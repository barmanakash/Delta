import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";

import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LocalParkingOutlinedIcon from "@mui/icons-material/LocalParkingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { LT, LiftTakerHeader, LiftTakerFooter } from "../lifttakerlayout/lifttakerlayout";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const API_BASE_URL = "http://localhost:8000";

const { teal, tealBright, indigo, dark, muted, pageBg } = LT;

const WINDOW_MINUTES = 15;
const MAX_DAYS_AHEAD = 30;
const FLEX_BUFFER_MINUTES = 15;

// Rough urban estimate: road distance is ~1.3x the straight line,
// travelled at ~22 km/h through city traffic.
const ROAD_FACTOR = 1.3;
const AVG_SPEED_KMH = 22;

const cardStyle = {
  background: "#fff",
  borderRadius: 22,
  boxShadow: "0 4px 20px rgba(30,35,90,0.06)",
};

const capsLabel = {
  fontSize: 11.5,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: "#3b4357",
  lineHeight: 1.2,
};

const bareInput = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontSize: 17,
  fontWeight: 700,
  color: dark,
  fontFamily: "inherit",
  padding: 0,
};

/* ------------------------------------------------------------------ */
/*  Date / time helpers                                                */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, "0");

const toISODate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const fromMinutes = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

const addMinutes = (t, n) => fromMinutes(toMinutes(t) + n);

// "08:30" -> "08:30 AM"
const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

const windowLabel = (start) =>
  `${formatTime(start)} – ${formatTime(addMinutes(start, WINDOW_MINUTES))}`;

