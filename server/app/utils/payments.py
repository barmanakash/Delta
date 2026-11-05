"""
Stripe payments (TEST MODE ONLY, no real money).

FriendRide takes the fuel-split through Stripe's hosted Checkout page:

  1. The lift taker presses Pay: we create a Checkout Session and send them
     to Stripe's page (create_checkout).
  2. They pay with Stripe's test card 4242 4242 4242 4242.
  3. Stripe sends them back to the app, and also tells this server directly
     with a webhook (parse_webhook). Either one marks the trip paid, and the
     server always asks Stripe itself: the browser's word is never enough.
  4. Cancelling a paid trip refunds it (refund).

Only TEST keys (sk_test_...) work here: live keys are refused.
Money is whole rupees in the app; Stripe wants paise (x100).
"""

import json
import logging
from typing import Optional

from fastapi import HTTPException, status
from fastapi.concurrency import run_in_threadpool

from app.config import settings


logger = logging.getLogger("uvicorn.error")  # prints in the same terminal as the server


def provider_name() -> str:
    return "stripe"


def _stripe():
    """The configured Stripe module, refusing anything that could take real money."""
    key = settings.STRIPE_SECRET_KEY
    if not key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Stripe isn't set up yet. Add your Stripe test secret key as "
                "STRIPE_SECRET_KEY in server/.env and restart the server."
            ),
        )
    if key.startswith(("sk_live", "rk_live")):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Live Stripe keys are blocked in this project. Use a test key (sk_test_...).",
        )
    if not key.startswith(("sk_test_", "rk_test_")):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "STRIPE_SECRET_KEY must be a Stripe secret test key (it starts with "
                "sk_test_), not a publishable key (pk_...)."
            ),
        )
    try:
        import stripe  # imported only when Stripe is actually used
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The 'stripe' package isn't installed on the server. Run: pip install stripe",
        )
    stripe.api_key = key
    return stripe


def _stripe_failed(exc: Optional[Exception] = None) -> HTTPException:
    """A Stripe call failed. Log why, and show Stripe's own message (test mode only)."""
    logger.error("Stripe request failed: %r", exc, exc_info=exc)
    reason = ""
    if exc is not None:
        reason = getattr(exc, "user_message", None) or str(exc)
    detail = "Stripe couldn't complete that request."
    if reason:
        detail += f" Stripe says: {reason[:300]}"
    return HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)


async def create_checkout(
    trip_id: str,
    amount: int,
    title: str,
    customer_email: Optional[str] = None,
) -> tuple[str, str]:
    """Start a payment of `amount` rupees. Returns (session_id, checkout_url)."""
    stripe = _stripe()

    def _create():
        params = dict(
            mode="payment",
            line_items=[
                {
                    "quantity": 1,
                    "price_data": {
                        "currency": "inr",
                        "unit_amount": amount * 100,
                        "product_data": {"name": title[:120]},
                    },
                }
            ],
            success_url=(
                f"{settings.FRONTEND_URL}/payment/result"
                f"?trip={trip_id}&session_id={{CHECKOUT_SESSION_ID}}"
            ),
            cancel_url=f"{settings.FRONTEND_URL}/payment/result?trip={trip_id}&cancelled=1",
            client_reference_id=trip_id,
            metadata={"trip_id": trip_id},
            # Shows up on the payment in the Stripe dashboard
            payment_intent_data={
                "description": title[:300],
                "metadata": {"trip_id": trip_id},
            },
        )
        if customer_email:
            params["customer_email"] = customer_email
        return stripe.checkout.Session.create(**params)

    try:
        session = await run_in_threadpool(_create)
    except Exception as exc:
        raise _stripe_failed(exc)
    return session.id, session.url


async def fetch_paid_state(session_id: str) -> tuple[bool, Optional[str]]:
    """Has this Checkout Session been paid? Returns (paid, payment_intent id)."""
    stripe = _stripe()
    try:
        session = await run_in_threadpool(stripe.checkout.Session.retrieve, session_id)
    except Exception as exc:
        raise _stripe_failed(exc)
    return session.payment_status == "paid", session.payment_intent


def parse_webhook(payload: bytes, signature: str) -> dict:
    """Check that a webhook really came from Stripe, then return its event."""
    secret = settings.STRIPE_WEBHOOK_SECRET
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Stripe webhooks aren't set up (STRIPE_WEBHOOK_SECRET is empty).",
        )
    stripe = _stripe()
    try:
        stripe.Webhook.construct_event(payload, signature, secret)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Stripe signature",
        )
    return json.loads(payload)


async def refund(payment: dict) -> None:
    """Give a paid Stripe payment back to the customer."""
    if payment.get("provider") != "stripe":
        return  # older practice payments have no money to move
    intent = payment.get("payment_intent")
    if not intent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="This payment has no Stripe reference, so it can't be refunded automatically.",
        )
    stripe = _stripe()
    try:
        await run_in_threadpool(stripe.Refund.create, payment_intent=intent)
    except Exception as exc:
        raise _stripe_failed(exc)
