"""
Matching between a lift taker's request and a rider's published route.

A rider publishes an ordered list of stops with the minutes it takes to reach
each one. A rider is compatible when

  * the lift taker's pickup is on (or very near) the rider's route,
  * the lift taker's drop is LATER along that route (same direction of travel),
  * the rider reaches the pickup inside the requested time window,
  * the rider still has a seat, and the same-gender rule (if on) is met.

Two ways of deciding "on the route" are used, in this order:

  1. By NAME. Places are free text, so stop names are compared by word overlap.
     Generic words ("gate", "stop", "station"...) are ignored so
     "PNT Naka Safe Transit Stop, North Gate" still matches "PNT Naka North Gate".

  2. By LOCATION. Both people pick real map points, and two people almost never
     name the same place the same way (or pick the exact same point). So when
     the request has map points and every stop of the rider's route has one too,
     the lift taker's pickup and drop only have to lie within GEO_MAX_KM of the
     rider's route. The pickup time is then worked out from how far along the
     route that point is.

When a rider does NOT fit, explain_no_match() says why in plain language, so the
screens can tell people what to change instead of just showing an empty list.
"""

import math
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

# A lift taker's pickup / drop may be at most this far (km, in a straight line)
# from the rider's route to count as "on the way". Riders' routes are drawn as
# straight lines between their stops, so a little slack is needed for bends.
GEO_MAX_KM = 1.5

# The drop must be at least this far past the pickup, measured in stop-to-stop
# segments (stops: 0, 1, 2 ...), so a pickup and drop on the same spot don't match.
MIN_PROGRESS = 0.05

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


# ---------------------------------------------------------------------------
#  Matching by name
# ---------------------------------------------------------------------------

def _best_stop(stops: list[dict], place: str, start: int = 0) -> Optional[tuple[int, float]]:
    """Index and score of the stop (at or after `start`) that best fits `place`."""
    best: Optional[tuple[int, float]] = None
    for i in range(start, len(stops)):
        score = place_similarity(place, stops[i]["name"])
        if score >= MIN_PLACE_SIMILARITY and (best is None or score > best[1]):
            best = (i, score)
    return best


def _fit_by_name(stops: list[dict], request: dict) -> Optional[dict]:
    """The lift taker's pickup and drop found among the rider's named stops."""
    pickup = _best_stop(stops, request["pickup"])
    if not pickup:
        return None
    drop = _best_stop(stops, request["destination"], start=pickup[0] + 1)
    if not drop:
        return None

    pick_idx, pick_sim = pickup
    drop_idx, drop_sim = drop
    return {
        "pick_idx": pick_idx,
        "drop_idx": drop_idx,
        "pick_sim": pick_sim,
        "drop_sim": drop_sim,
        "pick_off": stops[pick_idx]["offset_min"],
        "drop_off": stops[drop_idx]["offset_min"],
        "pickup_point": stops[pick_idx]["name"],
        "arrival_point": stops[drop_idx]["name"],
        "walk_note": None,
    }


# ---------------------------------------------------------------------------
#  Matching by location
# ---------------------------------------------------------------------------

def _is_located(stop: dict) -> bool:
    return stop.get("lat") is not None and stop.get("lng") is not None


def _xy_km(lat: float, lng: float, ref_lat: float) -> tuple[float, float]:
    """A small-area flat map (km) good enough for a city-sized route."""
    return (
        lng * 111.32 * math.cos(math.radians(ref_lat)),
        lat * 110.57,
    )


