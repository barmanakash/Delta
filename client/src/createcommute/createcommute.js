import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";

import ProfileMenu from "../profilemenu/profilemenu";
import RouteMap from "./routemap";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const API_BASE_URL = "http://localhost:8000";

const teal = "#00695f";
const tealBright = "#007d73";
const indigo = "#5559e2";
const dark = "#141b34";
const muted = "#5b6475";
const pageBg = "#f6f6fd";
const fieldBg = "#eef0fb";

const cardStyle = {
  background: "#fff",
  borderRadius: 22,
  boxShadow: "0 4px 20px rgba(30,35,90,0.06)",
};

const DAYS = [
  ["mon", "Mon"],
  ["tue", "Tue"],
  ["wed", "Wed"],
  ["thu", "Thu"],
  ["fri", "Fri"],
  ["sat", "Sat"],
  ["sun", "Sun"],
];
const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri"];
const ALL_DAYS = DAYS.map(([code]) => code);

// Fuel-split a lift taker pays: rupees per minute of ride. Keep in step with
// the default rate_per_min on the server (RideOfferCreate).
const RATE_PER_MIN = 1.65;
const MIN_FARE = 10;

// Average CO2 offset per pooled journey, and working weeks in a month
const KG_CO2_PER_JOURNEY = 1.8;
const WEEKS_PER_MONTH = 4.2;

// The app serves one city for now. Place searches are biased to it so
// "PNT Naka" finds the one in Jabalpur. Viewbox is left,top,right,bottom.
const CITY = "Jabalpur";
const CITY_VIEWBOX = "79.80,23.35,80.10,23.00";
const CITY_CENTER = { lat: 23.1815, lng: 79.9864 };

// Suggestions start after this many characters
const MIN_SUGGEST_CHARS = 3;

const IDLE_ROUTE = { status: "idle" };

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// "18:30" -> "6:30 PM"
const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const estimateFare = (minutes) => Math.max(MIN_FARE, Math.round(minutes * RATE_PER_MIN));

const sameDays = (a, b) => a.length === b.length && a.every((d) => b.includes(d));

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

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

const toAbsoluteUrl = (path) =>
  path ? (path.startsWith("http") ? path : `${API_BASE_URL}${path}`) : null;

const activateOnKey = (fn) => (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn(e);
  }
};

/* ---- place search (OpenStreetMap Nominatim) and routing (OSRM) ------ */
/* Both are free public services, so lookups are cached and spaced out.  */

const geoCache = new Map();
let lastGeoCall = 0;

async function geocodeOnce(query) {
  const wait = lastGeoCall + 1100 - Date.now(); // Nominatim allows ~1 request/second
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastGeoCall = Date.now();

  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in" +
    `&viewbox=${CITY_VIEWBOX}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Place search failed");
  const data = await res.json();
  return data[0]
    ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    : null;
}

// Try the full text first, then just its first part ("PNT Naka, Ranjhi
// Sub-Post" -> "PNT Naka"), always within the city.
export async function geocode(text) {
  const key = text.toLowerCase();
  if (geoCache.has(key)) return geoCache.get(key);

  const firstPart = text.split(",")[0].trim();
  const attempts = [...new Set([`${text}, ${CITY}`, `${firstPart}, ${CITY}`])];

  let point = null;
  for (const attempt of attempts) {
    point = await geocodeOnce(attempt);
    if (point) break;
  }
  geoCache.set(key, point);
  return point;
}

/* ---- place suggestions while typing (Photon, built for search-as-you-type) ---- */

// One Photon result -> something the dropdown can show and the form can use
function toSuggestion(feature) {
  const p = feature.properties || {};
  const coords = feature.geometry && feature.geometry.coordinates;
  if (!coords || (p.countrycode && p.countrycode !== "IN")) return null;

  const street = [p.housenumber, p.street].filter(Boolean).join(" ");
  const title = p.name || street || p.locality || p.district || p.city;
  if (!title) return null;

  const areas = [street, p.locality, p.district, p.city || p.county, p.state]
    .filter((a) => a && a !== title);
  const where = [p.city, p.district, p.county, p.locality].find((a) => a && a !== title);

  return {
    key: `${feature.properties.osm_type || ""}${feature.properties.osm_id || coords.join(",")}`,
    title,
    subtitle: [...new Set(areas)].slice(0, 3).join(", "),
    // What goes into the field once picked: short and easy to match, e.g. "Damoh Naka, Jabalpur"
    label: where ? `${title}, ${where}` : title,
    point: { lat: coords[1], lng: coords[0] },
  };
}

export async function searchPlaces(query, signal) {
  const params = new URLSearchParams({
    q: query,
    limit: "8",
    lang: "en",
    // Rank places near the city first, but still allow ones further away
    lat: String(CITY_CENTER.lat),
    lon: String(CITY_CENTER.lng),
    zoom: "11",
    location_bias_scale: "0.5",
  });
  const res = await fetch(`https://photon.komoot.io/api/?${params}`, { signal });
  if (!res.ok) throw new Error("Place search failed");
  const data = await res.json();

  const seen = new Set();
  const items = [];
  for (const feature of data.features || []) {
    const item = toSuggestion(feature);
    if (item && !seen.has(item.label.toLowerCase())) {
      seen.add(item.label.toLowerCase());
      items.push(item);
    }
  }
  return items.slice(0, 6);
}

