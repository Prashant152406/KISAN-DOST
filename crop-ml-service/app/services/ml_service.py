"""
Wraps the crop-recommendation model. As of the October 2026 model
swap, this is an ExtraTreesClassifier (joblib) + a separate
LabelEncoder (joblib) — replacing the original RandomForest +
StandardScaler combined pickle.

IMPORTANT: this model takes RAW, UNSCALED feature values. Verified
empirically against the model's own training data (a known "rice" row
predicts rice at 100% confidence when passed in raw) and against the
model author's own predict_crop.py, which calls predict_proba()
directly on unscaled input. A scaler.pkl ships alongside this model in
some exports, but it was fit on different (lowercase) column names
from an earlier experiment and is NOT part of this model's actual
pipeline — do not apply it here, it will silently produce wrong
predictions (or outright error on the column-name mismatch).
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import pandas as pd

from app.config import settings
from app.ml.crop_metadata import CROP_DISPLAY_NAMES


def _resolve(path_str: str) -> Path:
    path = Path(path_str)
    if not path.is_absolute():
        project_root = Path(__file__).resolve().parents[2]
        path = project_root / path_str
    return path


class MLService:
    def __init__(self) -> None:
        self._model: Optional[Any] = None
        self._encoder: Optional[Any] = None
        self._meta: Dict[str, Any] = {}

    def load(self) -> None:
        self._model = joblib.load(_resolve(settings.CROP_MODEL_PATH))
        self._encoder = joblib.load(_resolve(settings.CROP_ENCODER_PATH))

        meta_path = _resolve(settings.CROP_MODEL_META_PATH)
        if meta_path.exists():
            with open(meta_path, "r", encoding="utf-8") as f:
                self._meta = json.load(f)

    def is_loaded(self) -> bool:
        return self._model is not None and self._encoder is not None

    @property
    def model_name(self) -> str:
        return self._meta.get("model", "ExtraTrees")

    @property
    def accuracy(self) -> float:
        return float(self._meta.get("test_accuracy", 0.0))

    def predict(
        self,
        N: float,
        P: float,
        K: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float,
        top_n: int = 5,
    ) -> List[Dict[str, Any]]:
        if not self.is_loaded():
            raise RuntimeError("Model is not loaded")

        # Column names/order must match model.feature_names_in_
        # exactly: ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        row = pd.DataFrame(
            [[N, P, K, temperature, humidity, ph, rainfall]],
            columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall"],
        )

        # No scaling — see module docstring.
        probabilities = self._model.predict_proba(row)[0]
        ranked_indices = probabilities.argsort()[::-1][:top_n]

        results = []
        for idx in ranked_indices:
            crop_key = self._encoder.classes_[idx]
            results.append(
                {
                    "crop": crop_key,
                    "display_name": CROP_DISPLAY_NAMES.get(crop_key, crop_key.title()),
                    "probability": round(float(probabilities[idx]), 4),
                }
            )
        return results


ml_service = MLService()
