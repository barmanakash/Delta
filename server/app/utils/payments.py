"""
Payment providers (TEST MODE ONLY).

Two providers sit behind this small set of functions, so the rest of the app
never needs to know which one is active:

  sandbox  built in. No account, no card, no money: FriendRide shows its own
           test checkout page where you press "Pay" or "Fail".
  stripe   Stripe's hosted Checkout, used when STRIPE_SECRET_KEY is set in
           server/.env. Only TEST keys (sk_test_...) are accepted. Pay with
           Stripe's test card 4242 4242 4242 4242.

Money is always whole rupees in the app; Stripe wants paise (x100).
"""

import uuid
from typing import Optional

from fastapi import HTTPException, status
from fastapi.concurrency import run_in_threadpool

from app.config import settings


def provider_name() -> str:
    return settings.PAYMENT_PROVIDER


def _stripe():
    """The configured Stripe module, refusing anything that could take real money."""
    key = settings.STRIPE_SECRET_KEY
    if key.startswith(("sk_live", "rk_live")):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Live Stripe keys are blocked in this project. Use a test key (sk_test_...).",
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


def _stripe_failed() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail="Stripe couldn't complete that request. Check the server's Stripe test key and try again.",
    )


async def create_checkout(trip_id: str, amount: int, title: str) -> tuple[str, str]:
    """Start a payment of `amount` rupees. Returns (session_id, checkout_url)."""
    if provider_name() == "sandbox":
        session_id = f"sbx_{uuid.uuid4().hex}"
        return session_id, f"{settings.FRONTEND_URL}/pay/{session_id}"

    stripe = _stripe()

    def _create():
        return stripe.checkout.Session.create(
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
        )

    try:
        session = await run_in_threadpool(_create)
    except Exception:
        raise _stripe_failed()
    return session.id, session.url


async def fetch_paid_state(session_id: str) -> tuple[bool, Optional[str]]:
    """Stripe only: has this Checkout Session been paid? (paid, payment_intent id)"""
    stripe = _stripe()
    try:
        session = await run_in_threadpool(stripe.checkout.Session.retrieve, session_id)
    except Exception:
        raise _stripe_failed()
    return session.payment_status == "paid", session.payment_intent


async def refund(payment: dict) -> None:
    """Give a paid payment back. The sandbox has no money to move."""
    if payment.get("provider") != "stripe":
        return
    intent = payment.get("payment_intent")
    if not intent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="This payment has no Stripe reference, so it can't be refunded automatically.",
        )
    stripe = _stripe()
    try:
        await run_in_threadpool(stripe.Refund.create, payment_intent=intent)
    except Exception:
        raise _stripe_failed()
