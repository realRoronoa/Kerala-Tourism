from typing import List, Dict, Any
from datetime import datetime
import numpy as np
from sklearn.cluster import DBSCAN


def classify_transport_mode(avg_speed_kmh: float, max_speed_kmh: float) -> str:
    """
    Random Forest / Heuristic Classifier predicting mode of transport based on telemetry features.
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
    Clusters GPS pings using DBSCAN stop detection and classifies trip segments.
    """
    if not pings:
        return {"status": "empty", "trips": []}

    # Extract coordinates (Lat, Lon) for spatial clustering
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

    coords_arr = np.array(coords)
    
    # Convert lat/lon degrees to radians for Haversine metric in DBSCAN
    # 0.05 km (50m) radius epsilon (~0.0005 radians)
    kms_per_radian = 6371.0088
    epsilon = 0.05 / kms_per_radian
    
    if len(coords_arr) >= 2:
        radians_arr = np.radians(coords_arr)
        db = DBSCAN(eps=epsilon, min_samples=2, metric='haversine').fit(radians_arr)
        labels = db.labels_
    else:
        labels = np.zeros(len(coords_arr), dtype=int)

    # Calculate aggregate trip summary
    origin_lat = coords[0][0]
    origin_lon = coords[0][1]
    dest_lat = coords[-1][0]
    dest_lon = coords[-1][1]
    
    avg_speed = float(np.mean(speeds)) if speeds else 0.0
    max_speed = float(np.max(speeds)) if speeds else 0.0
    predicted_mode = classify_transport_mode(avg_speed, max_speed)

    user_id = pings[0].get("device_id", "anonymous_user")
    start_time = timestamps[0] if timestamps else datetime.utcnow().isoformat()
    end_time = timestamps[-1] if timestamps else datetime.utcnow().isoformat()

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
        "cluster_labels": labels.tolist()
    }

    return {
        "status": "success",
        "total_pings_processed": len(pings),
        "trips": [segmented_trip]
    }
