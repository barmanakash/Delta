import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ReplayIcon from "@mui/icons-material/Replay";

import { LiftTakerHeader, LiftTakerFooter } from "../lifttakerlayout/lifttakerlayout";
import {
  apiRequest,
  clearSession,
  errorText,
  formatClock,
  toAbsoluteUrl,
  useCachedUser,
} from "../riderrequests/riderrequests";

/* ------------------------------------------------------------------ */
/*  Payment pages (TEST MODE ONLY, no real money)                      */
/*                                                                     */
/*  SandboxCheckout  /pay/:sessionId      the built-in practice page,  */
/*                   used when no Stripe key is set on the server.     */
/*  PaymentResult    /payment/result      where Stripe (or the sandbox)*/
/*                   sends the lift taker back. It asks the server to  */
/*                   verify the payment, so the browser never decides  */
/*                   by itself that a trip is paid.                    */
/* ------------------------------------------------------------------ */

const teal = "#007d73";
const dark = "#182136";
const muted = "#5b6475";
const pageBg = "#f6f6fd";

const cardStyle = {
  background: "#fff",
  borderRadius: 20,
  boxShadow: "0 4px 20px rgba(30,35,90,0.06)",
};

const primaryButton = {
  background: teal,
  color: "#fff",
  borderRadius: 12,
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: 14.5,
};

const outlineButton = {
  background: "#fff",
  color: dark,
  border: "1px solid #d5d9ee",
  borderRadius: 12,
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 700,
  fontSize: 14.5,
};

const OFFLINE = "Unable to connect to server. Please make sure the backend is running.";

// "2025-10-24" -> "Fri, 24 Oct"
function dayLabel(iso) {
  const [y, m, d] = (iso || "").split("-").map(Number);
  if (!y) return iso || "";
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */

function Shell({ children }) {
  const cached = useCachedUser();
  const photoUrl = toAbsoluteUrl(cached?.profile_photo_url);

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: pageBg,
        color: dark,
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LiftTakerHeader active="trips" user={cached} photoUrl={photoUrl} />
      <Box component="main" style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 16px" }}>
        <Box
          style={{
            ...cardStyle,
            width: "100%",
            maxWidth: 480,
            padding: "32px 28px",
            boxSizing: "border-box",
            alignSelf: "flex-start",
          }}
        >
          {children}
        </Box>
      </Box>
      <LiftTakerFooter />
    </Box>
  );
}

function TestBadge() {
  return (
    <Box
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "#fff4dc",
        color: "#7a5300",
        borderRadius: 8,
        padding: "3px 10px",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      TEST MODE · no real money
    </Box>
  );
}

function StatusView({ icon, tint, bg, title, body, children }) {
  return (
    <Box style={{ textAlign: "center" }}>
      <Box
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: bg,
          color: tint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
        }}
      >
        {icon}
      </Box>
      <Typography component="h1" style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.4px" }}>
        {title}
      </Typography>
      <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "10px auto 22px", maxWidth: 360 }}>
        {body}
      </Typography>
      {children}
      <Box style={{ marginTop: 22 }}>
        <TestBadge />
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "6px 0", fontSize: 13.5 }}>
      <span style={{ color: muted, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 700, textAlign: "right", wordBreak: "break-word" }}>{value}</span>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  /pay/:sessionId  (sandbox checkout)                                */
/* ------------------------------------------------------------------ */

