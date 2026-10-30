import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import SportsMotorsportsOutlinedIcon from "@mui/icons-material/SportsMotorsportsOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import { LT, LiftTakerHeader, LiftTakerFooter } from "../lifttakerlayout/lifttakerlayout";
import RouteMap from "../createcommute/routemap";
import { fetchRoute } from "../createcommute/createcommute";

/* ------------------------------------------------------------------ */
/*  Constants + helpers                                                */
/* ------------------------------------------------------------------ */

const API_BASE_URL = "http://localhost:8000";
// While a sent request waits for the rider, the page re-checks this often
const POLL_MS = 5000;

const { teal, tealBright, indigo, dark, muted, pageBg } = LT;

const cardStyle = {
  background: "#fff",
  borderRadius: 22,
  boxShadow: "0 4px 20px rgba(30,35,90,0.06)",
};

const capsLabel = {
  fontSize: 10.5,
  fontWeight: 800,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: "#4b5468",
  lineHeight: 1.2,
};

const pad = (n) => String(n).padStart(2, "0");

const toISODate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const parseISODate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// "08:30" -> "08:30 AM"
const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

const formatDateShort = (iso) =>
  parseISODate(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// "Today, 24 Oct" / "Tomorrow, 25 Oct" / "26 Oct"
const relativeDay = (iso, todayIso) => {
  const diff = Math.round((parseISODate(iso) - parseISODate(todayIso)) / 86400000);
  const label = { 0: "Today", 1: "Tomorrow", "-1": "Yesterday" }[diff];
  return label ? `${label}, ${formatDateShort(iso)}` : formatDateShort(iso);
};

const toAbsoluteUrl = (path) =>
  path ? (path.startsWith("http") ? path : `${API_BASE_URL}${path}`) : null;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

const errorMessage = (data, fallback) => {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((e) => String(e.msg || "").replace(/^Value error, /, ""))
      .filter(Boolean)
      .join(". ");
  }
  return fallback;
};

const activateOnKey = (fn) => (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn(e);
  }
};

// "PNT Naka Safe Transit Stop, North Gate" -> "PNT Naka Safe Transit Stop"
const shortName = (value, fallback = "") => {
  const first = (value || "").split(",")[0].trim();
  if (!first) return fallback;
  return first.length > 30 ? `${first.slice(0, 29).trimEnd()}…` : first;
};

const initialsOf = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "R";

const compatibilityLabel = (pct) =>
  pct >= 85 ? "HIGH COMPATIBILITY MATCH" : pct >= 70 ? "GOOD COMPATIBILITY MATCH" : "PARTIAL COMPATIBILITY MATCH";

/* ---- map geometry ------------------------------------------------- */

// Straight-line distance between two [lat, lng] points, in km (haversine)
const distanceKm = ([lat1, lng1], [lat2, lng2]) => {
  const r = 6371;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = p2 - p1;
  const dl = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
};

const lineKm = (line) => line.slice(1).reduce((sum, p, i) => sum + distanceKm(line[i], p), 0);

