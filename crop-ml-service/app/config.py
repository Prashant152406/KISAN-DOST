"""
Central configuration for the Crop Recommendation + Disease Detection
service. All values can be overridden via a `.env` file in the
crop-ml-service/ folder (see .env.example) or real environment
variables.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Google Gemini — used for reading soil reports, generating crop
    # growing guides, and generating disease treatment plans.
    # Get a free key at https://aistudio.google.com/apikey
    GOOGLE_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Must match the origin your Vite frontend runs on, or the browser
    # will block every request with a CORS error.
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    # Paths relative to the crop-ml-service/ folder.
    # Crop recommendation model (ExtraTrees, Oct 2026 swap) — three
    # separate files, not one combined pickle like the original model.
    CROP_MODEL_PATH: str = "app/ml/crop_recommendation_model.joblib"
    CROP_ENCODER_PATH: str = "app/ml/label_encoder.joblib"
    CROP_MODEL_META_PATH: str = "app/ml/crop_model_meta.json"

    DISEASE_MODEL_PATH: str = "app/ml/plant_disease_model.keras"
    DISEASE_INFO_PATH: str = "app/ml/disease_info.json"

    # Upload guards.
    MAX_UPLOAD_MB: int = 10
    MAX_IMAGE_UPLOAD_MB: int = 15

    PORT: int = 8001

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()