export function SandboxCheckout() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | working | error
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/signin", { replace: true });
      return undefined;
    }
    let cancelled = false;

    apiRequest(`/api/payments/sandbox/${sessionId}`)
      .then(({ ok, status, data }) => {
        if (cancelled) return;
        if (status === 401) {
          clearSession();
          navigate("/signin", { replace: true });
          return;
        }
        if (!ok) {
          setError(errorText(data, "We couldn't find this payment."));
          setState("error");
          return;
        }
        setSession(data);
        setState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setError(OFFLINE);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, navigate]);

  const finish = async (outcome) => {
    setError("");
    setState("working");
    try {
      const { ok, status, data } = await apiRequest(`/api/payments/sandbox/${sessionId}/complete`, {
        method: "POST",
        body: { outcome },
      });
      if (status === 401) {
        clearSession();
        navigate("/signin", { replace: true });
        return;
      }
      if (!ok) {
        setError(errorText(data, "We couldn't finish this payment."));
        setState("ready");
        return;
      }
      navigate(`/payment/result?trip=${session.trip_id}`, { replace: true });
    } catch {
      setError(OFFLINE);
      setState("ready");
    }
  };

  const busy = state === "working";

  return (
    <Shell>
      {state === "loading" && (
        <Box style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <CircularProgress style={{ color: teal }} />
        </Box>
      )}

      {state === "error" && (
        <StatusView
          icon={<ErrorOutlineIcon style={{ fontSize: 34 }} />}
          tint="#a12626"
          bg="#fde2e2"
          title="Payment not found"
          body={error}
        >
          <Button disableElevation onClick={() => navigate("/trips")} style={primaryButton}>
            Back to My Trips
          </Button>
        </StatusView>
      )}

      {(state === "ready" || state === "working") && session && (
        <>
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Typography component="h1" style={{ fontSize: 22, fontWeight: 800 }}>
              Test checkout
            </Typography>
            <TestBadge />
          </Box>
          <Typography style={{ fontSize: 13.5, color: muted, marginTop: 8, lineHeight: 1.55 }}>
            This is FriendRide's built-in practice payment page. No card is needed and no money moves.
          </Typography>

          <Box style={{ background: "#f7f8fe", borderRadius: 14, padding: "12px 16px", marginTop: 20 }}>
            <InfoRow label="Trip" value={`${session.pickup} → ${session.destination}`} />
            <InfoRow label="Rider" value={session.rider_name} />
            <InfoRow label="Date" value={dayLabel(session.travel_date)} />
            <InfoRow label="Pickup" value={formatClock(session.pickup_time)} />
          </Box>

          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 20 }}>
            <Typography style={{ fontSize: 14, fontWeight: 700 }}>Total (fuel-split)</Typography>
            <Typography style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>₹{session.amount}</Typography>
          </Box>

          {error && (
            <Alert severity="error" style={{ marginTop: 16, borderRadius: 12 }}>
              {error}
            </Alert>
          )}

          {session.status !== "pending" ? (
            <Box style={{ marginTop: 22 }}>
              <Typography style={{ fontSize: 13.5, color: muted, marginBottom: 12 }}>
                This payment is already settled.
              </Typography>
              <Button
                disableElevation
                fullWidth
                onClick={() => navigate(`/payment/result?trip=${session.trip_id}`, { replace: true })}
                style={primaryButton}
              >
                See result
              </Button>
            </Box>
          ) : (
            <Box style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 22 }}>
              <Button
                disableElevation
                fullWidth
                disabled={busy}
                onClick={() => finish("success")}
                style={{ ...primaryButton, opacity: busy ? 0.7 : 1 }}
              >
                {busy ? <CircularProgress size={20} style={{ color: "#fff" }} /> : `Pay ₹${session.amount} (test)`}
              </Button>
              <Button disableElevation fullWidth disabled={busy} onClick={() => finish("failed")} style={outlineButton}>
                Simulate a failed payment
              </Button>
            </Box>
          )}
        </>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/*  /payment/result?trip=...  (Stripe's success / cancel return page)  */
/* ------------------------------------------------------------------ */

const MAX_RECHECKS = 4;

