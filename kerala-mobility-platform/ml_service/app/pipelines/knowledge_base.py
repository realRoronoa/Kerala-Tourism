"""
knowledge_base.py
=================
Kerala Mobility Platform — ML Service
--------------------------------------
Semantic vector search over Kerala tourist spots using:
  - sentence-transformers (all-MiniLM-L6-v2) for embedding
  - ChromaDB (in-memory) as the vector store

Public API
----------
  search_spots(query, top_k)  — returns ranked list of matching spots

Lifecycle
---------
The ChromaDB collection is built once at module import time by calling
_build_collection(). This means:
  - Cold start: ~2-4 seconds (model load + embedding 12 spots)
  - Subsequent calls: < 50ms (pure vector similarity lookup)

The collection is in-memory only. On a production deployment with many
spots, replace EphemeralClient() with PersistentClient(path="...") so
the index survives restarts without re-embedding.
"""

from __future__ import annotations

import json
import logging
import os
import random
from typing import Any, Dict, List, Optional
import chromadb
from chromadb.config import Settings
from google import genai

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Path to the spots JSON file — sits next to this pipelines/ directory
_SPOTS_JSON_PATH: str = os.path.join(
    os.path.dirname(__file__),   # ml_service/app/pipelines/
    "..",                        # ml_service/app/
    "kerala_spots.json",
)

# Use Gemini API for embeddings instead of local PyTorch models to save RAM
_EMBED_MODEL_NAME: str = "text-embedding-004"

# ChromaDB collection name
_COLLECTION_NAME: str = "kerala_tourist_spots"

# ---------------------------------------------------------------------------
# Internal state — built once at import
# ---------------------------------------------------------------------------

_chroma_collection: Optional[chromadb.Collection] = None

def _get_gemini_client() -> genai.Client:
    from dotenv import load_dotenv
    _env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
    load_dotenv(dotenv_path=os.path.abspath(_env_path))
    
    keys_raw = os.getenv("GEMINI_API_KEY", "")
    keys = [k.strip() for k in keys_raw.split(",") if k.strip() and k.strip() != "your_gemini_api_key_here"]
    if not keys:
        raise RuntimeError("GEMINI_API_KEY not set")
    return genai.Client(api_key=random.choice(keys))

def _embed_texts(texts: List[str]) -> List[List[float]]:
    client = _get_gemini_client()
    response = client.models.embed_content(
        model=_EMBED_MODEL_NAME,
        contents=texts
    )
    return [e.values for e in response.embeddings]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _load_spots(json_path: str) -> List[Dict[str, Any]]:
    """Load and validate the Kerala spots JSON file.

    Raises
    ------
    FileNotFoundError  : if the JSON file doesn't exist.
    ValueError         : if the file is malformed or empty.
    """
    abs_path = os.path.abspath(json_path)
    if not os.path.exists(abs_path):
        raise FileNotFoundError(
            f"kerala_spots.json not found at: {abs_path}"
        )

    with open(abs_path, "r", encoding="utf-8") as f:
        spots = json.load(f)

    if not isinstance(spots, list) or not spots:
        raise ValueError("kerala_spots.json must be a non-empty JSON array.")

    required_keys = {"id", "name", "description", "lat", "lon"}
    for idx, spot in enumerate(spots):
        missing = required_keys - set(spot.keys())
        if missing:
            raise ValueError(
                f"Spot #{idx} is missing required fields: {missing}"
            )

    logger.info("knowledge_base: loaded %d spots from %s", len(spots), abs_path)
    return spots


def _build_embed_text(spot: Dict[str, Any]) -> str:
    """Construct the text to embed for a single spot.

    We combine the name, categories, and description to give the model
    rich semantic context. The category tags (e.g. "beach", "wildlife")
    act as booster tokens for short queries like "quiet beach".
    """
    categories = ", ".join(spot.get("category", []))
    district = spot.get("district", "")
    best_time = spot.get("best_time", "")

    parts = [
        spot["name"],
        f"Category: {categories}" if categories else "",
        f"District: {district}" if district else "",
        f"Best time to visit: {best_time}" if best_time else "",
        spot["description"],
    ]
    return " | ".join(p for p in parts if p)


