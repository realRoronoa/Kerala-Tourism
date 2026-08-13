from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from app.pipelines.trip_segmentation import segment_and_predict_trips

app = FastAPI(
    title="NATPAC Kerala Mobility ML Microservice",
    version="1.0.0"
)


class TelemetryBatchSchema(BaseModel):
    pings: List[Dict[str, Any]]


@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "NATPAC ML Inference Microservice", "port": 8001}


@app.post("/segment-stops")
def segment_stops_endpoint(batch: TelemetryBatchSchema):
    """
    Accepts raw batched telemetry pings, executes DBSCAN stop clustering and
    transport mode classification, returning structured trip inference.
    """
    if not batch.pings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payload must contain non-empty 'pings' list."
        )

    result = segment_and_predict_trips(batch.pings)
    return result