export function PaymentResult() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tripId = params.get("trip");
  const cancelled = params.get("cancelled") === "1";

  const [phase, setPhase] = useState(cancelled ? "cancelled" : "checking");
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const rechecks = useRef(0);

  const check = useCallback(async () => {
    if (!tripId) {
      setError("This payment link is missing its trip.");
      setPhase("error");
      return;
    }
    if (!localStorage.getItem("access_token")) {
      navigate("/signin", { replace: true });
      return;
    }

    setPhase("checking");
    try {
      // The server asks Stripe itself; we only show what it concludes.
      const { ok, status, data } = await apiRequest(`/api/payments/trips/${tripId}/confirm`, {
        method: "POST",
      });
      if (status === 401) {
        clearSession();
        navigate("/signin", { replace: true });
        return;
      }
      if (!ok) {
        setError(errorText(data, "We couldn't check your payment."));
        setPhase("error");
        return;
      }
      setInfo(data);
      if (data.status === "paid") setPhase("paid");
      else if (data.status === "pending") setPhase("pending");
      else if (data.status === "refunded") setPhase("refunded");
      else setPhase("failed"); // failed, or never started
    } catch {
      setError(OFFLINE);
      setPhase("error");
    }
  }, [tripId, navigate]);

  useEffect(() => {
    if (!cancelled) check();
  }, [cancelled, check]);

  // Stripe can take a moment to mark a session paid, so look again a few times
  useEffect(() => {
    if (phase !== "pending" || rechecks.current >= MAX_RECHECKS) return undefined;
    const id = setTimeout(() => {
      rechecks.current += 1;
      check();
    }, 2500);
    return () => clearTimeout(id);
  }, [phase, check]);

  const toTrips = (
    <Button disableElevation onClick={() => navigate("/trips")} style={primaryButton}>
      Back to My Trips
    </Button>
  );

  return (
    <Shell>
      {phase === "checking" && (
        <Box style={{ textAlign: "center", padding: "24px 0" }}>
          <CircularProgress style={{ color: teal }} />
          <Typography style={{ fontSize: 15, fontWeight: 700, marginTop: 18 }}>Confirming your payment…</Typography>
          <Typography style={{ fontSize: 13.5, color: muted, marginTop: 6 }}>This only takes a moment.</Typography>
        </Box>
      )}

      {phase === "paid" && (
        <StatusView
          icon={<CheckCircleOutlineIcon style={{ fontSize: 36 }} />}
          tint={teal}
          bg="#d6f3ef"
          title="Payment sent"
          body={`Your ₹${info?.amount ?? ""} fuel-split is paid. Your rider will see the trip as paid. Have a safe ride!`}
        >
          {toTrips}
        </StatusView>
      )}

      {phase === "pending" && (
        <StatusView
          icon={<HourglassEmptyIcon style={{ fontSize: 34 }} />}
          tint="#7a5300"
          bg="#fff4dc"
          title="Still confirming…"
          body="We haven't heard back from the payment provider yet. This usually clears in a few seconds."
        >
          <Box style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <Button
              disableElevation
              startIcon={<ReplayIcon />}
              onClick={() => {
                rechecks.current = 0;
                check();
              }}
              style={primaryButton}
            >
              Check again
            </Button>
            <Button disableElevation onClick={() => navigate("/trips")} style={outlineButton}>
              My Trips
            </Button>
          </Box>
        </StatusView>
      )}

      {phase === "failed" && (
        <StatusView
          icon={<ErrorOutlineIcon style={{ fontSize: 34 }} />}
          tint="#a12626"
          bg="#fde2e2"
          title="Payment didn't go through"
          body="Nothing was charged. You can try again from your trip whenever you're ready."
        >
          {toTrips}
        </StatusView>
      )}

      {phase === "cancelled" && (
        <StatusView
          icon={<CancelOutlinedIcon style={{ fontSize: 34 }} />}
          tint="#4b5468"
          bg="#eceefb"
          title="Payment cancelled"
          body="You left the payment page before paying, so nothing was charged. Your trip is still booked."
        >
          {toTrips}
        </StatusView>
      )}

      {phase === "refunded" && (
        <StatusView
          icon={<CheckCircleOutlineIcon style={{ fontSize: 36 }} />}
          tint="#4b5468"
          bg="#eceefb"
          title="Payment refunded"
          body="This payment has been refunded."
        >
          {toTrips}
        </StatusView>
      )}

      {phase === "error" && (
        <StatusView
          icon={<ErrorOutlineIcon style={{ fontSize: 34 }} />}
          tint="#a12626"
          bg="#fde2e2"
          title="Couldn't check your payment"
          body={error}
        >
          <Box style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {tripId && (
              <Button disableElevation startIcon={<ReplayIcon />} onClick={check} style={primaryButton}>
                Try again
              </Button>
            )}
            <Button disableElevation onClick={() => navigate("/trips")} style={outlineButton}>
              My Trips
            </Button>
          </Box>
        </StatusView>
      )}
    </Shell>
  );
}