const parseISODate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatDateShort = (iso) =>
  parseISODate(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// "Today, 24 Oct" / "Tomorrow, 25 Oct" / "Sat, 26 Oct"
const dayLabel = (date, index) => {
  const short = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  if (index === 0) return `Today, ${short}`;
  if (index === 1) return `Tomorrow, ${short}`;
  return `${date.toLocaleDateString("en-IN", { weekday: "short" })}, ${short}`;
};

// 05:00 AM .. 10:45 PM start times, one every 15 minutes
const WINDOW_STARTS = Array.from({ length: 72 }, (_, i) =>
  fromMinutes(5 * 60 + i * WINDOW_MINUTES)
);

/* ------------------------------------------------------------------ */
/*  Misc helpers                                                       */
/* ------------------------------------------------------------------ */

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

// "PNT Naka Safe Transit Stop, North Gate" -> "PNT Naka Safe Transit…"
const shortName = (value, fallback) => {
  const first = (value || "").split(",")[0].trim();
  if (!first) return fallback;
  return first.length > 24 ? `${first.slice(0, 23).trimEnd()}…` : first;
};

const haversineKm = (a, b) => {
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

// Free OpenStreetMap geocoder. If it is unreachable the estimate shows "—".
const geocode = async (query, signal) => {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=" +
    encodeURIComponent(query);
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("geocoding failed");
  const rows = await res.json();
  return rows.length
    ? { lat: parseFloat(rows[0].lat), lng: parseFloat(rows[0].lon) }
    : null;
};

const durationRange = (minutes) => {
  const mid = Math.round(minutes);
  return `${Math.max(1, mid - 1)}–${mid + 1} mins`;
};

// Commute peaks: 7-10 AM and 5-8 PM
const corridorDensity = (windowStart) => {
  const m = windowStart ? toMinutes(windowStart) : -1;
  const peak = (m >= 7 * 60 && m < 10 * 60) || (m >= 17 * 60 && m < 20 * 60);
  return peak ? "High Commute" : "Moderate";
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FindLift() {
  const navigate = useNavigate();
  const location = useLocation();

  const [now, setNow] = useState(() => new Date());
  const [user, setUser] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [pickup, setPickup] = useState(location.state?.pickup || "");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [travelDate, setTravelDate] = useState(() =>
    location.state?.travelDate && location.state.travelDate >= toISODate(new Date())
      ? location.state.travelDate
      : toISODate(new Date())
  );
  const [windowStart, setWindowStart] = useState(location.state?.windowStart || "");
  const [flexible, setFlexible] = useState(location.state?.flexible ?? true);
  // Trip filters carried over from Home / Edit Search (this screen has no controls for them)
  const [filters] = useState(() => ({
    sameGender: false,
    twoWheeler: true,
    zeroDetour: true,
    ...(location.state?.filters || {}),
  }));

  const [estimate, setEstimate] = useState({ status: "idle" }); // idle | loading | ready | unavailable
  const [zoom, setZoom] = useState(1);

  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const geoCache = useRef(new Map());
  const prefilled = useRef(Boolean(location.state?.pickup));

  const today = toISODate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const signOutLocally = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/signin", { replace: true });
  };

  /* ---- clock ------------------------------------------------------- */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  /* ---- date + time-window options ---------------------------------- */
  const dateOptions = useMemo(() => {
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Array.from({ length: MAX_DAYS_AHEAD + 1 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return { value: toISODate(d), label: dayLabel(d, i) };
    });
    // only changes when the calendar day changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const availableStarts = useMemo(
    () =>
      travelDate === today
        ? WINDOW_STARTS.filter((s) => toMinutes(s) + WINDOW_MINUTES > nowMinutes)
        : WINDOW_STARTS,
    [travelDate, today, nowMinutes]
  );

  useEffect(() => {
    if (travelDate < today) {
      setTravelDate(today); // page was left open past midnight
      return;
    }
    if (!availableStarts.includes(windowStart)) {
      setWindowStart(
        availableStarts.find((s) => toMinutes(s) >= nowMinutes) ||
          availableStarts[0] ||
          ""
      );
    }
  }, [availableStarts, windowStart, travelDate, today, nowMinutes]);

  /* ---- load the signed-in user + any active search ----------------- */
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

    const loadUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, { headers: authHeaders() });
        if (res.status === 401) {
          signOutLocally();
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        if (data.role !== "lift") {
          navigate("/home", { replace: true }); // riders have their own screens
          return;
        }
        applyUser(data);
      } catch {
        // backend offline: keep the cached user
      }
    };

    const loadLatest = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/lifts/requests?limit=1`, {
          headers: authHeaders(),
        });
        if (res.status === 401) {
          signOutLocally();
          return;
        }
        if (!res.ok) return;
        const [latest] = await res.json();
        if (!latest) return;
        if (latest.status === "searching") setActiveRequest(latest);
        // Start from the last pickup used, unless Home already passed one in
        if (!prefilled.current) {
          prefilled.current = true;
          setPickup((p) => p || latest.pickup);
        }
      } catch {
        // backend offline: the page still works as a form
      }
    };

    loadUser();
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- distance / duration estimate -------------------------------- */
  useEffect(() => {
    const p = pickup.trim();
    const d = destination.trim();
    if (p.length < 3 || d.length < 3 || p.toLowerCase() === d.toLowerCase()) {
      setEstimate({ status: "idle" });
      return undefined;
    }

    const controller = new AbortController();
    setEstimate({ status: "loading" });

    const lookup = async (query) => {
      const key = query.toLowerCase();
      if (geoCache.current.has(key)) return geoCache.current.get(key);
      const result = await geocode(query, controller.signal);
      geoCache.current.set(key, result);
      return result;
    };

    const timer = setTimeout(async () => {
      try {
        const from = pickupCoords || (await lookup(p));
        const to = await lookup(d);
        if (!from || !to) {
          setEstimate({ status: "unavailable" });
          return;
        }
        const km = haversineKm(from, to) * ROAD_FACTOR;
        setEstimate({ status: "ready", km, minutes: (km / AVG_SPEED_KMH) * 60 });
      } catch (err) {
        if (err.name !== "AbortError") setEstimate({ status: "unavailable" });
      }
    }, 900);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [pickup, destination, pickupCoords]);

  /* ---- handlers ---------------------------------------------------- */

  const swapPlaces = () => {
    setPickup(destination);
    setDestination(pickup);
    setPickupCoords(null);
  };

  const fillCurrentLocation = () => {
    if (locating) return;
    if (!navigator.geolocation) {
      showToast("Your browser doesn't support location access.", "warning");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPickup(
          `Current location (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
        );
        setPickupCoords({ lat: coords.latitude, lng: coords.longitude });
        setLocating(false);
      },
      () => {
        setLocating(false);
        showToast(
          "Couldn't get your location. Allow location access or type your pickup.",
          "warning"
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = async () => {
    if (submitting) return;

    const p = pickup.trim();
    const d = destination.trim();
    const fail = (message) => setFormError(message);

    if (p.length < 3) return fail("Enter your pickup location.");
    if (d.length < 3) return fail("Enter where you want to go.");
    if (p.toLowerCase() === d.toLowerCase())
      return fail("Pickup and destination must be different.");
    if (!windowStart)
      return fail("No pickup windows are left today. Choose a later date.");

    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/lifts/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          pickup: p,
          destination: d,
          pickup_lat: pickupCoords ? pickupCoords.lat : null,
          pickup_lng: pickupCoords ? pickupCoords.lng : null,
          travel_date: travelDate,
          window_start: windowStart,
          window_end: addMinutes(windowStart, WINDOW_MINUTES),
          same_gender_only: filters.sameGender,
          two_wheeler_only: filters.twoWheeler,
          zero_detour_only: filters.zeroDetour,
          flexible_pickup: flexible,
        }),
      });

      if (res.status === 401) {
        signOutLocally();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        fail(errorMessage(data, "Couldn't search for rides. Please try again."));
        return;
      }

      // Show the riders whose routes fit this search
      navigate(`/compatibleriders/${data.id}`);
    } catch {
      fail("Unable to connect to server. Please make sure the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!activeRequest || cancelling) return;
    setCancelling(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/lifts/requests/${activeRequest.id}/cancel`,
        { method: "POST", headers: authHeaders() }
      );
      if (res.status === 401) {
        signOutLocally();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        showToast(errorMessage(data, "Couldn't cancel the search."), "error");
        return;
      }
      setActiveRequest(null);
      showToast("Search cancelled.", "info");
    } catch {
      showToast("Unable to connect to server.", "error");
    } finally {
      setCancelling(false);
    }
  };

  /* ---- derived values ---------------------------------------------- */
  const placeholderStat = estimate.status === "loading" ? "…" : "—";
  const distanceText =
    estimate.status === "ready" ? `${estimate.km.toFixed(1)} km` : placeholderStat;
  const durationText =
    estimate.status === "ready" ? durationRange(estimate.minutes) : placeholderStat;

  const flexNote = windowStart
    ? `Within 30 minutes (±${FLEX_BUFFER_MINUTES} mins buffer around ${formatTime(windowStart)})`
    : "Within 30 minutes";

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
        .fl-input::placeholder { color: #7b8294; font-weight: 500; }
        .fl-focus:focus-within { box-shadow: 0 0 0 2px rgba(0,125,115,0.35) !important; }
        .fl-btn:focus-visible { outline: 2px solid ${tealBright}; outline-offset: 2px; }
        @media (max-width: 1000px) {
          .fl-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .fl-banner { flex-direction: column !important; align-items: flex-start !important; }
        }
        @media (max-width: 600px) {
          .fl-two-col { grid-template-columns: minmax(0, 1fr) !important; }
          .fl-map-stats { flex-wrap: wrap; gap: 14px !important; }
          .fl-checks { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <LiftTakerHeader active="find" user={user} photoUrl={photoUrl} />

      {/* ========================= BREADCRUMB BAR ======================== */}
      <Box style={{ borderBottom: "1px solid #ebecf6", background: "#fafaff" }}>
        <Box
          className="ltl-pad fl-banner"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "12px 32px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Box style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Box style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span
                className="fl-btn"
                role="link"
                tabIndex={0}
                onClick={() => navigate("/lifttakerhome")}
                onKeyDown={activateOnKey(() => navigate("/lifttakerhome"))}
                style={{ color: muted, cursor: "pointer", fontWeight: 600 }}
              >
                Home
              </span>
              <span style={{ color: "#9aa1b5" }}>›</span>
              <span style={{ fontWeight: 700 }}>Find a Lift</span>
            </Box>

            <Box style={{ width: 1, height: 18, background: "#dadcec" }} />

            <Box
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "#dff4f1",
                color: teal,
                borderRadius: 12,
                padding: "4px 12px",
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              <Box style={{ width: 6, height: 6, borderRadius: "50%", background: tealBright }} />
              Lift Taker Route Planner • AIS-140 Safe Corridor Active
            </Box>
          </Box>

          <Box
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#3b4357" }}
          >
            <HubOutlinedIcon style={{ fontSize: 17, color: tealBright }} />
            <span>
              Over <b style={{ fontWeight: 700 }}>2,400</b> verified commuter routes active
              today in your city zone
            </span>
          </Box>
        </Box>
      </Box>

      {/* ============================= MAIN ============================= */}
      <Box component="main" style={{ flex: 1 }}>
        <Box
          className="ltl-pad fl-grid"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "28px 32px 0",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.4fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ------------------------ LEFT: FORM ------------------------ */}
          <Box style={{ ...cardStyle, overflow: "hidden" }}>
            <Box style={{ height: 5, background: `linear-gradient(90deg, ${teal}, #4fd1c5 55%, ${indigo})` }} />

            <Box style={{ padding: "26px 28px 28px" }}>
              <Typography component="h1" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.4px" }}>
                Find a lift
              </Typography>
              <Typography style={{ fontSize: 14.5, color: muted, marginTop: 6 }}>
                Tell us where you're going and we'll look for compatible routes.
              </Typography>

              {/* pickup */}
              <Typography style={{ ...capsLabel, marginTop: 28, marginBottom: 10 }}>
                Pickup location
              </Typography>
              <Box
                className="fl-focus"
                style={{
                  background: "#f0f2fb",
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Box
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#b9ece6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: `3px solid ${teal}`,
                      background: "#fff",
                      boxSizing: "border-box",
                    }}
                  />
                </Box>

                <Box style={{ flex: 1, minWidth: 0 }}>
                  <input
                    className="fl-input"
                    aria-label="Pickup location"
                    value={pickup}
                    onChange={(e) => {
                      setPickup(e.target.value);
                      setPickupCoords(null);
                    }}
                    placeholder="Where should we pick you up?"
                    maxLength={200}
                    style={{ ...bareInput, fontSize: 16 }}
                  />
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: tealBright,
                    }}
                  >
                    <VerifiedOutlinedIcon style={{ fontSize: 14 }} />
                    Certified CCTV Boarding Point
                  </Box>
                </Box>

                <Box
                  className="fl-btn"
                  role="button"
                  tabIndex={0}
                  aria-label="Use current GPS location"
                  onClick={fillCurrentLocation}
                  onKeyDown={activateOnKey(fillCurrentLocation)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "#dfe3fb",
                    color: "#3b4357",
                    borderRadius: 8,
                    padding: "5px 9px",
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {locating ? (
                    <CircularProgress size={13} style={{ color: tealBright }} />
                  ) : (
                    <MyLocationOutlinedIcon style={{ fontSize: 14, color: tealBright }} />
                  )}
                  GPS
                </Box>
              </Box>

              {/* swap divider */}
              <Box style={{ position: "relative", height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "1.5px dotted #d3d6e8" }} />
                <IconButton
                  aria-label="Swap pickup and destination"
                  onClick={swapPlaces}
                  style={{
                    position: "relative",
                    width: 34,
                    height: 34,
                    background: "#fff",
                    color: "#3b4357",
                    boxShadow: "0 2px 8px rgba(30,35,90,0.16)",
                  }}
                >
                  <SwapVertOutlinedIcon style={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              {/* destination */}
              <Typography style={{ ...capsLabel, marginBottom: 10 }}>Destination</Typography>
              <Box
                className="fl-focus"
                style={{
                  background: "#f0f2fb",
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Box
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#dcdffb",
                    color: indigo,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <LocationOnIcon style={{ fontSize: 19 }} />
                </Box>

                <Box style={{ flex: 1, minWidth: 0 }}>
                  <input
                    className="fl-input"
                    aria-label="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="Where do you want to go?"
                    maxLength={200}
                    style={{ ...bareInput, fontSize: 16 }}
                  />
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: indigo,
                    }}
                  >
                    <LocalParkingOutlinedIcon style={{ fontSize: 14 }} />
                    Official Pillion Drop Zone
                  </Box>
                </Box>

                {destination && (
                  <IconButton
                    aria-label="Clear destination"
                    size="small"
                    onClick={() => setDestination("")}
                    style={{ color: "#8b92a6", flexShrink: 0 }}
                  >
                    <CloseIcon style={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>

              {/* when */}
              <Typography style={{ ...capsLabel, marginTop: 26, marginBottom: 10 }}>
                When do you need the lift?
              </Typography>
              <Box
                className="fl-two-col"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
              >
                <Box className="fl-focus" style={tileStyle}>
                  <CalendarMonthOutlinedIcon style={{ fontSize: 20, color: indigo, flexShrink: 0 }} />
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Typography style={tileLabel}>Date</Typography>
                    <select
                      className="fl-input"
                      aria-label="Commute date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      style={selectStyle}
                    >
                      {dateOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Box>
                  <KeyboardArrowDownIcon style={{ fontSize: 20, color: "#596066", flexShrink: 0 }} />
                </Box>

                <Box className="fl-focus" style={tileStyle}>
                  <AccessTimeOutlinedIcon style={{ fontSize: 20, color: indigo, flexShrink: 0 }} />
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Typography style={tileLabel}>Pickup Window</Typography>
                    <select
                      className="fl-input"
                      aria-label="Pickup window"
                      value={windowStart}
                      disabled={!availableStarts.length}
                      onChange={(e) => setWindowStart(e.target.value)}
                      style={selectStyle}
                    >
                      {availableStarts.length ? (
                        availableStarts.map((s) => (
                          <option key={s} value={s}>
                            {windowLabel(s)}
                          </option>
                        ))
                      ) : (
                        <option value="">No windows left</option>
                      )}
                    </select>
                  </Box>
                  <KeyboardArrowDownIcon style={{ fontSize: 20, color: "#596066", flexShrink: 0 }} />
                </Box>
              </Box>

              {/* flexible pickup */}
              <Box
                style={{
                  background: "#f4f5fd",
                  borderRadius: 16,
                  padding: "16px 16px 14px",
                  marginTop: 16,
                }}
              >
                <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                  <Box style={{ minWidth: 0 }}>
                    <Typography
                      component="div"
                      style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}
                    >
                      Flexible pickup time
                      <span title="We also look at riders leaving a little before or after your window.">
                        <InfoOutlinedIcon style={{ fontSize: 15, color: muted, display: "block" }} />
                      </span>
                    </Typography>
                    <Typography style={{ fontSize: 12.5, color: muted, marginTop: 4, lineHeight: 1.45 }}>
                      Broaden search window to match more verified daily poolers.
                    </Typography>
                  </Box>

                  <Box
                    className="fl-btn"
                    role="switch"
                    tabIndex={0}
                    aria-checked={flexible}
                    aria-label="Flexible pickup time"
                    onClick={() => setFlexible((v) => !v)}
                    onKeyDown={activateOnKey(() => setFlexible((v) => !v))}
                    style={{
                      width: 52,
                      height: 30,
                      borderRadius: 15,
                      padding: 3,
                      boxSizing: "border-box",
                      background: flexible ? teal : "#c3c8db",
                      display: "flex",
                      justifyContent: flexible ? "flex-end" : "flex-start",
                      alignItems: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "background 0.15s ease",
                    }}
                  >
                    <Box style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
                  </Box>
                </Box>

                {flexible && (
                  <Box
                    style={{
                      marginTop: 12,
                      background: "#d6f3ef",
                      color: teal,
                      borderRadius: 8,
                      padding: "7px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <AccessTimeOutlinedIcon style={{ fontSize: 15, flexShrink: 0 }} />
                    {flexNote}
                  </Box>
                )}
              </Box>

              {/* active search */}
              {activeRequest && (
                <Box
                  role="status"
                  style={{
                    marginTop: 18,
                    background: "#eef0ff",
                    borderRadius: 14,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <CircularProgress size={18} style={{ color: indigo }} />
                  <Box style={{ flex: 1, minWidth: 170 }}>
                    <Typography style={{ fontSize: 13.5, fontWeight: 700, color: "#3c40c8" }}>
                      Searching compatible rides
                    </Typography>
                    <Typography style={{ fontSize: 12.5, color: "#3b4357", wordBreak: "break-word" }}>
                      {shortName(activeRequest.pickup, "Pickup")} →{" "}
                      {shortName(activeRequest.destination, "Destination")} ·{" "}
                      {activeRequest.travel_date === today
                        ? "Today"
                        : formatDateShort(activeRequest.travel_date)}
                      , {windowLabel(activeRequest.window_start)}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => navigate(`/compatibleriders/${activeRequest.id}`)}
                    style={{ textTransform: "none", fontWeight: 700, fontSize: 13, color: teal }}
                  >
                    View matches
                  </Button>
                  <Button
                    disabled={cancelling}
                    onClick={handleCancel}
                    style={{ textTransform: "none", fontWeight: 700, fontSize: 13, color: "#c0262d" }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}

              {formError && (
                <Alert severity="error" role="alert" style={{ marginTop: 18, borderRadius: 12 }}>
                  {formError}
                </Alert>
              )}

              {/* submit */}
              <Button
                fullWidth
                disableElevation
                disabled={submitting}
                onClick={handleSearch}
                endIcon={!submitting && <ArrowForwardIcon />}
                style={{
                  marginTop: 22,
                  height: 54,
                  borderRadius: 12,
                  background: submitting ? "#7fb3ad" : teal,
                  color: "#fff",
                  textTransform: "none",
                  fontSize: 16,
                  fontWeight: 800,
                  boxShadow: submitting ? "none" : "0 6px 16px rgba(0,105,95,0.28)",
                }}
              >
                {submitting ? (
                  <CircularProgress size={22} style={{ color: "#fff" }} />
                ) : (
                  "Search Compatible Rides"
                )}
              </Button>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  columnGap: 14,
                  rowGap: 6,
                  marginTop: 16,
                  fontSize: 12,
                  color: "#3b4357",
                  textAlign: "center",
                }}
              >
                <TrustItem icon={<VerifiedOutlinedIcon style={{ fontSize: 14 }} />}>
                  100% Aadhaar Verified
                </TrustItem>
                <span aria-hidden="true">•</span>
                <TrustItem icon={<BoltOutlinedIcon style={{ fontSize: 14 }} />}>
                  AIS-140 GPS Monitored
                </TrustItem>
                <span aria-hidden="true">•</span>
                <TrustItem icon={<CurrencyRupeeOutlinedIcon style={{ fontSize: 14 }} />}>
                  Zero Surcharge Cost-Split
                </TrustItem>
              </Box>
            </Box>
          </Box>

          {/* ------------------- RIGHT: MAP + INFO --------------------- */}
          <Box style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            {/* map */}
            <Box
              style={{
                ...cardStyle,
                position: "relative",
                overflow: "hidden",
                aspectRatio: "700 / 450",
                minHeight: 320,
                background: "#eef0fb",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `scale(${zoom})`,
                  transformOrigin: "50% 55%",
                  transition: "transform 0.2s ease",
                }}
              >
                <svg
                  viewBox="0 0 700 450"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                  style={{ position: "absolute", inset: 0 }}
                >
                  {/* parks */}
                  <path d="M40 60 C110 40 170 90 150 150 C135 200 70 215 30 180 Z" fill="#dff3ea" />
                  <path d="M470 330 C540 290 640 310 700 280 L700 450 L440 450 C430 400 440 360 470 330 Z" fill="#e1f3ec" />

                  {/* roads */}
                  <g stroke="#d8dbec" strokeWidth="2.5" fill="none" strokeLinecap="round">
                    <path d="M290 0 L290 450" />
                    <path d="M520 0 L520 190" />
                    <path d="M0 305 L450 305" />
                    <path d="M420 120 L700 120" />
                    <path d="M180 450 L470 140" />
                    <path d="M520 190 L700 235" />
                    <path d="M330 150 L400 100" />
                  </g>
                </svg>

                {/* route */}
                <svg
                  viewBox="0 0 700 450"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                  style={{ position: "absolute", inset: 0 }}
                >
                  <path
                    d="M115 350 C210 340 280 300 340 250 S470 175 595 130"
                    fill="none"
                    stroke="#9fe0d8"
                    strokeWidth="14"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                  <path
                    d="M115 350 C210 340 280 300 340 250 S470 175 595 130"
                    fill="none"
                    stroke={teal}
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M115 350 C210 340 280 300 340 250 S470 175 595 130"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeDasharray="7 6"
                    strokeLinecap="round"
                  />

                  {/* pickup pin */}
                  <circle cx="115" cy="350" r="20" fill="rgba(0,105,95,0.18)" />
                  <circle cx="115" cy="350" r="10" fill={teal} />
                  <circle cx="115" cy="350" r="4.5" fill="#fff" />

                  {/* drop pin */}
                  <circle cx="595" cy="130" r="20" fill="rgba(85,89,226,0.2)" />
                  <circle cx="595" cy="130" r="10" fill={indigo} />
                  <circle cx="595" cy="130" r="4.5" fill="#fff" />
                </svg>

                <MapLabel
                  style={{ left: "16.4%", top: "70%", transform: "translate(-12%, -100%)" }}
                  dot={teal}
                  name={shortName(pickup, "Pickup")}
                  tag="PICKUP"
                  tagBg="#cdeeea"
                  tagColor={teal}
                />
                <MapLabel
                  style={{ left: "85%", top: "21%", transform: "translate(-62%, -100%)" }}
                  dot={indigo}
                  name={shortName(destination, "Destination")}
                  tag="DROP-OFF"
                  tagBg="#dcdffb"
                  tagColor="#3c40c8"
                />
              </Box>

              {/* trip stats */}
              <Box
                className="fl-map-stats"
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  maxWidth: "calc(100% - 32px)",
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 6px 20px rgba(30,35,90,0.14)",
                  padding: "12px 18px",
                  display: "flex",
                  gap: 26,
                }}
              >
                <MapStat label="Distance" value={distanceText} />
                <MapStat label="Est. Duration" value={durationText} accent />
                <Box>
                  <Typography style={mapStatLabel}>Corridor Density</Typography>
                  <Typography
                    component="div"
                    style={{ fontSize: 14, fontWeight: 700, marginTop: 5, display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Box style={{ width: 8, height: 8, borderRadius: "50%", background: tealBright }} />
                    {corridorDensity(windowStart)}
                  </Typography>
                </Box>
              </Box>

              {/* zoom controls */}
              <Box
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <Box
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 3px 12px rgba(30,35,90,0.16)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <IconButton
                    aria-label="Zoom in"
                    size="small"
                    disabled={zoom >= 1.6}
                    onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.2).toFixed(1)))}
                    style={{ color: dark }}
                  >
                    <AddIcon style={{ fontSize: 20 }} />
                  </IconButton>
                  <Box style={{ height: 1, background: "#e6e8f3", margin: "0 8px" }} />
                  <IconButton
                    aria-label="Zoom out"
                    size="small"
                    disabled={zoom <= 1}
                    onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(1)))}
                    style={{ color: dark }}
                  >
                    <RemoveIcon style={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
                <IconButton
                  aria-label="Reset map view"
                  size="small"
                  onClick={() => setZoom(1)}
                  style={{
                    background: "#fff",
                    color: dark,
                    borderRadius: 12,
                    boxShadow: "0 3px 12px rgba(30,35,90,0.16)",
                  }}
                >
                  <MyLocationOutlinedIcon style={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>

            {/* matching architecture */}
            <Box
              style={{
                borderRadius: 22,
                padding: "22px 24px",
                background: "linear-gradient(135deg, #eceefd 0%, #e6e9fc 100%)",
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "#fff",
                  color: tealBright,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(30,35,90,0.08)",
                }}
              >
                <ShieldOutlinedIcon style={{ fontSize: 28 }} />
              </Box>

              <Box style={{ minWidth: 0, flex: 1 }}>
                <Box style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <Typography style={{ fontSize: 17, fontWeight: 800 }}>
                    SafeRoute matching architecture
                  </Typography>
                  <Box
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: "#cdeeea",
                      color: teal,
                      borderRadius: 8,
                      padding: "3px 9px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    <VerifiedOutlinedIcon style={{ fontSize: 13 }} />
                    Govt. ID &amp; AIS-140 Monitored
                  </Box>
                </Box>

                <Typography style={{ fontSize: 14, color: "#475066", lineHeight: 1.65, marginTop: 10 }}>
                  Only verified two-wheeler commuters adhering to pre-cleared urban
                  transit corridors appear in query results. Telephone numbers and
                  direct private identifiers remain permanently tokenized.
                </Typography>

                <Box
                  className="fl-checks"
                  style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", marginTop: 16 }}
                >
                  {[
                    "Aadhaar & Company Verified",
                    "Zero-Detour (<200m Walk)",
                    "Mandatory Dual Helmets",
                  ].map((text) => (
                    <Box
                      key={text}
                      style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600 }}
                    >
                      <CheckCircleOutlinedIcon style={{ fontSize: 16, color: tealBright, flexShrink: 0 }} />
                      {text}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <LiftTakerFooter />

      <Snackbar
        open={toast.open}
        autoHideDuration={4500}
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
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

const tileStyle = {
  background: "#f0f2fb",
  borderRadius: 14,
  padding: "12px 14px",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const tileLabel = { fontSize: 11.5, fontWeight: 500, color: "#4b5468" };

const selectStyle = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontSize: 16,
  fontWeight: 700,
  color: dark,
  fontFamily: "inherit",
  padding: 0,
  marginTop: 2,
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "pointer",
};

const mapStatLabel = {
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  color: "#4b5468",
  lineHeight: 1.2,
};

function MapStat({ label, value, accent }) {
  return (
    <Box>
      <Typography style={mapStatLabel}>{label}</Typography>
      <Typography
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginTop: 3,
          color: accent ? tealBright : dark,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function MapLabel({ style, dot, name, tag, tagBg, tagColor }) {
  return (
    <Box
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#fff",
        borderRadius: 10,
        padding: "7px 12px",
        boxShadow: "0 4px 14px rgba(30,35,90,0.16)",
        whiteSpace: "nowrap",
        marginTop: -18,
        ...style,
      }}
    >
      <Box style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      <span style={{ fontSize: 13.5, fontWeight: 700 }}>{name}</span>
      <span
        style={{
          background: tagBg,
          color: tagColor,
          borderRadius: 5,
          padding: "2px 7px",
          fontSize: 9.5,
          fontWeight: 800,
          letterSpacing: "0.4px",
        }}
      >
        {tag}
      </span>
    </Box>
  );
}

function TrustItem({ icon, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#3b4357" }}>
      <span style={{ display: "inline-flex", color: tealBright }}>{icon}</span>
      {children}
    </span>
  );
}
