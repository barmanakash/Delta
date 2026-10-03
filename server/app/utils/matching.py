"""
Matching between a lift taker's request and a rider's published route.

A rider publishes an ordered list of named stops with the minutes it takes to
reach each one. A rider is compatible when

  * the lift taker's pickup matches one of the stops,
  * the lift taker's drop matches a LATER stop (same direction of travel),
  * the rider reaches the pickup stop inside the requested time window,
  * the rider still has a seat, and the same-gender rule (if on) is met.

Places are free text, so stop names are compared by word overlap rather than
by coordinates. Generic words ("gate", "stop", "station"...) are ignored so
"PNT Naka Safe Transit Stop, North Gate" still matches "PNT Naka North Gate".
"""

import re
from datetime import date, datetime
from typing import Optional

# Words that appear in almost every stop name and say nothing about where it is
_GENERIC_WORDS = {
    "gate", "stop", "bay", "station", "safe", "transit", "zone", "point",
    "road", "rd", "the", "near", "at", "no", "stand",
}

# Below this word-overlap score two place names are treated as different places
MIN_PLACE_SIMILARITY = 0.5

# date.weekday() -> the day codes riders pick on the Create Commute screen
_WEEKDAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")

# Score penalties (rupees-free "points" out of 100)
MAX_PICKUP_PENALTY = 14
MAX_DROP_PENALTY = 14
MAX_TIME_PENALTY = 10
MIN_FARE = 10


def _words(text: str) -> set[str]:
    found = set(re.findall(r"[a-z0-9]+", text.lower()))
    distinctive = found - _GENERIC_WORDS
    return distinctive or found


def place_similarity(a: str, b: str) -> float:
    """0..1 word-overlap (Dice) score between two place names."""
    wa, wb = _words(a), _words(b)
    if not wa or not wb:
        return 0.0
    return 2 * len(wa & wb) / (len(wa) + len(wb))


def to_minutes(t: str) -> int:
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def from_minutes(mins: int) -> str:
    mins = max(0, min(mins, 23 * 60 + 59))
    return f"{mins // 60:02d}:{mins % 60:02d}"


def _best_stop(stops: list[dict], place: str, start: int = 0) -> Optional[tuple[int, float]]:
    """Index and score of the stop (at or after `start`) that best fits `place`."""
    best: Optional[tuple[int, float]] = None
    for i in range(start, len(stops)):
        score = place_similarity(place, stops[i]["name"])
        if score >= MIN_PLACE_SIMILARITY and (best is None or score > best[1]):
            best = (i, score)
    return best


def build_match(offer: dict, request: dict, now: Optional[datetime] = None) -> Optional[dict]:
    """
    The match details for one rider, or None when the rider doesn't fit.
    `request` is a stored lift-request document.
    """
    now = now or datetime.now()
    stops = offer.get("stops") or []
    if len(stops) < 2 or offer.get("seats_available", 0) < 1:
        return None

    # Commutes repeat only on the weekdays the rider picked (offers without
    # repeat_days, such as the demo riders, repeat every day)
    days = offer.get("repeat_days")
    if offer.get("repeat_daily") and days:
        weekday = _WEEKDAYS[datetime.strptime(request["travel_date"], "%Y-%m-%d").weekday()]
        if weekday not in days:
            return None

    # Same-gender rule
    if request.get("same_gender_only"):
        wanted = request.get("requester_gender")
        if not wanted or offer.get("rider_gender") != wanted:
            return None

    # Direction of travel: pickup first, drop at a later stop
    pickup = _best_stop(stops, request["pickup"])
    if not pickup:
        return None
    drop = _best_stop(stops, request["destination"], start=pickup[0] + 1)
    if not drop:
        return None
    pick_idx, pick_sim = pickup
    drop_idx, drop_sim = drop

    # When the rider reaches the pickup stop must fall inside the search window
    pickup_min = to_minutes(offer["depart_time"]) + stops[pick_idx]["offset_min"]
    window_start = to_minutes(request.get("search_window_start") or request["window_start"])
    window_end = to_minutes(request.get("search_window_end") or request["window_end"])
    if not window_start <= pickup_min <= window_end:
        return None

    # A rider who has already passed the pickup stop today is no use
    if request["travel_date"] == date.today().isoformat():
        if pickup_min < now.hour * 60 + now.minute:
            return None

    duration = stops[drop_idx]["offset_min"] - stops[pick_idx]["offset_min"]
    arrival_min = pickup_min + duration

    # How closely the rider's route follows the lift taker's: perfect name
    # matches and a pickup right at the requested time score highest.
    requested_min = to_minutes(request["window_start"])
    time_penalty = min(MAX_TIME_PENALTY, abs(pickup_min - requested_min) / 3)
    overlap = round(
        100
        - MAX_PICKUP_PENALTY * (1 - pick_sim)
        - MAX_DROP_PENALTY * (1 - drop_sim)
        - time_penalty
    )
    overlap = max(1, min(100, overlap))

    fare = max(MIN_FARE, round(duration * float(offer.get("rate_per_min", 1.65))))

    # The rider's route on the map, when every stop was located
    located = all(s.get("lat") is not None and s.get("lng") is not None for s in stops)
    route = (
        [{"name": s["name"], "lat": s["lat"], "lng": s["lng"]} for s in stops]
        if located
        else []
    )

    return {
        "offer_id": str(offer["_id"]),
        "rider_name": offer.get("rider_name", "Rider"),
        "rider_photo_url": offer.get("rider_photo_url"),
        "rider_verification": offer.get("rider_verification", "ID under review"),
        "vehicle_type": offer.get("vehicle_type", "bike"),
        "vehicle_model": offer.get("vehicle_model", ""),
        "vehicle_plate": offer.get("vehicle_plate", ""),
        "seats_available": offer["seats_available"],
        "overlap_pct": overlap,
        "pickup_time": from_minutes(pickup_min),
        "pickup_point": stops[pick_idx]["name"],
        "arrival_time": from_minutes(arrival_min),
        "arrival_point": stops[drop_idx]["name"],
        "duration_min": duration,
        "fare": fare,
        "helmet_note": offer.get("helmet_note", "Dual Helmets Provided"),
        "walk_note": offer.get("walk_note", "Zero Detour (<200m walk)"),
        "route_note": offer.get("route_note", "Direct Safe Corridor"),
        "corridor": offer.get("corridor"),
        "is_demo": bool(offer.get("is_demo", False)),
        "route": route,
        "board_index": pick_idx if route else None,
        "alight_index": drop_idx if route else None,
    }
