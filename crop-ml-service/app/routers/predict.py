from fastapi import APIRouter, HTTPException

from app.schemas import PredictRequest, PredictResponse
from app.services.ml_service import ml_service

router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictResponse)
def predict_crop(payload: PredictRequest) -> PredictResponse:
    if not ml_service.is_loaded():
        raise HTTPException(status_code=503, detail="Model is not loaded yet — check the server logs")

    try:
        results = ml_service.predict(
            N=payload.N,
            P=payload.P,
            K=payload.K,
            temperature=payload.temperature,
            humidity=payload.humidity,
            ph=payload.ph,
            rainfall=payload.rainfall,
            top_n=payload.top_n,
        )
    except Exception as exc:  # noqa: BLE001 — surfaced to the client deliberately
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc

    return PredictResponse(
        predictions=results,
        model_name=ml_service.model_name,
        accuracy=ml_service.accuracy,
    )