// The place name for a GPS point, or null when it can't be found
export async function reverseGeocode({ lat, lng }) {
  try {
    const res = await fetch(
      `https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}&lang=en&limit=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.features || []).map(toSuggestion).find(Boolean) || null;
  } catch {
    return null;
  }
}

export async function fetchRoute(points) {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const url =
    `https://router.project-osrm.org/route/v1/driving/${coords}` +
    "?overview=full&geometries=geojson&steps=false";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Routing failed");
  const data = await res.json();
  const route = data.routes && data.routes[0];
  if (data.code !== "Ok" || !route) throw new Error("No route found");

  const durationMin = Math.max(2, Math.round(route.duration / 60));
  let stopOffsetMin = null;
  if (points.length === 3 && route.legs && route.legs[0]) {
    stopOffsetMin = Math.min(
      durationMin - 1,
      Math.max(1, Math.round(route.legs[0].duration / 60))
    );
  }
  return {
    line: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceKm: route.distance / 1000,
    durationMin,
    stopOffsetMin,
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CreateCommute() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [year] = useState(() => new Date().getFullYear());

  // Step 1: route + schedule
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [stop, setStop] = useState("");
  const [showStop, setShowStop] = useState(false);
  const [locating, setLocating] = useState(false);
  // Exact map points for places picked from the suggestions (null = typed by hand)
  const [pickupPoint, setPickupPoint] = useState(null);
  const [stopPoint, setStopPoint] = useState(null);
  const [destPoint, setDestPoint] = useState(null);
  const [outboundTime, setOutboundTime] = useState("09:15");
  const [returnOn, setReturnOn] = useState(true);
  const [returnTime, setReturnTime] = useState("18:30");
  const [days, setDays] = useState(WEEKDAYS);

  // Step 2: vehicle
  const [vehicleType, setVehicleType] = useState("bike");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [manualMinutes, setManualMinutes] = useState("");

  const [route, setRoute] = useState(IDLE_ROUTE);
  const [step, setStep] = useState(1); // 1 | 2 | "done"
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const showToast = (message, severity = "info") =>
    setToast({ open: true, message, severity });

  const comingSoon = (name) => showToast(`${name} is coming soon.`);

  /* ---- load user + any existing commute (so it can be edited) ------ */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const signOutLocally = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/signin", { replace: true });
    };

    const applyUser = (u) => {
      setUser(u);
      setPhotoUrl(toAbsoluteUrl(u.profile_photo_url));
    };

    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        applyUser(JSON.parse(cached));
      } catch {
        // malformed cache: the fetch below repopulates it
      }
    }

    const load = async () => {
      try {
        const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, { headers: authHeaders() });
        if (meRes.status === 401) {
          signOutLocally();
          return;
        }
        if (!meRes.ok) return;
        const me = await meRes.json();
        localStorage.setItem("user", JSON.stringify(me));
        if (me.role === "lift") {
          navigate("/lifttakerhome", { replace: true }); // commutes are for riders
          return;
        }
        applyUser(me);

        const res = await fetch(`${API_BASE_URL}/api/rides/commutes/active`, {
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const active = await res.json();
        if (!active) return;

        setPickup(active.pickup);
        setDestination(active.destination);
        if (active.pickup_lat != null && active.pickup_lng != null)
          setPickupPoint({ lat: active.pickup_lat, lng: active.pickup_lng });
        if (active.destination_lat != null && active.destination_lng != null)
          setDestPoint({ lat: active.destination_lat, lng: active.destination_lng });
        if (active.stop) {
          setStop(active.stop);
          setShowStop(true);
          if (active.stop_lat != null && active.stop_lng != null)
            setStopPoint({ lat: active.stop_lat, lng: active.stop_lng });
        }
        setOutboundTime(active.outbound_time);
        setReturnOn(active.return_enabled);
        if (active.return_time) setReturnTime(active.return_time);
        setDays(active.days);
        setVehicleType(active.vehicle_type);
        setVehicleModel(active.vehicle_model);
        setVehiclePlate(active.vehicle_plate);
        setManualMinutes(String(active.duration_min));
      } catch {
        // backend offline: start with an empty form
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- route preview: find the places, then the road between them -- */
  useEffect(() => {
    const p = pickup.trim();
    const d = destination.trim();
    const s = showStop ? stop.trim() : "";

    if (p.length < 3 || d.length < 3) {
      setRoute(IDLE_ROUTE);
      return undefined;
    }

    let cancelled = false;
    setRoute({ status: "loading" });

    const timer = setTimeout(async () => {
      try {
        const entries = [
          [p, pickupPoint],
          ...(s.length >= 2 ? [[s, stopPoint]] : []),
          [d, destPoint],
        ];
        const points = [];
        for (const [label, known] of entries) {
          // A place picked from the suggestions already has its exact point
          const point = known || (await geocode(label));
          if (cancelled) return;
          if (!point) {
            setRoute({
              status: "error",
              message: `Couldn't find "${label}" on the map. Try a nearby landmark.`,
            });
            return;
          }
          points.push(point);
        }

        const result = await fetchRoute(points);
        if (cancelled) return;
        setRoute({
          status: "ready",
          start: points[0],
          stop: points.length === 3 ? points[1] : null,
          end: points[points.length - 1],
          ...result,
        });
      } catch {
        if (!cancelled) {
          setRoute({
            status: "error",
            message: "Route preview is unavailable right now. You can still continue.",
          });
        }
      }
    }, 900);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pickup, destination, stop, showStop, pickupPoint, stopPoint, destPoint]);

  /* ---- derived values ---------------------------------------------- */
  const routeReady = route.status === "ready";
  const durationMin = routeReady ? route.durationMin : parseInt(manualMinutes, 10) || 0;
  const co2PerMonth = Math.round(KG_CO2_PER_JOURNEY * days.length * WEEKS_PER_MONTH);
  const dayLabels = useMemo(
    () => DAYS.filter(([code]) => days.includes(code)).map(([, label]) => label),
    [days]
  );

  /* ---- handlers ----------------------------------------------------- */
  const swapPlaces = () => {
    setPickup(destination);
    setDestination(pickup);
    setPickupPoint(destPoint);
    setDestPoint(pickupPoint);
  };

  // Typing by hand forgets any point picked earlier; picking a suggestion sets it
  const changePickup = (value) => {
    setPickup(value);
    setPickupPoint(null);
  };
  const pickPickup = (item) => {
    setPickup(item.label);
    setPickupPoint(item.point);
  };
  const changeStop = (value) => {
    setStop(value);
    setStopPoint(null);
  };
  const pickStop = (item) => {
    setStop(item.label);
    setStopPoint(item.point);
  };
  const changeDestination = (value) => {
    setDestination(value);
    setDestPoint(null);
  };
  const pickDestination = (item) => {
    setDestination(item.label);
    setDestPoint(item.point);
  };

  // "Use current location": ask the device for its position, then name the spot
  const locateMe = () => {
    if (locating) return;
    if (!navigator.geolocation) {
      showToast("This browser can't share your location. Please type your pickup.", "warning");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const point = { lat: coords.latitude, lng: coords.longitude };
        const found = await reverseGeocode(point);

        setPickup(
          found
            ? found.label
            : `Current location (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`
        );
        setPickupPoint(point);
        setLocating(false);

        if (!found) {
          showToast(
            "Got your location but couldn't find its name. Change the pickup to a landmark lift takers will recognise.",
            "info"
          );
        } else if (coords.accuracy > 500) {
          showToast(
            `Your device could only find you roughly (within about ${Math.round(coords.accuracy)} m). Check the pickup name is right.`,
            "warning"
          );
        }
      },
      (error) => {
        setLocating(false);
        const reasons = {
          1: "Location access is blocked. Allow it from the lock icon in your browser's address bar, then try again.",
          2: "Your device couldn't work out its location. Please type your pickup.",
          3: "Finding your location took too long. Please try again.",
        };
        showToast(reasons[error.code] || "Couldn't get your location.", "warning");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const toggleDay = (code) =>
    setDays((current) =>
      current.includes(code) ? current.filter((d) => d !== code) : [...current, code]
    );

  const removeStop = () => {
    setStop("");
    setStopPoint(null);
    setShowStop(false);
  };

  const goToReview = () => {
    const p = pickup.trim();
    const d = destination.trim();
    const s = showStop ? stop.trim() : "";
    const fail = (message) => setFormError(message);

    if (p.length < 3) return fail("Enter your pickup / starting point.");
    if (d.length < 3) return fail("Enter your destination.");
    if (p.toLowerCase() === d.toLowerCase())
      return fail("Pickup and destination must be different.");
    if (s && (s.length < 2 || [p.toLowerCase(), d.toLowerCase()].includes(s.toLowerCase())))
      return fail("The stop must be a different place from your pickup and destination.");
    if (!outboundTime) return fail("Choose your morning outbound time.");
    if (returnOn) {
      if (!returnTime) return fail("Choose your evening return time or turn it off.");
      if (toMinutes(returnTime) <= toMinutes(outboundTime))
        return fail("Your evening return must be later than your morning outbound.");
    }
    if (!days.length) return fail("Pick at least one day to repeat on.");

    setFormError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirm = async () => {
    if (submitting) return;
    const fail = (message) => setFormError(message);

    if (vehicleModel.trim().length < 2) return fail("Enter your vehicle model.");
    if (vehiclePlate.trim().length < 2) return fail("Enter your vehicle registration number.");
    if (durationMin < 2 || durationMin > 300)
      return fail("Enter your one-way travel time (2 to 300 minutes).");

    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rides/commutes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          pickup: pickup.trim(),
          destination: destination.trim(),
          stop: showStop && stop.trim() ? stop.trim() : null,
          pickup_lat: routeReady ? route.start.lat : null,
          pickup_lng: routeReady ? route.start.lng : null,
          destination_lat: routeReady ? route.end.lat : null,
          destination_lng: routeReady ? route.end.lng : null,
          stop_lat: routeReady && route.stop ? route.stop.lat : null,
          stop_lng: routeReady && route.stop ? route.stop.lng : null,
          distance_km: routeReady ? Math.max(0.1, Math.round(route.distanceKm * 10) / 10) : null,
          duration_min: durationMin,
          stop_offset_min: routeReady && route.stopOffsetMin ? route.stopOffsetMin : null,
          outbound_time: outboundTime,
          return_enabled: returnOn,
          return_time: returnOn ? returnTime : null,
          days,
          seats: 1,
          vehicle_type: vehicleType,
          vehicle_model: vehicleModel.trim(),
          vehicle_plate: vehiclePlate.trim(),
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/signin", { replace: true });
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        fail(errorMessage(data, "Couldn't save your commute. Please try again."));
        return;
      }
      setStep("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      fail("Unable to connect to server. Please make sure the backend is running.");
    } finally {
      setSubmitting(false);
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
        .cc-input::placeholder { color: #7b8294; font-weight: 500; }
        .cc-focus:focus-within { box-shadow: 0 0 0 2px rgba(0,125,115,0.4); }
        .cc-btn:focus-visible { outline: 2px solid ${tealBright}; outline-offset: 2px; }
        @media (max-width: 1000px) {
          .cc-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .cc-nav { display: none !important; }
          .cc-label { display: none !important; }
        }
        @media (max-width: 640px) {
          .cc-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .cc-two { grid-template-columns: minmax(0, 1fr) !important; }
          .cc-three { grid-template-columns: minmax(0, 1fr) !important; }
          .cc-subbar-right { display: none !important; }
        }
      `}</style>

      {/* ============================ HEADER ============================ */}
      <Box
        component="header"
        style={{ background: "#fff", boxShadow: "0 2px 14px rgba(30,35,90,0.07)", position: "sticky", top: 0, zIndex: 30 }}
      >
        <Box
          className="cc-pad"
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            height: 68,
            padding: "0 32px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Box style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Box style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Box
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: tealBright,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldOutlinedIcon style={{ color: "#fff", fontSize: 20 }} />
              </Box>
              <Typography style={{ fontSize: 18, fontWeight: 800 }}>SafeRoute</Typography>
            </Box>

            <Box
              className="cc-btn cc-label"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/home")}
              onKeyDown={activateOnKey(() => navigate("/home"))}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
            >
              <ArrowBackIcon style={{ fontSize: 15 }} />
              Dashboard
            </Box>
            <Typography
              className="cc-label"
              style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.8px", color: muted }}
            >
              CREATE YOUR COMMUTE
            </Typography>
          </Box>

          <Box className="cc-nav" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Typography style={{ fontSize: 16, fontWeight: 600, color: tealBright }}>
              Create Commute
            </Typography>
            {["My Commutes", "Safety Shield", "Green Miles"].map((label) => (
              <Box
                key={label}
                className="cc-btn"
                role="button"
                tabIndex={0}
                onClick={() => comingSoon(label)}
                onKeyDown={activateOnKey(() => comingSoon(label))}
                style={{ fontSize: 16, fontWeight: 600, cursor: "pointer", color: "#2b3347" }}
              >
                {label}
              </Box>
            ))}
          </Box>

          <ProfileMenu user={user} photoUrl={photoUrl} variant="stacked" />
        </Box>
      </Box>

      {/* ========================== SUB BAR ============================ */}
      <Box style={{ background: "#fff", borderBottom: "1px solid #eceef8" }}>
        <Box
          className="cc-pad"
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "14px 32px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Box style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <Box
              className="cc-btn"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/home")}
              onKeyDown={activateOnKey(() => navigate("/home"))}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              <ArrowBackIcon style={{ fontSize: 16 }} />
              Dashboard
            </Box>
            <span style={{ color: "#c3c8da" }} aria-hidden="true">/</span>
            <Typography component="h1" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.3px" }}>
              Create Your Commute
            </Typography>
            <Chip
              icon={<AltRouteOutlinedIcon style={{ fontSize: 14, color: indigo }} />}
              label="Rider Commute Setup"
              size="small"
              style={{ background: "#e4e6fd", color: indigo, fontWeight: 600, fontSize: 11.5 }}
            />
          </Box>

          <Box className="cc-subbar-right" style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 13, fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: teal }}>
              <Box style={{ width: 7, height: 7, borderRadius: "50%", background: tealBright }} />
              Corridor Auto-Matching Active
            </span>
            <Box
              className="cc-btn"
              role="button"
              tabIndex={0}
              onClick={() => setGuidelinesOpen(true)}
              onKeyDown={activateOnKey(() => setGuidelinesOpen(true))}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#2b3347" }}
            >
              <HelpOutlineOutlinedIcon style={{ fontSize: 17 }} />
              Route Guidelines
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ============================= MAIN ============================= */}
      <Box component="main" style={{ flex: 1 }}>
        <Box
          className="cc-pad cc-grid"
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "32px 32px 0",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ------------------------ LEFT COLUMN ------------------------ */}
          <Box style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
            <Box style={{ ...cardStyle, padding: 24 }}>
              {step === 1 && (
                <StepOne
                  {...{
                    pickup, changePickup, pickPickup, destination, changeDestination, pickDestination,
                    stop, changeStop, pickStop, locateMe, locating,
                    showStop, setShowStop, removeStop, swapPlaces,
                    outboundTime, setOutboundTime, returnOn, setReturnOn,
                    returnTime, setReturnTime, days, setDays, toggleDay,
                    formError, goToReview,
                  }}
                />
              )}

              {step === 2 && (
                <StepTwo
                  {...{
                    pickup, destination, stop: showStop ? stop.trim() : "",
                    outboundTime, returnOn, returnTime, dayLabels,
                    route, routeReady, durationMin,
                    manualMinutes, setManualMinutes,
                    vehicleType, setVehicleType, vehicleModel, setVehicleModel,
                    vehiclePlate, setVehiclePlate,
                    formError, submitting, handleConfirm,
                    onBack: () => {
                      setFormError("");
                      setStep(1);
                    },
                  }}
                />
              )}

              {step === "done" && (
                <Done
                  pickup={pickup.trim()}
                  destination={destination.trim()}
                  dayLabels={dayLabels}
                  onDashboard={() => navigate("/home")}
                  onEdit={() => setStep(1)}
                />
              )}
            </Box>

            {/* CO2 savings */}
            <Box
              style={{
                ...cardStyle,
                borderRadius: 18,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Box
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "#e4e6fd",
                  color: "#2f3550",
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                CO₂
              </Box>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Typography style={{ fontSize: 16, fontWeight: 600 }}>CO₂ Savings Impact</Typography>
                <Typography style={{ fontSize: 13, color: muted }}>
                  Avg. {KG_CO2_PER_JOURNEY} kg offset per pooled journey
                </Typography>
              </Box>
              <Typography style={{ fontSize: 20, fontWeight: 700, color: teal, whiteSpace: "nowrap" }}>
                ~{co2PerMonth} kg/mo
              </Typography>
            </Box>
          </Box>

          {/* ------------------------ RIGHT COLUMN ----------------------- */}
          <Box style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <Box style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              <Box style={{ height: 640 }}>
                <RouteMap
                  start={routeReady ? route.start : null}
                  stop={routeReady ? route.stop : null}
                  end={routeReady ? route.end : null}
                  line={routeReady ? route.line : null}
                >
                  <RouteInfoCard route={route} />

                  {routeReady && (
                    <Box
                      style={{
                        position: "absolute",
                        left: 16,
                        bottom: 40,
                        zIndex: 1000,
                        background: "#fff",
                        borderRadius: 20,
                        padding: "8px 16px",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#2b3347",
                        boxShadow: "0 2px 10px rgba(30,35,90,0.18)",
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        maxWidth: "calc(100% - 32px)",
                      }}
                    >
                      <ShieldOutlinedIcon style={{ fontSize: 16, color: tealBright }} />
                      AIS-140 SafeCorridor Verified • 200m Geo-Fence Active
                    </Box>
                  )}
                </RouteMap>
              </Box>

              <Box
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#2b3347",
                  borderTop: "1px solid #eceef8",
                }}
              >
                <Box style={{ width: 12, height: 5, borderRadius: 3, background: "#0b7a70" }} />
                Primary Commute Corridor
              </Box>
            </Box>

            <Box className="cc-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
              <InfoTile icon={<TwoWheelerOutlinedIcon />} title="Dual Helmet" text="Selfie check required" />
              <InfoTile icon={<BadgeOutlinedIcon />} title="Govt ID Verified" text="100% Aadhaar pooling" />
              <InfoTile icon={<SupportAgentOutlinedIcon />} title="24/7 Police SOS" text="Direct PCR link enabled" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ============================ FOOTER ============================ */}
      <Box component="footer" style={{ background: "#eff0fa", marginTop: 40 }}>
        <Box
          className="cc-pad"
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "20px 32px",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 12.5,
            color: "#2b3347",
          }}
        >
          <Box style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: teal }}>
              <VerifiedUserOutlinedIcon style={{ fontSize: 16 }} />
              ISO 27001 &amp; Aadhaar Certified
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ShieldOutlinedIcon style={{ fontSize: 15 }} />
              Dual-Helmet Verification Mandatory
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <SupportAgentOutlinedIcon style={{ fontSize: 16 }} />
              24/7 Police Dispatch SOS Linked
            </span>
          </Box>
          <Box style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
            <span>Safety Guidelines</span>
            <span>Trip Cover</span>
            <span>© {year} SafeRoute Mobility</span>
          </Box>
        </Box>
      </Box>

      {/* ======================== GUIDELINES DIALOG ===================== */}
      <Dialog
        open={guidelinesOpen}
        onClose={() => setGuidelinesOpen(false)}
        slotProps={{ paper: { style: { borderRadius: 20, maxWidth: 440, width: "100%", margin: 16 } } }}
      >
        <Box style={{ padding: "24px 24px 20px" }}>
          <Typography style={{ fontSize: 19, fontWeight: 800 }}>Route Guidelines</Typography>
          <Box style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {[
              "Use landmarks lift takers can find easily, like gates, junctions and stations.",
              "Keep the same pickup point each day so regular commuters can plan around you.",
              "Only the places you list are used to match people to your trip.",
              "Carry a spare helmet for your pillion and keep your ID verified.",
            ].map((tip) => (
              <Box key={tip} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5 }}>
                <CheckCircleIcon style={{ fontSize: 18, color: tealBright, flexShrink: 0, marginTop: 2 }} />
                {tip}
              </Box>
            ))}
          </Box>
          <Box style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <Button
              onClick={() => setGuidelinesOpen(false)}
              style={{ textTransform: "none", fontWeight: 700, color: teal }}
            >
              Got it
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
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
/*  Step 1: route + schedule (the design)                              */
/* ------------------------------------------------------------------ */

function StepOne({
  pickup, changePickup, pickPickup, destination, changeDestination, pickDestination,
  stop, changeStop, pickStop, locateMe, locating,
  showStop, setShowStop, removeStop, swapPlaces,
  outboundTime, setOutboundTime, returnOn, setReturnOn,
  returnTime, setReturnTime, days, setDays, toggleDay,
  formError, goToReview,
}) {
  const weekdaysActive = sameDays(days, WEEKDAYS);
  const allActive = sameDays(days, ALL_DAYS);

  return (
    <>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <Typography component="h2" style={{ fontSize: 25, fontWeight: 700, letterSpacing: "-0.4px" }}>
          Where are you going?
        </Typography>
        <Chip
          label="Step 1 of 2"
          size="small"
          style={{ background: "#e4e6fd", color: indigo, fontWeight: 600, fontSize: 11.5 }}
        />
      </Box>
      <Typography style={{ fontSize: 14.5, color: muted, lineHeight: 1.5, marginTop: 8 }}>
        Set your daily commute path to receive verified same-gender passenger
        requests along your way.
      </Typography>

      {/* pickup */}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginTop: 22,
          marginBottom: 8,
        }}
      >
        <Typography style={{ ...fieldLabel, marginBottom: 0 }}>
          Pickup / Starting Point *
        </Typography>
        <Box
          className="cc-btn"
          role="button"
          tabIndex={0}
          aria-disabled={locating}
          onClick={locateMe}
          onKeyDown={activateOnKey(locateMe)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: teal,
            fontSize: 13,
            fontWeight: 700,
            cursor: locating ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {locating ? (
            <CircularProgress size={14} style={{ color: tealBright }} />
          ) : (
            <MyLocationOutlinedIcon style={{ fontSize: 17 }} />
          )}
          {locating ? "Locating…" : "Use current location"}
        </Box>
      </Box>
      <PlaceSearchField
        label="Pickup / starting point"
        value={pickup}
        onChange={changePickup}
        onPick={pickPickup}
        placeholder="e.g. PNT Naka, Ranjhi Sub-Post"
        leading={
          <Box
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: `3px solid ${tealBright}`,
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          />
        }
      />

      <Connector>
        <IconButton
          aria-label="Swap pickup and destination"
          onClick={swapPlaces}
          style={{ width: 36, height: 36, background: "#fff", boxShadow: "0 2px 8px rgba(30,35,90,0.15)", color: dark }}
        >
          <SwapVertOutlinedIcon style={{ fontSize: 19 }} />
        </IconButton>
      </Connector>

      {showStop && (
        <>
          <Typography style={fieldLabel}>Stop along the way</Typography>
          <PlaceSearchField
            label="Stop along the corridor"
            value={stop}
            onChange={changeStop}
            onPick={pickStop}
            placeholder="e.g. Ranjhi Transit Junction"
            leading={<AltRouteOutlinedIcon style={{ fontSize: 20, color: "#c28a00", flexShrink: 0 }} />}
            maxLength={100}
          />
          <Connector />
        </>
      )}

      {/* destination */}
      <Typography style={fieldLabel}>Destination *</Typography>
      <PlaceSearchField
        label="Destination"
        value={destination}
        onChange={changeDestination}
        onPick={pickDestination}
        placeholder="e.g. Madan Mahal Station, South Gate"
        leading={<LocationOnIcon style={{ fontSize: 22, color: "#d93025", flexShrink: 0 }} />}
      />

      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 16 }}>
        <Box
          className="cc-btn"
          role="button"
          tabIndex={0}
          onClick={() => (showStop ? removeStop() : setShowStop(true))}
          onKeyDown={activateOnKey(() => (showStop ? removeStop() : setShowStop(true)))}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, color: teal, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
        >
          <AddCircleOutlinedIcon style={{ fontSize: 18, transform: showStop ? "rotate(45deg)" : "none" }} />
          {showStop ? "Remove stop" : "+ Add stop along corridor"}
        </Box>
        <Typography style={{ fontSize: 12.5, color: muted, textAlign: "right", wordBreak: "break-word" }}>
          {showStop && stop.trim() ? `Via ${stop.trim()}` : "Direct route"}
        </Typography>
      </Box>

      {/* schedule */}
      <Box style={{ background: "#f2f3fc", borderRadius: 20, padding: 20, marginTop: 24 }}>
        <Box style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CalendarMonthOutlinedIcon style={{ color: teal, fontSize: 22 }} />
          <Typography style={{ fontSize: 17.5, fontWeight: 600 }}>When do you usually travel?</Typography>
        </Box>

        <Box className="cc-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
          <TimeTile
            icon={<WbSunnyOutlinedIcon style={{ fontSize: 15 }} />}
            label="Morning Outbound"
            value={outboundTime}
            onChange={setOutboundTime}
          />
          <TimeTile
            icon={<NightsStayOutlinedIcon style={{ fontSize: 15 }} />}
            label="Evening Return"
            value={returnTime}
            onChange={setReturnTime}
            disabled={!returnOn}
            action={
              <Switch
                size="small"
                checked={returnOn}
                onChange={(e) => setReturnOn(e.target.checked)}
                slotProps={{ input: { "aria-label": "Offer an evening return trip" } }}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: teal,
                    opacity: 1,
                  },
                }}
              />
            }
          />
        </Box>

        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
          <Typography style={{ fontSize: 13.5, fontWeight: 600 }}>Repeat on days</Typography>
          <Box style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, fontWeight: 600 }}>
            <Box
              className="cc-btn"
              role="button"
              tabIndex={0}
              onClick={() => setDays(WEEKDAYS)}
              onKeyDown={activateOnKey(() => setDays(WEEKDAYS))}
              style={{ cursor: "pointer", color: weekdaysActive ? teal : muted, fontWeight: weekdaysActive ? 800 : 600 }}
            >
              Weekdays (Mon-Fri)
            </Box>
            <span style={{ color: "#c3c8da" }} aria-hidden="true">•</span>
            <Box
              className="cc-btn"
              role="button"
              tabIndex={0}
              onClick={() => setDays(ALL_DAYS)}
              onKeyDown={activateOnKey(() => setDays(ALL_DAYS))}
              style={{ cursor: "pointer", color: allActive ? teal : muted, fontWeight: allActive ? 800 : 600 }}
            >
              All Days
            </Box>
          </Box>
        </Box>

        <Box style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {DAYS.map(([code, label]) => {
            const on = days.includes(code);
            return (
              <Box
                key={code}
                className="cc-btn"
                role="button"
                tabIndex={0}
                aria-pressed={on}
                onClick={() => toggleDay(code)}
                onKeyDown={activateOnKey(() => toggleDay(code))}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  userSelect: "none",
                  background: on ? teal : "#e6e8f7",
                  color: on ? "#fff" : "#4b5468",
                }}
              >
                {label}
              </Box>
            );
          })}
        </Box>

        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
          <Typography style={{ fontSize: 13.5, fontWeight: 600 }}>Available passenger seats</Typography>
          <Typography style={{ fontSize: 12.5, color: muted }}>Two-wheeler pillion</Typography>
        </Box>
        <Box className="cc-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 10 }}>
          <Box
            role="radio"
            aria-checked="true"
            style={{
              border: `2px solid ${teal}`,
              borderRadius: 14,
              background: "#fff",
              padding: "14px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TwoWheelerOutlinedIcon style={{ color: dark }} />
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Typography style={{ fontSize: 14.5, fontWeight: 700 }}>1 Commuter</Typography>
              <Typography style={{ fontSize: 12, color: teal, fontWeight: 600 }}>Standard Pillion</Typography>
            </Box>
            <CheckCircleIcon style={{ color: teal }} />
          </Box>

          <Box
            role="radio"
            aria-checked="false"
            aria-disabled="true"
            style={{
              borderRadius: 14,
              background: "#eceef8",
              padding: "14px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: 0.85,
            }}
          >
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Typography style={{ fontSize: 14.5, fontWeight: 700, color: "#7b8294" }}>2+ Commuters</Typography>
              <Typography style={{ fontSize: 12, color: "#7b8294" }}>4-Wheeler only</Typography>
            </Box>
            <Chip
              icon={<LockOutlinedIcon style={{ fontSize: 12 }} />}
              label="Locked"
              size="small"
              style={{ height: 20, fontSize: 10.5, fontWeight: 600, background: "#dfe2f2", color: "#6b7388" }}
            />
          </Box>
        </Box>
      </Box>

      {/* privacy */}
      <Box style={{ background: fieldBg, borderRadius: 18, padding: 18, marginTop: 22, display: "flex", gap: 14 }}>
        <VerifiedUserOutlinedIcon style={{ color: teal, fontSize: 24, flexShrink: 0 }} />
        <Box>
          <Typography style={{ fontSize: 14, fontWeight: 700 }}>
            Strict Privacy &amp; Aadhaar Corridor Lock
          </Typography>
          <Typography style={{ fontSize: 13.5, color: muted, lineHeight: 1.65, marginTop: 6 }}>
            Your route coordinates are strictly used to find compatible lift
            requests along your daily path. Only government-verified commuters
            matching your exact schedule corridor will be connected.
          </Typography>
        </Box>
      </Box>

      {formError && (
        <Alert severity="error" role="alert" style={{ marginTop: 20, borderRadius: 12 }}>
          {formError}
        </Alert>
      )}

      <Button
        fullWidth
        disableElevation
        onClick={goToReview}
        endIcon={<ArrowForwardIcon />}
        style={{
          marginTop: 22,
          height: 58,
          borderRadius: 14,
          background: teal,
          color: "#fff",
          textTransform: "none",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Continue to Schedule Review
      </Button>
      <Typography style={{ fontSize: 12.5, color: muted, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
        You can modify, pause, or remove route broadcasting anytime from your
        rider dashboard.
      </Typography>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: schedule review + vehicle                                  */
/* ------------------------------------------------------------------ */

function StepTwo({
  pickup, destination, stop, outboundTime, returnOn, returnTime, dayLabels,
  route, routeReady, durationMin, manualMinutes, setManualMinutes,
  vehicleType, setVehicleType, vehicleModel, setVehicleModel,
  vehiclePlate, setVehiclePlate,
  formError, submitting, handleConfirm, onBack,
}) {
  const waiting = route.status === "loading";

  return (
    <>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <Typography component="h2" style={{ fontSize: 25, fontWeight: 700, letterSpacing: "-0.4px" }}>
          Review your schedule
        </Typography>
        <Chip
          label="Step 2 of 2"
          size="small"
          style={{ background: "#e4e6fd", color: indigo, fontWeight: 600, fontSize: 11.5 }}
        />
      </Box>
      <Typography style={{ fontSize: 14.5, color: muted, lineHeight: 1.5, marginTop: 8 }}>
        Check your commute and add your vehicle details. Lift takers see these
        before they board.
      </Typography>

      <Box style={{ background: "#f2f3fc", borderRadius: 18, padding: "6px 18px", marginTop: 20 }}>
        <SummaryRow label="Route">
          {pickup} → {stop ? `${stop} → ` : ""}
          {destination}
        </SummaryRow>
        <SummaryRow label="Trip">
          {routeReady
            ? `${route.distanceKm.toFixed(1)} km · about ${route.durationMin} min · ≈ ₹${estimateFare(route.durationMin)} per lift`
            : durationMin >= 2
            ? `About ${durationMin} min · ≈ ₹${estimateFare(durationMin)} per lift`
            : "Travel time not set"}
        </SummaryRow>
        <SummaryRow label="Morning outbound">{formatTime(outboundTime)}</SummaryRow>
        <SummaryRow label="Evening return">{returnOn ? formatTime(returnTime) : "Not offered"}</SummaryRow>
        <SummaryRow label="Repeats on">{dayLabels.join(", ")}</SummaryRow>
        <SummaryRow label="Seats" last>
          1 commuter (standard pillion)
        </SummaryRow>
      </Box>

      <Typography style={{ ...fieldLabel, marginTop: 22 }}>Vehicle type</Typography>
      <Box role="group" aria-label="Vehicle type" style={{ display: "flex", gap: 10 }}>
        {[
          ["bike", "Bike"],
          ["scooter", "Scooter"],
        ].map(([value, label]) => (
          <Box
            key={value}
            className="cc-btn"
            role="button"
            tabIndex={0}
            aria-pressed={vehicleType === value}
            onClick={() => setVehicleType(value)}
            onKeyDown={activateOnKey(() => setVehicleType(value))}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "11px 0",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              background: vehicleType === value ? teal : fieldBg,
              color: vehicleType === value ? "#fff" : "#2b3347",
            }}
          >
            {label}
          </Box>
        ))}
      </Box>

      <Typography style={{ ...fieldLabel, marginTop: 16 }}>Vehicle model *</Typography>
      <PlaceField
        label="Vehicle model"
        value={vehicleModel}
        onChange={setVehicleModel}
        placeholder="e.g. Bajaj Pulsar NS200"
        maxLength={40}
        clearable={false}
      />

      <Typography style={{ ...fieldLabel, marginTop: 16 }}>Registration number *</Typography>
      <PlaceField
        label="Vehicle registration number"
        value={vehiclePlate}
        onChange={(v) => setVehiclePlate(v.toUpperCase())}
        placeholder="e.g. MP 20 ZB 4821"
        maxLength={40}
        clearable={false}
      />

      {!routeReady && !waiting && (
        <>
          <Typography style={{ ...fieldLabel, marginTop: 16 }}>One-way travel time (minutes) *</Typography>
          <Box className="cc-focus" style={{ background: fieldBg, borderRadius: 12, padding: "14px 16px" }}>
            <input
              className="cc-input"
              type="number"
              min={2}
              max={300}
              aria-label="One-way travel time in minutes"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(e.target.value)}
              placeholder="We couldn't measure your route. Enter it here."
              style={inputReset}
            />
          </Box>
        </>
      )}

      {formError && (
        <Alert severity="error" role="alert" style={{ marginTop: 20, borderRadius: 12 }}>
          {formError}
        </Alert>
      )}

      <Box style={{ display: "flex", gap: 12, marginTop: 22 }}>
        <Button
          onClick={onBack}
          disabled={submitting}
          startIcon={<ArrowBackIcon />}
          style={{
            height: 56,
            borderRadius: 14,
            background: "#e6e8f7",
            color: "#2b3347",
            textTransform: "none",
            fontSize: 15,
            fontWeight: 700,
            padding: "0 22px",
          }}
        >
          Edit
        </Button>
        <Button
          fullWidth
          disableElevation
          disabled={submitting || waiting}
          onClick={handleConfirm}
          style={{
            height: 56,
            borderRadius: 14,
            background: submitting || waiting ? "#7fb3ad" : teal,
            color: "#fff",
            textTransform: "none",
            fontSize: 16.5,
            fontWeight: 700,
          }}
        >
          {submitting ? (
            <CircularProgress size={22} style={{ color: "#fff" }} />
          ) : waiting ? (
            "Measuring your route…"
          ) : (
            "Confirm & Start Broadcasting"
          )}
        </Button>
      </Box>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Done                                                               */
/* ------------------------------------------------------------------ */

function Done({ pickup, destination, dayLabels, onDashboard, onEdit }) {
  return (
    <Box style={{ textAlign: "center", padding: "20px 4px 8px" }} role="status">
      <CheckCircleIcon style={{ fontSize: 60, color: tealBright }} />
      <Typography component="h2" style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>
        Your commute is live
      </Typography>
      <Typography style={{ fontSize: 14.5, color: muted, lineHeight: 1.6, marginTop: 10 }}>
        Lift takers travelling from <strong>{pickup}</strong> to{" "}
        <strong>{destination}</strong> on {dayLabels.join(", ")} can now find
        you.
      </Typography>
      <Button
        fullWidth
        disableElevation
        onClick={onDashboard}
        style={{
          marginTop: 24,
          height: 54,
          borderRadius: 14,
          background: teal,
          color: "#fff",
          textTransform: "none",
          fontSize: 16.5,
          fontWeight: 700,
        }}
      >
        Back to Dashboard
      </Button>
      <Button
        onClick={onEdit}
        style={{ marginTop: 8, textTransform: "none", fontWeight: 700, color: teal }}
      >
        Edit this commute
      </Button>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

const fieldLabel = {
  fontSize: 13.5,
  fontWeight: 600,
  color: dark,
  marginBottom: 8,
};

const inputReset = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontSize: 17,
  fontWeight: 600,
  color: dark,
  fontFamily: "inherit",
  padding: 0,
};

/**
 * A place input that suggests matching places while you type, like a map
 * search box. Picking one fills the field and hands back its exact map point.
 *
 * `query` is only set by typing, so a value filled in from outside (editing a
 * saved commute, swapping places) never triggers a search.
 */
function PlaceSearchField({ label, value, onChange, onPick, placeholder, leading, maxLength = 200 }) {
  const listId = useId();
  const requestId = useRef(0);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [result, setResult] = useState({ status: "idle", items: [] });

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_SUGGEST_CHARS) {
      setResult({ status: "idle", items: [] });
      return undefined;
    }

    const id = ++requestId.current;
    const controller = new AbortController();
    setResult((r) => ({ ...r, status: "loading" }));

    const timer = setTimeout(async () => {
      try {
        const items = await searchPlaces(q, controller.signal);
        if (id === requestId.current) {
          setResult({ status: "done", items });
          setActive(-1);
        }
      } catch (err) {
        if (err.name !== "AbortError" && id === requestId.current) {
          setResult({ status: "error", items: [] });
        }
      }
    }, 350); // wait for a pause in typing

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Only while the field still holds what was typed: a value set from outside
  // (current location, swap, a picked suggestion) shouldn't reopen an old list
  const show = open && query === value && query.trim().length >= MIN_SUGGEST_CHARS;
  const { status, items } = result;

  const choose = (item) => {
    onPick(item);
    setQuery("");
    setOpen(false);
    setActive(-1);
    setResult({ status: "idle", items: [] });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!show || !items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(items[active]);
    }
  };

  const note = (text) => (
    <Typography style={{ fontSize: 13, color: muted, padding: "10px 12px", lineHeight: 1.5 }}>
      {text}
    </Typography>
  );

  return (
    <Box style={{ position: "relative" }}>
      <Box
        className="cc-focus"
        style={{
          background: fieldBg,
          borderRadius: 12,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {leading}
        <input
          className="cc-input"
          role="combobox"
          aria-label={label}
          aria-expanded={show}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          style={inputReset}
        />
        {value && (
          <IconButton
            aria-label={`Clear ${label.toLowerCase()}`}
            onClick={() => {
              onChange("");
              setQuery("");
              setResult({ status: "idle", items: [] });
            }}
            size="small"
            style={{ color: "#4b5468", padding: 2 }}
          >
            <CancelOutlinedIcon style={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>

      {show && (
        <Box
          id={listId}
          role="listbox"
          aria-label={`${label} suggestions`}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 40,
            background: "#fff",
            borderRadius: 14,
            padding: 6,
            maxHeight: 300,
            overflowY: "auto",
            boxShadow: "0 10px 30px rgba(30,35,90,0.22)",
            border: "1px solid #e4e6f3",
          }}
        >
          {items.map((item, i) => (
            <Box
              key={item.key}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown (not click) so the input doesn't lose focus first
              onMouseDown={(e) => {
                e.preventDefault();
                choose(item);
              }}
              onMouseEnter={() => setActive(i)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                background: i === active ? fieldBg : "transparent",
              }}
            >
              <LocationOnIcon style={{ fontSize: 20, color: "#7b8294", marginTop: 2, flexShrink: 0 }} />
              <Box style={{ minWidth: 0 }}>
                <Typography style={{ fontSize: 14.5, fontWeight: 700, wordBreak: "break-word" }}>
                  {item.title}
                </Typography>
                {item.subtitle && (
                  <Typography style={{ fontSize: 12.5, color: muted, wordBreak: "break-word" }}>
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}

          {status === "loading" && !items.length && (
            <Box style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
              <CircularProgress size={16} style={{ color: tealBright }} />
              <Typography style={{ fontSize: 13, color: muted }}>Searching places…</Typography>
            </Box>
          )}
          {status === "done" && !items.length &&
            note(`No places found for "${query.trim()}". Try a nearby landmark or a shorter name.`)}
          {status === "error" &&
            note("Suggestions are unavailable right now. You can still type the place and continue.")}
        </Box>
      )}
    </Box>
  );
}

function PlaceField({ label, value, onChange, placeholder, leading, maxLength = 200, clearable = true }) {
  return (
    <Box
      className="cc-focus"
      style={{
        background: fieldBg,
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {leading}
      <input
        className="cc-input"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        style={inputReset}
      />
      {clearable && value && (
        <IconButton
          aria-label={`Clear ${label.toLowerCase()}`}
          onClick={() => onChange("")}
          size="small"
          style={{ color: "#4b5468", padding: 2 }}
        >
          <CancelOutlinedIcon style={{ fontSize: 20 }} />
        </IconButton>
      )}
    </Box>
  );
}

// The thin vertical line between two places, with an optional button on the right
function Connector({ children }) {
  return (
    <Box style={{ position: "relative", height: 44, display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 8 }}>
      <Box style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 2, background: "#d5d9ee" }} />
      {children}
    </Box>
  );
}

function TimeTile({ icon, label, value, onChange, disabled, action }) {
  return (
    <Box
      className="cc-focus"
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "12px 14px",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 24 }}>
        <Typography
          component="div"
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4b5468" }}
        >
          {icon}
          {label}
        </Typography>
        {action}
      </Box>
      <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 4 }}>
        <input
          className="cc-input"
          type="time"
          aria-label={label}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputReset, fontSize: 20, fontWeight: 700, width: "auto", minWidth: 0 }}
        />
        <span
          style={{
            background: "#eceef8",
            color: "#6b7388",
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 10.5,
            fontWeight: 600,
          }}
        >
          IST
        </span>
      </Box>
    </Box>
  );
}

function SummaryRow({ label, children, last }) {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "13px 0",
        borderBottom: last ? "none" : "1px solid #e1e4f3",
      }}
    >
      <Typography style={{ fontSize: 13, color: muted, flexShrink: 0 }}>{label}</Typography>
      <Typography style={{ fontSize: 14, fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>
        {children}
      </Typography>
    </Box>
  );
}

function InfoTile({ icon, title, text }) {
  return (
    <Box
      style={{
        ...cardStyle,
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Box style={{ color: teal, display: "flex" }}>{icon}</Box>
      <Box style={{ minWidth: 0 }}>
        <Typography style={{ fontSize: 13.5, fontWeight: 700 }}>{title}</Typography>
        <Typography style={{ fontSize: 12.5, color: muted }}>{text}</Typography>
      </Box>
    </Box>
  );
}

// Route summary card drawn on top of the map
function RouteInfoCard({ route }) {
  const ready = route.status === "ready";

  return (
    <Box
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 1000,
        width: 310,
        maxWidth: "calc(100% - 90px)",
        background: "#fff",
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 6px 24px rgba(30,35,90,0.2)",
        boxSizing: "border-box",
      }}
    >
      {ready ? (
        <>
          <Box
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#cdf3ee",
              color: "#00574f",
              borderRadius: 14,
              padding: "5px 12px",
              fontSize: 11.5,
              fontWeight: 700,
            }}
          >
            <Box style={{ width: 8, height: 8, borderRadius: "50%", background: tealBright }} />
            Optimal Route Detected
          </Box>

          <Box style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            <Box style={{ background: "#f4f5fd", borderRadius: 12, padding: "10px 12px" }}>
              <Typography style={{ fontSize: 11.5, color: muted }}>Distance</Typography>
              <Typography style={{ fontSize: 21, fontWeight: 700 }}>
                {route.distanceKm.toFixed(1)} km
              </Typography>
            </Box>
            <Box style={{ background: "#f4f5fd", borderRadius: 12, padding: "10px 12px" }}>
              <Typography style={{ fontSize: 11.5, color: muted }}>Est. Time</Typography>
              <Typography style={{ fontSize: 21, fontWeight: 700, color: tealBright }}>
                {route.durationMin} mins
              </Typography>
            </Box>
          </Box>

          <Box style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12.5 }}>
            <span style={{ color: muted }}>Route basis</span>
            <span style={{ fontWeight: 600 }}>Fastest road</span>
          </Box>
          <Box style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12.5 }}>
            <span style={{ color: muted }}>Fuel Recovery</span>
            <span style={{ fontWeight: 700, color: "#9a6700" }}>
              ≈ ₹{estimateFare(route.durationMin)} / lift
            </span>
          </Box>
        </>
      ) : route.status === "loading" ? (
        <Box style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CircularProgress size={20} style={{ color: tealBright }} />
          <Typography style={{ fontSize: 13.5, fontWeight: 600 }}>Finding the best route…</Typography>
        </Box>
      ) : route.status === "error" ? (
        <Typography style={{ fontSize: 13, color: "#9a3412", lineHeight: 1.5 }} role="status">
          {route.message}
        </Typography>
      ) : (
        <Box>
          <Typography style={{ fontSize: 14, fontWeight: 700 }}>Route preview</Typography>
          <Typography style={{ fontSize: 13, color: muted, marginTop: 4, lineHeight: 1.5 }}>
            Enter your pickup and destination to see your route, distance and
            travel time.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
