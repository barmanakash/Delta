import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SportsMotorsportsOutlinedIcon from "@mui/icons-material/SportsMotorsportsOutlined";
import CallSplitOutlinedIcon from "@mui/icons-material/CallSplitOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";

import { LT, LiftTakerHeader, LiftTakerFooter } from "../lifttakerlayout/lifttakerlayout";

/* ------------------------------------------------------------------ */
/*  Constants + helpers                                                */
/* ------------------------------------------------------------------ */

const API_BASE_URL = "http://localhost:8000";
const POLL_MS = 30000;

const { teal, tealBright, indigo, dark, muted, pageBg } = LT;

const cardStyle = {
  background: "#fff",
  borderRadius: 22,
  boxShadow: "0 4px 20px rgba(30,35,90,0.06)",
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

const fromMinutes = (mins) => {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

// "08:30" -> "08:30 AM"
const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

// "08:30" -> { clock: "08:30", meridiem: "AM" }
const splitTime = (t) => {
  const [clock, meridiem] = formatTime(t).split(" ");
  return { clock, meridiem };
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

const DEFAULT_FILTERS = {
  window: "full",
  minOverlap: 75,
  arrival: "any",
  seats: 1,
  vehicle: "any",
  sort: "overlap",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CompatibleRiders() {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const [user, setUser] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [data, setData] = useState(null); // { request, search_window_*, matches }
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [menu, setMenu] = useState(null); // { key, anchor }
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [lowOpen, setLowOpen] = useState(false);
  const [viewing, setViewing] = useState(null); // the rider shown in the details dialog

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

  /* ---- matches (loaded once, then refreshed while still searching) -- */
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

  const searching = data?.request?.status === "searching";

  useEffect(() => {
    if (!searching) return undefined;
    const id = setInterval(() => {
      if (!document.hidden) load(true);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [searching, load]);

  /* ---- filter options (depend on the searched time window) --------- */
  const windowStart = data ? toMinutes(data.search_window_start) : 0;
  const windowEnd = data ? toMinutes(data.search_window_end) : 0;
  const windowMid = Math.round((windowStart + windowEnd) / 2);
  const clock = (mins) => formatTime(fromMinutes(mins));

  const filterDefs = [
    {
      key: "window",
      prefix: "Pickup Window",
      primary: true,
      options: [
        { value: "full", label: `${clock(windowStart)} – ${clock(windowEnd)}` },
        { value: "early", label: `${clock(windowStart)} – ${clock(windowMid)}` },
        { value: "late", label: `${clock(windowMid)} – ${clock(windowEnd)}` },
      ],
    },
    {
      key: "minOverlap",
      prefix: "Route Overlap",
      options: [
        { value: 50, label: "50%+" },
        { value: 60, label: "60%+" },
        { value: 75, label: "75%+" },
        { value: 85, label: "85%+" },
      ],
    },
    {
      key: "arrival",
      prefix: "Arrival Time",
      options: [
        { value: "any", label: "Any" },
        { value: 30, label: `Before ${clock(windowEnd + 30)}` },
        { value: 60, label: `Before ${clock(windowEnd + 60)}` },
      ],
    },
    {
      key: "seats",
      prefix: "Available Seats",
      options: [
        { value: 1, label: "1 Seat" },
        { value: 2, label: "2 Seats" },
      ],
    },
    {
      key: "vehicle",
      prefix: "Vehicle",
      options: [
        { value: "any", label: "Bike / Two-Wheeler" },
        { value: "bike", label: "Bike" },
        { value: "scooter", label: "Scooter" },
      ],
    },
    {
      key: "sort",
      prefix: "Sort By",
      options: [
        { value: "overlap", label: "Route Overlap" },
        { value: "pickup", label: "Earliest Pickup" },
        { value: "arrival", label: "Earliest Arrival" },
        { value: "fare", label: "Lowest Fare" },
      ],
    },
  ];

  /* ---- filtered + sorted riders ------------------------------------ */
  const visible = useMemo(() => {
    if (!data) return [];

    const ws = toMinutes(data.search_window_start);
    const we = toMinutes(data.search_window_end);
    const mid = Math.round((ws + we) / 2);

    const list = data.matches.filter((m) => {
      const pickup = toMinutes(m.pickup_time);
      const arrival = toMinutes(m.arrival_time);
      if (filters.window === "early" && pickup > mid) return false;
      if (filters.window === "late" && pickup < mid) return false;
      if (m.overlap_pct < filters.minOverlap) return false;
      if (filters.arrival !== "any" && arrival > we + filters.arrival) return false;
      if (m.seats_available < filters.seats) return false;
      if (filters.vehicle !== "any" && m.vehicle_type !== filters.vehicle) return false;
      return true;
    });

    const by = {
      overlap: (a, b) => b.overlap_pct - a.overlap_pct || a.pickup_time.localeCompare(b.pickup_time),
      pickup: (a, b) => a.pickup_time.localeCompare(b.pickup_time),
      arrival: (a, b) => a.arrival_time.localeCompare(b.arrival_time),
      fare: (a, b) => a.fare - b.fare,
    }[filters.sort];

    return [...list].sort(by);
  }, [data, filters]);

  const totalMatches = data ? data.matches.length : 0;
  const hiddenCount = totalMatches - visible.length;
  const selected = visible.find((m) => m.offer_id === selectedId) || visible[0] || null;

  /* ---- actions ------------------------------------------------------ */
  const editSearch = () => {
    const r = data?.request;
    navigate("/findlift", {
      state: r
        ? {
            pickup: r.pickup,
            destination: r.destination,
            travelDate: r.travel_date,
            windowStart: r.window_start,
            flexible: r.flexible_pickup,
            filters: {
              sameGender: r.same_gender_only,
              twoWheeler: r.two_wheeler_only,
              zeroDetour: r.zero_detour_only,
            },
          }
        : undefined,
    });
  };

  const previewRoute = (offerId) => {
    setSelectedId(offerId);
    setZoom(1);
    document
      .getElementById("route-overview")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const openMenu = (key) => (e) => setMenu({ key, anchor: e.currentTarget });
  const activeDef = menu ? filterDefs.find((d) => d.key === menu.key) : null;

  /* ---------------------------------------------------------------- */

  const request = data?.request;

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
        .cr-btn:focus-visible { outline: 2px solid ${tealBright}; outline-offset: 2px; }
        .cr-scroll::-webkit-scrollbar { height: 0; }
        @keyframes crPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @media (max-width: 1000px) {
          .cr-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .cr-actions { flex-direction: column !important; align-items: stretch !important; }
        }
        @media (max-width: 640px) {
          .cr-title { font-size: 30px !important; }
          .cr-stats { grid-template-columns: minmax(0, 1fr) !important; }
          .cr-stat-sep { border-left: none !important; padding-left: 0 !important; border-top: 1px solid #e8eaf6; padding-top: 12px; }
          .cr-tiles { grid-template-columns: minmax(0, 1fr) !important; }
          .cr-head-row { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <LiftTakerHeader active="find" user={user} photoUrl={photoUrl} />

      {/* ========================= BREADCRUMB BAR ======================== */}
      <Box className="ltl-pad" style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "14px 32px 0", boxSizing: "border-box" }}>
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Box style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: muted }}>
            <span
              className="cr-btn"
              role="link"
              tabIndex={0}
              onClick={() => navigate("/lifttakerhome")}
              onKeyDown={activateOnKey(() => navigate("/lifttakerhome"))}
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              Home
            </span>
            <span>›</span>
            <span
              className="cr-btn"
              role="link"
              tabIndex={0}
              onClick={() => navigate("/findlift")}
              onKeyDown={activateOnKey(() => navigate("/findlift"))}
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              Find a Lift
            </span>
            <span>›</span>
            <span style={{ color: dark, fontWeight: 700 }}>Compatible Riders</span>
          </Box>

          <Box style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: tealBright }}>
            <ShieldOutlinedIcon style={{ fontSize: 15 }} />
            AIS-140 Corridor Guardrails Active
          </Box>
        </Box>
      </Box>

      {/* ============================= MAIN ============================= */}
      <Box component="main" style={{ flex: 1 }}>
        {/* ----- title ----- */}
        <Box
          className="ltl-pad"
          style={{ maxWidth: 1280, margin: "0 auto", padding: "10px 32px 0", boxSizing: "border-box" }}
        >
          <Box className="cr-head-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
            <Box>
              <Typography className="cr-title" component="h1" style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15 }}>
                Compatible Riders
              </Typography>
              <Typography style={{ fontSize: 14.5, color: muted, marginTop: 6 }}>
                We found verified Riders whose active commutes overlap with your journey.
              </Typography>
            </Box>

            <Button
              disableElevation
              onClick={editSearch}
              startIcon={<TuneOutlinedIcon style={{ fontSize: 19 }} />}
              style={{
                background: "#fff",
                color: dark,
                borderRadius: 12,
                padding: "10px 18px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 14.5,
                boxShadow: "0 2px 10px rgba(30,35,90,0.08)",
                flexShrink: 0,
              }}
            >
              Edit Search
            </Button>
          </Box>
        </Box>

        {/* ----- loading / error ----- */}
        {loading && !data && (
          <Box style={{ display: "flex", justifyContent: "center", padding: "90px 0" }}>
            <CircularProgress style={{ color: tealBright }} />
          </Box>
        )}

        {!loading && !data && (
          <Box className="ltl-pad" style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 32px", boxSizing: "border-box" }}>
            <Box style={{ ...cardStyle, padding: "34px 28px", textAlign: "center" }}>
              <Typography style={{ fontSize: 20, fontWeight: 800 }}>
                {loadError === "notfound" ? "We couldn't find that search" : "Couldn't load your matches"}
              </Typography>
              <Typography style={{ fontSize: 14, color: muted, margin: "8px 0 20px" }}>
                {loadError === "notfound"
                  ? "It may have been removed. Start a new search to see compatible riders."
                  : loadError === "offline"
                  ? "Unable to connect to server. Please make sure the backend is running."
                  : "Something went wrong. Please try again."}
              </Typography>
              <Box style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
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
                <Button
                  disableElevation
                  onClick={() => navigate("/findlift")}
                  style={{ background: teal, color: "#fff", borderRadius: 10, textTransform: "none", fontWeight: 700, padding: "8px 22px" }}
                >
                  New search
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {data && (
          <>
            {/* ----- trip summary ----- */}
            <Box className="ltl-pad" style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 32px 0", boxSizing: "border-box" }}>
              <Box
                style={{
                  ...cardStyle,
                  borderRadius: 20,
                  padding: "20px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <Box style={{ display: "flex", flexWrap: "wrap", gap: 10, minWidth: 0 }}>
                  <Box
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#eceefd",
                      borderRadius: 12,
                      padding: "9px 16px",
                      fontSize: 15,
                      fontWeight: 700,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box style={{ width: 9, height: 9, borderRadius: "50%", background: teal }} />
                    {shortName(request.pickup)}
                    <ArrowForwardIcon style={{ fontSize: 17, color: muted }} />
                    <Box style={{ width: 9, height: 9, borderRadius: "50%", background: indigo }} />
                    {shortName(request.destination)}
                  </Box>

                  <Box
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#e1e5fb",
                      color: "#2d3480",
                      borderRadius: 12,
                      padding: "9px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <AccessTimeOutlinedIcon style={{ fontSize: 17, color: indigo }} />
                    {relativeDay(request.travel_date, today)} · {formatTime(request.window_start)} Window
                  </Box>

                  <Box
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#eceefd",
                      color: "#2d3a55",
                      borderRadius: 12,
                      padding: "8px 16px",
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    <ShieldOutlinedIcon style={{ fontSize: 16, color: muted }} />
                    AIS-140 Corridor Monitored • {totalMatches} Commute{" "}
                    {totalMatches === 1 ? "Route" : "Routes"} Matched
                  </Box>
                </Box>

                <Box style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#3b4357" }}>
                  <VerifiedOutlinedIcon style={{ fontSize: 18, color: tealBright }} />
                  100% Aadhaar &amp; Company Verified Pool
                </Box>
              </Box>
            </Box>

            {/* ----- filter bar ----- */}
            <Box style={{ marginTop: 22, borderTop: "1px solid #e8eaf6", borderBottom: "1px solid #e8eaf6", background: "#fafaff" }}>
              <Box
                className="ltl-pad cr-scroll"
                style={{
                  maxWidth: 1280,
                  margin: "0 auto",
                  padding: "14px 32px",
                  boxSizing: "border-box",
                  display: "flex",
                  gap: 10,
                  overflowX: "auto",
                }}
              >
                {filterDefs.map((def) => {
                  const current = def.options.find((o) => o.value === filters[def.key]) || def.options[0];
                  return (
                    <Box
                      key={def.key}
                      className="cr-btn"
                      role="button"
                      tabIndex={0}
                      aria-haspopup="true"
                      onClick={openMenu(def.key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openMenu(def.key)(e);
                        }
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                        padding: "9px 16px",
                        borderRadius: 22,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        userSelect: "none",
                        background: def.primary ? teal : "#eceefb",
                        color: def.primary ? "#fff" : "#2f3550",
                      }}
                    >
                      {def.key === "window" && <AccessTimeOutlinedIcon style={{ fontSize: 16 }} />}
                      {def.key === "vehicle" && <TwoWheelerOutlinedIcon style={{ fontSize: 16 }} />}
                      {def.key === "seats" && <EventSeatOutlinedIcon style={{ fontSize: 16 }} />}
                      {def.key === "sort" && <SwapVertOutlinedIcon style={{ fontSize: 16 }} />}
                      {def.prefix}: {current.label}
                      <KeyboardArrowDownIcon style={{ fontSize: 17 }} />
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Menu
              open={Boolean(menu)}
              anchorEl={menu?.anchor}
              onClose={() => setMenu(null)}
              slotProps={{ paper: { style: { borderRadius: 12, marginTop: 6, minWidth: 190 } } }}
            >
              {activeDef?.options.map((o) => (
                <MenuItem
                  key={String(o.value)}
                  selected={filters[activeDef.key] === o.value}
                  onClick={() => {
                    setFilters((f) => ({ ...f, [activeDef.key]: o.value }));
                    setMenu(null);
                  }}
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  {o.label}
                </MenuItem>
              ))}
            </Menu>

            {/* ----- two columns ----- */}
            <Box
              className="ltl-pad cr-grid"
              style={{
                maxWidth: 1280,
                margin: "0 auto",
                padding: "36px 32px 0",
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
                gap: 32,
                alignItems: "start",
              }}
            >
              {/* ---------------- LEFT: RIDERS ---------------- */}
              <Box style={{ minWidth: 0 }}>
                <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                  <Box>
                    <Box style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Typography component="h2" style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.4px" }}>
                        Available Commute Matches
                      </Typography>
                      <Box
                        style={{
                          minWidth: 24,
                          height: 24,
                          borderRadius: 12,
                          background: "#b9ece6",
                          color: teal,
                          fontSize: 12.5,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 7px",
                          boxSizing: "border-box",
                        }}
                      >
                        {visible.length}
                      </Box>
                    </Box>
                    <Typography style={{ fontSize: 13, color: muted, marginTop: 4 }}>
                      Matches are ranked neutrally by route proximity and temporal alignment.
                    </Typography>
                  </Box>

                  {searching && (
                    <Box style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: "#3b4357", paddingTop: 6 }}>
                      <Box style={{ width: 8, height: 8, borderRadius: "50%", background: tealBright, animation: "crPulse 2s ease-in-out infinite" }} />
                      Live Sync Active
                    </Box>
                  )}
                </Box>

                {/* search ended */}
                {!searching && (
                  <Alert
                    severity="info"
                    style={{ marginTop: 18, borderRadius: 12 }}
                    action={
                      <Button color="inherit" size="small" onClick={editSearch} style={{ textTransform: "none", fontWeight: 700 }}>
                        New search
                      </Button>
                    }
                  >
                    This search is {request.status}, so no riders are being matched. Start a new
                    search to see compatible riders.
                  </Alert>
                )}

                {/* hidden by filters */}
                {searching && hiddenCount > 0 && visible.length > 0 && (
                  <Box
                    role="status"
                    style={{
                      marginTop: 18,
                      background: "#fff4dc",
                      color: "#7a5300",
                      borderRadius: 12,
                      padding: "10px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      {hiddenCount} {hiddenCount === 1 ? "rider is" : "riders are"} hidden by your filters.
                    </span>
                    <span
                      className="cr-btn"
                      role="button"
                      tabIndex={0}
                      onClick={() => setFilters({ ...DEFAULT_FILTERS, minOverlap: 50 })}
                      onKeyDown={activateOnKey(() => setFilters({ ...DEFAULT_FILTERS, minOverlap: 50 }))}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      Show all
                    </span>
                  </Box>
                )}

                {/* rider cards */}
                <Box style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20 }}>
                  {visible.map((m) => (
                    <RiderCard
                      key={m.offer_id}
                      match={m}
                      request={request}
                      active={selected?.offer_id === m.offer_id}
                      onPreview={() => previewRoute(m.offer_id)}
                      onView={() => setViewing(m)}
                    />
                  ))}

                  {searching && visible.length === 0 && (
                    <Box style={{ ...cardStyle, padding: "34px 28px", textAlign: "center" }}>
                      <Box
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 16,
                          background: "#eceefd",
                          color: indigo,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 14px",
                        }}
                      >
                        <SearchOutlinedIcon style={{ fontSize: 28 }} />
                      </Box>
                      <Typography style={{ fontSize: 19, fontWeight: 800 }}>
                        {totalMatches > 0 ? "No riders match your filters" : "No compatible riders yet"}
                      </Typography>
                      <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "8px auto 20px", maxWidth: 470 }}>
                        {totalMatches > 0
                          ? "Riders on your route exist, but they are hidden by the filters above."
                          : "No verified rider is travelling your route in this time window right now. We keep checking, and new riders appear here automatically."}
                      </Typography>
                      <Box style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                        {totalMatches > 0 && (
                          <Button
                            disableElevation
                            onClick={() => setFilters({ ...DEFAULT_FILTERS, minOverlap: 50 })}
                            style={{ background: teal, color: "#fff", borderRadius: 10, textTransform: "none", fontWeight: 700, padding: "8px 22px" }}
                          >
                            Show all riders
                          </Button>
                        )}
                        <Button
                          onClick={editSearch}
                          style={{ textTransform: "none", fontWeight: 700, color: tealBright }}
                        >
                          Edit search
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* low match density */}
                <Box style={{ ...cardStyle, borderRadius: 18, marginTop: 24, overflow: "hidden" }}>
                  <Box
                    className="cr-btn"
                    role="button"
                    tabIndex={0}
                    aria-expanded={lowOpen}
                    onClick={() => setLowOpen((v) => !v)}
                    onKeyDown={activateOnKey(() => setLowOpen((v) => !v))}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", cursor: "pointer" }}
                  >
                    <Box
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "#eceefd",
                        color: muted,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <SearchOutlinedIcon style={{ fontSize: 22 }} />
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Typography style={{ fontSize: 15, fontWeight: 800 }}>
                        Preview: When no riders are available
                      </Typography>
                      <Typography style={{ fontSize: 13, color: muted, marginTop: 2 }}>
                        How SafeRoute handles low corridor match density
                      </Typography>
                    </Box>
                    <KeyboardArrowDownIcon
                      style={{
                        color: muted,
                        transform: lowOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.15s ease",
                      }}
                    />
                  </Box>

                  {lowOpen && (
                    <Box style={{ padding: "0 20px 20px 74px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        "Your search stays active and refreshes automatically, so riders who publish a matching route appear here without you doing anything.",
                        "Turn on Flexible pickup time to also search a few minutes either side of your window.",
                        "Try Schedule Ahead for tomorrow, or a nearby boarding point, to reach more riders.",
                      ].map((text) => (
                        <Box key={text} style={{ display: "flex", gap: 9, fontSize: 13.5, color: "#475066", lineHeight: 1.55 }}>
                          <CheckCircleOutlinedIcon style={{ fontSize: 17, color: tealBright, flexShrink: 0, marginTop: 2 }} />
                          {text}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* ---------------- RIGHT: MAP + SAFETY ---------------- */}
              <Box style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                <Box id="route-overview" style={{ ...cardStyle, overflow: "hidden" }}>
                  <Box style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px" }}>
                    <Box
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "#b9ece6",
                        color: teal,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MapOutlinedIcon style={{ fontSize: 22 }} />
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Typography style={{ fontSize: 17, fontWeight: 800 }}>
                        Route Matching Overview
                      </Typography>
                      <Typography style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>
                        Live alignment along {selected?.corridor || "your transit corridor"}
                      </Typography>
                    </Box>
                    <Box style={{ display: "flex", background: "#eef0fb", borderRadius: 12, padding: 2, flexShrink: 0 }}>
                      <IconButton aria-label="Zoom in" size="small" disabled={zoom >= 1.6} onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.2).toFixed(1)))}>
                        <AddIcon style={{ fontSize: 19 }} />
                      </IconButton>
                      <IconButton aria-label="Zoom out" size="small" disabled={zoom <= 1} onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(1)))}>
                        <RemoveIcon style={{ fontSize: 19 }} />
                      </IconButton>
                      <IconButton aria-label="Reset map view" size="small" onClick={() => setZoom(1)}>
                        <MyLocationOutlinedIcon style={{ fontSize: 19 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  <RouteMap match={selected} request={request} zoom={zoom} />

                  <Box style={{ padding: "16px 20px 18px" }}>
                    <Typography style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.6px", color: "#3b4357" }}>
                      MAP LEGEND
                    </Typography>
                    <Box style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", marginTop: 10, fontSize: 12.5, fontWeight: 600 }}>
                      <LegendItem label="Your Requested Route">
                        <span style={{ width: 22, borderTop: "2.5px dashed #4a46d6" }} />
                      </LegendItem>
                      <LegendItem label="Rider Route">
                        <span style={{ width: 22, height: 5, borderRadius: 3, background: "#bdb9f7" }} />
                      </LegendItem>
                      <LegendItem label="Shared Overlap Segment" color={teal}>
                        <span style={{ width: 22, height: 6, borderRadius: 3, background: teal }} />
                      </LegendItem>
                    </Box>
                  </Box>
                </Box>

                {/* safety */}
                <Box style={{ ...cardStyle, padding: 24 }}>
                  <Box style={{ display: "flex", gap: 16 }}>
                    <Box
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: "#d6f3ef",
                        color: tealBright,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ShieldOutlinedIcon style={{ fontSize: 30 }} />
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: 18, fontWeight: 800 }}>Safety Match Confirmed</Typography>
                      <Typography style={{ fontSize: 13.5, color: "#475066", lineHeight: 1.6, marginTop: 6 }}>
                        These Riders meet your configured SafeRoute matching requirements: 100%
                        Aadhaar verified, government-issued commercial ID validation, mandatory
                        dual helmets, AIS-140 GPS route guardrails, and tokenized private
                        contact data.
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="cr-tiles" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginTop: 20 }}>
                    <SafetyTile icon={<CurrencyRupeeOutlinedIcon style={{ fontSize: 20 }} />} title="Zero Surcharge" text="Strict Fuel-Split Only" />
                    <SafetyTile icon={<LocationOnOutlinedIcon style={{ fontSize: 20 }} />} title="AIS-140 Active" text="Corridor Deviation Guard" />
                    <SafetyTile icon={<LockOutlinedIcon style={{ fontSize: 20 }} />} title="Masked Contact" text="Zero Number Sharing" />
                  </Box>

                  <Typography style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: tealBright, marginTop: 22 }}>
                    SafeRoute Urban Transit Assurance Charter
                  </Typography>
                </Box>

                <Box
                  style={{
                    background: "#eceefd",
                    borderRadius: 16,
                    padding: "16px 18px",
                    display: "flex",
                    gap: 12,
                    fontSize: 13,
                    color: "#3b4357",
                    lineHeight: 1.5,
                  }}
                >
                  <InfoOutlinedIcon style={{ fontSize: 20, color: muted, flexShrink: 0 }} />
                  Riders undergo scheduled breathalyzer and helmet spot-checks at designated
                  metro corridor bays.
                </Box>
              </Box>
            </Box>
          </>
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
        copyright="SafeRoute Technologies India Pvt Ltd. All rights reserved."
      />

      {/* ============================ RIDER DIALOG ======================= */}
      <Dialog
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        slotProps={{ paper: { style: { borderRadius: 20, maxWidth: 460, width: "100%", margin: 16 } } }}
      >
        {viewing && (
          <Box style={{ padding: "24px 24px 20px" }}>
            <Box style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <RiderAvatar match={viewing} size={58} />
              <Box style={{ minWidth: 0 }}>
                <Typography style={{ fontSize: 19, fontWeight: 800 }}>{viewing.rider_name}</Typography>
                <Typography style={{ fontSize: 12.5, fontWeight: 600, color: tealBright, display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <ShieldOutlinedIcon style={{ fontSize: 15 }} />
                  {viewing.rider_verification}
                </Typography>
              </Box>
            </Box>

            <Box style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 2 }}>
              <DetailRow label="Vehicle" value={`${viewing.vehicle_model} · ${viewing.vehicle_plate}`} />
              <DetailRow label="Pickup" value={`${formatTime(viewing.pickup_time)} · ${viewing.pickup_point}`} />
              <DetailRow label="Drop-off" value={`${formatTime(viewing.arrival_time)} · ${viewing.arrival_point}`} />
              <DetailRow label="Ride time" value={`${viewing.duration_min} mins · ${viewing.route_note}`} />
              <DetailRow label="Route overlap" value={`${viewing.overlap_pct}%`} />
              <DetailRow label="Safety" value={`${viewing.helmet_note} · ${viewing.walk_note}`} />
              <DetailRow label="Fuel-split fare" value={`₹${viewing.fare}`} />
            </Box>

            <Typography style={{ fontSize: 12.5, color: muted, lineHeight: 1.5, marginTop: 16 }}>
              Sending a ride request to a rider isn't available yet. Check back soon.
            </Typography>

            <Box style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <Button onClick={() => setViewing(null)} style={{ textTransform: "none", fontWeight: 700, color: muted }}>
                Close
              </Button>
              <Button
                disabled
                disableElevation
                style={{ textTransform: "none", fontWeight: 800, borderRadius: 10, padding: "8px 20px", background: "#dfe4ff", color: "#6c7579" }}
              >
                Request Lift
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Rider card                                                         */
/* ------------------------------------------------------------------ */

function RiderAvatar({ match, size = 64 }) {
  return (
    <Box style={{ position: "relative", width: size + 8, height: size + 8, flexShrink: 0 }}>
      <Avatar
        src={toAbsoluteUrl(match.rider_photo_url) || undefined}
        style={{
          width: size,
          height: size,
          margin: 4,
          border: `3px solid #9be3da`,
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

function RiderCard({ match: m, request, active, onPreview, onView }) {
  const pickup = splitTime(m.pickup_time);
  const arrival = splitTime(m.arrival_time);
  const seats = `${m.seats_available} Pillion Seat${m.seats_available === 1 ? "" : "s"} Available`;

  return (
    <Box
      style={{
        ...cardStyle,
        padding: "22px 22px 24px",
        border: active ? `2px solid ${tealBright}` : "2px solid transparent",
        boxSizing: "border-box",
      }}
    >
      {/* header */}
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <Box style={{ display: "flex", gap: 14, minWidth: 0 }}>
          <RiderAvatar match={m} />
          <Box style={{ minWidth: 0 }}>
            <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Typography style={{ fontSize: 20, fontWeight: 800 }}>{m.rider_name}</Typography>
              <Box style={{ background: "#e1e5fb", color: "#3c40c8", borderRadius: 6, padding: "2px 9px", fontSize: 11.5, fontWeight: 700 }}>
                Rider
              </Box>
              <Box
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#e5eafc",
                  color: "#1f6f68",
                  borderRadius: 6,
                  padding: "2px 9px",
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                <ShieldOutlinedIcon style={{ fontSize: 13 }} />
                {m.rider_verification}
              </Box>
              {m.is_demo && (
                <Box style={{ background: "#fff4dc", color: "#7a5300", borderRadius: 6, padding: "2px 8px", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.4px" }}>
                  DEMO
                </Box>
              )}
            </Box>
            <Typography
              component="div"
              style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, fontSize: 13, color: "#3b4357", flexWrap: "wrap" }}
            >
              <TwoWheelerOutlinedIcon style={{ fontSize: 17, color: muted }} />
              {m.vehicle_model}
              <span style={{ color: "#9aa1b5" }}>•</span>
              <span style={{ fontFamily: "'Roboto Mono', Consolas, monospace", color: muted, fontSize: 12 }}>
                {m.vehicle_plate}
              </span>
            </Typography>
          </Box>
        </Box>

        <Box
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#d6f3ef",
            color: teal,
            borderRadius: 10,
            padding: "7px 13px",
            fontSize: 13,
            fontWeight: 800,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <TrendingUpIcon style={{ fontSize: 17 }} />
          {m.overlap_pct}% Overlap
        </Box>
      </Box>

      {/* timing */}
      <Box style={{ background: "#f7f8fe", borderRadius: 16, padding: "18px 20px 14px", marginTop: 20 }}>
        <Box className="cr-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <Stat label="Pickup Window" clock={pickup.clock} unit={pickup.meridiem} sub={shortName(m.pickup_point, shortName(request.pickup))} />
          <Stat label="Est. Arrival" clock={arrival.clock} unit={arrival.meridiem} sub={shortName(m.arrival_point, shortName(request.destination))} separated />
          <Stat label="Total Duration" clock={String(m.duration_min)} unit="mins" sub={m.route_note} separated />
        </Box>

        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
            borderTop: "1px solid #e8eaf6",
            marginTop: 14,
            paddingTop: 12,
            fontSize: 13,
            color: "#2f3550",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 600 }}>
            <FlagOutlinedIcon style={{ fontSize: 16, color: tealBright }} />
            {seats}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <SportsMotorsportsOutlinedIcon style={{ fontSize: 16, color: tealBright }} />
            {m.helmet_note} • {m.walk_note}
          </span>
        </Box>
      </Box>

      {/* fare + actions */}
      <Box className="cr-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <Box>
          <Box style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.5px" }}>₹{m.fare}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#3b4357" }}>Fixed Fuel-Split</span>
          </Box>
          <Typography style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>
            Community shared rate · Zero surge surcharge
          </Typography>
        </Box>

        <Box style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Box
            className="cr-btn"
            role="button"
            tabIndex={0}
            onClick={onPreview}
            onKeyDown={activateOnKey(onPreview)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700, cursor: "pointer", padding: "8px 6px" }}
          >
            <CallSplitOutlinedIcon style={{ fontSize: 18 }} />
            Route Preview
          </Box>
          <Button
            disableElevation
            onClick={onView}
            endIcon={<ArrowForwardIcon style={{ fontSize: 18 }} />}
            style={{
              background: teal,
              color: "#fff",
              borderRadius: 12,
              padding: "11px 24px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            View Rider
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function Stat({ label, clock, unit, sub, separated }) {
  return (
    <Box
      className={separated ? "cr-stat-sep" : undefined}
      style={{
        minWidth: 0,
        paddingLeft: separated ? 22 : 0,
        borderLeft: separated ? "1px solid #e8eaf6" : "none",
      }}
    >
      <Typography style={{ fontSize: 12.5, color: "#3b4357" }}>{label}</Typography>
      <Box style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: teal, letterSpacing: "-0.5px" }}>{clock}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: muted }}>{unit}</span>
      </Box>
      <Typography style={{ fontSize: 12.5, color: muted, marginTop: 2, wordBreak: "break-word" }}>{sub}</Typography>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Route map (schematic)                                              */
/* ------------------------------------------------------------------ */

const MAP_W = 500;
const MAP_H = 330;
const PIN_P = { x: 112, y: 258 };
const PIN_D = { x: 404, y: 112 };

const BLOCKS = [
  [20, 20, 90, 70], [130, 20, 110, 70], [270, 28, 90, 62], [388, 18, 92, 80],
  [20, 120, 80, 80], [370, 150, 110, 70], [150, 150, 70, 60], [270, 190, 80, 60],
  [20, 240, 70, 70], [190, 262, 90, 56], [330, 262, 80, 56], [430, 250, 50, 62],
];

// A point a fraction t of the way from pickup to drop, nudged sideways by `off`
const along = (t, off = 0) => {
  const dx = PIN_D.x - PIN_P.x;
  const dy = PIN_D.y - PIN_P.y;
  const len = Math.hypot(dx, dy);
  return {
    x: PIN_P.x + dx * t + (-dy / len) * off,
    y: PIN_P.y + dy * t + (dx / len) * off,
  };
};

function MapLabel({ x, y, text }) {
  const w = Math.round(text.length * 6.4 + 18);
  const left = Math.max(6, Math.min(MAP_W - w - 6, x));
  return (
    <g transform={`translate(${left} ${y})`}>
      <rect width={w} height={23} rx={6} fill="#141b34" />
      <text x={w / 2} y={15.5} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="Inter, Arial, sans-serif">
        {text}
      </text>
    </g>
  );
}

function RouteMap({ match, request, zoom }) {
  // The rider's route runs a little past the lift taker's trip at each end,
  // and the shared segment's length follows the overlap %.
  const overlap = match ? match.overlap_pct / 100 : 0;
  const shareStart = 0.04;
  const shareEnd = shareStart + overlap * 0.92;

  const r0 = along(-0.12, 11);
  const r1 = along(1.1, 11);
  const s0 = along(shareStart, 11);
  const s1 = along(shareEnd, 11);

  const line = (a, b) => `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;

  return (
    <Box style={{ position: "relative", background: "#eef0fb", aspectRatio: `${MAP_W} / ${MAP_H}`, overflow: "hidden" }}>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Schematic of your route and the selected rider's route"
        style={{ position: "absolute", inset: 0 }}
      >
        <g transform={`translate(${MAP_W / 2} ${MAP_H / 2}) scale(${zoom}) translate(${-MAP_W / 2} ${-MAP_H / 2})`} style={{ transition: "transform 0.2s ease" }}>
          {BLOCKS.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={5} fill="#e3e6f7" />
          ))}
          <g stroke="#d4d8ee" strokeWidth="2.5" strokeLinecap="round">
            <path d="M0 105 L500 105" />
            <path d="M0 230 L500 230" />
            <path d="M255 0 L255 330" />
            <path d="M360 0 L360 330" />
          </g>

          {match && (
            <>
              {/* rider route */}
              <path d={line(r0, r1)} stroke="#bdb9f7" strokeWidth="10" strokeLinecap="round" fill="none" />
              {/* shared overlap */}
              <path d={line(s0, s1)} stroke={teal} strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d={line(s0, s1)} stroke="#fff" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* requested route */}
          <path d={line(PIN_P, PIN_D)} stroke="#4a46d6" strokeWidth="2.6" strokeDasharray="6 5" strokeLinecap="round" fill="none" />

          {/* pins */}
          <circle cx={PIN_P.x} cy={PIN_P.y} r="13" fill="rgba(0,105,95,0.2)" />
          <circle cx={PIN_P.x} cy={PIN_P.y} r="7" fill={teal} />
          <circle cx={PIN_P.x} cy={PIN_P.y} r="3" fill="#fff" />
          <circle cx={PIN_D.x} cy={PIN_D.y} r="13" fill="rgba(85,89,226,0.22)" />
          <circle cx={PIN_D.x} cy={PIN_D.y} r="7" fill={indigo} />
          <circle cx={PIN_D.x} cy={PIN_D.y} r="3" fill="#fff" />

          <MapLabel x={PIN_P.x - 22} y={PIN_P.y + 18} text="Pickup" />
          <MapLabel x={PIN_D.x - 90} y={PIN_D.y - 40} text={`Drop · ${shortName(request.destination, "Destination")}`} />
        </g>
      </svg>

      <Box
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          maxWidth: "calc(100% - 24px)",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 18,
          padding: "6px 13px",
          fontSize: 12,
          fontWeight: 700,
          boxShadow: "0 2px 10px rgba(30,35,90,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <Box style={{ width: 8, height: 8, borderRadius: "50%", background: tealBright, flexShrink: 0 }} />
        {match
          ? `${match.rider_name} · ${match.overlap_pct}% route overlap · ${match.duration_min} min ride`
          : "No rider selected"}
      </Box>

      {match && (
        <Box
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 18,
            padding: "6px 13px",
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "0 2px 10px rgba(30,35,90,0.12)",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <ShieldOutlinedIcon style={{ fontSize: 14, color: tealBright }} />
          {match.route_note}
        </Box>
      )}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function LegendItem({ children, label, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: color || "#3b4357" }}>
      {children}
      {label}
    </span>
  );
}

function SafetyTile({ icon, title, text }) {
  return (
    <Box style={{ background: "#eef0fb", borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
      <Box style={{ color: tealBright, display: "flex", justifyContent: "center" }}>{icon}</Box>
      <Typography style={{ fontSize: 12.5, fontWeight: 800, marginTop: 6 }}>{title}</Typography>
      <Typography style={{ fontSize: 12, color: muted, lineHeight: 1.35, marginTop: 2 }}>{text}</Typography>
    </Box>
  );
}

function DetailRow({ label, value }) {
  return (
    <Box style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "9px 0", borderBottom: "1px solid #eef0f8", fontSize: 13.5 }}>
      <span style={{ color: muted, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 700, textAlign: "right", wordBreak: "break-word" }}>{value}</span>
    </Box>
  );
}