// Index of the point on `line` closest to { lat, lng }
const nearestIndex = (line, point) => {
  let best = 0;
  let bestDist = Infinity;
  line.forEach(([lat, lng], i) => {
    const d = (lat - point.lat) ** 2 + (lng - point.lng) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
};

// The part of the rider's route between the lift taker's pickup and drop
const sliceBetween = (line, a, b) => {
  const i = nearestIndex(line, a);
  const j = nearestIndex(line, b);
  if (i === j) return null;
  const [from, to] = i < j ? [i, j] : [j, i];
  return line.slice(from, to + 1);
};

/**
 * Where the pickup and drop pins go. When the rider picks up at the place the
 * lift taker asked for, that is the lift taker's own point; when the rider
 * uses one of their own stops, it is that stop.
 */
function resolvePoints(match, request) {
  const route = match.route || [];
  const stopAt = (i) =>
    i !== null && i !== undefined && route[i] ? { lat: route[i].lat, lng: route[i].lng } : null;
  const asked = (lat, lng) =>
    lat !== null && lat !== undefined && lng !== null && lng !== undefined ? { lat, lng } : null;

  const askedPickup = asked(request.pickup_lat, request.pickup_lng);
  const askedDrop = asked(request.destination_lat, request.destination_lng);

  const pickup =
    match.pickup_point === request.pickup
      ? askedPickup || stopAt(match.board_index)
      : stopAt(match.board_index) || askedPickup;
  const drop =
    match.arrival_point === request.destination
      ? askedDrop || stopAt(match.alight_index)
      : stopAt(match.alight_index) || askedDrop;

  return { pickup, drop };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

/**
 * "Rider & Route Details": one compatible rider, reviewed in full before the
 * lift taker sends a request. Reached from "View Rider" on Compatible Riders.
 */
export default function RiderDetails() {
  const navigate = useNavigate();
  const { requestId, offerId } = useParams();

  const [user, setUser] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [data, setData] = useState(null); // { request, matches, accepted_match, ... }
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [map, setMap] = useState({ status: "idle" });

  const today = toISODate(new Date());

  const signOutLocally = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/signin", { replace: true });
  }, [navigate]);

  /* ---- signed-in user ---------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const applyUser = (u) => {
      setUser(u);
      setPhotoUrl(toAbsoluteUrl(u.profile_photo_url));
    };

    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        applyUser(JSON.parse(cached));
      } catch {
        // ignore a malformed cache; the fetch below repopulates it
      }
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, { headers: authHeaders() });
        if (res.status === 401) {
          signOutLocally();
          return;
        }
        if (!res.ok) return;
        const me = await res.json();
        localStorage.setItem("user", JSON.stringify(me));
        if (me.role !== "lift") {
          navigate("/home", { replace: true }); // riders have their own screens
          return;
        }
        applyUser(me);
      } catch {
        // backend offline: keep the cached user
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- the request and its riders ---------------------------------- */
  // The rider is found among this request's matches, so the details always
  // agree with what Compatible Riders showed (and are re-checked on load).
  const load = useCallback(
    async (silent) => {
      if (!localStorage.getItem("access_token")) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/lifts/requests/${encodeURIComponent(requestId)}/matches`,
          { headers: authHeaders() }
        );
        if (res.status === 401) {
          signOutLocally();
          return;
        }
        if (res.status === 404) {
          setLoadError("notfound");
          return;
        }
        if (!res.ok) {
          if (!silent) setLoadError("failed");
          return;
        }
        setData(await res.json());
        setLoadError("");
      } catch {
        if (!silent) setLoadError("offline");
      } finally {
        setLoading(false);
      }
    },
    [requestId, signOutLocally]
  );

  useEffect(() => {
    setLoading(true);
    load(false);
  }, [load]);

  const request = data ? data.request : null;

  const match = useMemo(() => {
    if (!data) return null;
    const found = data.matches.find((m) => m.offer_id === offerId);
    if (found) return found;
    // Once a rider accepts, matching stops and only the accepted rider is kept
    if (data.accepted_match && data.accepted_match.offer_id === offerId) {
      return data.accepted_match;
    }
    return null;
  }, [data, offerId]);

  const accepted = Boolean(
    request && request.status === "matched" && data.accepted_match && data.accepted_match.offer_id === offerId
  );
  const sent = Boolean(request && (request.requested_offer_ids || []).includes(offerId));

  // After sending, keep checking so the page flips when the rider accepts
  const waiting = sent && !accepted && request && request.status === "searching";
  useEffect(() => {
    if (!waiting) return undefined;
    const id = setInterval(() => {
      if (!document.hidden) load(true);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [waiting, load]);

  /* ---- the route on the map ---------------------------------------- */
  // A plain string, so a refresh that returns the same rider doesn't redraw
  // the map or ask the routing service again
  const mapInputKey = useMemo(() => {
    if (!match || !request) return "";
    const { pickup, drop } = resolvePoints(match, request);
    return JSON.stringify({
      route: (match.route || []).map((p) => [p.lat, p.lng]),
      pickup,
      drop,
    });
  }, [match, request]);

  useEffect(() => {
    if (!mapInputKey) {
      setMap({ status: "idle" });
      return undefined;
    }

    const { route, pickup, drop } = JSON.parse(mapInputKey);
    const riderPoints = route.map(([lat, lng]) => ({ lat, lng }));
    if (riderPoints.length < 2 && !(pickup && drop)) {
      setMap({ status: "unavailable" });
      return undefined;
    }

    // Straight lines first, so the map shows something straight away; the
    // road routes replace them when the routing service answers
    const straightRider = riderPoints.length > 1 ? route : null;
    const straightAsked = pickup && drop ? [[pickup.lat, pickup.lng], [drop.lat, drop.lng]] : null;
    const build = (riderLine, askedLine) => {
      const sharedLine = riderLine && pickup && drop ? sliceBetween(riderLine, pickup, drop) : null;
      return {
        status: "ready",
        pickup,
        drop,
        riderLine,
        askedLine,
        sharedLine,
        sharedKm: sharedLine ? lineKm(sharedLine) : null,
      };
    };

    let cancelled = false;
    setMap(build(straightRider, straightAsked));

    Promise.all([
      riderPoints.length > 1 ? fetchRoute(riderPoints).then((r) => r.line).catch(() => null) : null,
      pickup && drop ? fetchRoute([pickup, drop]).then((r) => r.line).catch(() => null) : null,
    ]).then(([riderRoad, askedRoad]) => {
      if (cancelled) return;
      setMap(build(riderRoad || straightRider, askedRoad || straightAsked));
    });

    return () => {
      cancelled = true;
    };
  }, [mapInputKey]);

  const extraLines = useMemo(() => {
    const lines = [];
    if (map.riderLine) lines.push({ coords: map.riderLine, color: "#bdb9f7", weight: 9, opacity: 0.95 });
    if (map.sharedLine) lines.push({ coords: map.sharedLine, color: teal, weight: 6, opacity: 1 });
    if (map.askedLine) lines.push({ coords: map.askedLine, color: "#4a46d6", weight: 3, opacity: 1, dashArray: "7 8" });
    return lines;
  }, [map]);

  /* ---- actions ------------------------------------------------------ */
  const backToRiders = () => navigate(`/compatibleriders/${encodeURIComponent(requestId)}`);

  const handleSend = async () => {
    if (sending || !match) return;
    setSending(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/lifts/requests/${encodeURIComponent(requestId)}/send`,
        {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ offer_id: offerId }),
        }
      );
      if (res.status === 401) {
        signOutLocally();
        return;
      }
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setToast({
          open: true,
          severity: "error",
          message: errorMessage(body, "Couldn't send your request. Please try again."),
        });
        // the rider may have just become unavailable: show what is true now
        if (res.status === 404 || res.status === 409) load(true);
        return;
      }
      setData((prev) => (prev ? { ...prev, request: body } : prev));
      setToast({ open: true, severity: "success", message: `Lift request sent to ${match.rider_name}` });
    } catch {
      setToast({
        open: true,
        severity: "error",
        message: "Unable to connect to server. Please make sure the backend is running.",
      });
    } finally {
      setSending(false);
    }
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
        .rd-btn:focus-visible { outline: 2px solid ${tealBright}; outline-offset: 2px; }
        @media (max-width: 1000px) {
          .rd-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .rd-matrix { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .rd-title { font-size: 30px !important; }
          .rd-tiles { grid-template-columns: minmax(0, 1fr) !important; }
          .rd-head-row { flex-direction: column !important; align-items: flex-start !important; }
          .rd-actions { flex-direction: column !important; align-items: stretch !important; }
          .rd-actions-right { justify-content: flex-start !important; }
        }
        @media (max-width: 480px) {
          .rd-matrix { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>

      <LiftTakerHeader active="find" user={user} photoUrl={photoUrl} />

      {/* ========================= BREADCRUMB BAR ======================== */}
      <Box className="ltl-pad" style={{ maxWidth: 1560, margin: "0 auto", width: "100%", padding: "14px 32px 0", boxSizing: "border-box" }}>
        <Box style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: muted, flexWrap: "wrap" }}>
          <Crumb onClick={() => navigate("/lifttakerhome")}>Home</Crumb>
          <span>›</span>
          <Crumb onClick={() => navigate("/findlift")}>Find a Lift</Crumb>
          <span>›</span>
          <Crumb onClick={backToRiders}>Compatible Riders</Crumb>
          <span>›</span>
          <span style={{ color: dark, fontWeight: 700 }}>Rider &amp; Route Details</span>
        </Box>
      </Box>

      <Box component="main" style={{ flex: 1 }}>
        {/* ----- title ----- */}
        <Box className="ltl-pad" style={{ maxWidth: 1560, margin: "0 auto", padding: "10px 32px 0", boxSizing: "border-box" }}>
          <Box className="rd-head-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
            <Box>
              <Typography className="rd-title" component="h1" style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15 }}>
                Rider &amp; Route Details
              </Typography>
              <Typography style={{ fontSize: 14.5, color: muted, marginTop: 6 }}>
                Review commuter credentials, the verified route corridor, and schedule overlap before
                requesting a lift.
              </Typography>
            </Box>

            {match && (
              <Box
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  background: "#e1e5fb",
                  color: "#2d3480",
                  borderRadius: 14,
                  padding: "9px 16px",
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: "0.4px",
                  flexShrink: 0,
                }}
              >
                <Box style={{ width: 8, height: 8, borderRadius: "50%", background: tealBright }} />
                AIS-140 CORRIDOR MONITORED • {compatibilityLabel(match.overlap_pct)}
              </Box>
            )}
          </Box>
        </Box>

        {/* ----- loading / error ----- */}
        {loading && !data && (
          <Box style={{ display: "flex", justifyContent: "center", padding: "90px 0" }}>
            <CircularProgress style={{ color: tealBright }} />
          </Box>
        )}

        {!loading && !data && (
          <StateCard
            title={loadError === "notfound" ? "We couldn't find that search" : "Couldn't load this rider"}
            text={
              loadError === "notfound"
                ? "It may have been removed. Start a new search to see compatible riders."
                : loadError === "offline"
                ? "Unable to connect to server. Please make sure the backend is running."
                : "Something went wrong. Please try again."
            }
          >
            {loadError !== "notfound" && (
              <Button
                onClick={() => {
                  setLoading(true);
                  load(false);
                }}
                style={{ textTransform: "none", fontWeight: 700, color: tealBright }}
              >
                Try again
              </Button>
            )}
            <PrimaryButton onClick={() => navigate("/findlift")}>New search</PrimaryButton>
          </StateCard>
        )}

        {/* the rider is gone (seat booked, declined, search ended...) */}
        {data && !match && (
          <StateCard
            title={
              request.status === "matched"
                ? "Another rider has accepted your request"
                : request.status !== "searching"
                ? "This search has ended"
                : "This rider is no longer available"
            }
            text={
              request.status === "matched"
                ? "Your request has already been matched, so no other riders are being considered."
                : request.status !== "searching"
                ? `This search is ${request.status}, so no riders are being matched. Start a new search to see compatible riders.`
                : "Their pillion seat may have been booked, or they may have changed their route. Go back to see who else is on your corridor."
            }
          >
            {request.status === "searching" ? (
              <>
                <Button onClick={() => navigate("/findlift")} style={{ textTransform: "none", fontWeight: 700, color: tealBright }}>
                  Edit search
                </Button>
                <PrimaryButton onClick={backToRiders}>Back to Compatible Riders</PrimaryButton>
              </>
            ) : request.status === "matched" ? (
              <PrimaryButton onClick={() => navigate("/trips")}>View My Trips</PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => navigate("/findlift")}>New search</PrimaryButton>
            )}
          </StateCard>
        )}

        {/* ============================ DETAILS ============================ */}
        {data && match && (
          <RiderDetailsBody
            match={match}
            request={request}
            today={today}
            map={map}
            extraLines={extraLines}
            accepted={accepted}
            sent={sent}
            sending={sending}
            onBack={backToRiders}
            onSend={handleSend}
            onTrips={() => navigate("/trips")}
          />
        )}
      </Box>

      <LiftTakerFooter
        description="High-trust, institutional-grade two-wheeler ride pooling designed exclusively for urban commuters and daily tech park transit."
        columns={[
          {
            title: "Safety Assurance",
            items: ["Safety Charter", "Emergency SOS Protocols", "Rider Verification Grid", "Insurance Coverage"],
          },
          {
            title: "Mobility & Network",
            items: ["Find a Lift", "My Trips", "Metro Mobility Grid", "Help & Support"],
          },
          {
            title: "Legal & Trust",
            items: ["Privacy Policy", "Terms of Service", "Compliance Desk", "Security Standards"],
          },
        ]}
        copyright="FriendRide Technologies India Pvt Ltd. All rights reserved."
      />

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
/*  The details themselves                                             */
/* ------------------------------------------------------------------ */

