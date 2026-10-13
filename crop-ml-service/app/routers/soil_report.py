from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import settings
from app.schemas import SoilExtractResponse
from app.services import gemini_service

router = APIRouter(tags=["soil-report"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "application/pdf"}


@router.post("/soil-report/extract", response_model=SoilExtractResponse)
async def extract_soil_report(file: UploadFile = File(...)) -> SoilExtractResponse:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, PNG or WEBP photo, or a PDF, of your soil report",
        )

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File is too large — the limit is {settings.MAX_UPLOAD_MB}MB",
        )

    if not settings.GOOGLE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Reading soil reports needs a GOOGLE_API_KEY configured on the server",
        )

    try:
        result = await gemini_service.extract_soil_report(contents, file.content_type)
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Could not read the soil report: {exc}") from exc

    return SoilExtractResponse(**result.model_dump())
