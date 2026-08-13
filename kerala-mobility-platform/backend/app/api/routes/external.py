from typing import Any, Dict
from fastapi import APIRouter, Query, status
from app.services.external_apis import ExternalAPIService

router = APIRouter()


@router.get("/geocode")
async def reverse_geocode(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate")
) -> Dict[str, Any]:
    """
    Converts (lat, lon) coordinates into human-readable address and district details
    via OpenStreetMap Nominatim with Redis caching.
    """
    return await ExternalAPIService.reverse_geocode(lat, lon)


@router.get("/route")
async def get_road_route(
    origin_lat: float = Query(..., description="Origin latitude"),
    origin_lon: float = Query(..., description="Origin longitude"),
    dest_lat: float = Query(..., description="Destination latitude"),
    dest_lon: float = Query(..., description="Destination longitude"),
    mode: str = Query("driving", description="Mode of travel: driving or walking")
) -> Dict[str, Any]:
    """
    Calculates actual road travel distance (km), estimated duration (mins),
    and polyline coordinates between origin and destination using the OSRM Routing Engine.
    """
    return await ExternalAPIService.get_road_route(origin_lat, origin_lon, dest_lat, dest_lon, mode)


@router.get("/weather")
async def get_weather(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate")
) -> Dict[str, Any]:
    """
    Returns real-time temperature (°C), weather status (Rain, Clear, Clouds),
    and wind speed using the Open-Meteo Weather API.
    """
    return await ExternalAPIService.get_weather(lat, lon)


@router.get("/transit-stops")
async def get_nearby_transit_stops(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate"),
    radius: int = Query(1000, description="Search radius in meters")
) -> Dict[str, Any]:
    """
    Returns nearby public transit hubs (KSRTC Bus Stands, Kochi Metro & Water Metro stations).
    """
    return await ExternalAPIService.get_nearby_transit_stops(lat, lon, radius)
