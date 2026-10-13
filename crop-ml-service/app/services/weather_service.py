"""
Turns a browser Geolocation (lat, lon) into the three weather-derived
features the crop model needs: temperature, humidity, rainfall.

Uses Open-Meteo (https://open-meteo.com) — no API key required.
Rainfall is approximated from the last 30 days of actual precipitation
since the training dataset's "rainfall" feature is a season-scale
total, not a single reading. The field stays editable in the UI.
"""

import httpx

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def fetch_weather(lat: float, lon: float) -> dict:
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m",
        "daily": "precipitation_sum",
        "past_days": 30,
        "forecast_days": 1,
        "timezone": "auto",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(OPEN_METEO_URL, params=params)
        response.raise_for_status()
        data = response.json()

    current = data.get("current", {})
    daily = data.get("daily", {})
    precipitation_values = [v for v in daily.get("precipitation_sum", []) if v is not None]
    rainfall_estimate = round(sum(precipitation_values), 1) if precipitation_values else None

    return {
        "temperature": current.get("temperature_2m"),
        "humidity": current.get("relative_humidity_2m"),
        "rainfall": rainfall_estimate,
        "source": "Open-Meteo — last 30 days' actual rainfall total; adjust if you know better",
    }
