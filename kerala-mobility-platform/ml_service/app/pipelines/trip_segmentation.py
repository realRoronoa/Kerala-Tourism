from typing import List, Dict, Any
from datetime import datetime, timezone
import math

try:
    import numpy as np
except ImportError:
    np = None

try:
    from sklearn.cluster import DBSCAN
except ImportError:
    DBSCAN = None


def classify_transport_mode(avg_speed_kmh: float, max_speed_kmh: float) -> str:
    """
    Predict transport mode based on telemetry speed features.
    """
    if avg_speed_kmh < 6.0:
        return "Walking"
    elif avg_speed_kmh < 22.0:
        return "Auto/Two-Wheeler"
    elif avg_speed_kmh < 50.0:
        return "Bus"
    elif avg_speed_kmh < 85.0:
        return "Car/Taxi"
    else:
        return "Train/Express"


def segment_and_predict_trips(pings: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Clusters GPS pings using DBSCAN (or pure Python fallback) stop detection and classifies trip segments.
    """
    if not pings:
        return {"status": "empty", "trips": []}

    coords = []
    speeds = []
    timestamps = []

    for p in pings:
        lat = float(p.get("lat", 0.0))
        lon = float(p.get("lon", 0.0))
        speed = float(p.get("speed", 0.0))
        ts = p.get("timestamp")
        
        coords.append([lat, lon])
        speeds.append(speed)
        timestamps.append(ts)

    if DBSCAN is not None and np is not None and len(coords) >= 2:
        coords_arr = np.array(coords)
        kms_per_radian = 6371.0088
        epsilon = 0.05 / kms_per_radian
        radians_arr = np.radians(coords_arr)
        db = DBSCAN(eps=epsilon, min_samples=2, metric='haversine').fit(radians_arr)
        labels = db.labels_.tolist()
    else:
        labels = [0] * len(coords)

    origin_lat = coords[0][0]
    origin_lon = coords[0][1]
    dest_lat = coords[-1][0]
    dest_lon = coords[-1][1]
    
    if np is not None and speeds:
        avg_speed = float(np.mean(speeds))
        max_speed = float(np.max(speeds))
    elif speeds:
        avg_speed = float(sum(speeds) / len(speeds))
        max_speed = float(max(speeds))
    else:
        avg_speed = 0.0
        max_speed = 0.0

    predicted_mode = classify_transport_mode(avg_speed, max_speed)

    user_id = pings[0].get("device_id", "anonymous_user")
    start_time = timestamps[0] if timestamps else datetime.now(timezone.utc).isoformat()
    end_time = timestamps[-1] if timestamps else datetime.now(timezone.utc).isoformat()

    segmented_trip = {
        "user_id": user_id,
        "origin_lat": origin_lat,
        "origin_lon": origin_lon,
        "dest_lat": dest_lat,
        "dest_lon": dest_lon,
        "start_time": start_time,
        "end_time": end_time,
        "predicted_mode": predicted_mode,
        "avg_speed_kmh": round(avg_speed, 2),
        "cluster_labels": labels
    }

    return {
        "status": "success",
        "total_pings_processed": len(pings),
        "trips": [segmented_trip]
    }
