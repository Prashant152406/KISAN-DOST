from fastapi import APIRouter, HTTPException, Query

from app.schemas import WeatherResponse
from app.services import weather_service

router = APIRouter(tags=["weather"])


@router.get("/weather", response_model=WeatherResponse)
async def get_weather(
    lat: float = Query(..., ge=-90, le=90, description="Latitude from the browser's Geolocation API"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude from the browser's Geolocation API"),
) -> WeatherResponse:
    try:
        data = await weather_service.fetch_weather(lat, lon)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Could not fetch weather data: {exc}") from exc

    return WeatherResponse(latitude=lat, longitude=lon, **data)