function RiderDetailsBody({
  match,
  request,
  today,
  map,
  extraLines,
  accepted,
  sent,
  sending,
  onBack,
  onSend,
  onTrips,
}) {
  const verified = /verified/i.test(match.rider_verification || "");
  const stops = match.route || [];
  const hasRoute = stops.length >= 2;
  const originName = hasRoute ? shortName(stops[0].name) : shortName(match.pickup_point, "Pickup");
  const terminusName = hasRoute
    ? shortName(stops[stops.length - 1].name)
    : shortName(match.arrival_point, "Drop-off");

  const pickupExact = !/from route/i.test(match.walk_note || "");
  const inWindow =
    toMinutes(match.pickup_time) >= toMinutes(request.window_start) &&
    toMinutes(match.pickup_time) <= toMinutes(request.window_end);

  const riderRouteLabel = hasRoute ? `Rider Route (${originName} → ${terminusName})` : "Rider Route";

  return (
    <Box
      className="ltl-pad"
      style={{ maxWidth: 1560, margin: "0 auto", padding: "28px 32px 0", boxSizing: "border-box" }}
    >
      <Box
        className="rd-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.5fr)",
          gap: 28,
          alignItems: "start",
        }}
      >
        {/* ---------------- LEFT: the rider ---------------- */}
        <Box style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
          <Box style={{ ...cardStyle, padding: 24 }}>
            <Box style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <RiderAvatar match={match} size={72} />
              <Box style={{ minWidth: 0 }}>
                <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <Typography component="h2" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.4px" }}>
                    {match.rider_name}
                  </Typography>
                  <Box style={{ background: "#e1e5fb", color: "#3c40c8", borderRadius: 6, padding: "2px 9px", fontSize: 11.5, fontWeight: 700 }}>
                    Rider
                  </Box>
                  {match.is_demo && (
                    <Box style={{ background: "#fff4dc", color: "#7a5300", borderRadius: 6, padding: "2px 8px", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.4px" }}>
                      DEMO
                    </Box>
                  )}
                </Box>
                <Typography style={{ fontSize: 13, fontWeight: 700, color: verified ? tealBright : "#9a6700", marginTop: 4 }}>
                  FriendRide {verified ? "Verified" : "Pending"} Rider
                </Typography>
              </Box>
            </Box>

            {/* identity */}
            <Box
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                background: "#eef0fb",
                borderRadius: 14,
                padding: "14px 16px",
                marginTop: 20,
              }}
            >
              <VerifiedOutlinedIcon style={{ fontSize: 22, color: verified ? tealBright : "#c58a00", flexShrink: 0 }} />
              <Box style={{ minWidth: 0 }}>
                <Typography style={{ fontSize: 14, fontWeight: 800 }}>{match.rider_verification}</Typography>
                <Typography style={{ fontSize: 12.5, color: muted, marginTop: 1 }}>
                  {verified
                    ? "Identity authenticated through government ID."
                    : "Identity documents are still being reviewed."}
                </Typography>
              </Box>
            </Box>

            {/* vehicle */}
            <Box style={{ background: "#eef0fb", borderRadius: 14, padding: "16px", marginTop: 14 }}>
              <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 16, fontWeight: 800 }}>
                  <TwoWheelerOutlinedIcon style={{ fontSize: 22, color: muted }} />
                  {match.vehicle_model}
                </span>
                <span
                  style={{
                    fontFamily: "'Roboto Mono', Consolas, monospace",
                    fontSize: 12,
                    color: "#3b4357",
                    background: "#fff",
                    borderRadius: 6,
                    padding: "4px 9px",
                  }}
                >
                  {match.vehicle_plate}
                </span>
              </Box>

              <Box style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14, fontSize: 13 }}>
                <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#2f3550" }}>
                    <SportsMotorsportsOutlinedIcon style={{ fontSize: 17, color: tealBright }} />
                    {match.helmet_note}
                  </span>
                  <span style={{ fontWeight: 700, color: teal }}>Mandatory</span>
                </Box>
                <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#2f3550" }}>
                    <EventSeatOutlinedIcon style={{ fontSize: 17, color: tealBright }} />
                    {match.seats_available} Pillion Seat{match.seats_available === 1 ? "" : "s"} Available
                  </span>
                  <span style={{ background: "#d6f3ef", color: teal, borderRadius: 6, padding: "3px 9px", fontSize: 11.5, fontWeight: 800 }}>
                    {match.seats_available === 1 ? "Solo Co-Commuter Only" : `Up to ${match.seats_available} Co-Commuters`}
                  </span>
                </Box>
              </Box>
            </Box>

            {/* protocols */}
            <Typography style={{ ...capsLabel, marginTop: 24 }}>Verification &amp; protocols</Typography>
            <Box style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 12 }}>
              <CheckRow ok={verified}>
                {verified ? "Government ID & Aadhaar verification cleared" : "Identity review in progress"}
              </CheckRow>
              <CheckRow>{match.helmet_note} for rider and passenger</CheckRow>
              <CheckRow>AIS-140 GPS corridor tracking active</CheckRow>
              <CheckRow>Tokenized in-app number masking</CheckRow>
            </Box>

            <Box
              style={{
                display: "flex",
                gap: 10,
                background: "#eceefd",
                borderRadius: 12,
                padding: "12px 14px",
                marginTop: 20,
                fontSize: 12.5,
                color: "#3b4357",
                lineHeight: 1.5,
              }}
            >
              <LockOutlinedIcon style={{ fontSize: 17, color: muted, flexShrink: 0, marginTop: 1 }} />
              Personal telephone numbers and exact residential addresses are encrypted and never
              displayed.
            </Box>
          </Box>

          {/* safety match */}
          <Box style={{ ...cardStyle, padding: 24 }}>
            <Box style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Box
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: verified ? "#d6f3ef" : "#fff4dc",
                  color: verified ? tealBright : "#c58a00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShieldOutlinedIcon style={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography style={{ fontSize: 18, fontWeight: 800 }}>
                  {verified ? "Safety match confirmed" : "Safety review in progress"}
                </Typography>
                <Typography style={{ fontSize: 12.5, fontWeight: 700, color: verified ? tealBright : "#9a6700", marginTop: 2 }}>
                  {verified ? "Strict standards met" : "Identity still under review"}
                </Typography>
              </Box>
            </Box>

            <Typography style={{ fontSize: 13.5, color: "#475066", lineHeight: 1.6, marginTop: 14 }}>
              {verified
                ? "This rider meets your configured FriendRide safety and matching requirements, including government-verified identity, helmet compliance, and active AIS-140 corridor tracking."
                : "This rider's identity documents are still being reviewed. Their route, helmet and AIS-140 corridor details are shown below, and this page updates as soon as the review finishes."}
            </Typography>

            <Box style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              <IconRow icon={<ShieldOutlinedIcon />}>Police SOS (112) stays one tap away during the ride</IconRow>
              <IconRow icon={<AltRouteOutlinedIcon />}>Corridor deviation alerts stay on for the whole ride</IconRow>
              <IconRow icon={<CurrencyRupeeOutlinedIcon />}>
                Strict fuel-split community fare: no surge, no commercial taxi surcharge
              </IconRow>
            </Box>
          </Box>
        </Box>

        {/* ---------------- RIGHT: route + schedule ---------------- */}
        <Box style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
          {/* map */}
          <Box style={{ ...cardStyle, overflow: "hidden" }}>
            <Box style={{ position: "relative", height: 420, background: "#eef0fb" }}>
              {map.status === "ready" ? (
                <RouteMap
                  start={map.pickup}
                  end={map.drop}
                  extraLines={extraLines}
                  minHeight={420}
                  padTop={70}
                  padBottom={60}
                  startName={`${shortName(match.pickup_point, "Pickup")} · ${formatTime(match.pickup_time)}`}
                  startTag="PICKUP"
                  endName={`${shortName(match.arrival_point, "Drop-off")} · ${formatTime(match.arrival_time)}`}
                  endTag="DROP"
                >
                  <Box style={mapChip({ top: 14, left: 14, maxWidth: "calc(100% - 84px)" })}>
                    <AltRouteOutlinedIcon style={{ fontSize: 15, color: tealBright, flexShrink: 0 }} />
                    <span>Direct Transit Corridor • {match.walk_note}</span>
                  </Box>
                  <Box style={mapChip({ bottom: 22, left: 14 })}>
                    <TrendingUpIcon style={{ fontSize: 15, color: tealBright, flexShrink: 0 }} />
                    <span>
                      <b>{match.overlap_pct}% Shared Route</b>
                      {map.sharedKm ? ` · ${map.sharedKm.toFixed(1)} km corridor segment` : ""}
                    </span>
                  </Box>
                </RouteMap>
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
                  <Typography style={{ fontSize: 13.5, maxWidth: 320, lineHeight: 1.5 }}>
                    {map.status === "unavailable"
                      ? "The map isn't available because this route's places weren't located on the map. The schedule below still applies."
                      : "Loading the map…"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px 20px",
                flexWrap: "wrap",
                padding: "14px 20px 16px",
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              <Box style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
                {map.riderLine && (
                  <LegendItem label={riderRouteLabel}>
                    <span style={{ width: 22, height: 5, borderRadius: 3, background: "#bdb9f7" }} />
                  </LegendItem>
                )}
                {map.askedLine && (
                  <LegendItem label="Requested Journey">
                    <span style={{ width: 22, borderTop: "2.5px dashed #4a46d6" }} />
                  </LegendItem>
                )}
                {map.sharedLine && (
                  <LegendItem label={`${match.overlap_pct}% Shared Overlap Corridor`} color={teal}>
                    <span style={{ width: 22, height: 6, borderRadius: 3, background: teal }} />
                  </LegendItem>
                )}
              </Box>
              <span style={{ color: muted, fontWeight: 600 }}>Live Map Sync: Instant</span>
            </Box>
          </Box>

          {/* trip + schedule */}
          <Box style={{ ...cardStyle, padding: 24 }}>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Typography component="h2" style={{ fontSize: 20, fontWeight: 800 }}>
                Trip &amp; Schedule Alignment
              </Typography>
              <Box style={{ background: "#d6f3ef", color: teal, borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 800 }}>
                Corridor Coordinated
              </Box>
            </Box>

            <Box className="rd-tiles" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, marginTop: 18 }}>
              <Tile label={hasRoute ? "Rider origin & terminus" : "Rider's matched stretch"} icon={<RouteOutlinedIcon style={{ fontSize: 19 }} />}>
                <TileValue>
                  {originName}
                  <ArrowForwardIcon style={{ fontSize: 17, margin: "0 7px -3px", color: muted }} />
                  {terminusName}
                </TileValue>
                <TileSub>{match.corridor || match.route_note}</TileSub>
              </Tile>

              <Tile label="Your requested commute" icon={<LocationOnOutlinedIcon style={{ fontSize: 19 }} />}>
                <TileValue>
                  {shortName(request.pickup)}
                  <ArrowForwardIcon style={{ fontSize: 17, margin: "0 7px -3px", color: muted }} />
                  {shortName(request.destination)}
                </TileValue>
                <TileSub color={tealBright}>
                  {relativeDay(request.travel_date, today)} · Pickup {formatTime(match.pickup_time)}
                </TileSub>
              </Tile>

              <Tile label="Schedule & timing" icon={<AccessTimeOutlinedIcon style={{ fontSize: 19 }} />}>
                <Box style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: teal, letterSpacing: "-0.5px" }}>
                    ~{match.duration_min}
                  </span>
                  <span style={{ fontSize: 13, color: muted, fontWeight: 600 }}>mins total duration</span>
                </Box>
                <TileSub>
                  Pickup: {formatTime(match.pickup_time)} &nbsp;•&nbsp; Drop: {formatTime(match.arrival_time)}
                </TileSub>
              </Tile>

              <Tile label="Fixed fuel-split share" icon={<CurrencyRupeeOutlinedIcon style={{ fontSize: 19 }} />}>
                <Box style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: teal, letterSpacing: "-0.5px" }}>
                    ₹{match.fare}
                  </span>
                  <span style={{ fontSize: 13, color: muted, fontWeight: 600 }}>/ passenger split</span>
                </Box>
                <TileSub>Zero surge surcharge • Community shared rate</TileSub>
              </Tile>
            </Box>
          </Box>

          {/* matrix */}
          <Box style={{ ...cardStyle, padding: 24 }}>
            <Typography style={capsLabel}>Commuter compatibility matrix</Typography>
            <Box className="rd-matrix" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginTop: 14 }}>
              <MatrixCell label="Route Overlap" value={`${match.overlap_pct}% Match`} ok icon={<TrendingUpIcon />} />
              <MatrixCell
                label="Pickup Alignment"
                value={pickupExact ? "Compatible" : match.walk_note}
                ok={pickupExact}
                icon={<LocationOnOutlinedIcon />}
              />
              <MatrixCell
                label="Timing Window"
                value={inWindow ? "Synchronized" : "Flexible Match"}
                ok
                icon={<AccessTimeOutlinedIcon />}
              />
              <MatrixCell
                label="Safety Matching"
                value={verified ? "Confirmed" : "ID in Review"}
                ok={verified}
                icon={<ShieldOutlinedIcon />}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ============================ ACTIONS ============================ */}
      <Box style={{ ...cardStyle, padding: "18px 22px", marginTop: 28 }}>
        <Box className="rd-actions" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <Button
            disableElevation
            onClick={onBack}
            startIcon={<ArrowBackIcon style={{ fontSize: 19 }} />}
            style={{
              background: "#e3e7ff",
              color: "#28324c",
              borderRadius: 12,
              padding: "11px 22px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14.5,
            }}
          >
            Back to Compatible Riders
          </Button>

          <Box className="rd-actions-right" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: "#3b4357" }}>
              <ShieldOutlinedIcon style={{ fontSize: 17, color: muted }} />
              Protected by FriendRide Commuter Shield
            </span>

            {accepted ? (
              <Button
                disableElevation
                onClick={onTrips}
                endIcon={<ArrowForwardIcon style={{ fontSize: 19 }} />}
                style={primaryButton}
              >
                View My Trips
              </Button>
            ) : sent ? (
              <Button
                disabled
                disableElevation
                startIcon={<CheckCircleOutlinedIcon style={{ fontSize: 19 }} />}
                style={{ ...primaryButton, background: "#d6f3ef", color: teal }}
              >
                Request Sent
              </Button>
            ) : (
              <Button
                disableElevation
                disabled={sending}
                onClick={onSend}
                endIcon={<ArrowForwardIcon style={{ fontSize: 19 }} />}
                style={{ ...primaryButton, opacity: sending ? 0.7 : 1 }}
              >
                {sending ? "Sending…" : "Send Lift Request"}
              </Button>
            )}
          </Box>
        </Box>

        {accepted && (
          <Box
            role="status"
            style={{ display: "flex", gap: 10, alignItems: "center", background: "#e3f6ec", color: "#16794a", borderRadius: 12, padding: "12px 14px", marginTop: 16, fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}
          >
            <CheckCircleOutlinedIcon style={{ fontSize: 20, flexShrink: 0 }} />
            {match.rider_name} accepted your request. Your pillion seat is reserved. You can find this
            lift under My Trips.
          </Box>
        )}

        {sent && !accepted && (
          <Box
            role="status"
            style={{ display: "flex", gap: 10, alignItems: "center", background: "#eceefd", color: "#2d3480", borderRadius: 12, padding: "12px 14px", marginTop: 16, fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}
          >
            <AccessTimeOutlinedIcon style={{ fontSize: 20, flexShrink: 0, color: indigo }} />
            Your request has been sent to {match.rider_name}. This page updates automatically when they
            respond.
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

const primaryButton = {
  background: teal,
  color: "#fff",
  borderRadius: 12,
  padding: "11px 26px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: 15,
};

const mapChip = (position) => ({
  position: "absolute",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: 7,
  background: "rgba(255,255,255,0.95)",
  borderRadius: 18,
  padding: "6px 13px",
  fontSize: 12,
  fontWeight: 600,
  color: dark,
  boxShadow: "0 2px 10px rgba(30,35,90,0.14)",
  ...position,
});

function Crumb({ onClick, children }) {
  return (
    <span
      className="rd-btn"
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={activateOnKey(onClick)}
      style={{ cursor: "pointer", fontWeight: 600 }}
    >
      {children}
    </span>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <Button disableElevation onClick={onClick} style={{ ...primaryButton, padding: "8px 22px", fontSize: 14, fontWeight: 700, borderRadius: 10 }}>
      {children}
    </Button>
  );
}

function StateCard({ title, text, children }) {
  return (
    <Box className="ltl-pad" style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 32px", boxSizing: "border-box" }}>
      <Box style={{ ...cardStyle, padding: "34px 28px", textAlign: "center" }}>
        <Typography style={{ fontSize: 20, fontWeight: 800 }}>{title}</Typography>
        <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "8px 0 20px" }}>{text}</Typography>
        <Box style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>{children}</Box>
      </Box>
    </Box>
  );
}

function RiderAvatar({ match, size = 64 }) {
  return (
    <Box style={{ position: "relative", width: size + 8, height: size + 8, flexShrink: 0 }}>
      <Avatar
        src={toAbsoluteUrl(match.rider_photo_url) || undefined}
        style={{
          width: size,
          height: size,
          margin: 4,
          border: "3px solid #9be3da",
          boxSizing: "content-box",
          background: "#d8b293",
          color: "#172033",
          fontWeight: 700,
          fontSize: size * 0.32,
        }}
      >
        {initialsOf(match.rider_name)}
      </Avatar>
      <Box
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: tealBright,
          border: "2px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckCircleOutlinedIcon style={{ fontSize: 14, color: "#fff" }} />
      </Box>
    </Box>
  );
}

function CheckRow({ ok = true, children }) {
  return (
    <Box style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "#2f3550", lineHeight: 1.45 }}>
      {ok ? (
        <CheckCircleOutlinedIcon style={{ fontSize: 18, color: tealBright, flexShrink: 0, marginTop: 1 }} />
      ) : (
        <AccessTimeOutlinedIcon style={{ fontSize: 18, color: "#c58a00", flexShrink: 0, marginTop: 1 }} />
      )}
      <span>{children}</span>
    </Box>
  );
}

