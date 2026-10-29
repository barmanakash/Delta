import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Avatar, Box, Button, CircularProgress, Snackbar, Typography } from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
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
  genderLabel,
  initialsOf,
  toAbsoluteUrl,
  useCachedUser,
  useIncomingRequest,
  useIncomingRequests,
} from "../riderrequests/riderrequests";

const teal = "#007d73";
const indigo = "#4c49d9";
const dark = "#172033";
const muted = "#5b6475";
const pageBg = "#f8f8ff";

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 12px rgba(30,35,90,0.06)",
};

const shortName = (value) => (value || "").split(",")[0].trim();

/**
 * One incoming lift request, with everything the rider needs to decide.
 * The data comes from the server, by the request id in the address.
 */
export default function ViewRequest() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const cachedUser = useCachedUser();

  const [user, setUser] = useState(cachedUser);
  const [photoUrl, setPhotoUrl] = useState(toAbsoluteUrl(cachedUser?.profile_photo_url));
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
  const [mapRoute, setMapRoute] = useState({ status: "idle" });

  const { loading, error, notFound, request, reload } = useIncomingRequest(requestId);
  const { pendingCount } = useIncomingRequests();

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

  /* ---- the lift taker's route on the map --------------------------- */
  const pLat = request?.pickup_lat;
  const pLng = request?.pickup_lng;
  const dLat = request?.destination_lat;
  const dLng = request?.destination_lng;

  useEffect(() => {
    if ([pLat, pLng, dLat, dLng].some((v) => v === null || v === undefined)) {
      setMapRoute({ status: request ? "unavailable" : "idle" });
      return undefined;
    }

    const start = { lat: pLat, lng: pLng };
    const end = { lat: dLat, lng: dLng };
    let cancelled = false;
    setMapRoute({ status: "ready", start, end, line: null });

    fetchRoute([start, end])
      .then((result) => {
        if (!cancelled) setMapRoute({ status: "ready", start, end, line: result.line });
      })
      .catch(() => {
        // no road line: the map still shows the pickup and drop pins
      });

    return () => {
      cancelled = true;
    };
  }, [pLat, pLng, dLat, dLng, request]);

  const handleDecline = async () => {
    if (busy || !request) return;
    setBusy(true);
    const result = await declineRequest(request.id);
    setBusy(false);
    if (result.ok) {
      navigate("/liftrequest", { replace: true });
      return;
    }
    setToast({ open: true, message: result.message, severity: "error" });
    reload();
  };

  /* ---------------------------------------------------------------- */

  const accepted = request?.status === "accepted";

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
        .vr-btn:focus-visible { outline: 2px solid ${teal}; outline-offset: 2px; }
        @media (max-width: 960px) {
          .vr-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .vr-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .vr-facts { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>

      <RiderHeader active="requests" user={user} photoUrl={photoUrl} pendingCount={pendingCount} />

      <Box component="main" className="vr-pad" style={{ flex: 1, padding: "24px 30px 48px", boxSizing: "border-box" }}>
        <Box
          className="vr-btn"
          role="link"
          tabIndex={0}
          onClick={() => navigate("/liftrequest")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/liftrequest");
            }
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 700, color: teal, cursor: "pointer" }}
        >
          <ArrowBackIcon style={{ fontSize: 18 }} />
          Back to Lift Requests
        </Box>

        {loading && (
          <Box style={{ display: "flex", justifyContent: "center", padding: "90px 0" }}>
            <CircularProgress style={{ color: teal }} />
          </Box>
        )}

        {!loading && (notFound || error) && (
          <Box style={{ ...cardStyle, maxWidth: 560, margin: "40px auto 0", padding: "34px 26px", textAlign: "center" }}>
            <Typography style={{ fontSize: 20, fontWeight: 800 }}>
              {notFound ? "This request is no longer available" : "Couldn't load this request"}
            </Typography>
            <Typography style={{ fontSize: 14, color: muted, margin: "8px 0 20px", lineHeight: 1.55 }}>
              {notFound
                ? "It may have been cancelled, expired, or accepted by another rider."
                : error}
            </Typography>
            <Button
              disableElevation
              onClick={() => navigate("/liftrequest")}
              style={{ background: teal, color: "#fff", borderRadius: 10, textTransform: "none", fontWeight: 700, padding: "8px 22px" }}
            >
              View Lift Requests
            </Button>
          </Box>
        )}

        {!loading && request && (
          <Box
            className="vr-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)",
              gap: 22,
              marginTop: 18,
              alignItems: "start",
            }}
          >
            {/* ---------------- LEFT: details ---------------- */}
            <Box style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
              <Box style={{ ...cardStyle, padding: "22px 24px" }}>
                <Typography component="h1" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.4px" }}>
                  Lift Request
                </Typography>

                {/* the lift taker */}
                <Box style={{ display: "flex", alignItems: "center", gap: 14, background: "#f1f2ff", borderRadius: 14, padding: "14px 16px", marginTop: 16 }}>
                  <Avatar
                    src={toAbsoluteUrl(request.requester_photo_url) || undefined}
                    style={{ width: 56, height: 56, border: "3px solid #9be3da", boxSizing: "content-box", background: "#d8b293", color: "#172033", fontWeight: 700 }}
                  >
                    {initialsOf(request.requester_name)}
                  </Avatar>
                  <Box style={{ minWidth: 0, flex: 1 }}>
                    <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Typography style={{ fontSize: 19, fontWeight: 800 }}>{request.requester_name}</Typography>
                      <VerifiedOutlinedIcon style={{ fontSize: 19, color: teal }} />
                    </Box>
                    <Typography style={{ fontSize: 12.5, color: teal, fontWeight: 600, marginTop: 2 }}>
                      {request.requester_verification}
                    </Typography>
                    <Typography style={{ fontSize: 12.5, color: muted, marginTop: 3 }}>
                      Lift taker
                      {request.requester_gender ? ` · ${genderLabel(request.requester_gender)}` : ""}
                      {request.member_since ? ` · Member since ${request.member_since}` : ""}
                    </Typography>
                  </Box>
                  {request.same_gender && (
                    <Box style={{ background: "#d6f3ef", color: "#00695f", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                      Same-gender match
                    </Box>
                  )}
                </Box>

                {/* journey */}
                <Box style={{ marginTop: 20 }}>
                  <Stop color={teal} label="Pickup" title={request.pickup} time={request.pickup_time} />
                  <Box style={{ borderLeft: "2px dotted #c9cdea", height: 18, marginLeft: 5 }} />
                  <Stop color={indigo} label="Drop-off" title={request.destination} time={request.arrival_time} approx />
                </Box>

                <Box className="vr-facts" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 20 }}>
                  <Fact icon={<TrendingUpIcon />} label="Route overlap" value={`${request.overlap_pct}%`} />
                  <Fact icon={<CurrencyRupeeOutlinedIcon />} label="Fixed fuel-split" value={`₹${request.fare}`} sub="Zero surge surcharge" />
                  <Fact icon={<AccessTimeOutlinedIcon />} label="Est. ride time" value={`~${request.duration_min} mins`} sub={request.route_note} />
                  <Fact icon={<DirectionsWalkOutlinedIcon />} label="Detour" value={request.walk_note} />
                </Box>

                <Typography style={{ fontSize: 13, color: muted, marginTop: 16 }}>
                  {formatDayLabel(request.travel_date)} · requested window {formatClock(request.window_start)} –{" "}
                  {formatClock(request.window_end)}
                </Typography>
              </Box>

              {/* decision */}
              {accepted ? (
                <Box style={{ ...cardStyle, padding: "18px 22px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <CheckCircleOutlinedIcon style={{ color: "#16794a", fontSize: 26 }} />
                  <Box style={{ flex: 1, minWidth: 200 }}>
                    <Typography style={{ fontSize: 15.5, fontWeight: 800 }}>You accepted this lift</Typography>
                    <Typography style={{ fontSize: 13, color: muted }}>
                      Your pillion seat is reserved for {request.requester_name}.
                    </Typography>
                  </Box>
                  <Button
                    disableElevation
                    onClick={() => navigate("/trips")}
                    style={{ background: teal, color: "#fff", borderRadius: 10, textTransform: "none", fontWeight: 700, padding: "8px 20px" }}
                  >
                    View Trips
                  </Button>
                </Box>
              ) : (
                <Box style={{ ...cardStyle, padding: "18px 22px" }}>
                  <Box style={{ display: "flex", alignItems: "center", gap: 8, color: "#d44d4d", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
                    <AccessTimeOutlinedIcon style={{ fontSize: 17 }} />
                    Expires in {formatExpiry(request.expires_in_min)}
                  </Box>
                  <Box style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Button
                      disableElevation
                      disabled={busy}
                      onClick={() => navigate(`/confirmrequest/${request.id}`)}
                      startIcon={<CheckCircleOutlinedIcon />}
                      style={{ flex: 1, minWidth: 160, height: 46, background: teal, color: "#fff", borderRadius: 10, textTransform: "none", fontWeight: 800, fontSize: 14.5 }}
                    >
                      Accept Lift
                    </Button>
                    <Button
                      disableElevation
                      disabled={busy}
                      onClick={handleDecline}
                      style={{ flex: 1, minWidth: 160, height: 46, background: "#e3e7ff", color: "#28324c", borderRadius: 10, textTransform: "none", fontWeight: 700, fontSize: 14.5 }}
                    >
                      Decline
                    </Button>
                  </Box>
                  <Typography style={{ fontSize: 12.5, color: muted, marginTop: 10, lineHeight: 1.5 }}>
                    Declining only hides this request from you. It stays open for other riders.
                  </Typography>
                </Box>
              )}
            </Box>

            {/* ---------------- RIGHT: map + safety ---------------- */}
            <Box style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
              <Box style={{ ...cardStyle, overflow: "hidden" }}>
                <Box style={{ height: 320, position: "relative", background: "#eef0fb" }}>
                  {mapRoute.status === "ready" ? (
                    <RouteMap
                      start={mapRoute.start}
                      end={mapRoute.end}
                      line={mapRoute.line}
                      minHeight={320}
                      padTop={60}
                      padBottom={40}
                      startName={shortName(request.pickup)}
                      startTag="PICKUP"
                      endName={shortName(request.destination)}
                      endTag="DROP-OFF"
                    />
                  ) : (
                    <Box
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: 24,
                        textAlign: "center",
                        color: muted,
                      }}
                    >
                      <MapOutlinedIcon style={{ fontSize: 34 }} />
                      <Typography style={{ fontSize: 13.5, maxWidth: 300, lineHeight: 1.5 }}>
                        {mapRoute.status === "unavailable"
                          ? "The map isn't available because this lift taker's pickup and drop weren't located on the map."
                          : "Loading the map…"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box style={{ ...cardStyle, padding: "18px 20px" }}>
                <Typography style={{ fontSize: 15.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 7 }}>
                  <ShieldOutlinedIcon style={{ color: teal, fontSize: 21 }} />
                  Safety match
                </Typography>
                {[
                  "Identity verified through Aadhaar and government ID",
                  "AIS-140 route guardrails stay active for the whole ride",
                  "Only accept when you are comfortable with the pickup, route and timing",
                ].map((text) => (
                  <Box key={text} style={{ display: "flex", gap: 9, marginTop: 10, fontSize: 13, lineHeight: 1.45, color: "#2f3550" }}>
                    <CheckCircleOutlinedIcon style={{ fontSize: 17, color: teal, flexShrink: 0, marginTop: 1 }} />
                    {text}
                  </Box>
                ))}
                <Box style={{ display: "flex", gap: 9, marginTop: 14, background: "#eceefd", borderRadius: 10, padding: "10px 12px", fontSize: 12.5, color: "#3b4357", lineHeight: 1.5 }}>
                  <LockOutlinedIcon style={{ fontSize: 17, color: muted, flexShrink: 0, marginTop: 1 }} />
                  The lift taker's phone number stays masked. Contact happens inside FriendRide only.
                </Box>
              </Box>
            </Box>
          </Box>
        )}
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

function Stop({ color, label, title, time, approx }) {
  return (
    <Box style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <Box style={{ width: 12, height: 12, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0 }} />
      <Box style={{ minWidth: 0, flex: 1 }}>
        <Typography style={{ fontSize: 12, color: muted, fontWeight: 600 }}>{label}</Typography>
        <Typography style={{ fontSize: 14.5, fontWeight: 700, wordBreak: "break-word" }}>{title}</Typography>
      </Box>
      <Typography style={{ fontSize: 14, fontWeight: 800, whiteSpace: "nowrap" }}>
        {approx ? "~" : ""}
        {formatClock(time)}
      </Typography>
    </Box>
  );
}

function Fact({ icon, label, value, sub }) {
  return (
    <Box style={{ background: "#f7f8fe", borderRadius: 12, padding: "12px 14px", minWidth: 0 }}>
      <Box style={{ display: "flex", alignItems: "center", gap: 7, color: muted, fontSize: 12 }}>
        {React.cloneElement(icon, { style: { fontSize: 16, color: teal } })}
        {label}
      </Box>
      <Typography style={{ fontSize: 15, fontWeight: 800, marginTop: 5, wordBreak: "break-word" }}>{value}</Typography>
      {sub && <Typography style={{ fontSize: 12, color: muted, marginTop: 2 }}>{sub}</Typography>}
    </Box>
  );
}
