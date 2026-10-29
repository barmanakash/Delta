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
  Typography,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CallSplitOutlinedIcon from "@mui/icons-material/CallSplitOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import ProfileMenu from "../profilemenu/profilemenu";
// Same place lookup the rider's "Create Your Commute" screen uses, so a place
// typed by hand still gets a map point and can be matched against riders' routes
import { geocode, CITY_CENTER } from "../createcommute/createcommute";

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

const cardStyle = {
  background: "#fff",
  borderRadius: 22,
  boxShadow: "0 4px 20px rgba(30,35,90,0.06)",
};

const capsLabel = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: "#4b5468",
  lineHeight: 1.2,
};

const bareInput = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontSize: 17,
  fontWeight: 600,
  color: dark,
  fontFamily: "inherit",
  padding: 0,
  marginTop: 3,
};

const WINDOW_MINUTES = 15;
const MAX_DAYS_AHEAD = 30;

const STATUS_STYLES = {
  searching: { label: "Searching", background: "#e8eafd", color: "#3c40c8" },
  matched: { label: "Matched", background: "#e3f6ec", color: "#16794a" },
  completed: { label: "Completed", background: "#e3f6ec", color: "#16794a" },
  cancelled: { label: "Cancelled", background: "#eef0f4", color: "#5b6475" },
  expired: { label: "Expired", background: "#fff4dc", color: "#9a6700" },
};

/* ------------------------------------------------------------------ */
/*  Date / time helpers                                                */
/* ------------------------------------------------------------------ */

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

const fromMinutes = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

const addMinutes = (t, n) => fromMinutes(toMinutes(t) + n);

// "08:30" -> "08:30 AM"
const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

const windowLabel = (start) =>
  `${formatTime(start)} – ${formatTime(addMinutes(start, WINDOW_MINUTES))}`;

