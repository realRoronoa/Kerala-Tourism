# Kerala Mobility Platform (NATPAC)

An enterprise-grade civic travel discovery & passive mobility intelligence platform for the **National Transportation Planning and Research Centre (NATPAC)**, built for Smart India Hackathon.

---

## 🚀 Architectural Overview

- **FastAPI Core Backend** (`backend/`): Non-blocking asynchronous REST API with Redis queue shock-absorber for high-frequency GPS ping ingestion (30s intervals).
- **Decoupled ML Microservice** (`ml_service/`): Asynchronous AI inference engine utilizing DBSCAN clustering for stop detection and Random Forest classifiers for transport mode prediction (Walking, Auto, Bus, Car, Train).
- **PostgreSQL & PostGIS Data Layer**: Relational data store for trip verification, origin-destination matrices, and spatial corridor analytics.
- **NATPAC Admin Dashboard** (`apps/dashboard/`): React dashboard rendering modal split distributions, trip verification metrics, and spatial heatmaps.
- **React Native Mobile Client** (`apps/mobile/`): Mobile app for travel discovery recommendations with passive background telemetry collection and 5-second human-in-the-loop trip verification.

---

## ⚡ Quick Start with Docker

Boot the entire full-stack ecosystem with a single command:

```bash
docker-compose up --build
```

### Services & Ports:
- **FastAPI Backend API**: `http://localhost:8000` (Swagger UI: `http://localhost:8000/docs`)
- **ML Microservice**: `http://localhost:8001`
- **PostgreSQL / PostGIS Database**: `localhost:5432`
- **Redis Cache & Ingestion Queue**: `localhost:6379`

---

## 📡 Core API Endpoints

- **`POST /api/v1/location/ping`**: Ingest high-frequency GPS ping to Redis queue (returns `202 Accepted`).
- **`GET /api/v1/trips/unverified/{user_id}`**: Fetch unverified trips for mobile user review.
- **`POST /api/v1/trips/verify`**: Submit corrected transport mode and trip purpose.
- **`GET /api/v1/analytics/summary`**: NATPAC government dashboard trip summary.
- **`GET /api/v1/analytics/mode-split`**: NATPAC transit corridor modal split metrics.
