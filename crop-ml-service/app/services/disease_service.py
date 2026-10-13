"""
Loads the trained plant-disease Keras model (EfficientNetB0 backbone,
224x224x3 input, 38-class softmax output) once at startup and runs
inference on uploaded leaf photos.

Preprocessing note: the saved model has a `Rescaling(scale=1/255)`
layer built in as its second layer (confirmed by inspecting the
model's config.json), so images are fed in as raw 0-255 float32
values — do NOT divide by 255 again here, or every prediction will be
wrong (double-normalized input is a very easy silent bug with Keras
models that embed their own preprocessing).
"""

from io import BytesIO
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
from PIL import Image

from app.config import settings
from app.ml.disease_classes import DISEASE_CLASSES, parse_class_key

IMG_SIZE = 224


def _resolve(path_str: str) -> Path:
    path = Path(path_str)
    if not path.is_absolute():
        project_root = Path(__file__).resolve().parents[2]
        path = project_root / path_str
    return path


class DiseaseService:
    def __init__(self) -> None:
        self._model: Optional[Any] = None

    def load(self) -> None:
        # Imported lazily so importing this module doesn't require
        # TensorFlow to be installed unless disease detection is
        # actually used (keeps the crop-recommendation half of this
        # service usable even if TF isn't set up yet).
        import tensorflow as tf

        model_path = _resolve(settings.DISEASE_MODEL_PATH)
        self._model = tf.keras.models.load_model(str(model_path))

    def is_loaded(self) -> bool:
        return self._model is not None

    @property
    def model_name(self) -> str:
        return "EfficientNetB0 (plant disease classifier)"

    def _preprocess(self, image_bytes: bytes) -> np.ndarray:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = image.resize((IMG_SIZE, IMG_SIZE))
        array = np.asarray(image, dtype=np.float32)  # 0-255 range, on purpose
        return np.expand_dims(array, axis=0)

    def predict(self, image_bytes: bytes, top_n: int = 3) -> List[Dict[str, Any]]:
        if self._model is None:
            raise RuntimeError("Disease model is not loaded")

        batch = self._preprocess(image_bytes)
        probabilities = self._model.predict(batch, verbose=0)[0]

        ranked_indices = probabilities.argsort()[::-1][:top_n]

        results = []
        for idx in ranked_indices:
            class_key = DISEASE_CLASSES[int(idx)]
            parsed = parse_class_key(class_key)
            results.append(
                {
                    "class_key": class_key,
                    "crop": parsed["crop"],
                    "condition": parsed["condition"],
                    "is_healthy": parsed["is_healthy"],
                    "confidence": round(float(probabilities[idx]), 4),
                }
            )
        return results


disease_service = DiseaseService()
