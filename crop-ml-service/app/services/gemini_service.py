"""
Three Gemini-powered features, all using the same GOOGLE_API_KEY:

1. extract_soil_report() — reads an uploaded soil health card /
   soil test report (image or PDF) directly — Gemini has native
   document understanding, so no OCR library is needed.

2. get_crop_info() — given a crop name, generates a practical growing
   guide (season, sowing time, steps, fertilizers, pesticides,
   harvest time, tips).

3. get_disease_treatment_plan() — given a diagnosed plant disease
   (crop + condition, plus the static database's short description as
   context), generates a deeper, farmer-friendly treatment plan:
   organic options, chemical options (kept intentionally general —
   no specific dosages/mixing ratios, matching the style of the
   static database, since exact application rates should come from
   the product label or local agricultural extension office, not a
   generic AI answer), application tips, and a prevention schedule.

All three use `response_schema` with a Pydantic model so Gemini
returns data in the exact shape needed, instead of parsing free text.

Uses the `google-genai` SDK (current, actively maintained — the older
`google-generativeai` package was deprecated in 2025).
"""

from typing import Dict, List, Optional

from google import genai
from google.genai import types
from pydantic import BaseModel, Field

from app.config import settings


# ---------- Soil report extraction ----------

class SoilExtraction(BaseModel):
    N: Optional[float] = Field(None, description="Nitrogen value as printed on the report")
    P: Optional[float] = Field(None, description="Phosphorus value as printed on the report")
    K: Optional[float] = Field(None, description="Potassium value as printed on the report")
    ph: Optional[float] = Field(None, description="Soil pH, typically between 3 and 10")
    temperature: Optional[float] = Field(None, description="Only if a temperature in Celsius is explicitly printed")
    humidity: Optional[float] = Field(None, description="Only if a relative humidity percentage is explicitly printed")
    rainfall: Optional[float] = Field(None, description="Only if a rainfall figure in millimetres is explicitly printed")
    fields_found: List[str] = Field(default_factory=list, description="Which of N,P,K,ph,temperature,humidity,rainfall were actually present in the document")
    notes: Optional[str] = Field(None, description="Any caveats, e.g. a value was given as Low/Medium/High and converted to a number")


# ---------- Crop growing guide ----------

class PesticideItem(BaseModel):
    name: str
    purpose: str


class CropInfo(BaseModel):
    season: str = Field(..., description="Best growing season(s) in India, e.g. 'Kharif (June–October)'")
    sowing_time: str
    growing_process: List[str] = Field(..., description="5 to 9 ordered, practical steps from land prep to maturity")
    irrigation: str
    fertilizers: List[str]
    pesticides: List[PesticideItem] = Field(..., description="3 to 6 common pests/diseases paired with the control measure or pesticide used against them")
    harvest_time: str
    common_diseases: List[str]
    tips: List[str] = Field(..., description="3 to 5 short, practical tips for a better yield")


# ---------- Disease treatment plan ----------

class TreatmentOption(BaseModel):
    name: str = Field(..., description="Name of the treatment/product category, e.g. 'Neem oil spray' or 'Copper-based fungicide'")
    details: str = Field(..., description="How and when to use it, in general terms — no specific dosage or mixing ratio")


class DiseaseTreatmentPlan(BaseModel):
    overview: str = Field(..., description="2-3 sentence plain-language summary of the disease and how serious it typically is")
    organic_treatment: List[TreatmentOption] = Field(..., description="2-4 organic/non-chemical control options")
    chemical_treatment: List[TreatmentOption] = Field(..., description="2-4 chemical control categories, described generally — never with a specific dosage, concentration or mixing ratio; always tell the farmer to follow the product label or a local agricultural officer for exact rates")
    application_tips: List[str] = Field(..., description="3-5 practical tips for applying treatment effectively")
    prevention_schedule: List[str] = Field(..., description="3-5 ongoing practices to prevent recurrence")
    when_to_seek_help: str = Field(..., description="One or two sentences on when this is serious enough to consult a local agricultural extension officer")


def _client() -> genai.Client:
    if not settings.GOOGLE_API_KEY:
        raise RuntimeError(
            "GOOGLE_API_KEY is not set. Add it to crop-ml-service/.env "
            "(get a free key at https://aistudio.google.com/apikey)."
        )
    return genai.Client(api_key=settings.GOOGLE_API_KEY)


async def extract_soil_report(file_bytes: bytes, mime_type: str) -> SoilExtraction:
    client = _client()

    prompt = (
        "You are reading an Indian soil health card or soil test report. "
        "Extract the Nitrogen (N), Phosphorus (P), Potassium (K) and pH values. "
        "Only fill in temperature, humidity or rainfall if one of those is "
        "explicitly printed on this specific document — never guess or estimate "
        "them from the location, date or crop mentioned. "
        "If a nutrient is reported qualitatively (e.g. 'Low', 'Medium', 'High') "
        "instead of a number, convert it using standard Indian soil-testing "
        "reference ranges and explain the conversion in `notes`. "
        "List exactly which fields you found real values for in `fields_found`."
    )

    response = await client.aio.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
            prompt,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=SoilExtraction,
            temperature=0.1,
        ),
    )

    parsed = response.parsed
    if parsed is None:
        raise RuntimeError("Gemini did not return structured data for this report")
    return parsed


_crop_info_cache: Dict[str, CropInfo] = {}


async def get_crop_info(crop_display_name: str, language: str = "English") -> CropInfo:
    cache_key = f"{crop_display_name}:{language}".lower()
    if cache_key in _crop_info_cache:
        return _crop_info_cache[cache_key]

    client = _client()

    prompt = (
        f"Give a practical, farmer-friendly growing guide for '{crop_display_name}' "
        f"in {language}, aimed at a smallholder farmer in India. Be specific and "
        "actionable rather than generic. Keep every list item to one short line."
    )

    response = await client.aio.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=CropInfo,
            temperature=0.3,
        ),
    )

    parsed = response.parsed
    if parsed is None:
        raise RuntimeError("Gemini did not return a structured growing guide")

    _crop_info_cache[cache_key] = parsed
    return parsed


_treatment_cache: Dict[str, DiseaseTreatmentPlan] = {}


async def get_disease_treatment_plan(
    crop: str,
    condition: str,
    static_summary: str,
    language: str = "English",
) -> DiseaseTreatmentPlan:
    cache_key = f"{crop}:{condition}:{language}".lower()
    if cache_key in _treatment_cache:
        return _treatment_cache[cache_key]

    client = _client()

    prompt = (
        f"A farmer's {crop} plant has been diagnosed with '{condition}'. "
        f"Here is a short baseline description: {static_summary}\n\n"
        f"Write a more detailed, practical treatment plan in {language} for a "
        "smallholder farmer in India. Include organic and chemical control "
        "options, but for chemical options describe the category and general "
        "approach only — do NOT give specific dosages, concentrations or "
        "mixing ratios, since those vary by product and region; instead tell "
        "the farmer to follow the product label or consult a local "
        "agricultural extension officer for exact application rates. Keep "
        "every list item short and practical."
    )

    response = await client.aio.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=DiseaseTreatmentPlan,
            temperature=0.3,
        ),
    )

    parsed = response.parsed
    if parsed is None:
        raise RuntimeError("Gemini did not return a structured treatment plan")

    _treatment_cache[cache_key] = parsed
    return parsed