def _build_collection(
    spots: List[Dict[str, Any]],
) -> chromadb.Collection:
    """Embed all spots and store them in an in-memory ChromaDB collection.

    Parameters
    ----------
    spots : list of spot dicts loaded from kerala_spots.json

    Returns
    -------
    A populated ChromaDB Collection ready for similarity queries.
    """
    # In-memory client — no persistence, no telemetry
    client = chromadb.EphemeralClient(
        settings=Settings(anonymized_telemetry=False)
    )

    collection = client.create_collection(
        name=_COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},   # cosine similarity for text embeddings
    )

    # Build text corpus to embed in one batched call (faster than one-by-one)
    texts: List[str] = [_build_embed_text(s) for s in spots]
    ids: List[str] = [s["id"] for s in spots]

    logger.info(
        "knowledge_base: embedding %d spots with '%s'...",
        len(spots), _EMBED_MODEL_NAME,
    )
    embeddings = _embed_texts(texts)

    # Build metadata dicts for each spot (stored alongside the vectors)
    metadatas: List[Dict[str, Any]] = []
    for spot in spots:
        metadatas.append({
            "name":         spot["name"],
            "lat":          float(spot["lat"]),
            "lon":          float(spot["lon"]),
            "district":     spot.get("district", ""),
            "best_time":    spot.get("best_time", ""),
            "crowd_level":  spot.get("crowd_level", "unknown"),
            "category":     ", ".join(spot.get("category", [])),
            "description":  spot["description"],
        })

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=texts,          # raw text stored for debugging / reranking
        metadatas=metadatas,
    )

    logger.info(
        "knowledge_base: ChromaDB collection '%s' ready with %d vectors.",
        _COLLECTION_NAME, len(ids),
    )
    return collection


def _initialise() -> None:
    """Load spots and build collection. Called once at import."""
    global _chroma_collection

    spots = _load_spots(_SPOTS_JSON_PATH)
    _chroma_collection = _build_collection(spots)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def search_spots(
    query: str,
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    """Find the most semantically relevant Kerala tourist spots for a query.

    Parameters
    ----------
    query : str
        A natural-language travel preference or interest.
        Examples:
          - "quiet beaches away from crowds"
          - "wildlife safari with elephants"
          - "cultural heritage and local food"
          - "hill station trekking"
          - "houseboat backwater cruise"
    top_k : int, optional
        Number of top results to return (default: 5, capped at total spots).

    Returns
    -------
    list of dict, each with:
        rank            int   — 1-based result rank
        id              str   — spot identifier
        name            str   — spot name
        score           float — cosine similarity score (0.0 – 1.0, higher is better)
        lat             float — latitude
        lon             float — longitude
        district        str   — Kerala district
        best_time       str   — recommended visiting months
        crowd_level     str   — expected crowd density
        category        str   — comma-separated category tags
        description     str   — full spot description

    Raises
    ------
    RuntimeError
        If the knowledge base failed to initialise (model or JSON error).

    Examples
    --------
    >>> from app.pipelines.knowledge_base import search_spots
    >>> results = search_spots("quiet beach sunset", top_k=3)
    >>> for r in results:
    ...     print(r["rank"], r["name"], r["score"])
    1 Varkala Cliff Beach 0.823
    2 Fort Kochi Beach 0.761
    3 Bekal Fort 0.704
    """
    if _chroma_collection is None:
        raise RuntimeError(
            "Knowledge base is not initialised. "
            "Ensure _initialise() ran successfully at import time."
        )

    if not query or not query.strip():
        raise ValueError("search_spots: query must be a non-empty string.")

    top_k = max(1, min(top_k, _chroma_collection.count()))

    # Embed the query using the Gemini API
    query_embedding = _embed_texts([query.strip()])[0]

    # Query the ChromaDB collection
    results = _chroma_collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["metadatas", "distances"],
    )

    # ChromaDB returns cosine *distance* (0 = identical, 2 = opposite).
    # Convert to similarity score ∈ [0, 1]: similarity = 1 - distance / 2
    spots_out: List[Dict[str, Any]] = []
    ids_list      = results["ids"][0]
    metadatas_list = results["metadatas"][0]
    distances_list = results["distances"][0]

    for rank_idx, (spot_id, meta, dist) in enumerate(
        zip(ids_list, metadatas_list, distances_list), start=1
    ):
        similarity_score = round(1.0 - dist / 2.0, 4)
        spots_out.append(
            {
                "rank":         rank_idx,
                "id":           spot_id,
                "name":         meta["name"],
                "score":        similarity_score,
                "lat":          meta["lat"],
                "lon":          meta["lon"],
                "district":     meta["district"],
                "best_time":    meta["best_time"],
                "crowd_level":  meta["crowd_level"],
                "category":     meta["category"],
                "description":  meta["description"],
            }
        )

    logger.info(
        "search_spots: query='%s' | top_k=%d | best_match='%s' (score=%.3f)",
        query,
        top_k,
        spots_out[0]["name"] if spots_out else "none",
        spots_out[0]["score"] if spots_out else 0.0,
    )

    return spots_out


def get_spot_count() -> int:
    """Return the total number of spots indexed in the knowledge base."""
    if _chroma_collection is None:
        return 0
    return _chroma_collection.count()


# ---------------------------------------------------------------------------
# Module initialisation — runs once when the module is first imported
# ---------------------------------------------------------------------------

try:
    _initialise()
except Exception as _init_exc:
    logger.error(
        "knowledge_base: initialisation failed — search_spots will raise RuntimeError. "
        "Error: %s",
        _init_exc,
    )
    # Do NOT re-raise: we want the rest of the ML service to start normally.
    # search_spots() will raise RuntimeError if called while uninitialised.
