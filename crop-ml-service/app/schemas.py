"""
Request/response shapes for the public API. Kept separate from the
internal Gemini structured-output models in services/gemini_service.py
so the two can evolve independently and the auto-generated /docs stay
clean.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


# ---------- /predict (crop recommendation) ----------

class PredictRequest(BaseModel):
    N: float = Field(..., ge=0, le=200, description="Nitrogen content ratio in soil")
    P: float = Field(..., ge=0, le=200, description="Phosphorus content ratio in soil")
    K: float = Field(..., ge=0, le=250, description="Potassium content ratio in soil")
    temperature: float = Field(..., ge=-10, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    ph: float = Field(..., ge=0, le=14, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=1000, description="Rainfall in millimetres")
    top_n: int = Field(5, ge=1, le=10, description="How many crop suggestions to return")


class CropPrediction(BaseModel):
    crop: str
    display_name: str
    probability: float


class PredictResponse(BaseModel):
    predictions: List[CropPrediction]
    model_name: str
    accuracy: float


# ---------- /weather ----------

class WeatherResponse(BaseModel):
    latitude: float
    longitude: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    source: str


# ---------- /soil-report/extract ----------

class SoilExtractResponse(BaseModel):
    N: Optional[float] = None
    P: Optional[float] = None
    K: Optional[float] = None
    ph: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    fields_found: List[str] = []
    notes: Optional[str] = None


# ---------- /crop-info ----------

class CropInfoRequest(BaseModel):
    crop: str = Field(..., description="Crop key as returned by /predict, e.g. 'kidneybeans'")
    language: str = "English"


class PesticideItem(BaseModel):
    name: str
    purpose: str


class CropInfoResponse(BaseModel):
    crop: str
    display_name: str
    season: str
    sowing_time: str
    growing_process: List[str]
    irrigation: str
    fertilizers: List[str]
    pesticides: List[PesticideItem]
    harvest_time: str
    common_diseases: List[str]
    tips: List[str]


# ---------- /disease/predict ----------

class DiseaseInfoBlock(BaseModel):
    disease: str
    appearance: str
    cause: str
    recommended_solution: str
    precautions: str


class DiseasePrediction(BaseModel):
    class_key: str = Field(..., description="Raw dataset label, e.g. 'Tomato___Late_blight'")
    crop: str
    condition: str
    is_healthy: bool
    confidence: float
    info: DiseaseInfoBlock


class DiseasePredictResponse(BaseModel):
    predictions: List[DiseasePrediction]
    model_name: str
    input_size: int


# ---------- /disease/treatment-plan ----------

class DiseaseTreatmentRequest(BaseModel):
    class_key: str = Field(..., description="class_key as returned by /disease/predict")
    language: str = "English"


class TreatmentOption(BaseModel):
    name: str
    details: str


class DiseaseTreatmentResponse(BaseModel):
    class_key: str
    crop: str
    condition: str
    overview: str
    organic_treatment: List[TreatmentOption]
    chemical_treatment: List[TreatmentOption]
    application_tips: List[str]
    prevention_schedule: List[str]
    when_to_seek_help: str