function IconRow({ icon, children }) {
  return (
    <Box style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "#2f3550", lineHeight: 1.45 }}>
      {React.cloneElement(icon, { style: { fontSize: 18, color: tealBright, flexShrink: 0, marginTop: 1 } })}
      <span>{children}</span>
    </Box>
  );
}

function Tile({ label, icon, children }) {
  return (
    <Box style={{ background: "#f4f5fd", borderRadius: 16, padding: "16px 18px", minWidth: 0 }}>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <Typography style={capsLabel}>{label}</Typography>
        <Box style={{ color: muted, display: "flex" }}>{icon}</Box>
      </Box>
      {children}
    </Box>
  );
}

function TileValue({ children }) {
  return (
    <Typography component="div" style={{ fontSize: 19, fontWeight: 800, marginTop: 8, lineHeight: 1.3, wordBreak: "break-word" }}>
      {children}
    </Typography>
  );
}

function TileSub({ children, color }) {
  return (
    <Typography component="div" style={{ fontSize: 12.5, color: color || muted, fontWeight: color ? 700 : 400, marginTop: 6, lineHeight: 1.45 }}>
      {children}
    </Typography>
  );
}

function MatrixCell({ label, value, ok, icon }) {
  const color = ok ? teal : "#9a6700";
  return (
    <Box style={{ background: "#eef0fb", borderRadius: 14, padding: "13px 14px", minWidth: 0 }}>
      <Typography style={{ fontSize: 12, color: muted, fontWeight: 600 }}>{label}</Typography>
      <Box style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, color, fontSize: 14, fontWeight: 800 }}>
        {React.cloneElement(icon, { style: { fontSize: 17, flexShrink: 0 } })}
        <span style={{ wordBreak: "break-word" }}>{value}</span>
      </Box>
    </Box>
  );
}

function LegendItem({ children, label, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: color || "#3b4357" }}>
      {children}
      {label}
    </span>
  );
}
