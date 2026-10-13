"""
Loads the curated disease_info.json once and caches it. This is the
static, human-reviewed database extracted from the original training
notebook — instant and free, used as the primary source of remedy
info. The Gemini-powered /disease/treatment-plan endpoint builds on
top of this for a deeper, more tailored plan on request.
"""

import json
from pathlib import Path
from typing import Dict, Optional

from app.config import settings

_cache: Optional[Dict[str, dict]] = None


def _resolve(path_str: str) -> Path:
    path = Path(path_str)
    if not path.is_absolute():
        project_root = Path(__file__).resolve().parents[2]
        path = project_root / path_str
    return path


def get_disease_info() -> Dict[str, dict]:
    global _cache
    if _cache is None:
        with open(_resolve(settings.DISEASE_INFO_PATH), "r", encoding="utf-8") as f:
            _cache = json.load(f)
    return _cache


def lookup(class_key: str) -> dict:
    info = get_disease_info().get(class_key)
    if info is None:
        raise KeyError(f"No disease info for class key '{class_key}'")
    return info