def _locate_on_route(stops: list[dict], lat: float, lng: float) -> tuple[float, float, int, float]:
    """
    Where a point sits against the rider's route (straight lines between stops).

    Returns (progress, distance_km, segment, offset_min):
      progress   - how far along the route: segment number + fraction (1.5 is
                   halfway between stop 1 and stop 2)
      distance   - how far the point is from the route
      segment    - the stop the rider has most recently passed at that point
      offset_min - minutes after departure the rider is at that point
    """
    px, py = _xy_km(lat, lng, lat)
    best: Optional[tuple[float, float, int, float]] = None

    for i in range(len(stops) - 1):
        a, b = stops[i], stops[i + 1]
        ax, ay = _xy_km(a["lat"], a["lng"], lat)
        bx, by = _xy_km(b["lat"], b["lng"], lat)
        dx, dy = bx - ax, by - ay
        length2 = dx * dx + dy * dy
        t = 0.0 if length2 == 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / length2))
        dist = math.hypot(px - (ax + t * dx), py - (ay + t * dy))

        if best is None or dist < best[1]:
            offset = a["offset_min"] + t * (b["offset_min"] - a["offset_min"])
            best = (i + t, dist, i, offset)

    # stops always has at least 2 entries, so there is always a best
    return best  # type: ignore[return-value]


def _fit_by_location(stops: list[dict], request: dict) -> tuple[Optional[dict], str]:
    """
    The lift taker's pickup and drop found along the rider's mapped route.
    Returns (fit, reason): fit is None when it doesn't fit, and reason says why.
    """
    needed = (
        request.get("pickup_lat"),
        request.get("pickup_lng"),
        request.get("destination_lat"),
        request.get("destination_lng"),
    )
    if any(v is None for v in needed):
        return None, (
            "your pickup or destination has no map point, and their names don't match "
            "this rider's stops"
        )
    if not all(_is_located(s) for s in stops):
        return None, (
            "this rider's route has no map points, and its stop names don't match "
            "your pickup and destination"
        )

    pick_prog, pick_dist, pick_seg, pick_off = _locate_on_route(
        stops, request["pickup_lat"], request["pickup_lng"]
    )
    drop_prog, drop_dist, drop_seg, drop_off = _locate_on_route(
        stops, request["destination_lat"], request["destination_lng"]
    )

    if pick_dist > GEO_MAX_KM or drop_dist > GEO_MAX_KM:
        far = []
        if pick_dist > GEO_MAX_KM:
            far.append(f"your pickup is {pick_dist:.1f} km from this rider's route")
        if drop_dist > GEO_MAX_KM:
            far.append(f"your destination is {drop_dist:.1f} km from it")
        return None, " and ".join(far) + f" (limit {GEO_MAX_KM:g} km)"
    if drop_prog - pick_prog < MIN_PROGRESS:
        return None, "this rider travels your route in the opposite direction"

    # Closer to the route = better; at the edge of the corridor it still scores 0.5
    def closeness(dist_km: float) -> float:
        return 1 - 0.5 * min(1.0, dist_km / GEO_MAX_KM)

    # Index the rider's stop just before the pickup and just after the drop,
    # so the route can be drawn from the pickup to the drop
    pick_idx = pick_seg
    drop_idx = min(len(stops) - 1, drop_seg + 1)
    if drop_idx <= pick_idx:
        drop_idx = min(len(stops) - 1, pick_idx + 1)

    worst = max(pick_dist, drop_dist)
    return {
        "pick_idx": pick_idx,
        "drop_idx": drop_idx,
        "pick_sim": closeness(pick_dist),
        "drop_sim": closeness(drop_dist),
        "pick_off": pick_off,
        "drop_off": drop_off,
        # The rider picks up and drops where the lift taker asked
        "pickup_point": request["pickup"],
        "arrival_point": request["destination"],
        "walk_note": f"~{round(worst * 1000)} m from route" if worst > 0.2 else None,
    }, ""


# ---------------------------------------------------------------------------
#  Putting it together
# ---------------------------------------------------------------------------

