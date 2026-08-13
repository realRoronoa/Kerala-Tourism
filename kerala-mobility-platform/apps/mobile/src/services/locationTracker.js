/**
 * Lightweight background GPS Location Tracker Service for React Native client.
 * Sends passive telemetry pings every 30 seconds to FastAPI /api/v1/location/ping.
 */

const BACKEND_PING_URL = "http://localhost:8000/api/v1/location/ping";

export async function sendTelemetryPing(deviceId, latitude, longitude, speedKmh) {
  const payload = {
    device_id: deviceId,
    lat: latitude,
    lon: longitude,
    speed: speedKmh,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(BACKEND_PING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.status === 202) {
      console.log("[Location Tracker] Ping queued successfully (202 Accepted)");
      return true;
    }
    return false;
  } catch (error) {
    console.error("[Location Tracker Error] Failed sending ping:", error);
    return false;
  }
}
