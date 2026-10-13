from fastapi import APIRouter, HTTPException

from app.config import settings
from app.ml.crop_metadata import CROP_DISPLAY_NAMES
from app.schemas import CropInfoRequest, CropInfoResponse
from app.services import gemini_service

router = APIRouter(tags=["crop-info"])


@router.post("/crop-info", response_model=CropInfoResponse)
async def crop_info(payload: CropInfoRequest) -> CropInfoResponse:
    display_name = CROP_DISPLAY_NAMES.get(payload.crop)
    if not display_name:
        raise HTTPException(status_code=404, detail=f"Unknown crop key '{payload.crop}'")

    if not settings.GOOGLE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Crop growing guides need a GOOGLE_API_KEY configured on the server",
        )

    try:
        info = await gemini_service.get_crop_info(display_name, payload.language)
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Could not fetch crop information: {exc}") from exc

    return CropInfoResponse(
        crop=payload.crop,
        display_name=display_name,
        **info.model_dump(),
    )