def _evaluate(
    offer: dict, request: dict, now: Optional[datetime] = None
) -> tuple[Optional[dict], str]:
    """
    (match, reason): the match details when the rider fits, otherwise None and
    a plain-language reason the rider was left out.
    """
    now = now or datetime.now()
    stops = offer.get("stops") or []
    if len(stops) < 2 or offer.get("seats_available", 0) < 1:
        return None, "this rider has no free pillion seat"

    # Commutes repeat only on the weekdays the rider picked (offers without
    # repeat_days, such as the demo riders, repeat every day)
    days = offer.get("repeat_days")
    if offer.get("repeat_daily") and days:
        weekday = _WEEKDAYS[datetime.strptime(request["travel_date"], "%Y-%m-%d").weekday()]
        if weekday not in days:
            return None, (
                f"this rider doesn't ride on {weekday.capitalize()} "
                f"(rides {', '.join(d.capitalize() for d in days)})"
            )

    # Same-gender rule
    if request.get("same_gender_only"):
        wanted = request.get("requester_gender")
        if not wanted:
            return None, "same-gender filter is on, but your gender isn't saved on the request"
        if not offer.get("rider_gender"):
            return None, "same-gender filter is on, but this rider's gender wasn't saved on their route"
        if offer.get("rider_gender") != wanted:
            return None, "same-gender filter is on and this rider's gender is different"

    # Direction of travel: pickup first, drop later. Names first, then map points.
    fit = _fit_by_name(stops, request)
    if not fit:
        fit, reason = _fit_by_location(stops, request)
        if not fit:
            return None, reason

    # When the rider reaches the pickup must fall inside the search window
    pickup_min = to_minutes(offer["depart_time"]) + round(fit["pick_off"])
    window_start = to_minutes(request.get("search_window_start") or request["window_start"])
    window_end = to_minutes(request.get("search_window_end") or request["window_end"])
    if not window_start <= pickup_min <= window_end:
        return None, (
            f"this rider reaches your pickup at {from_minutes(pickup_min)}, outside your time "
            f"window {from_minutes(window_start)}–{from_minutes(window_end)}"
        )

    # A rider who has already passed the pickup stop today is no use
    if request["travel_date"] == date.today().isoformat():
        if pickup_min < now.hour * 60 + now.minute:
            return None, f"this rider already passed your pickup today (at {from_minutes(pickup_min)})"

    duration = max(1, round(fit["drop_off"] - fit["pick_off"]))
    arrival_min = pickup_min + duration

    # How closely the rider's route follows the lift taker's: close places
    # and a pickup right at the requested time score highest.
    requested_min = to_minutes(request["window_start"])
    time_penalty = min(MAX_TIME_PENALTY, abs(pickup_min - requested_min) / 3)
    overlap = round(
        100
        - MAX_PICKUP_PENALTY * (1 - fit["pick_sim"])
        - MAX_DROP_PENALTY * (1 - fit["drop_sim"])
        - time_penalty
    )
    overlap = max(1, min(100, overlap))

    fare = max(MIN_FARE, round(duration * float(offer.get("rate_per_min", 1.65))))

    # The rider's route on the map, when every stop was located
    route = (
        [{"name": s["name"], "lat": s["lat"], "lng": s["lng"]} for s in stops]
        if all(_is_located(s) for s in stops)
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
        "pickup_point": fit["pickup_point"],
        "arrival_time": from_minutes(arrival_min),
        "arrival_point": fit["arrival_point"],
        "duration_min": duration,
        "fare": fare,
        "helmet_note": offer.get("helmet_note", "Dual Helmets Provided"),
        "walk_note": fit["walk_note"] or offer.get("walk_note", "Zero Detour (<200m walk)"),
        "route_note": offer.get("route_note", "Direct Safe Corridor"),
        "corridor": offer.get("corridor"),
        "is_demo": bool(offer.get("is_demo", False)),
        "route": route,
        "board_index": fit["pick_idx"] if route else None,
        "alight_index": fit["drop_idx"] if route else None,
    }, ""


def build_match(offer: dict, request: dict, now: Optional[datetime] = None) -> Optional[dict]:
    """
    The match details for one rider, or None when the rider doesn't fit.
    `request` is a stored lift-request document.
    """
    return _evaluate(offer, request, now)[0]


def explain_no_match(offer: dict, request: dict, now: Optional[datetime] = None) -> Optional[str]:
    """Why this rider doesn't fit the request (None when the rider does fit)."""
    match, reason = _evaluate(offer, request, now)
    return None if match else reason
