import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Avatar, Box, Button, Chip, CircularProgress, Snackbar, Typography } from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import AddRoadOutlinedIcon from "@mui/icons-material/AddRoadOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { RiderHeader, RiderFooter } from "../riderlayout/riderlayout";
import RouteMap from "../createcommute/routemap";
import { fetchRoute } from "../createcommute/createcommute";
import {
  apiRequest,
  clearSession,
  declineRequest,
  formatClock,
  formatDayLabel,
  formatExpiry,
  initialsOf,
  toAbsoluteUrl,
  useActiveCommute,
  useCachedUser,
  useIncomingRequests,
} from "../riderrequests/riderrequests";

const teal = "#007d73";
const indigo = "#4c49d9";
const dark = "#172033";
const muted = "#5b6475";
const pageBg = "#f8f8fd";

const cardStyle = {
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 2px 12px rgba(30,35,90,0.06)",
};

// "PNT Naka Safe Transit Stop, North Gate" -> "PNT Naka Safe Transit Stop"
const shortName = (value) => (value || "").split(",")[0].trim();

/**
 * The rider's "Lift Requests" screen: every lift request that fits one of the
 * rider's commutes. Everything shown here comes from the server.
 */
export default function LiftRequests() {
  const navigate = useNavigate();
  const cachedUser = useCachedUser();
  const [user, setUser] = useState(cachedUser);
  const [photoUrl, setPhotoUrl] = useState(toAbsoluteUrl(cachedUser?.profile_photo_url));

  const incoming = useIncomingRequests();
  const commute = useActiveCommute();

  const [tab, setTab] = useState("pending"); // pending | accepted
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
  const [mapRoute, setMapRoute] = useState({ status: "idle" });

  /* ---- the real signed-in user ------------------------------------- */
  useEffect(() => {
    if (!localStorage.getItem("access_token")) return undefined;

    let mounted = true;
    apiRequest("/api/auth/me")
      .then(({ ok, status, data }) => {
        if (status === 401) {
          clearSession();
          navigate("/signin", { replace: true });
          return;
        }
        if (!ok || !data) return;
        localStorage.setItem("user", JSON.stringify(data));
        if (mounted) {
          setUser(data);
          setPhotoUrl(toAbsoluteUrl(data.profile_photo_url));
        }
      })
      .catch(() => {
        // keep showing the cached profile while the backend is unavailable
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  /* ---- the lists ---------------------------------------------------- */
  const pending = useMemo(() => incoming.requests.filter((r) => r.status === "pending"), [incoming.requests]);
  const accepted = useMemo(() => incoming.requests.filter((r) => r.status === "accepted"), [incoming.requests]);
  const list = tab === "pending" ? pending : accepted;

  // Start on the tab that has something in it
  useEffect(() => {
    if (!incoming.loading && pending.length === 0 && accepted.length > 0) setTab("accepted");
    // only when the data first arrives
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming.loading]);

  /* ---- the rider's route on the map -------------------------------- */
  const hasPoints = Boolean(
    commute && commute.pickup_lat != null && commute.pickup_lng != null &&
      commute.destination_lat != null && commute.destination_lng != null
  );

  useEffect(() => {
    if (!hasPoints) {
      setMapRoute({ status: "idle" });
      return undefined;
    }

    const start = { lat: commute.pickup_lat, lng: commute.pickup_lng };
    const end = { lat: commute.destination_lat, lng: commute.destination_lng };
    const stop =
      commute.stop_lat != null && commute.stop_lng != null
        ? { lat: commute.stop_lat, lng: commute.stop_lng }
        : null;

    let cancelled = false;
    setMapRoute({ status: "ready", start, stop, end, line: null });
    fetchRoute(stop ? [start, stop, end] : [start, end])
      .then((result) => {
        if (!cancelled) setMapRoute({ status: "ready", start, stop, end, line: result.line });
      })
      .catch(() => {
        // no road line: the map still shows the pins
      });

    return () => {
      cancelled = true;
    };
  }, [commute, hasPoints]);

  /* ---- actions ------------------------------------------------------ */
  const handleDecline = async (requestId) => {
    if (busyId) return;
    setBusyId(requestId);
    const result = await declineRequest(requestId);
    setBusyId(null);
    setToast({
      open: true,
      message: result.ok ? "Request declined. It stays open for other riders." : result.message,
      severity: result.ok ? "info" : "error",
    });
    incoming.reload();
  };

  /* ---------------------------------------------------------------- */

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
      <style>{`
        .lr-btn:focus-visible { outline: 2px solid ${teal}; outline-offset: 2px; }
        @media (max-width: 1000px) {
          .lr-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .lr-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .lr-card-row { flex-direction: column !important; align-items: stretch !important; }
          .lr-actions { align-items: stretch !important; width: 100% !important; }
        }
      `}</style>

      <RiderHeader active="requests" user={user} photoUrl={photoUrl} pendingCount={incoming.pendingCount} />

      <Box component="main" className="lr-pad" style={{ flex: 1, padding: "26px 30px 48px", boxSizing: "border-box" }}>
        {/* ----- title ----- */}
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <Box>
            <Box style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <Typography component="h1" style={{ fontSize: 32, fontWeight: 750, lineHeight: 1.1 }}>
                Lift Requests
              </Typography>
              {commute && (
                <Chip
                  label="CORRIDOR ACTIVE"
                  size="small"
                  style={{ height: 23, background: "#e0f2f0", color: "#00786e", fontSize: 12, fontWeight: 800, letterSpacing: ".5px" }}
                />
              )}
            </Box>
            <Typography style={{ marginTop: 6, color: "#565b63", fontSize: 14.5 }}>
              Verified commuters searching for a pillion lift along your designated route.
            </Typography>
          </Box>

          <Box role="tablist" aria-label="Request status" style={{ display: "inline-flex", gap: 4, background: "#eceefb", borderRadius: 26, padding: 4 }}>
            {[
              { key: "pending", label: "Available", count: pending.length },
              { key: "accepted", label: "Accepted", count: accepted.length },
            ].map((t) => {
              const on = tab === t.key;
              return (
                <Box
                  key={t.key}
                  className="lr-btn"
                  role="tab"
                  tabIndex={0}
                  aria-selected={on}
                  onClick={() => setTab(t.key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setTab(t.key);
                    }
                  }}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 22,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    userSelect: "none",
                    background: on ? teal : "transparent",
                    color: on ? "#fff" : "#2f3550",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {t.label}
                  <span
                    style={{
                      minWidth: 22,
                      height: 22,
                      borderRadius: 11,
                      padding: "0 6px",
                      boxSizing: "border-box",
                      background: on ? "rgba(255,255,255,0.22)" : "#fff",
                      color: on ? "#fff" : teal,
                      fontSize: 12,
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {t.count}
                  </span>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ----- route summary ----- */}
        {commute && (
          <Box
            style={{
              ...cardStyle,
              borderRadius: 14,
              marginTop: 18,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Box style={{ display: "flex", alignItems: "center", gap: 8, background: "#e8f6f4", borderRadius: 16, padding: "5px 12px" }}>
              <Box style={{ width: 8, height: 8, borderRadius: "50%", background: teal }} />
              <Typography style={{ fontSize: 13, fontWeight: 700 }}>Active Route:</Typography>
              <Typography style={{ fontSize: 13, fontWeight: 800, color: teal }}>
                {shortName(commute.pickup)} → {shortName(commute.destination)}
              </Typography>
            </Box>
            <Chip
              icon={<ShieldOutlinedIcon style={{ fontSize: 14 }} />}
              label="AIS-140 Corridor Locked"
              size="small"
              style={{ background: "#eef0ff", color: "#5658c9", fontSize: 12.5 }}
            />
            <Typography style={{ fontSize: 13, color: "#555b65", marginLeft: "auto" }}>
              {pending.length} Compatible Request{pending.length === 1 ? "" : "s"} Found · {commute.seats} Seat
              {commute.seats === 1 ? "" : "s"} (Standard Pillion)
            </Typography>
          </Box>
        )}

        {/* ----- content ----- */}
        <Box
          className="lr-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2.15fr) minmax(320px, 1fr)",
            gap: 22,
            marginTop: 18,
            alignItems: "start",
          }}
        >
          {/* LEFT: requests */}
          <Box style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
            {incoming.loading && (
              <Box style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <CircularProgress style={{ color: teal }} />
              </Box>
            )}

            {!incoming.loading && incoming.error && (
              <Box style={{ ...cardStyle, padding: "30px 24px", textAlign: "center" }}>
                <Typography style={{ fontSize: 18, fontWeight: 800 }}>Couldn't load your lift requests</Typography>
                <Typography style={{ fontSize: 14, color: muted, margin: "8px 0 16px" }}>{incoming.error}</Typography>
                <Button
                  disableElevation
                  onClick={incoming.reload}
                  style={{ background: teal, color: "#fff", borderRadius: 10, textTransform: "none", fontWeight: 700, padding: "8px 22px" }}
                >
                  Try again
                </Button>
              </Box>
            )}

            {!incoming.loading && !incoming.error && list.length === 0 && (
              <EmptyState tab={tab} hasCommute={Boolean(commute)} onCreate={() => navigate("/createcommute")} />
            )}

            {!incoming.loading &&
              !incoming.error &&
              list.map((request) => (
                <RequestRow
                  key={request.id}
                  request={request}
                  busy={busyId === request.id}
                  onView={() => navigate(`/viewRequest/${request.id}`)}
                  onAccept={() => navigate(`/confirmrequest/${request.id}`)}
                  onDecline={() => handleDecline(request.id)}
                />
              ))}
          </Box>

          {/* RIGHT: the rider's own route */}
          <Box style={{ ...cardStyle, padding: 16, minWidth: 0 }}>
            <Typography style={{ fontSize: 17, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
              <TwoWheelerOutlinedIcon style={{ color: teal, fontSize: 20 }} />
              Your Active Route
            </Typography>

            {commute ? (
              <>
                <Box style={{ marginTop: 12, background: "#f1f2ff", borderRadius: 12, padding: "10px 14px" }}>
                  <Typography style={{ fontSize: 13.5, fontWeight: 800, wordBreak: "break-word" }}>
                    {shortName(commute.pickup)} → {shortName(commute.destination)}
                  </Typography>
                  <Typography style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>
                    {commute.stop ? `Via ${shortName(commute.stop)}` : "Direct route"}
                    {commute.distance_km ? ` · ${commute.distance_km} km` : ""} · {commute.duration_min} mins
                  </Typography>
                </Box>

                <Box style={{ height: 260, borderRadius: 12, overflow: "hidden", marginTop: 12, position: "relative", background: "#eef0fb" }}>
                  {mapRoute.status === "ready" ? (
                    <RouteMap
                      start={mapRoute.start}
                      stop={mapRoute.stop}
                      end={mapRoute.end}
                      line={mapRoute.line}
                      minHeight={260}
                      padTop={40}
                      padBottom={30}
                    />
                  ) : (
                    <Box style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" }}>
                      <Typography style={{ fontSize: 13, color: muted }}>
                        No map was saved for this route. Edit your route to add one.
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box style={{ marginTop: 12, background: "#f2f3ff", borderRadius: 12, padding: "12px 14px" }}>
                  <Typography style={{ fontSize: 12.5, fontWeight: 800, color: "#4e535c", marginBottom: 8 }}>
                    COMMUTE PARAMETERS
                  </Typography>
                  <ParamRow label="Scheduled Departure" value={formatClock(commute.outbound_time)} />
                  <ParamRow label="Registered Vehicle" value={commute.vehicle_model} />
                  <ParamRow label="Seat Availability" value={`${commute.seats} Seat${commute.seats === 1 ? "" : "s"} Available`} />
                </Box>

                <Button
                  fullWidth
                  disableElevation
                  onClick={() => navigate("/createcommute")}
                  style={{ marginTop: 12, background: "#e8ebfb", color: "#34404a", borderRadius: 10, textTransform: "none", fontWeight: 700 }}
                >
                  Edit Route
                </Button>
              </>
            ) : (
              <Box style={{ textAlign: "center", padding: "26px 8px" }}>
                <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.55 }}>
                  You haven't created a commute yet. Lift takers can only find you once your route is published.
                </Typography>
                <Button
                  disableElevation
                  onClick={() => navigate("/createcommute")}
                  startIcon={<AddRoadOutlinedIcon />}
                  style={{ marginTop: 14, background: teal, color: "#fff", borderRadius: 20, textTransform: "none", fontWeight: 700, padding: "8px 20px" }}
                >
                  Create Route
                </Button>
              </Box>
            )}

            <Box style={{ marginTop: 14, background: "#e9ecff", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10 }}>
              <LockOutlinedIcon style={{ color: teal, fontSize: 22, flexShrink: 0 }} />
              <Typography style={{ fontSize: 12.5, color: "#5d626b", lineHeight: 1.45 }}>
                Passenger phone numbers stay masked. Contact happens inside FriendRide only.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <RiderFooter />

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          style={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

function RequestRow({ request: r, busy, onView, onAccept, onDecline }) {
  const isPending = r.status === "pending";

  return (
    <Box
      style={{
        ...cardStyle,
        borderLeft: `5px solid ${isPending ? teal : indigo}`,
        padding: "16px 18px",
        boxSizing: "border-box",
      }}
    >
      <Box className="lr-card-row" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* person */}
        <Box style={{ width: 104, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <Box style={{ position: "relative" }}>
            <Avatar
              src={toAbsoluteUrl(r.requester_photo_url) || undefined}
              style={{ width: 58, height: 58, background: "#dce4e7", color: "#24303a", fontWeight: 700, fontSize: 20 }}
            >
              {initialsOf(r.requester_name)}
            </Avatar>
            <Box style={{ position: "absolute", right: -2, bottom: -2, background: "#fff", borderRadius: "50%", display: "flex" }}>
              <VerifiedOutlinedIcon style={{ color: "#008a7c", fontSize: 17 }} />
            </Box>
          </Box>
          <Typography style={{ fontSize: 15.5, fontWeight: 700, marginTop: 4 }}>{r.requester_name}</Typography>
        </Box>

        {/* route */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <Chip
              label={`${r.overlap_pct}% Route Overlap`}
              size="small"
              style={{ height: 24, background: "#e4f4f2", color: "#007a70", fontSize: 12.5, fontWeight: 800 }}
            />
            {r.same_gender && (
              <Chip
                label="Same-Gender Verified"
                size="small"
                style={{ height: 24, background: "#eef0ff", color: "#555acb", fontSize: 12.5 }}
              />
            )}
            <Typography style={{ fontSize: 12, color: teal, fontWeight: 600 }}>{r.requester_verification}</Typography>
          </Box>

          <Box style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Box style={{ width: 14, height: 14, borderRadius: "50%", border: `3px solid ${teal}`, flexShrink: 0, boxSizing: "border-box" }} />
            <Typography style={{ fontSize: 13, fontWeight: 700, wordBreak: "break-word" }}>Pickup: {r.pickup}</Typography>
            <Typography style={{ fontSize: 12.5, color: muted, marginLeft: "auto", whiteSpace: "nowrap" }}>
              {formatClock(r.pickup_time)}
            </Typography>
          </Box>
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Box style={{ width: 14, height: 14, borderRadius: "50%", border: `3px solid ${indigo}`, flexShrink: 0, boxSizing: "border-box" }} />
            <Typography style={{ fontSize: 13, fontWeight: 700, wordBreak: "break-word" }}>Drop-off: {r.destination}</Typography>
            <Typography style={{ fontSize: 12.5, color: muted, marginLeft: "auto", whiteSpace: "nowrap" }}>
              ~{formatClock(r.arrival_time)}
            </Typography>
          </Box>

          <Typography style={{ fontSize: 12, color: muted, marginTop: 8 }}>
            {formatDayLabel(r.travel_date)} · {r.duration_min} min ride · {r.walk_note}
          </Typography>
        </Box>

        {/* actions */}
        <Box className="lr-actions" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          {isPending ? (
            <Chip
              icon={<AccessTimeOutlinedIcon style={{ fontSize: 15 }} />}
              label={`Expires in ${formatExpiry(r.expires_in_min)}`}
              size="small"
              style={{ height: 24, background: r.expires_in_min <= 15 ? "#ffe8e8" : "#e9edff", color: r.expires_in_min <= 15 ? "#d44d4d" : "#505a86", fontSize: 12, fontWeight: 700 }}
            />
          ) : (
            <Chip label="Accepted" size="small" style={{ height: 24, background: "#e3f6ec", color: "#16794a", fontSize: 12, fontWeight: 700 }} />
          )}
          <Typography style={{ fontSize: 20, fontWeight: 800, color: teal, lineHeight: 1 }}>₹{r.fare}</Typography>

          <Box style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {isPending && (
              <>
                <Button
                  disabled={busy}
                  onClick={onDecline}
                  style={{ height: 36, color: "#555e64", textTransform: "none", fontSize: 13, fontWeight: 600 }}
                >
                  Decline
                </Button>
                <Button
                  disabled={busy}
                  disableElevation
                  onClick={onAccept}
                  style={{ height: 36, background: teal, color: "#fff", borderRadius: 8, textTransform: "none", fontSize: 13, fontWeight: 700, padding: "0 14px" }}
                >
                  Accept Lift
                </Button>
              </>
            )}
            <Button
              disableElevation
              onClick={onView}
              endIcon={<ArrowForwardIcon style={{ fontSize: 17 }} />}
              style={{ height: 36, background: "#e3e7ff", color: "#28324c", borderRadius: 8, textTransform: "none", fontSize: 13, fontWeight: 700, padding: "0 14px" }}
            >
              Details
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ParamRow({ label, value }) {
  return (
    <Box style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
      <Typography style={{ fontSize: 12.5, color: "#50555e" }}>{label}</Typography>
      <Typography style={{ fontSize: 12.5, fontWeight: 800, textAlign: "right" }}>{value}</Typography>
    </Box>
  );
}

function EmptyState({ tab, hasCommute, onCreate }) {
  return (
    <Box style={{ ...cardStyle, padding: "44px 24px", textAlign: "center" }}>
      <Box
        style={{
          width: 58,
          height: 58,
          borderRadius: 16,
          background: "#d6f3ef",
          color: teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
        }}
      >
        <TwoWheelerOutlinedIcon style={{ fontSize: 30 }} />
      </Box>
      <Typography style={{ fontSize: 19, fontWeight: 800 }}>
        {tab === "pending" ? "No lift requests right now" : "No accepted requests yet"}
      </Typography>
      <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "8px auto 0", maxWidth: 440 }}>
        {tab === "pending"
          ? hasCommute
            ? "When a verified commuter's trip fits your route, it will show up here."
            : "Create your commute so lift takers on your route can find you."
          : "Lifts you accept appear here, and on your Trips page."}
      </Typography>
      {!hasCommute && (
        <Button
          disableElevation
          onClick={onCreate}
          startIcon={<AddRoadOutlinedIcon />}
          style={{ marginTop: 18, background: teal, color: "#fff", borderRadius: 20, textTransform: "none", fontWeight: 700, padding: "8px 22px" }}
        >
          Create Route
        </Button>
      )}
    </Box>
  );
}
