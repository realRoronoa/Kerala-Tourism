import json
import logging
from typing import Dict, Any, Optional, List
import httpx
import redis.asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger(__name__)

# Redis TTL cache duration (seconds): 24 hours for geocode/routing, 30 mins for weather
CACHE_TTL_SPATIAL = 86400
CACHE_TTL_WEATHER = 1800


class ExternalAPIService:
    """
    Unified async service providing Maps Geocoding, Road Network Routing,
    Public Transit Data lookup, and Real-Time Weather services with Redis caching.
    """

    @staticmethod
    async def _get_redis_client() -> Optional[aioredis.Redis]:
        try:
            return aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        except Exception as exc:
            logger.warning(f"Could not connect to Redis for caching: {exc}")
            return None

    @classmethod
    async def reverse_geocode(cls, lat: float, lon: float) -> Dict[str, Any]:
        """
        Converts (lat, lon) coordinates to a human-readable place name/address using OpenStreetMap Nominatim.
        Result is cached in Redis.
        """
        cache_key = f"cache:geocode:{round(lat, 4)}:{round(lon, 4)}"
        redis_client = await cls._get_redis_client()

        if redis_client:
            try:
                cached_data = await redis_client.get(cache_key)
                if cached_data:
                    await redis_client.aclose()
                    return json.loads(cached_data)
            except Exception as e:
                logger.warning(f"Redis get cache failed: {e}")

        # Nominatim OpenStreetMap Reverse Geocoding API
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&addressdetails=1"
        headers = {"User-Agent": "Kerala-Mobility-Platform/1.0 (natpac.kerala.gov.in)"}

        async with httpx.AsyncClient(timeout=8.0) as client:
            try:
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    address = data.get("address", {})
                    place_name = (
                        address.get("suburb")
                        or address.get("town")
                        or address.get("city")
                        or address.get("county")
                        or address.get("state_district")
                        or "Kerala Location"
                    )
                    full_address = data.get("display_name", f"{lat}, {lon}")
                    result = {
                        "lat": lat,
                        "lon": lon,
                        "place_name": place_name,
                        "full_address": full_address,
                        "district": address.get("state_district", address.get("county", "Kerala")),
                        "state": address.get("state", "Kerala"),
                        "country": address.get("country", "India"),
                        "raw_address": address
                    }

                    if redis_client:
                        try:
                            await redis_client.setex(cache_key, CACHE_TTL_SPATIAL, json.dumps(result))
                        except Exception as e:
                            logger.warning(f"Redis set cache failed: {e}")
                    
                    return result
            except Exception as exc:
                logger.error(f"Geocoding request failed: {exc}")

        if redis_client:
            await redis_client.aclose()

        return {
            "lat": lat,
            "lon": lon,
            "place_name": f"Location ({round(lat, 3)}, {round(lon, 3)})",
            "full_address": f"Kerala Coordinates: {lat}, {lon}",
            "district": "Kerala",
            "state": "Kerala",
            "country": "India"
        }

    @classmethod
    async def search_location(cls, query: str) -> Dict[str, Any]:
        """
        Forward geocodes a place name query (e.g., 'Varkala Beach', 'Munnar') into lat/lon coordinates
        using OpenStreetMap Nominatim API with Redis caching.
        """
        cache_key = f"cache:search:{query.lower().strip()}"
        redis_client = await cls._get_redis_client()

        if redis_client:
            try:
                cached = await redis_client.get(cache_key)
                if cached:
                    await redis_client.aclose()
                    return json.loads(cached)
            except Exception:
                pass

        url = f"https://nominatim.openstreetmap.org/search?q={query},+Kerala,+India&format=json&limit=5&addressdetails=1"
        headers = {"User-Agent": "Kerala-Mobility-Platform/1.0 (natpac.kerala.gov.in)"}

        async with httpx.AsyncClient(timeout=8.0) as client:
            try:
                res = await client.get(url, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    results = []
                    for item in data:
                        results.append({
                            "display_name": item.get("display_name"),
                            "lat": float(item.get("lat", 0)),
                            "lon": float(item.get("lon", 0)),
                            "type": item.get("type"),
                            "importance": item.get("importance")
                        })
                    
                    response_payload = {
                        "query": query,
                        "total_results": len(results),
                        "results": results
                    }

                    if redis_client:
                        try:
                            await redis_client.setex(cache_key, CACHE_TTL_SPATIAL, json.dumps(response_payload))
                        except Exception:
                            pass

                    return response_payload
            except Exception as exc:
                logger.error(f"Forward geocoding search failed: {exc}")

        if redis_client:
            await redis_client.aclose()

        return {
            "query": query,
            "total_results": 0,
            "results": []
        }


    @classmethod
    async def get_road_route(
        cls, 
        origin_lat: float, 
        origin_lon: float, 
        dest_lat: float, 
        dest_lon: float, 
        mode: str = "driving"
    ) -> Dict[str, Any]:
        """
        Calculates real road distance (km), travel duration (mins), and route geometry 
        between origin and destination using the OSRM (Open Source Routing Machine) API.
        """
        profile = "foot" if mode.lower() in ["walk", "walking"] else "driving"
        cache_key = f"cache:route:{profile}:{round(origin_lat, 4)}:{round(origin_lon, 4)}:{round(dest_lat, 4)}:{round(dest_lon, 4)}"
        redis_client = await cls._get_redis_client()

        if redis_client:
            try:
                cached = await redis_client.get(cache_key)
                if cached:
                    await redis_client.aclose()
                    return json.loads(cached)
            except Exception:
                pass

        url = f"http://router.project-osrm.org/route/v1/{profile}/{origin_lon},{origin_lat};{dest_lon},{dest_lat}?overview=full&geometries=geojson"

        async with httpx.AsyncClient(timeout=8.0) as client:
            try:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    routes = data.get("routes", [])
                    if routes:
                        best_route = routes[0]
                        distance_km = round(best_route.get("distance", 0) / 1000.0, 2)
                        duration_mins = round(best_route.get("duration", 0) / 60.0, 1)
                        geometry = best_route.get("geometry", {}).get("coordinates", [])

                        result = {
                            "origin": {"lat": origin_lat, "lon": origin_lon},
                            "destination": {"lat": dest_lat, "lon": dest_lon},
                            "mode": mode,
                            "distance_km": distance_km,
                            "duration_minutes": duration_mins,
                            "polyline_coordinates": geometry,
                            "source": "OSRM Road Network Engine"
                        }

                        if redis_client:
                            try:
                                await redis_client.setex(cache_key, CACHE_TTL_SPATIAL, json.dumps(result))
                            except Exception:
                                pass

                        return result
            except Exception as exc:
                logger.error(f"OSRM Routing request failed: {exc}")

        if redis_client:
            await redis_client.aclose()

        # Fallback haversine estimation if OSRM service is unreachable
        from math import radians, cos, sin, asin, sqrt
        dlon = radians(dest_lon - origin_lon)
        dlat = radians(dest_lat - origin_lat)
        a = sin(dlat / 2)**2 + cos(radians(origin_lat)) * cos(radians(dest_lat)) * sin(dlon / 2)**2
        c = 2 * asin(sqrt(a))
        est_distance_km = round(6371 * c * 1.2, 2)  # 1.2 road detour factor

        return {
            "origin": {"lat": origin_lat, "lon": origin_lon},
            "destination": {"lat": dest_lat, "lon": dest_lon},
            "mode": mode,
            "distance_km": est_distance_km,
            "duration_minutes": round(est_distance_km / 30.0 * 60, 1),
            "polyline_coordinates": [[origin_lon, origin_lat], [dest_lon, dest_lat]],
            "source": "Spatial Geometry Fallback"
        }

    @classmethod
    async def get_weather(cls, lat: float, lon: float) -> Dict[str, Any]:
        """
        Fetches current weather condition, temperature (°C), rainfall, and wind speed
        for a given location using the free, open-access Open-Meteo API.
        """
        cache_key = f"cache:weather:{round(lat, 2)}:{round(lon, 2)}"
        redis_client = await cls._get_redis_client()

        if redis_client:
            try:
                cached = await redis_client.get(cache_key)
                if cached:
                    await redis_client.aclose()
                    return json.loads(cached)
            except Exception:
                pass

        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"

        async with httpx.AsyncClient(timeout=6.0) as client:
            try:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    curr = data.get("current_weather", {})
                    temp_c = curr.get("temperature", 28.0)
                    weather_code = curr.get("weathercode", 0)
                    wind_speed = curr.get("windspeed", 5.0)

                    # Interpret WMO Weather Code
                    if weather_code in [51, 53, 55, 61, 63, 65, 80, 81, 82]:
                        condition = "Rainy"
                    elif weather_code in [1, 2, 3]:
                        condition = "Partly Cloudy"
                    elif weather_code == 0:
                        condition = "Clear / Sunny"
                    else:
                        condition = "Cloudy"

                    result = {
                        "lat": lat,
                        "lon": lon,
                        "temperature_celsius": temp_c,
                        "condition": condition,
                        "wind_speed_kmh": wind_speed,
                        "weather_code": weather_code,
                        "source": "Open-Meteo Weather API"
                    }

                    if redis_client:
                        try:
                            await redis_client.setex(cache_key, CACHE_TTL_WEATHER, json.dumps(result))
                        except Exception:
                            pass

                    return result
            except Exception as exc:
                logger.error(f"Open-Meteo weather request failed: {exc}")

        if redis_client:
            await redis_client.aclose()

        return {
            "lat": lat,
            "lon": lon,
            "temperature_celsius": 28.5,
            "condition": "Pleasant / Tropical",
            "wind_speed_kmh": 8.0,
            "weather_code": 0,
            "source": "Default Kerala Climate Profile"
        }

    @classmethod
    async def get_nearby_transit_stops(cls, lat: float, lon: float, radius: int = 1000) -> Dict[str, Any]:
        """
        Returns nearby bus stops, metro stations, and transit hubs for a coordinate location.
        """
        # Pre-seeded Kerala transit hubs database (KSRTC bus stations & Kochi Metro stations)
        kerala_transit_hubs = [
            {"name": "Kochi Metro - Aluva Station", "type": "Metro", "lat": 10.1084, "lon": 76.3563},
            {"name": "Kochi Metro - Edapally Station", "type": "Metro", "lat": 10.0253, "lon": 76.3082},
            {"name": "Kochi Metro - MG Road Station", "type": "Metro", "lat": 9.9772, "lon": 76.2818},
            {"name": "Kochi Water Metro - Vyttila Terminal", "type": "Water Metro", "lat": 9.9678, "lon": 76.3195},
            {"name": "KSRTC Central Bus Station Thiruvananthapuram", "type": "Bus Stand", "lat": 8.4875, "lon": 76.9525},
            {"name": "KSRTC Bus Station Ernakulam", "type": "Bus Stand", "lat": 9.9731, "lon": 76.2878},
            {"name": "KSRTC Bus Station Kozhikode", "type": "Bus Stand", "lat": 11.2480, "lon": 75.7839},
            {"name": "Munnar KSRTC Bus Stand", "type": "Bus Stand", "lat": 10.0889, "lon": 77.0597},
            {"name": "Alleppey KSRTC Bus Stand", "type": "Bus Stand", "lat": 9.4981, "lon": 76.3388},
            {"name": "Wayanad Kalpetta Bus Station", "type": "Bus Stand", "lat": 11.6080, "lon": 76.0825}
        ]

        from math import radians, cos, sin, asin, sqrt
        results = []
        for hub in kerala_transit_hubs:
            dlon = radians(hub["lon"] - lon)
            dlat = radians(hub["lat"] - lat)
            a = sin(dlat / 2)**2 + cos(radians(lat)) * cos(radians(hub["lat"])) * sin(dlon / 2)**2
            dist_km = 2 * asin(sqrt(a)) * 6371
            if dist_km * 1000 <= radius * 5:  # search window
                results.append({
                    "name": hub["name"],
                    "type": hub["type"],
                    "lat": hub["lat"],
                    "lon": hub["lon"],
                    "distance_meters": round(dist_km * 1000, 1)
                })

        results.sort(key=lambda x: x["distance_meters"])

        return {
            "query_location": {"lat": lat, "lon": lon},
            "radius_meters": radius,
            "total_found": len(results),
            "nearby_transit_hubs": results
        }
