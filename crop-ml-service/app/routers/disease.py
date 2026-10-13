from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import settings
from app.ml import disease_info_store
from app.ml.disease_classes import parse_class_key
from app.schemas import (
    DiseasePredictResponse,
    DiseaseTreatmentRequest,
    DiseaseTreatmentResponse,
)
from app.services import gemini_service
from app.services.disease_service import disease_service

router = APIRouter(tags=["disease-detection"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/disease/predict", response_model=DiseasePredictResponse)
async def predict_disease(file: UploadFile = File(...)) -> DiseasePredictResponse:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, PNG or WEBP photo of the leaf",
        )

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.MAX_IMAGE_UPLOAD_MB:
        raise HTTPException(
            status_code=400,
            detail=f"Image is too large — the limit is {settings.MAX_IMAGE_UPLOAD_MB}MB",
        )

    if not disease_service.is_loaded():
        raise HTTPException(status_code=503, detail="Disease model is not loaded yet — check the server logs")

    try:
        raw_predictions = disease_service.predict(contents, top_n=3)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc

    predictions = []
    for pred in raw_predictions:
        try:
            info = disease_info_store.lookup(pred["class_key"])
        except KeyError:
            # Shouldn't happen — every model class has a matching info
            # entry — but fail gracefully rather than 500 the request.
            info = {
                "disease": pred["condition"],
                "appearance": "No additional information available for this class.",
                "cause": "Unknown.",
                "recommended_solution": "Consult a local agricultural extension officer.",
                "precautions": "Monitor the plant closely and isolate it if symptoms spread.",
            }
        predictions.append({**pred, "info": info})

    return DiseasePredictResponse(
        predictions=predictions,
        model_name=disease_service.model_name,
        input_size=224,
    )


@router.post("/disease/treatment-plan", response_model=DiseaseTreatmentResponse)
async def disease_treatment_plan(payload: DiseaseTreatmentRequest) -> DiseaseTreatmentResponse:
    try:
        info = disease_info_store.lookup(payload.class_key)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Unknown disease class key '{payload.class_key}'")

    if not settings.GOOGLE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Detailed treatment plans need a GOOGLE_API_KEY configured on the server",
        )

    parsed = parse_class_key(payload.class_key)

    if parsed["is_healthy"]:
        raise HTTPException(
            status_code=400,
            detail="This leaf was classified as healthy — no treatment plan needed",
        )

    static_summary = f"{info['appearance']} {info['cause']} {info['recommended_solution']}"

    try:
        plan = await gemini_service.get_disease_treatment_plan(
            crop=parsed["crop"],
            condition=parsed["condition"],
            static_summary=static_summary,
            language=payload.language,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Could not generate a treatment plan: {exc}") from exc

    return DiseaseTreatmentResponse(
        class_key=payload.class_key,
        crop=parsed["crop"],
        condition=parsed["condition"],
        **plan.model_dump(),
    )
