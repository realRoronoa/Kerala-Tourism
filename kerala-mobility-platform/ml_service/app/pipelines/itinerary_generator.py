"""
itinerary_generator.py
=======================
Kerala Mobility Platform — ML Service
--------------------------------------
Generates personalised Kerala travel itineraries by combining:
  1. Semantic spot retrieval   — knowledge_base.search_spots()
  2. LLM planning              — Google Gemini API (gemini-2.0-flash)

Public API
----------
  generate_trip_plan(user_request, num_days, top_k_spots)
      → ItineraryResult  (dataclass, also serialisable to dict)

JSON Output Schema (enforced via Gemini JSON mode)
---------------------------------------------------
  {
    "itinerary_title": str,
    "destination":     str,
    "total_days":      int,
    "summary":         str,
    "days": [
      {
        "day":   int,
        "theme": str,
        "activities": [
          {
            "time":          str,   // "9:00 AM"
            "location_name": str,
            "description":   str,
            "lat":           float,
            "lon":           float,
            "duration_hours": float
          }
        ]
      }
    ]
  }

Environment
-----------
  GEMINI_API_KEY  — loaded from ml_service/.env via python-dotenv
"""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.pipelines.knowledge_base import search_spots

# Load .env from the ml_service directory (one level up from pipelines/)
_env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=os.path.abspath(_env_path))

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Gemini Configuration
# ---------------------------------------------------------------------------

_GEMINI_MODEL = "gemini-flash-latest"
_GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")

_gemini_client: Optional[genai.Client] = None

if _GEMINI_API_KEY and _GEMINI_API_KEY != "your_gemini_api_key_here":
    _gemini_client = genai.Client(api_key=_GEMINI_API_KEY)
    logger.info("itinerary_generator: Gemini client initialised (model=%s).", _GEMINI_MODEL)
else:
    logger.warning(
        "itinerary_generator: GEMINI_API_KEY not set or is placeholder. "
        "generate_trip_plan() will raise RuntimeError until the key is configured."
    )

# ---------------------------------------------------------------------------
# Result dataclass
# ---------------------------------------------------------------------------


@dataclass
class ItineraryResult:
    """Return type for generate_trip_plan()."""

    itinerary_title: str
    destination: str
    total_days: int
    summary: str
    days: List[Dict[str, Any]]
    spots_used: List[Dict[str, Any]] = field(default_factory=list)   # raw KB results
    raw_llm_response: Optional[str] = None                           # debug only

    def to_dict(self) -> Dict[str, Any]:
        return {
            "itinerary_title": self.itinerary_title,
            "destination":     self.destination,
            "total_days":      self.total_days,
            "summary":         self.summary,
            "days":            self.days,
            "spots_used":      [
                {
                    "rank":    s["rank"],
                    "name":    s["name"],
                    "score":   s["score"],
                    "lat":     s["lat"],
                    "lon":     s["lon"],
                    "district": s["district"],
                }
                for s in self.spots_used
            ],
        }


# ---------------------------------------------------------------------------
# Prompt builder
# ---------------------------------------------------------------------------


def _build_system_prompt(
    spots: List[Dict[str, Any]],
    num_days: int,
) -> str:
    """Construct the Gemini system prompt with injected spot data.

    The spots retrieved from the knowledge base are embedded verbatim so the
    LLM grounds its itinerary in real, coordinate-accurate Kerala locations.
    """
    spot_blocks = []
    for s in spots:
        block = (
            f"- Name: {s['name']}\n"
            f"  District: {s['district']}\n"
            f"  Categories: {s['category']}\n"
            f"  Crowd level: {s['crowd_level']}\n"
            f"  Best time: {s['best_time']}\n"
            f"  Latitude: {s['lat']}, Longitude: {s['lon']}\n"
            f"  Description: {s['description']}"
        )
        spot_blocks.append(block)

    spots_text = "\n\n".join(spot_blocks)

    return f"""You are an expert Kerala travel planner with deep knowledge of local culture, transport, and tourism.

You have been given a set of verified Kerala tourist spots retrieved from a semantic knowledge base. Your task is to create a realistic, engaging, and practical {num_days}-day travel itinerary using ONLY these locations.

VERIFIED KERALA LOCATIONS (use ONLY these, do not invent locations):
{spots_text}

STRICT RULES:
1. Create exactly {num_days} day(s) in the itinerary.
2. Each day must have 2–4 activities drawn from the provided locations above.
3. Use the EXACT lat/lon values provided — do not modify coordinates.
4. Use the EXACT location name as given.
5. Schedule activities at realistic Kerala travel times (account for travel between locations in the same district).
6. Return ONLY valid JSON. No markdown, no explanation, no code fences.

REQUIRED JSON SCHEMA (return this exact structure):
{{
  "itinerary_title": "string — a catchy title for this trip",
  "destination": "Kerala, India",
  "total_days": {num_days},
  "summary": "string — 2-3 sentence overview of the itinerary",
  "days": [
    {{
      "day": 1,
      "theme": "string — theme for this day (e.g. 'Beaches and Heritage')",
      "activities": [
        {{
          "time": "string — e.g. '9:00 AM'",
          "location_name": "string — exact name from the list above",
          "description": "string — what the traveller will do here (2-3 sentences)",
          "lat": number,
          "lon": number,
          "duration_hours": number
        }}
      ]
    }}
  ]
}}"""


