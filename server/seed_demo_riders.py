"""
Seed DEMO riders so the lift taker "Compatible Riders" screen has someone to show
before real riders publish routes.

    cd server
    python seed_demo_riders.py          # add (or refresh) the demo riders
    python seed_demo_riders.py --clear  # remove them again

The demo riders commute every day (repeat_daily) along the PNT Naka ->
Madan Mahal corridor, and are flagged is_demo so they are easy to find and
delete. They are not real users and have no login.
"""

import asyncio
import sys
from datetime import datetime, timezone

from app.database import get_ride_offers_collection

CORRIDOR = "Jabalpur Transit Corridor"

DEMO_RIDERS = [
    {
        "rider_name": "Rahul M.",
        "rider_verification": "Aadhaar & Co. Verified",
        "vehicle_type": "scooter",
        "vehicle_model": "Honda Activa 6G",
        "vehicle_plate": "KA-04-E-8821",
        "depart_time": "08:25",
        "stops": [
            {"name": "PNT Naka Safe Bay", "offset_min": 0},
            {"name": "Napier Town Gate 1", "offset_min": 8},
            {"name": "Civic Centre Zone", "offset_min": 16},
            {"name": "Madan Mahal Station", "offset_min": 27},
        ],
        "rate_per_min": 45 / 27,
        "helmet_note": "Dual Helmets Provided",
        "walk_note": "Zero Detour (<150m walk)",
        "route_note": "Direct Safe Corridor",
    },
    {
        "rider_name": "Amit K.",
        "rider_verification": "Aadhaar & Tech Park Verified",
        "vehicle_type": "scooter",
        "vehicle_model": "TVS Jupiter ZX",
        "vehicle_plate": "KA-03-J-4912",
        "depart_time": "08:32",
        "stops": [
            {"name": "PNT Naka North Gate", "offset_min": 0},
            {"name": "Tech Park Crossing", "offset_min": 12},
            {"name": "Madan Mahal Bay 3", "offset_min": 30},
        ],
        "rate_per_min": 1.6,
        "helmet_note": "Dual ISI Helmets",
        "walk_note": "Direct Corridor (<200m walk)",
        "route_note": "Optimized Transit",
    },
    {
        "rider_name": "Siddharth V.",
        "rider_verification": "Aadhaar & Campus Verified",
        "vehicle_type": "bike",
        "vehicle_model": "Royal Enfield Hunter 350",
        "vehicle_plate": "KA-05-M-1029",
        "depart_time": "08:40",
        "stops": [
            {"name": "PNT Naka Junction", "offset_min": 0},
            {"name": "Campus Circle", "offset_min": 14},
            {"name": "Madan Mahal West Entr.", "offset_min": 30},
        ],
        "rate_per_min": 50 / 30,
        "helmet_note": "Full Face ISI Helmet",
        "walk_note": "Safe Boarding Point",
        "route_note": "Standard Route",
    },
]


async def main(clear_only: bool) -> None:
    offers = get_ride_offers_collection()

    removed = await offers.delete_many({"is_demo": True})
    print(f"Removed {removed.deleted_count} existing demo rider(s).")
    if clear_only:
        return

    now = datetime.now(timezone.utc)
    docs = [
        {
            **rider,
            "user_id": None,
            "rider_photo_url": None,
            "rider_gender": "male",
            "corridor": CORRIDOR,
            "travel_date": None,
            "repeat_daily": True,
            "seats_available": 1,
            "status": "active",
            "is_demo": True,
            "created_at": now,
        }
        for rider in DEMO_RIDERS
    ]
    await offers.insert_many(docs)
    print(f"Added {len(docs)} demo riders on the {CORRIDOR}.")


if __name__ == "__main__":
    asyncio.run(main("--clear" in sys.argv))