const formatDateLong = (iso) =>
  parseISODate(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatDateShort = (iso) =>
  parseISODate(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

// "Today, 24 Oct" / "Yesterday, 23 Oct" / "12 Oct"
const relativeDay = (iso, todayIso) => {
  const diff = Math.round((parseISODate(iso) - parseISODate(todayIso)) / 86400000);
  const label = { 0: "Today", 1: "Tomorrow", "-1": "Yesterday" }[diff];
  return label ? `${label}, ${formatDateShort(iso)}` : formatDateShort(iso);
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

/* ---- place suggestions (Photon, free) - same as the Rider's Create ---- */
/* ---- Commute page: results are ranked around the city ---------------- */

// CITY_CENTER (imported above) is shared with the rider's screen, so both
// sides search around the same city
const MIN_SUGGEST_CHARS = 3; // suggestions start after this many characters
const suggestionHover = "#f0f2fb";

// One Photon result -> something the dropdown can show and the form can use
function toSuggestion(feature) {
  const p = feature.properties || {};
  const coords = feature.geometry && feature.geometry.coordinates;
  if (!coords || (p.countrycode && p.countrycode !== "IN")) return null;

  const street = [p.housenumber, p.street].filter(Boolean).join(" ");
  const title = p.name || street || p.locality || p.district || p.city;
  if (!title) return null;

  const areas = [street, p.locality, p.district, p.city || p.county, p.state].filter(
    (a) => a && a !== title
  );
  const where = [p.city, p.district, p.county, p.locality].find((a) => a && a !== title);

  return {
    key: `${p.osm_type || ""}${p.osm_id || coords.join(",")}`,
    title,
    subtitle: [...new Set(areas)].slice(0, 3).join(", "),
    // What goes into the field once picked, e.g. "Damoh Naka, Jabalpur"
    label: where ? `${title}, ${where}` : title,
    point: { lat: coords[1], lng: coords[0] },
  };
}

async function searchPlaces(query, signal) {
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
async function reverseGeocode({ lat, lng }) {
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

// The text input of a place field, plus its suggestion dropdown. The dropdown
// is positioned against the field's white box (which must be position: relative).
function PlaceInput({ ariaLabel, value, onChange, onPick, onEnter, placeholder, inputRef }) {
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
    if (show && items.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i + 1) % items.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
        return;
      }
      if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        choose(items[active]);
        return;
      }
    }
    if (e.key === "Enter" && onEnter) onEnter();
  };

  const note = (text) => (
    <Typography style={{ fontSize: 13, color: muted, padding: "10px 12px", lineHeight: 1.5 }}>
      {text}
    </Typography>
  );

  return (
    <>
      <input
        ref={inputRef}
        className="lt-input"
        role="combobox"
        aria-label={ariaLabel}
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
        maxLength={200}
        style={bareInput}
      />

      {show && (
        <Box
          id={listId}
          role="listbox"
          aria-label={`${ariaLabel} suggestions`}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 1300,
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
                background: i === active ? suggestionHover : "transparent",
              }}
            >
              <LocationOnOutlinedIcon
                style={{ fontSize: 20, color: "#7b8294", marginTop: 2, flexShrink: 0 }}
              />
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
          {status === "done" &&
            !items.length &&
            note(`No places found for "${query.trim()}". Try a nearby landmark or a shorter name.`)}
          {status === "error" &&
            note("Suggestions are unavailable right now. You can still type the place and continue.")}
        </Box>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LiftTakerHome() {
  const navigate = useNavigate();

  const [now, setNow] = useState(() => new Date());
  const [user, setUser] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  // Plan Your Commute form
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [mode, setMode] = useState("today"); // today | ahead
  const [travelDate, setTravelDate] = useState(() => toISODate(new Date()));
  const [windowStart, setWindowStart] = useState("");
  const [filters, setFilters] = useState({
    sameGender: false,
    twoWheeler: true,
    zeroDetour: true,
  });

  // UI state
  const [locating, setLocating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [formError, setFormError] = useState("");
  const [dialog, setDialog] = useState(null); // "sos" | "safety" | null
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const planRef = useRef(null);
  const destinationRef = useRef(null);
  const prefilled = useRef(false);
  const pickupRef = useRef(""); // the pickup as it is now, for the async loaders below
  pickupRef.current = pickup;

  const today = toISODate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const maxDate = toISODate(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + MAX_DAYS_AHEAD)
  );

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const signOutLocally = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/signin", { replace: true });
  };

  /* ---- clock: keeps "windows left today" accurate ------------------ */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  /* ---- time windows that are still available for the chosen date --- */
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

  /* ---- load the signed-in user + recent requests ------------------- */
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
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: authHeaders(),
        });
        if (res.status === 401) {
          signOutLocally();
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        if (data.role !== "lift") {
          navigate("/home", { replace: true }); // not a lift taker -> rider home
          return;
        }
        applyUser(data);
      } catch {
        // backend offline: keep the cached user
      }
    };

    const loadRecent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/lifts/requests?limit=5`, {
          headers: authHeaders(),
        });
        if (res.status === 401) {
          signOutLocally();
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        setRecent(data);
        // Start the pickup field from the last pickup the user used
        if (!prefilled.current && data.length) {
          prefilled.current = true;
          // Only when the user hasn't typed a pickup already
          if (!pickupRef.current) {
            setPickup(data[0].pickup);
            if (data[0].pickup_lat != null && data[0].pickup_lng != null) {
              setPickupCoords({ lat: data[0].pickup_lat, lng: data[0].pickup_lng });
            }
          }
        }
      } catch {
        // backend offline: the card shows its empty state
      } finally {
        setRecentLoading(false);
      }
    };

    loadUser();
    loadRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- form handlers ---------------------------------------------- */

  const chooseMode = (next) => {
    setMode(next);
    if (next === "today") {
      setTravelDate(today);
    } else if (travelDate === today) {
      setTravelDate(
        toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))
      );
    }
  };

  const handleDateChange = (value) => {
    if (!value) return;
    setTravelDate(value < today ? today : value > maxDate ? maxDate : value);
  };

  const toggleFilter = (key) =>
    setFilters((f) => ({ ...f, [key]: !f[key] }));

  const swapPlaces = () => {
    setPickup(destination);
    setDestination(pickup);
    setPickupCoords(destinationCoords);
    setDestinationCoords(pickupCoords);
  };

  // Typing by hand forgets any point picked earlier; picking a suggestion sets it
  const changePickup = (value) => {
    setPickup(value);
    setPickupCoords(null);
  };
  const pickPickup = (item) => {
    setPickup(item.label);
    setPickupCoords(item.point);
  };
  const changeDestination = (value) => {
    setDestination(value);
    setDestinationCoords(null);
  };
  const pickDestination = (item) => {
    setDestination(item.label);
    setDestinationCoords(item.point);
  };
  // A destination from the history list keeps the map point it was saved with
  const chooseRecentDestination = (place) => {
    const found = recent.find((r) => r.destination === place);
    setDestination(place);
    setDestinationCoords(
      found && found.destination_lat != null && found.destination_lng != null
        ? { lat: found.destination_lat, lng: found.destination_lng }
        : null
    );
    setShowHistory(false);
  };

  const fillCurrentLocation = () => {
    if (locating) return;
    if (!navigator.geolocation) {
      showToast("Your browser doesn't support location access.", "warning");
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
        setPickupCoords(point);
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

  const goToFindLift = () =>
    navigate("/findlift", { state: { pickup, destination } });

  const handleFindLift = async () => {
    if (submitting) return;

    const p = pickup.trim();
    const d = destination.trim();
    const fail = (message) => setFormError(message);

    if (p.length < 3) return fail("Enter your pickup location.");
    if (d.length < 3) return fail("Enter where you want to go.");
    if (p.toLowerCase() === d.toLowerCase())
      return fail("Pickup and destination must be different.");
    if (!windowStart)
      return fail("No time windows are left today. Choose Schedule Ahead.");

    setFormError("");
    setSubmitting(true);
    try {
      // Riders are matched by where places are on the map, so find the point of
      // any place that was typed by hand. If the lookup fails the request still
      // goes through and is matched by name.
      let pickupPoint = pickupCoords;
      let destinationPoint = destinationCoords;
      try {
        if (!pickupPoint) pickupPoint = await geocode(p);
        if (!destinationPoint) destinationPoint = await geocode(d);
      } catch {
        // map lookup unavailable: fall back to matching by name
      }

      const res = await fetch(`${API_BASE_URL}/api/lifts/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          pickup: p,
          destination: d,
          pickup_lat: pickupPoint ? pickupPoint.lat : null,
          pickup_lng: pickupPoint ? pickupPoint.lng : null,
          destination_lat: destinationPoint ? destinationPoint.lat : null,
          destination_lng: destinationPoint ? destinationPoint.lng : null,
          travel_date: travelDate,
          window_start: windowStart,
          window_end: addMinutes(windowStart, WINDOW_MINUTES),
          same_gender_only: filters.sameGender,
          two_wheeler_only: filters.twoWheeler,
          zero_detour_only: filters.zeroDetour,
        }),
      });

      if (res.status === 401) {
        signOutLocally();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        fail(errorMessage(data, "Couldn't send your request. Please try again."));
        return;
      }

      // A new request replaces any earlier one that was still searching
      setRecent((prev) =>
        [
          data,
          ...prev.map((r) =>
            r.status === "searching" ? { ...r, status: "cancelled" } : r
          ),
        ].slice(0, 5)
      );
      // Show the riders whose routes fit this request
      navigate(`/compatibleriders/${data.id}`);
    } catch {
      fail("Unable to connect to server. Please make sure the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (cancelling) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/lifts/requests/${id}/cancel`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        signOutLocally();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        showToast(errorMessage(data, "Couldn't cancel the request."), "error");
        return;
      }
      setRecent((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      showToast("Lift request cancelled.", "info");
    } catch {
      showToast("Unable to connect to server.", "error");
    } finally {
      setCancelling(false);
    }
  };

  /* ---- derived values --------------------------------------------- */
  const latest = recent[0];
  const activeRequest = latest && latest.status === "searching" ? latest : null;
  const recentDestinations = [...new Set(recent.map((r) => r.destination))].slice(0, 4);

  /* ---------------------------------------------------------------- */

  return (
    <Box
      className="lt-page"
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
        .lt-input::placeholder { color: #7b8294; font-weight: 500; }
        .lt-focus:focus-within { box-shadow: 0 0 0 2px rgba(0,125,115,0.35) !important; }
        .lt-btn:focus-visible { outline: 2px solid ${tealBright}; outline-offset: 2px; }
        .lt-page .lt-reveal {
          animation: lt-reveal 560ms cubic-bezier(0.22, 0.8, 0.24, 1) backwards;
        }
        .lt-page .lt-reveal-delay-1 { animation-delay: 80ms; }
        .lt-page .lt-reveal-delay-2 { animation-delay: 160ms; }
        .lt-page .lt-reveal-delay-3 { animation-delay: 240ms; }
        .lt-page .lt-reveal-delay-4 { animation-delay: 320ms; }
        .lt-page .lt-hover-card {
          transition: transform 240ms cubic-bezier(0.22, 0.8, 0.24, 1), filter 240ms ease;
        }
        .lt-page .lt-hover-card:hover {
          transform: translateY(-4px);
          filter: drop-shadow(0 12px 16px rgba(24, 34, 70, 0.12));
        }
        .lt-page .lt-card-icon {
          transition: transform 240ms cubic-bezier(0.22, 0.8, 0.24, 1);
        }
        .lt-page .lt-hover-card:hover .lt-card-icon {
          transform: translateY(-2px) rotate(-4deg);
        }
        .lt-page .lt-focus {
          transition: transform 180ms cubic-bezier(0.22, 0.8, 0.24, 1);
        }
        .lt-page .lt-focus:hover { transform: translateY(-1px); }
        /* a field with its suggestion list open sits above the fields below it */
        .lt-page .lt-focus:has([role="listbox"]) { z-index: 20; }
        .lt-page .lt-feature-row {
          transition: transform 180ms cubic-bezier(0.22, 0.8, 0.24, 1);
        }
        .lt-page .lt-feature-row:hover { transform: translateX(3px); }
        .lt-page .lt-route-path {
          animation: lt-route-flow 8s linear infinite;
        }
        .lt-page .lt-route-point {
          transform-box: fill-box;
          transform-origin: center;
          animation: lt-route-pulse 2.4s ease-in-out infinite;
        }
        .lt-page .lt-route-point:last-child { animation-delay: 1.2s; }
        .lt-page .lt-network-dot {
          animation: lt-route-pulse 2.4s ease-in-out infinite;
        }
        @keyframes lt-reveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lt-route-flow {
          to { stroke-dashoffset: -40; }
        }
        @keyframes lt-route-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.18); }
        }
        @media (max-width: 960px) {
          .lt-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .lt-hero-row { flex-direction: column !important; }
          .lt-stats { grid-template-columns: 1fr 1fr !important; }
          .lt-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 760px) {
          .lt-nav { display: none !important; }
          .lt-sos-text { display: none !important; }
        }
        @media (max-width: 600px) {
          .lt-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .lt-two-col { grid-template-columns: minmax(0, 1fr) !important; }
          .lt-footer-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .lt-h1 { font-size: 32px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lt-page .lt-route-path,
          .lt-page .lt-route-point,
          .lt-page .lt-network-dot { animation: none; }
        }
      `}</style>

      {/* ============================ HEADER ============================ */}
      <Box
        component="header"
        style={{
          background: "#fff",
          boxShadow: "0 2px 14px rgba(30,35,90,0.07)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <Box
          className="lt-pad"
          style={{
            maxWidth: 1560,
            margin: "0 auto",
            height: 72,
            padding: "0 32px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* brand + mode chip */}
          <Box style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
              <Typography style={{ fontSize: 18, fontWeight: 800, color: dark }}>
                Friend<span style={{ color: tealBright }}>Ride</span>
              </Typography>
            </Box>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "#e8eafd",
                color: "#3c40c8",
                borderRadius: 12,
                padding: "5px 11px",
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: "0.5px",
              }}
            >
              LIFT TAKER
              <SwapVertOutlinedIcon
                style={{ fontSize: 13, transform: "rotate(90deg)" }}
              />
            </Box>
          </Box>

          {/* nav */}
          <Box
            className="lt-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "#f1f2fb",
              borderRadius: 30,
              padding: 4,
            }}
          >
            <NavTab active>Home</NavTab>
            <NavTab onClick={goToFindLift}>Find a Lift</NavTab>
            <NavTab onClick={() => navigate("/trips")}>My Trips</NavTab>
          </Box>

          {/* actions */}
          <Box style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Box
              className="lt-btn"
              role="button"
              tabIndex={0}
              aria-label="Police SOS"
              onClick={() => setDialog("sos")}
              onKeyDown={activateOnKey(() => setDialog("sos"))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "#ffe3e3",
                color: "#c0262d",
                borderRadius: 22,
                padding: "9px 18px",
                fontSize: 12.5,
                fontWeight: 800,
                letterSpacing: "0.5px",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(192,38,45,0.18)",
              }}
            >
              <ShieldOutlinedIcon style={{ fontSize: 17 }} />
              <span className="lt-sos-text">POLICE SOS</span>
            </Box>

            <Box style={{ position: "relative", display: "flex" }}>
              <NotificationsNoneOutlinedIcon style={{ fontSize: 25, color: "#343b43" }} />
              <Box
                style={{
                  position: "absolute",
                  top: 1,
                  right: 1,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#dc2929",
                  border: "1.5px solid #fff",
                }}
              />
            </Box>

            <Box style={{ width: 1, height: 34, background: "#e4e6f0" }} />

            <ProfileMenu user={user} photoUrl={photoUrl} variant="stacked" />
          </Box>
        </Box>
      </Box>

      {/* ============================= MAIN ============================= */}
      <Box component="main" style={{ flex: 1 }}>
        {/* hero */}
        <Box
          className="lt-pad"
          style={{
            maxWidth: 1560,
            margin: "0 auto",
            padding: "32px 32px 0",
            boxSizing: "border-box",
          }}
        >
          <Box
            className="lt-hero-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 24,
            }}
          >
            <Box className="lt-reveal">
              <Box
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  background: "#e9ecfb",
                  borderRadius: 20,
                  padding: "8px 16px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                  color: teal,
                }}
              >
                <Box className="lt-network-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: tealBright }} />
                FriendRide COMMUTER NETWORK
                <Box style={{ width: 5, height: 5, borderRadius: "50%", background: "#b9bfd3" }} />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#3b4357", fontWeight: 600 }}>
                  <VerifiedOutlinedIcon style={{ fontSize: 15, color: tealBright }} />
                  100% Aadhaar Verified
                </span>
              </Box>

              <Typography
                className="lt-h1"
                component="h1"
                style={{
                  fontSize: 46,
                  fontWeight: 800,
                  letterSpacing: "-1.2px",
                  lineHeight: 1.1,
                  margin: "18px 0 10px",
                  color: dark,
                }}
              >
                Where would you like to go?
              </Typography>
              <Typography style={{ fontSize: 16.5, color: "#475066", maxWidth: 680 }}>
                Find a compatible lift along your daily route with authenticated
                institutional commuters.
              </Typography>
            </Box>

            <Box
              className="lt-hover-card lt-reveal lt-reveal-delay-1"
              style={{
                ...cardStyle,
                borderRadius: 16,
                padding: "14px 20px 14px 14px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexShrink: 0,
              }}
            >
              <Box
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: "#e9ecfb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: teal,
                }}
              >
                <ShieldOutlinedIcon className="lt-card-icon" style={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography style={{ fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                  Corridor Shield Active
                  <CheckCircleOutlinedIcon style={{ fontSize: 14, color: tealBright }} />
                </Typography>
                <Typography style={{ fontSize: 12.5, color: muted }}>
                  AIS-140 Live Route Guardrails
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* two-column area */}
        <Box
          className="lt-pad lt-grid"
          style={{
            maxWidth: 1560,
            margin: "28px auto 0",
            padding: "0 32px",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.45fr) minmax(0, 1fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ------------------------ LEFT COLUMN ------------------------ */}
          <Box style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
            {/* Plan Your Commute */}
            <Box
              ref={planRef}
              className="lt-hover-card lt-reveal lt-reveal-delay-1"
              style={{ ...cardStyle, overflow: "hidden", scrollMarginTop: 90 }}
            >
              <Box style={{ height: 5, background: `linear-gradient(90deg, ${teal}, ${indigo})` }} />

              <Box style={{ padding: "22px 24px 24px" }}>
                {/* header row */}
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Box style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Box
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: "#e9ecfb",
                        color: indigo,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TwoWheelerOutlinedIcon className="lt-card-icon" style={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: 20, fontWeight: 800 }}>
                        Plan Your Commute
                      </Typography>
                      <Typography
                        component="div"
                        style={{ fontSize: 12, fontWeight: 600, color: tealBright, display: "flex", alignItems: "center", gap: 5 }}
                      >
                        <Box style={{ width: 6, height: 6, borderRadius: "50%", background: tealBright }} />
                        Instant Corridor Match Available
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    role="group"
                    aria-label="When do you want to travel"
                    style={{ display: "flex", background: "#f1f2fb", borderRadius: 22, padding: 4 }}
                  >
                    {[
                      ["today", "Today"],
                      ["ahead", "Schedule Ahead"],
                    ].map(([value, label]) => (
                      <Box
                        key={value}
                        className="lt-btn"
                        role="button"
                        tabIndex={0}
                        aria-pressed={mode === value}
                        onClick={() => chooseMode(value)}
                        onKeyDown={activateOnKey(() => chooseMode(value))}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 18,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          background: mode === value ? "#fff" : "transparent",
                          color: mode === value ? tealBright : "#3b4357",
                          boxShadow: mode === value ? "0 1px 5px rgba(30,35,90,0.12)" : "none",
                        }}
                      >
                        {label}
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* pickup / destination */}
                <Box
                  style={{
                    background: "#f4f5fd",
                    borderRadius: 20,
                    padding: 16,
                    marginTop: 22,
                  }}
                >
                  {/* pickup */}
                  <Box
                    className="lt-focus"
                    style={{
                      position: "relative",
                      background: "#fff",
                      borderRadius: 14,
                      padding: "13px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      boxShadow: "0 1px 4px rgba(30,35,90,0.06)",
                    }}
                  >
                    <Box
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        background: tealBright,
                        boxShadow: "0 0 0 4px #cdeeea",
                        flexShrink: 0,
                      }}
                    />
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Typography style={capsLabel}>Pickup location</Typography>
                      <PlaceInput
                        ariaLabel="Pickup location"
                        value={pickup}
                        onChange={changePickup}
                        onPick={pickPickup}
                        placeholder="Where should we pick you up?"
                      />
                    </Box>
                    <Box
                      className="lt-btn"
                      role="button"
                      tabIndex={0}
                      onClick={fillCurrentLocation}
                      onKeyDown={activateOnKey(fillCurrentLocation)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: tealBright,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {locating ? (
                        <CircularProgress size={15} style={{ color: tealBright }} />
                      ) : (
                        <MyLocationOutlinedIcon style={{ fontSize: 17 }} />
                      )}
                      Current GPS
                    </Box>
                  </Box>

                  {/* swap */}
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      margin: "-4px 14px -14px 0",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <IconButton
                      aria-label="Swap pickup and destination"
                      onClick={swapPlaces}
                      style={{
                        width: 38,
                        height: 38,
                        background: "#fff",
                        color: "#3b4357",
                        boxShadow: "0 2px 8px rgba(30,35,90,0.15)",
                      }}
                    >
                      <SwapVertOutlinedIcon style={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>

                  {/* destination */}
                  <Box
                    className="lt-focus"
                    style={{
                      position: "relative",
                      background: "#fff",
                      borderRadius: 14,
                      padding: "13px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginTop: 10,
                      boxShadow: "0 1px 4px rgba(30,35,90,0.06)",
                    }}
                  >
                    <LocationOnOutlinedIcon style={{ fontSize: 22, color: indigo, flexShrink: 0 }} />
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Typography style={capsLabel}>Destination</Typography>
                      <PlaceInput
                        inputRef={destinationRef}
                        ariaLabel="Destination"
                        value={destination}
                        onChange={changeDestination}
                        onPick={pickDestination}
                        onEnter={handleFindLift}
                        placeholder="Where do you want to go? (e.g. Madan Mahal Station Gate 2)"
                      />
                    </Box>
                    <IconButton
                      aria-label="Recent destinations"
                      aria-expanded={showHistory}
                      onClick={() => setShowHistory((v) => !v)}
                      style={{ color: showHistory ? tealBright : "#596066" }}
                    >
                      <HistoryOutlinedIcon style={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>

                  {showHistory && (
                    <Box
                      style={{
                        background: "#fff",
                        borderRadius: 12,
                        marginTop: 8,
                        padding: 6,
                        boxShadow: "0 4px 14px rgba(30,35,90,0.10)",
                      }}
                    >
                      {recentDestinations.length ? (
                        recentDestinations.map((place) => (
                          <Box
                            key={place}
                            className="lt-btn"
                            role="button"
                            tabIndex={0}
                            onClick={() => chooseRecentDestination(place)}
                            onKeyDown={activateOnKey(() => chooseRecentDestination(place))}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "9px 10px",
                              borderRadius: 8,
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <HistoryOutlinedIcon style={{ fontSize: 17, color: "#7b8294" }} />
                            {place}
                          </Box>
                        ))
                      ) : (
                        <Typography style={{ fontSize: 13, color: muted, padding: "9px 10px" }}>
                          No recent destinations yet.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>

                {/* date + time */}
                <Box
                  className="lt-two-col"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginTop: 16,
                  }}
                >
                  <Box className="lt-focus" style={tileStyle}>
                    <Box style={tileIcon}>
                      <CalendarMonthOutlinedIcon style={{ fontSize: 20 }} />
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Typography style={tileLabel}>Commute Date</Typography>
                      {mode === "today" ? (
                        <Typography style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>
                          Today, {formatDateLong(travelDate)}
                        </Typography>
                      ) : (
                        <input
                          className="lt-input"
                          type="date"
                          aria-label="Commute date"
                          value={travelDate}
                          min={today}
                          max={maxDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          style={{ ...bareInput, fontSize: 16, fontWeight: 700, marginTop: 2 }}
                        />
                      )}
                    </Box>
                    <KeyboardArrowDownIcon style={{ fontSize: 20, color: "#596066" }} />
                  </Box>

                  <Box className="lt-focus" style={tileStyle}>
                    <Box style={tileIcon}>
                      <AccessTimeOutlinedIcon style={{ fontSize: 20 }} />
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Typography style={tileLabel}>Preferred Time Window</Typography>
                      <select
                        className="lt-input"
                        aria-label="Preferred time window"
                        value={windowStart}
                        disabled={!availableStarts.length}
                        onChange={(e) => setWindowStart(e.target.value)}
                        style={{
                          ...bareInput,
                          fontSize: 16,
                          fontWeight: 700,
                          marginTop: 2,
                          appearance: "none",
                          WebkitAppearance: "none",
                          cursor: "pointer",
                        }}
                      >
                        {availableStarts.length ? (
                          availableStarts.map((s) => (
                            <option key={s} value={s}>
                              {windowLabel(s)}
                            </option>
                          ))
                        ) : (
                          <option value="">No windows left today</option>
                        )}
                      </select>
                    </Box>
                    <KeyboardArrowDownIcon style={{ fontSize: 20, color: "#596066" }} />
                  </Box>
                </Box>

                {/* filters */}
                <Typography style={{ ...capsLabel, marginTop: 22, marginBottom: 10 }}>
                  Trip safety &amp; vehicle filters
                </Typography>
                <Box style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <FilterChip
                    active={filters.sameGender}
                    icon={<PersonOutlineOutlinedIcon style={{ fontSize: 17 }} />}
                    onClick={() => toggleFilter("sameGender")}
                  >
                    Same-Gender Commute (Optional)
                  </FilterChip>
                  <FilterChip
                    active={filters.twoWheeler}
                    icon={<TwoWheelerOutlinedIcon style={{ fontSize: 17 }} />}
                    onClick={() => toggleFilter("twoWheeler")}
                  >
                    Two-Wheeler / Bike Pool
                  </FilterChip>
                  <FilterChip
                    active={filters.zeroDetour}
                    icon={<CallSplitOutlinedIcon style={{ fontSize: 17 }} />}
                    onClick={() => toggleFilter("zeroDetour")}
                  >
                    Zero Detour Only
                  </FilterChip>
                </Box>

                {/* active request */}
                {activeRequest && (
                  <Box
                    role="status"
                    style={{
                      marginTop: 20,
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
                    <Box style={{ flex: 1, minWidth: 180 }}>
                      <Typography style={{ fontSize: 13.5, fontWeight: 700, color: "#3c40c8" }}>
                        Looking for riders on your route
                      </Typography>
                      <Typography style={{ fontSize: 12.5, color: "#3b4357", wordBreak: "break-word" }}>
                        {activeRequest.pickup} → {activeRequest.destination} ·{" "}
                        {relativeDay(activeRequest.travel_date, today)},{" "}
                        {windowLabel(activeRequest.window_start)}
                      </Typography>
                    </Box>
                    <Button
                      disabled={cancelling}
                      onClick={() => handleCancel(activeRequest.id)}
                      style={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#c0262d",
                      }}
                    >
                      Cancel request
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
                  onClick={handleFindLift}
                  endIcon={!submitting && <ArrowForwardIcon />}
                  style={{
                    marginTop: 22,
                    height: 56,
                    borderRadius: 14,
                    background: submitting ? "#7fb3ad" : teal,
                    color: "#fff",
                    textTransform: "none",
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  {submitting ? <CircularProgress size={22} style={{ color: "#fff" }} /> : "Find a Lift"}
                </Button>

                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 14,
                    marginTop: 14,
                    fontSize: 12,
                    color: "#3b4357",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: tealBright, fontWeight: 700 }}>
                    <BoltOutlinedIcon style={{ fontSize: 15 }} />
                    AIS-140 Corridor Tracking
                  </span>
                  <span aria-hidden="true">•</span>
                  <span>Fixed fuel-split ₹40 – ₹60 average</span>
                </Box>
              </Box>
            </Box>

            {/* Smart route corridor engine */}
            <Box
              className="lt-hover-card lt-reveal lt-reveal-delay-2"
              style={{
                ...cardStyle,
                borderRadius: 20,
                padding: 20,
                display: "flex",
                alignItems: "center",
                gap: 22,
                flexWrap: "wrap",
              }}
            >
              <Box
                style={{
                  width: 190,
                  height: 112,
                  borderRadius: 14,
                  background: "#eceefe",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 190 112" width="190" height="112" aria-hidden="true">
                  <path
                    className="lt-route-path"
                    d="M24 92 C 60 60, 120 70, 164 24"
                    fill="none"
                    stroke="#9aa3ea"
                    strokeWidth="3"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                  />
                  <circle className="lt-route-point" cx="24" cy="92" r="6" fill={tealBright} />
                  <circle className="lt-route-point" cx="164" cy="24" r="6" fill={indigo} />
                </svg>
                <Box
                  style={{
                    position: "absolute",
                    left: 26,
                    top: 46,
                    background: "#fff",
                    borderRadius: 8,
                    padding: "5px 10px",
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: tealBright,
                    boxShadow: "0 2px 8px rgba(30,35,90,0.15)",
                  }}
                >
                  98.4% Route Overlap
                </Box>
              </Box>

              <Box style={{ flex: 1, minWidth: 220 }}>
                <Typography style={{ ...capsLabel, color: indigo }}>
                  Smart route corridor engine
                </Typography>
                <Typography style={{ fontSize: 19, fontWeight: 800, margin: "6px 0 6px" }}>
                  High-Density Commuter Corridors
                </Typography>
                <Typography style={{ fontSize: 13.5, color: muted, lineHeight: 1.5 }}>
                  Direct matching with verified coworkers and institutional
                  professionals commuting along your precise road sector without
                  unwanted side detours.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ----------------------- RIGHT COLUMN ----------------------- */}
          <Box style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
            {/* FriendRide Matching */}
            <Box className="lt-hover-card lt-reveal lt-reveal-delay-1" style={{ ...cardStyle, padding: 24 }}>
              <Box style={{ display: "flex", gap: 16 }}>
                <Box
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: "#e9ecfb",
                    color: teal,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShieldOutlinedIcon className="lt-card-icon" style={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography style={{ fontSize: 20, fontWeight: 800 }}>
                    FriendRide Matching
                  </Typography>
                  <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.5, marginTop: 4 }}>
                    We show compatible riders based on route overlap, timing, and
                    your strict safety standards.
                  </Typography>
                </Box>
              </Box>

              <Box
                style={{
                  background: "#f4f5fd",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginTop: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  "100% Aadhaar & Govt. ID Verified Riders",
                  "Mandatory Pillion Helmet & Contact Masking",
                  "AIS-140 GPS Route Guard & Deviation Alerts",
                ].map((text) => (
                  <Box key={text} className="lt-feature-row" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 500 }}>
                    <CheckCircleOutlinedIcon style={{ fontSize: 17, color: tealBright }} />
                    {text}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Recent Activity */}
            <Box className="lt-hover-card lt-reveal lt-reveal-delay-2" style={{ ...cardStyle, padding: 24 }}>
              <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <Typography style={{ fontSize: 20, fontWeight: 800 }}>Recent Activity</Typography>
                <Box
                  className="lt-btn"
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate("/trips")}
                  onKeyDown={activateOnKey(() => navigate("/trips"))}
                  style={{ fontSize: 13, fontWeight: 700, color: tealBright, cursor: "pointer" }}
                >
                  View All Trips
                </Box>
              </Box>

              <Box style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {recentLoading ? (
                  <Box style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                    <CircularProgress size={24} style={{ color: tealBright }} />
                  </Box>
                ) : recent.length ? (
                  recent.slice(0, 2).map((item) => (
                    <ActivityItem key={item.id} item={item} today={today} />
                  ))
                ) : (
                  <Box
                    style={{
                      background: "#f7f8fe",
                      borderRadius: 16,
                      padding: "22px 18px",
                      textAlign: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 14, fontWeight: 700 }}>
                      No activity yet
                    </Typography>
                    <Typography style={{ fontSize: 13, color: muted, marginTop: 4 }}>
                      Your lift requests will show up here once you plan your first commute.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Guardian Shield Hub */}
            <Box className="lt-hover-card lt-reveal lt-reveal-delay-3" style={{ ...cardStyle, padding: 24 }}>
              <Typography
                style={{ ...capsLabel, color: teal, display: "flex", alignItems: "center", gap: 7, fontSize: 11.5 }}
              >
                <ShieldOutlinedIcon style={{ fontSize: 18 }} />
                Guardian Shield Hub
              </Typography>
              <Typography style={{ fontSize: 19, fontWeight: 800, margin: "12px 0 8px" }}>
                Travel with confidence
              </Typography>
              <Typography style={{ fontSize: 13.5, color: muted, lineHeight: 1.55 }}>
                Your safety tools are available throughout your journey —
                including 24/7 Police SOS standby, emergency contact telemetry,
                and route corridor alarms.
              </Typography>
              <Button
                disableElevation
                onClick={() => setDialog("safety")}
                startIcon={<ShieldOutlinedIcon style={{ fontSize: 18 }} />}
                style={{
                  marginTop: 16,
                  background: "#e9ecfb",
                  color: teal,
                  borderRadius: 22,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: "8px 18px",
                }}
              >
                Open Safety Center
              </Button>
            </Box>
          </Box>
        </Box>

        {/* stats */}
        <Box
          className="lt-pad"
          style={{
            maxWidth: 1560,
            margin: "48px auto 0",
            padding: "0 32px",
            boxSizing: "border-box",
          }}
        >
          <Box
            className="lt-stats lt-hover-card lt-reveal lt-reveal-delay-4"
            style={{
              ...cardStyle,
              borderRadius: 18,
              padding: "22px 12px",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              rowGap: 20,
            }}
          >
            <Stat value="14,200+" label="Daily Verified Pools" color={teal} />
            <Stat value="4.92 ★" label="Average Rider Rating" color={indigo} />
            <Stat value="< 3 min" label="Median Pickup Time" color={dark} />
            <Stat value="100%" label="Aadhaar Screened" color={teal} />
          </Box>
        </Box>
      </Box>

      {/* ============================ FOOTER ============================ */}
      <Box component="footer" style={{ background: "#f0f1fc", marginTop: 64 }}>
        <Box
          className="lt-pad"
          style={{
            maxWidth: 1560,
            margin: "0 auto",
            padding: "48px 32px 24px",
            boxSizing: "border-box",
          }}
        >
          <Box
            className="lt-footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr",
              gap: 32,
            }}
          >
            <Box>
              <Box style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Box
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: tealBright,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShieldOutlinedIcon style={{ color: "#fff", fontSize: 18 }} />
                </Box>
                <Typography style={{ fontSize: 18, fontWeight: 800 }}>FriendRide</Typography>
              </Box>
              <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "14px 0 16px", maxWidth: 460 }}>
                Next-generation intercity and metro pooled mobility. Certified for
                institutional passenger security, continuous telemetry, and
                verified corporate commuter networks across India.
              </Typography>
              <Box style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <Badge icon={<ShieldOutlinedIcon style={{ fontSize: 14 }} />}>AIS-140 Compliant</Badge>
                <Badge icon={<LockOutlinedIcon style={{ fontSize: 14 }} />}>ISO 27001 Certified</Badge>
                <Badge icon={<SupportAgentOutlinedIcon style={{ fontSize: 14 }} />}>24/7 Response Desk</Badge>
              </Box>
            </Box>

            <FooterColumn
              title="Passenger Assurance"
              items={["Safety Charter", "Emergency SOS Protocols", "Driver Verification Grid", "Insurance Coverage"]}
            />
            <FooterColumn
              title="Network & Governance"
              items={["Metro Mobility Grid", "Privacy Policy", "Terms of Service", "Help & Contact Support"]}
            />
          </Box>

          <Box
            style={{
              borderTop: "1px solid #dcdff0",
              marginTop: 32,
              paddingTop: 18,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              fontSize: 12.5,
              color: "#3b4357",
            }}
          >
            <span>
              © {now.getFullYear()} SafeRoute Technologies India Pvt Ltd. Intercity &amp; Urban Mobility Network.
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Box style={{ width: 7, height: 7, borderRadius: "50%", background: tealBright }} />
              Operational in Bengaluru, Hyderabad, Pune, NCR &amp; Mumbai
            </span>
          </Box>
        </Box>
      </Box>

      {/* ====================== SOS / SAFETY DIALOG ===================== */}
      <Dialog
        open={Boolean(dialog)}
        onClose={() => setDialog(null)}
        slotProps={{
          paper: { style: { borderRadius: 20, maxWidth: 420, width: "100%", margin: 16 } },
        }}
      >
        <Box style={{ padding: "24px 24px 20px" }}>
          <Box style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Box
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: dialog === "sos" ? "#ffe3e3" : "#e9ecfb",
                color: dialog === "sos" ? "#c0262d" : teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldOutlinedIcon />
            </Box>
            <Typography style={{ fontSize: 19, fontWeight: 800 }}>
              {dialog === "sos" ? "Police SOS" : "Safety Center"}
            </Typography>
          </Box>

          <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.55, marginTop: 14 }}>
            {dialog === "sos"
              ? "If you are in danger, call the police on 112 right away. This opens your phone's dialer so you can place the call."
              : "Safety tools to keep your commute protected from pickup to drop-off."}
          </Typography>

          {dialog === "safety" && (
            <Box style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              {[
                "Verify your rider's name and vehicle number before you board.",
                "Wear a helmet for the whole ride.",
                "Share your trip with someone you trust.",
                "In an emergency, call 112 straight away.",
              ].map((tip) => (
                <Box key={tip} style={{ display: "flex", gap: 10, fontSize: 13.5 }}>
                  <CheckCircleOutlinedIcon style={{ fontSize: 18, color: tealBright, flexShrink: 0 }} />
                  {tip}
                </Box>
              ))}
            </Box>
          )}

          <Box style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
            <Button
              onClick={() => setDialog(null)}
              style={{ textTransform: "none", fontWeight: 700, color: muted }}
            >
              Close
            </Button>
            <Button
              component="a"
              href="tel:112"
              disableElevation
              style={{
                textTransform: "none",
                fontWeight: 800,
                background: "#c0262d",
                color: "#fff",
                borderRadius: 10,
                padding: "8px 20px",
              }}
            >
              Call 112
            </Button>
          </Box>
        </Box>
      </Dialog>

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
  background: "#fff",
  border: "1px solid #eceef8",
  borderRadius: 16,
  padding: "14px 16px",
  display: "flex",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 1px 4px rgba(30,35,90,0.05)",
};

const tileIcon = {
  width: 40,
  height: 40,
  borderRadius: 10,
  background: "#e9ecfb",
  color: indigo,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const tileLabel = { fontSize: 11.5, fontWeight: 500, color: "#4b5468" };

function NavTab({ active, onClick, children }) {
  return (
    <Box
      className="lt-btn"
      role="button"
      tabIndex={0}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      onKeyDown={onClick ? activateOnKey(onClick) : undefined}
      style={{
        padding: "10px 26px",
        borderRadius: 26,
        fontSize: 15,
        fontWeight: 700,
        cursor: active ? "default" : "pointer",
        background: active ? tealBright : "transparent",
        color: active ? "#fff" : "#3b4357",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

function FilterChip({ active, icon, onClick, children }) {
  return (
    <Box
      className="lt-btn"
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onClick={onClick}
      onKeyDown={activateOnKey(onClick)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "9px 16px",
        borderRadius: 22,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        userSelect: "none",
        background: active ? "#e3e6fd" : "#eef0f6",
        color: active ? "#3c40c8" : "#3b4357",
        border: `1px solid ${active ? "#c9ceff" : "transparent"}`,
      }}
    >
      {icon}
      {children}
    </Box>
  );
}

function ActivityItem({ item, today }) {
  const status = STATUS_STYLES[item.status] || STATUS_STYLES.cancelled;
  const tags = [
    item.two_wheeler_only && "Bike pool",
    item.same_gender_only && "Same-gender",
    item.zero_detour_only && "Zero detour",
  ].filter(Boolean);

  return (
    <Box className="hover-lift" style={{ background: "#f7f8fe", borderRadius: 16, padding: "14px 16px" }}>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <Typography style={{ fontSize: 12, color: "#3b4357" }}>
          {relativeDay(item.travel_date, today)} • {formatTime(item.window_start)}
        </Typography>
        <Chip
          label={status.label}
          size="small"
          style={{
            height: 20,
            borderRadius: 10,
            background: status.background,
            color: status.color,
            fontWeight: 700,
            fontSize: 11,
          }}
        />
      </Box>

      <Box style={{ display: "flex", gap: 14, marginTop: 12 }}>
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 5 }}>
          <Box style={{ width: 9, height: 9, borderRadius: "50%", background: tealBright }} />
          <Box style={{ width: 2, flex: 1, minHeight: 18, background: "#d5d9ee" }} />
          <Box style={{ width: 9, height: 9, borderRadius: "50%", background: indigo }} />
        </Box>
        <Box style={{ minWidth: 0 }}>
          <Typography style={{ fontSize: 15.5, fontWeight: 800, wordBreak: "break-word" }}>
            {item.destination}
          </Typography>
          <Typography style={{ fontSize: 12.5, color: muted, marginTop: 2, wordBreak: "break-word" }}>
            From {item.pickup}
          </Typography>
        </Box>
      </Box>

      {tags.length > 0 && (
        <Typography
          style={{
            fontSize: 12,
            color: muted,
            marginTop: 12,
            paddingTop: 10,
            borderTop: "1px solid #e6e8f4",
          }}
        >
          {tags.join(" · ")}
        </Typography>
      )}
    </Box>
  );
}

function Stat({ value, label, color }) {
  return (
    <Box style={{ textAlign: "center", padding: "4px 8px" }}>
      <Typography style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography style={{ fontSize: 13, color: "#3b4357", marginTop: 4 }}>{label}</Typography>
    </Box>
  );
}

function Badge({ icon, children }) {
  return (
    <Box
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#e3e6fb",
        color: "#2f3550",
        borderRadius: 14,
        padding: "6px 12px",
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      {icon}
      {children}
    </Box>
  );
}

function FooterColumn({ title, items }) {
  return (
    <Box>
      <Typography style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>{title}</Typography>
      <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <Typography key={item} style={{ fontSize: 14, color: muted }}>
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