# ---------------------------------------------------------------------------
# Core function
# ---------------------------------------------------------------------------


def generate_trip_plan(
    user_request: str,
    num_days: int = 3,
    top_k_spots: int = 6,
) -> ItineraryResult:
    """Generate a personalised Kerala travel itinerary using RAG + Gemini.

    Parameters
    ----------
    user_request : str
        Natural-language travel preference.
        Examples:
          - "I want a peaceful nature trip with wildlife and waterfalls"
          - "beach holiday with some heritage sightseeing"
          - "adventure trekking in the hills"
    num_days : int, optional
        Number of days in the itinerary (default: 3).
    top_k_spots : int, optional
        Number of spots to retrieve from the knowledge base (default: 6).

    Returns
    -------
    ItineraryResult
        Dataclass with the full itinerary. Call .to_dict() for JSON output.

    Raises
    ------
    RuntimeError
        If GEMINI_API_KEY is not configured.
    ValueError
        If the LLM returns malformed JSON or a schema-invalid response.
    """
    # ------------------------------------------------------------------
    # Guard: client must be initialised
    # ------------------------------------------------------------------
    if _gemini_client is None:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. "
            "Set it in ml_service/.env and restart the service."
        )

    if not user_request or not user_request.strip():
        raise ValueError("user_request must be a non-empty string.")

    num_days = max(1, min(num_days, 7))  # cap between 1–7 days

    # ------------------------------------------------------------------
    # Step 1: Retrieve relevant spots from the vector knowledge base
    # ------------------------------------------------------------------
    logger.info(
        "generate_trip_plan: retrieving top %d spots for query='%s'",
        top_k_spots, user_request,
    )
    try:
        spots = search_spots(user_request.strip(), top_k=top_k_spots)
    except Exception as exc:
        raise RuntimeError(f"Knowledge base search failed: {exc}") from exc

    if not spots:
        raise RuntimeError(
            "No spots returned from knowledge base. "
            "Check that kerala_spots.json is loaded correctly."
        )

    logger.info(
        "generate_trip_plan: retrieved %d spots | top match='%s' (score=%.3f)",
        len(spots), spots[0]["name"], spots[0]["score"],
    )

    # ------------------------------------------------------------------
    # Step 2: Build the grounded system prompt with injected spot data
    # ------------------------------------------------------------------
    system_prompt = _build_system_prompt(spots, num_days)
    user_message = (
        f"Plan a {num_days}-day Kerala trip for this traveller request: \"{user_request.strip()}\""
    )

    # ------------------------------------------------------------------
    # Step 3: Call Gemini with JSON output enforced
    # ------------------------------------------------------------------
    logger.info(
        "generate_trip_plan: calling Gemini model '%s'...", _GEMINI_MODEL
    )
    try:
        response = _gemini_client.models.generate_content(
            model=_GEMINI_MODEL,
            contents=f"{system_prompt}\n\nUser request: {user_message}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.4,
                max_output_tokens=4096,
            ),
        )
        raw_text: str = response.text.strip()
    except Exception as exc:
        raise RuntimeError(f"Gemini API call failed: {exc}") from exc

    logger.debug("generate_trip_plan: raw LLM response length=%d chars", len(raw_text))

    # ------------------------------------------------------------------
    # Step 4: Parse and validate the JSON response
    # ------------------------------------------------------------------
    try:
        itinerary_data: Dict[str, Any] = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Gemini returned non-JSON output. Raw response: {raw_text[:500]!r}"
        ) from exc

    # Validate required top-level keys
    required_keys = {"itinerary_title", "destination", "total_days", "summary", "days"}
    missing = required_keys - set(itinerary_data.keys())
    if missing:
        raise ValueError(
            f"Gemini response missing required keys: {missing}. "
            f"Got keys: {set(itinerary_data.keys())}"
        )

    if not isinstance(itinerary_data.get("days"), list) or not itinerary_data["days"]:
        raise ValueError("Gemini response has empty or invalid 'days' array.")

    # Validate each day and activity have required fields
    for day_idx, day in enumerate(itinerary_data["days"]):
        if "activities" not in day or not day["activities"]:
            raise ValueError(f"Day {day_idx + 1} has no activities.")
        for act_idx, act in enumerate(day["activities"]):
            for req_field in ("time", "location_name", "lat", "lon"):
                if req_field not in act:
                    raise ValueError(
                        f"Day {day_idx + 1}, activity {act_idx + 1} "
                        f"missing required field '{req_field}'."
                    )
                    
    logger.info(
        "generate_trip_plan: itinerary generated successfully — '%s' (%d days)",
        itinerary_data.get("itinerary_title", "Untitled"),
        len(itinerary_data["days"]),
    )

    # ------------------------------------------------------------------
    # Step 5: Return structured result
    # ------------------------------------------------------------------
    return ItineraryResult(
        itinerary_title=itinerary_data["itinerary_title"],
        destination=itinerary_data.get("destination", "Kerala, India"),
        total_days=itinerary_data.get("total_days", num_days),
        summary=itinerary_data.get("summary", ""),
        days=itinerary_data["days"],
        spots_used=spots,
        raw_llm_response=raw_text,
    )
