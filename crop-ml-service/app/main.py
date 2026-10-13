"""
Crop Recommendation + Disease Detection service — a standalone FastAPI
microservice, separate from the Node/Express backend:

  POST /api/predict                 — crop model inference (N,P,K,temp,humidity,ph,rainfall) -> top crops
  GET  /api/weather                 — lat/lon -> temperature, humidity, rainfall estimate
  POST /api/soil-report/extract     — soil report image/PDF -> N,P,K,ph (via Gemini)
  POST /api/crop-info               — crop name -> growing guide (via Gemini)
  POST /api/disease/predict         — leaf photo -> top disease matches + static remedy info
  POST /api/disease/treatment-plan  — diagnosed disease -> detailed AI treatment plan (via Gemini)
  GET  /health                      — service + model status

Run with:  uvicorn app.main:app --reload --port 8001
(from inside the crop-ml-service/ folder, with its virtual environment active)

IMPORTANT — Python version: disease detection requires TensorFlow,
which does not yet support Python 3.14 (as of writing, TF wheels only
go up to Python 3.12). This whole service — not just the disease
part — needs to run on Python 3.9–3.12 if you want disease detection
working. See README.md.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import crop_info, disease, predict, soil_report, weather
from app.services.ml_service import ml_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crop model — always required.
    ml_service.load()

    # Disease model — optional at startup: if TensorFlow isn't
    # installed (e.g. still on Python 3.14), the rest of the service
    # keeps working; only /api/disease/* returns a clear 503.
    try:
        from app.services.disease_service import disease_service

        disease_service.load()
        print("✅ Disease detection model loaded")
    except Exception as exc:  # noqa: BLE001
        print(f"⚠️  Disease detection model NOT loaded ({exc}). "
              f"/api/disease/* will return 503 until this is fixed. "
              f"See README.md — this is almost always a Python/TensorFlow version issue.")

    yield


app = FastAPI(
    title="Kisan Dost — Crop Recommendation & Disease Detection Service",
    description="ML crop prediction, leaf disease detection, and Gemini-powered soil reading, growing guides and treatment plans.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(soil_report.router, prefix="/api")
app.include_router(crop_info.router, prefix="/api")
app.include_router(disease.router, prefix="/api")


@app.get("/health")
def health() -> dict:
    try:
        from app.services.disease_service import disease_service
        disease_loaded = disease_service.is_loaded()
    except Exception:  # noqa: BLE001
        disease_loaded = False

    return {
        "status": "ok",
        "crop_model_loaded": ml_service.is_loaded(),
        "crop_model_name": ml_service.model_name if ml_service.is_loaded() else None,
        "crop_model_accuracy": ml_service.accuracy if ml_service.is_loaded() else None,
        "disease_model_loaded": disease_loaded,
        "gemini_configured": bool(settings.GOOGLE_API_KEY),
    }


@app.get("/")
def root() -> dict:
    return {"service": "crop-recommendation-and-disease-detection", "docs": "/docs"}
