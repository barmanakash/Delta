import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Avatar, Box, Button, CircularProgress, Typography } from "@mui/material";

import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import SportsMotorsportsOutlinedIcon from "@mui/icons-material/SportsMotorsportsOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

import { RiderHeader, RiderFooter } from "../riderlayout/riderlayout";
import { LiftTakerHeader, LiftTakerFooter } from "../lifttakerlayout/lifttakerlayout";
import {
  apiRequest,
  clearSession,
  errorText,
  formatClock,
  initialsOf,
  toAbsoluteUrl,
  useCachedUser,
} from "../riderrequests/riderrequests";
import RouteMap from "../createcommute/routemap";
import { fetchRoute } from "../createcommute/createcommute";

/* ------------------------------------------------------------------ */
/*  Look                                                               */
/* ------------------------------------------------------------------ */

const teal = "#007d73";
const indigo = "#5559e2";
const dark = "#182136";
const muted = "#5b6475";
const pageBg = "#f6f6fd";

const cardStyle = {
  background: "#fff",
  borderRadius: 20,
  boxShadow: "0 4px 20px rgba(30,35,90,0.06)",
};

const TONES = {
  live: { bg: "#ffe9d6", fg: "#9a4a00" },
  soon: { bg: "#fff4dc", fg: "#7a5300" },
  upcoming: { bg: "#d6f3ef", fg: "#00695f" },
  past: { bg: "#eceefb", fg: "#4b5468" },
};

/* What each side of the app calls things */
const COPY = {
  rider: {
    subtitle: "Lifts you've agreed to give along your commute.",
    other: "Lift taker",
    money: "Fuel-split received",
    cta: { label: "View Requests", path: "/liftrequest" },
    emptyTitle: "No trips yet",
    emptyBody:
      "When you accept a lift request, the trip appears here with the pickup point, timings and fuel-split.",
    privacy: "The lift taker's phone number stays masked. Contact happens inside FriendRide only.",
  },
  lift: {
    subtitle: "Rides you've booked with verified riders.",
    other: "Rider",
    money: "Fuel-split paid",
    cta: { label: "Find a Lift", path: "/findlift" },
    emptyTitle: "No trips yet",
    emptyBody:
      "Once a rider accepts your request, your trip appears here with the rider, vehicle and pickup details.",
    privacy: "The rider's phone number stays masked. Contact happens inside FriendRide only.",
  },
};

/* ------------------------------------------------------------------ */
/*  Time helpers                                                       */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, "0");

const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Local date-times for a trip (its end rolls to the next day if it crosses midnight)
function tripSpan(trip) {
  const start = new Date(`${trip.travel_date}T${trip.pickup_time}:00`);
  let end = new Date(`${trip.travel_date}T${trip.arrival_time}:00`);
  if (end < start) end = new Date(end.getTime() + 86400000);
  return { start, end };
}

// "Today, 24 Oct" / "Tomorrow, 25 Oct" / "Sat, 26 Oct"
function dayTitle(iso, todayIso) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const [ty, tm, td] = todayIso.split("-").map(Number);
  const diff = Math.round((date - new Date(ty, tm - 1, td)) / 86400000);
  const short = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  if (diff === 0) return `Today, ${short}`;
  if (diff === 1) return `Tomorrow, ${short}`;
  if (diff === -1) return `Yesterday, ${short}`;
  return `${date.toLocaleDateString("en-IN", { weekday: "short" })}, ${short}`;
}

// What to show next to a trip: where it is in time
function timingChip(trip, now) {
  if (trip.phase === "past") {
    return { label: trip.status === "completed" ? "Completed" : "Past", tone: "past" };
  }
  const { start, end } = trip.span;
  if (now >= start && now <= end) return { label: "In progress", tone: "live" };
  const mins = Math.ceil((start - now) / 60000);
  if (mins > 0 && mins <= 90) return { label: `Starts in ${mins} min${mins === 1 ? "" : "s"}`, tone: "soon" };
  return { label: "Upcoming", tone: "upcoming" };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const IDLE_MAP = { status: "idle" };

export default function Trips() {
  const navigate = useNavigate();
  const cached = useCachedUser();

  const [user, setUser] = useState(cached);
  const [photoUrl, setPhotoUrl] = useState(toAbsoluteUrl(cached?.profile_photo_url));
  const [pendingCount, setPendingCount] = useState(0);

  const [now, setNow] = useState(() => new Date());
  const [data, setData] = useState(null);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("upcoming");
  const [selectedId, setSelectedId] = useState(null);
  const [mapRoute, setMapRoute] = useState(IDLE_MAP);

  const role = data?.role || user?.role || "rider";
  const copy = COPY[role === "lift" ? "lift" : "rider"];
  const todayIso = toISODate(now);

  /* ---- clock (keeps "Starts in 12 mins" and upcoming/past honest) --- */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  /* ---- load trips -------------------------------------------------- */
  const load = useCallback(async () => {
    if (!localStorage.getItem("access_token")) {
      navigate("/signin", { replace: true });
      return;
    }
    try {
      const { ok, status, data: body } = await apiRequest("/api/trips");
      if (status === 401) {
        clearSession();
        navigate("/signin", { replace: true });
        return;
      }
      if (!ok) {
        setLoadError(errorText(body, "Couldn't load your trips."));
        setLoadState("error");
        return;
      }
      setData(body);
      setLoadError("");
      setLoadState("ready");
      // Open on the tab that has something in it
      setTab((current) => (current === "upcoming" && body.upcoming_count === 0 && body.past_count > 0 ? "past" : current));
    } catch {
      setLoadError("Unable to connect to server. Please make sure the backend is running.");
      setLoadState("error");
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  /* ---- the real signed-in user (never fixed text) ------------------ */
  useEffect(() => {
    if (!localStorage.getItem("access_token")) return;
    apiRequest("/api/auth/me")
      .then(({ ok, data: me }) => {
        if (!ok || !me) return;
        localStorage.setItem("user", JSON.stringify(me));
        setUser(me);
        setPhotoUrl(toAbsoluteUrl(me.profile_photo_url));
      })
      .catch(() => {
        // offline: keep the cached user
      });
  }, []);

  /* ---- the rider's "Requests" badge -------------------------------- */
  useEffect(() => {
    if (role !== "rider") return;
    apiRequest("/api/rides/requests/incoming")
      .then(({ ok, data: body }) => {
        if (ok && body) setPendingCount(body.pending_count || 0);
      })
      .catch(() => {
        // the badge just stays hidden
      });
  }, [role]);

  /* ---- trips with their live timing -------------------------------- */
  const trips = useMemo(
    () =>
      (data?.trips || []).map((t) => {
        const span = tripSpan(t);
        return { ...t, span, phase: span.end < now ? "past" : "upcoming" };
      }),
    [data, now]
  );

  const upcoming = useMemo(
    () => trips.filter((t) => t.phase === "upcoming").sort((a, b) => a.span.start - b.span.start),
    [trips]
  );
  const past = useMemo(
    () => trips.filter((t) => t.phase === "past").sort((a, b) => b.span.start - a.span.start),
    [trips]
  );
  const fareTotal = past.reduce((sum, t) => sum + t.fare, 0);

  const list = tab === "upcoming" ? upcoming : past;
  const selected = list.find((t) => t.id === selectedId) || list[0] || null;

  /* ---- road route for the selected trip ---------------------------- */
  const selId = selected?.id;
  const selPickLat = selected?.pickup_lat;
  const selPickLng = selected?.pickup_lng;
  const selDestLat = selected?.destination_lat;
  const selDestLng = selected?.destination_lng;

  useEffect(() => {
    if (!selId) {
      setMapRoute(IDLE_MAP);
      return undefined;
    }
    if ([selPickLat, selPickLng, selDestLat, selDestLng].some((v) => v === null || v === undefined)) {
      setMapRoute({ status: "unavailable" });
      return undefined;
    }

    const start = { lat: selPickLat, lng: selPickLng };
    const end = { lat: selDestLat, lng: selDestLng };
    let cancelled = false;
    setMapRoute({ status: "loading", start, end });

    fetchRoute([start, end])
      .then((result) => {
        if (!cancelled) setMapRoute({ status: "ready", start, end, ...result });
      })
      .catch(() => {
        // no road line: the map still shows the pickup and drop pins
        if (!cancelled) setMapRoute({ status: "ready", start, end, line: null });
      });

    return () => {
      cancelled = true;
    };
  }, [selId, selPickLat, selPickLng, selDestLat, selDestLng]);

  const chooseTrip = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 1000) {
      document.getElementById("trip-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ---------------------------------------------------------------- */

  const Header = role === "lift" ? LiftTakerHeader : RiderHeader;
  const Footer = role === "lift" ? LiftTakerFooter : RiderFooter;
  const headerProps =
    role === "lift"
      ? { active: "trips", user, photoUrl }
      : { active: "trips", user, photoUrl, pendingCount };

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
        .tp-btn:focus-visible { outline: 2px solid ${teal}; outline-offset: 2px; }
        .tp-card:hover { box-shadow: 0 8px 26px rgba(30,35,90,0.12); }
        @media (max-width: 1000px) {
          .tp-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .tp-stats { grid-template-columns: minmax(0, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .tp-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .tp-title-row { flex-direction: column !important; align-items: flex-start !important; }
          .tp-info { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>

      <Header {...headerProps} />

      <Box component="main" style={{ flex: 1 }}>
        <Box
          className="tp-pad"
          style={{ maxWidth: 1560, margin: "0 auto", padding: "28px 32px 0", boxSizing: "border-box" }}
        >
          {/* ----- title ----- */}
          <Box className="tp-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
            <Box>
              <Typography component="h1" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.6px" }}>
                My Trips
              </Typography>
              <Typography style={{ fontSize: 14, color: muted, marginTop: 6 }}>{copy.subtitle}</Typography>
            </Box>
            <Button
              disableElevation
              onClick={() => navigate(copy.cta.path)}
              endIcon={<ArrowForwardIcon style={{ fontSize: 18 }} />}
              style={{
                background: teal,
                color: "#fff",
                borderRadius: 12,
                padding: "10px 22px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: 14.5,
                flexShrink: 0,
              }}
            >
              {copy.cta.label}
            </Button>
          </Box>

          {loadState === "loading" && (
            <Box style={{ display: "flex", justifyContent: "center", padding: "90px 0" }}>
              <CircularProgress style={{ color: teal }} />
            </Box>
          )}

          {loadState === "error" && (
            <Box style={{ ...cardStyle, padding: "32px 24px", textAlign: "center", marginTop: 28 }}>
              <Typography style={{ fontSize: 19, fontWeight: 800 }}>Couldn't load your trips</Typography>
              <Typography style={{ fontSize: 14, color: muted, margin: "8px 0 18px" }}>{loadError}</Typography>
              <Button
                disableElevation
                onClick={() => {
                  setLoadState("loading");
                  load();
                }}
                style={{ background: teal, color: "#fff", borderRadius: 10, textTransform: "none", fontWeight: 700, padding: "8px 22px" }}
              >
                Try again
              </Button>
            </Box>
          )}

          {loadState === "ready" && (
            <>
              {/* ----- stats ----- */}
              <Box className="tp-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: 24 }}>
                <Stat icon={<EventAvailableOutlinedIcon />} label="Upcoming trips" value={upcoming.length} color={teal} bg="#d6f3ef" />
                <Stat icon={<HistoryOutlinedIcon />} label="Past trips" value={past.length} color={indigo} bg="#e1e5fb" />
                <Stat icon={<CurrencyRupeeOutlinedIcon />} label={copy.money} value={`₹${fareTotal}`} color="#9a4a00" bg="#ffe9d6" />
              </Box>

              {/* ----- tabs ----- */}
              <Box
                role="tablist"
                aria-label="Trips"
                style={{ display: "inline-flex", gap: 4, background: "#eceefb", borderRadius: 26, padding: 4, marginTop: 26 }}
              >
                {[
                  { key: "upcoming", label: "Upcoming", count: upcoming.length },
                  { key: "past", label: "Past", count: past.length },
                ].map((t) => {
                  const on = tab === t.key;
                  return (
                    <Box
                      key={t.key}
                      className="tp-btn"
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
                        padding: "9px 22px",
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

              {/* ----- list + details ----- */}
              {trips.length === 0 ? (
                <EmptyState copy={copy} onAction={() => navigate(copy.cta.path)} />
              ) : (
                <Box
                  className="tp-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
                    gap: 24,
                    alignItems: "start",
                    marginTop: 20,
                  }}
                >
                  {/* trips */}
                  <Box style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                    {list.length === 0 && (
                      <Box style={{ ...cardStyle, padding: "28px 24px", textAlign: "center" }}>
                        <Typography style={{ fontSize: 17, fontWeight: 800 }}>
                          {tab === "upcoming" ? "No upcoming trips" : "No past trips yet"}
                        </Typography>
                        <Typography style={{ fontSize: 13.5, color: muted, marginTop: 6 }}>
                          {tab === "upcoming"
                            ? "Your next trip will show up here as soon as one is agreed."
                            : "Trips move here once their ride time has passed."}
                        </Typography>
                      </Box>
                    )}
                    {list.map((trip) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        copy={copy}
                        now={now}
                        todayIso={todayIso}
                        active={selected?.id === trip.id}
                        onSelect={() => chooseTrip(trip.id)}
                      />
                    ))}
                  </Box>

                  {/* details */}
                  <Box id="trip-detail" style={{ minWidth: 0, position: "sticky", top: 84 }}>
                    {selected ? (
                      <TripDetail trip={selected} copy={copy} now={now} todayIso={todayIso} mapRoute={mapRoute} />
                    ) : (
                      <Box style={{ ...cardStyle, padding: "32px 24px", textAlign: "center", color: muted, fontSize: 14 }}>
                        Select a trip to see its route and details.
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      <Box style={{ marginTop: 48 }}>
        <Footer />
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

function Stat({ icon, label, value, color, bg }) {
  return (
    <Box style={{ ...cardStyle, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
      <Box
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: bg,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box style={{ minWidth: 0 }}>
        <Typography style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1 }}>{value}</Typography>
        <Typography style={{ fontSize: 13, color: muted, marginTop: 3 }}>{label}</Typography>
      </Box>
    </Box>
  );
}

function Pill({ tone, children }) {
  const { bg, fg } = TONES[tone];
  return (
    <Box
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: bg,
        color: fg,
        borderRadius: 8,
        padding: "3px 10px",
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

function PersonAvatar({ person, size = 48 }) {
  return (
    <Avatar
      src={toAbsoluteUrl(person.photo_url) || undefined}
      style={{
        width: size,
        height: size,
        border: "3px solid #9be3da",
        boxSizing: "content-box",
        background: "#d8b293",
        color: "#172033",
        fontWeight: 700,
        fontSize: size * 0.34,
        flexShrink: 0,
      }}
    >
      {initialsOf(person.name)}
    </Avatar>
  );
}

function TripCard({ trip, copy, now, todayIso, active, onSelect }) {
  const chip = timingChip(trip, now);

  return (
    <Box
      className="tp-card tp-btn"
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        ...cardStyle,
        padding: "20px 22px",
        cursor: "pointer",
        border: active ? `2px solid ${teal}` : "2px solid transparent",
        boxSizing: "border-box",
        transition: "box-shadow 0.15s ease",
      }}
    >
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Box style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700, color: "#2f3550" }}>
          <CalendarMonthOutlinedIcon style={{ fontSize: 18, color: indigo }} />
          {dayTitle(trip.travel_date, todayIso)}
        </Box>
        <Pill tone={chip.tone}>{chip.label}</Pill>
      </Box>

      {/* the other person */}
      <Box style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
        <PersonAvatar person={trip.counterpart} />
        <Box style={{ minWidth: 0, flex: 1 }}>
          <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Typography style={{ fontSize: 18, fontWeight: 800 }}>{trip.counterpart.name}</Typography>
            <Box style={{ background: "#e1e5fb", color: "#3c40c8", borderRadius: 6, padding: "2px 9px", fontSize: 12, fontWeight: 700 }}>
              {copy.other}
            </Box>
          </Box>
          <Typography
            component="div"
            style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 12.5, fontWeight: 600, color: teal }}
          >
            <ShieldOutlinedIcon style={{ fontSize: 14 }} />
            {trip.counterpart.verification}
          </Typography>
        </Box>
        <Box style={{ textAlign: "right", flexShrink: 0 }}>
          <Typography style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.1 }}>₹{trip.fare}</Typography>
          <Typography style={{ fontSize: 12, color: muted, marginTop: 2 }}>Fuel-split</Typography>
        </Box>
      </Box>

      {/* the journey */}
      <Box style={{ background: "#f7f8fe", borderRadius: 14, padding: "14px 16px", marginTop: 16 }}>
        <Stop dot={teal} time={trip.pickup_time} title={trip.pickup} sub={trip.pickup_point} />
        <Box style={{ borderLeft: "2px dotted #c9cdea", height: 14, marginLeft: 4.5 }} />
        <Stop dot={indigo} time={trip.arrival_time} title={trip.destination} sub={trip.arrival_point} />
      </Box>

      <Box style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 14, fontSize: 12.5, color: "#3b4357", fontWeight: 600 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <TrendingUpIcon style={{ fontSize: 16, color: teal }} /> {trip.overlap_pct}% route overlap
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <AccessTimeOutlinedIcon style={{ fontSize: 16, color: teal }} /> {trip.duration_min} min ride
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <TwoWheelerOutlinedIcon style={{ fontSize: 16, color: teal }} /> {trip.vehicle_model}
        </span>
      </Box>
    </Box>
  );
}

function Stop({ dot, time, title, sub }) {
  return (
    <Box style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <Box style={{ width: 11, height: 11, borderRadius: "50%", background: dot, marginTop: 5, flexShrink: 0 }} />
      <Box style={{ minWidth: 0, flex: 1 }}>
        <Typography style={{ fontSize: 14, fontWeight: 700, wordBreak: "break-word" }}>{title}</Typography>
        {sub && <Typography style={{ fontSize: 12.5, color: muted, wordBreak: "break-word" }}>{sub}</Typography>}
      </Box>
      <Typography style={{ fontSize: 14, fontWeight: 800, color: dark, whiteSpace: "nowrap" }}>{formatClock(time)}</Typography>
    </Box>
  );
}

function TripDetail({ trip, copy, now, todayIso, mapRoute }) {
  const chip = timingChip(trip, now);
  const ready = mapRoute.status === "ready";

  return (
    <Box style={{ ...cardStyle, overflow: "hidden" }}>
      {/* map */}
      <Box style={{ height: 300, position: "relative", background: "#eef0fb" }}>
        {mapRoute.status === "unavailable" ? (
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
              The map isn't available for this trip because its pickup and drop weren't located on the map.
            </Typography>
          </Box>
        ) : (
          <RouteMap
            start={mapRoute.start || null}
            end={mapRoute.end || null}
            line={ready ? mapRoute.line : null}
            minHeight={300}
            padTop={70}
            padBottom={40}
            startName={ready ? shortName(trip.pickup) : ""}
            startTag="PICKUP"
            endName={ready ? shortName(trip.destination) : ""}
            endTag="DROP-OFF"
          >
            <Box
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                zIndex: 1000,
                background: "rgba(255,255,255,0.96)",
                borderRadius: 18,
                padding: "6px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                boxShadow: "0 2px 10px rgba(30,35,90,0.14)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {mapRoute.status === "loading" && <CircularProgress size={14} style={{ color: teal }} />}
              {mapRoute.status === "loading" && "Finding the route…"}
              {ready && mapRoute.distanceKm
                ? `${mapRoute.distanceKm.toFixed(1)} km · ${trip.duration_min} min ride`
                : ready && `${trip.duration_min} min ride`}
            </Box>
          </RouteMap>
        )}
      </Box>

      <Box style={{ padding: "22px 24px 24px" }}>
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Typography style={{ fontSize: 19, fontWeight: 800 }}>Trip details</Typography>
          <Pill tone={chip.tone}>{chip.label}</Pill>
        </Box>
        <Typography style={{ fontSize: 13, color: muted, marginTop: 4 }}>{dayTitle(trip.travel_date, todayIso)}</Typography>

        {/* person + vehicle */}
        <Box style={{ display: "flex", alignItems: "center", gap: 14, background: "#f7f8fe", borderRadius: 14, padding: "14px 16px", marginTop: 16 }}>
          <PersonAvatar person={trip.counterpart} size={52} />
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Typography style={{ fontSize: 17, fontWeight: 800 }}>{trip.counterpart.name}</Typography>
              <VerifiedOutlinedIcon style={{ fontSize: 18, color: teal }} />
            </Box>
            <Typography style={{ fontSize: 12.5, color: teal, fontWeight: 600 }}>{trip.counterpart.verification}</Typography>
            <Typography style={{ fontSize: 12.5, color: muted, marginTop: 4 }}>
              {copy.other}
              {trip.counterpart.member_since ? ` · Member since ${trip.counterpart.member_since}` : ""}
            </Typography>
          </Box>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid #e4e6f3",
            borderRadius: 14,
            padding: "12px 16px",
            marginTop: 12,
          }}
        >
          <TwoWheelerOutlinedIcon style={{ fontSize: 24, color: teal }} />
          <Box>
            <Typography style={{ fontSize: 14, fontWeight: 700 }}>{trip.vehicle_model}</Typography>
            <Typography style={{ fontSize: 12.5, color: muted, fontFamily: "'Roboto Mono', Consolas, monospace" }}>
              {trip.vehicle_plate}
            </Typography>
          </Box>
        </Box>

        {/* timeline */}
        <Box style={{ marginTop: 20 }}>
          <Stop dot={teal} time={trip.pickup_time} title={trip.pickup} sub={`Pickup · ${trip.pickup_point}`} />
          <Box style={{ borderLeft: "2px dotted #c9cdea", height: 18, marginLeft: 4.5 }} />
          <Stop dot={indigo} time={trip.arrival_time} title={trip.destination} sub={`Drop-off · ${trip.arrival_point}`} />
        </Box>

        {/* facts */}
        <Box className="tp-info" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 20 }}>
          <Fact icon={<AccessTimeOutlinedIcon />} label="Ride time" value={`${trip.duration_min} mins`} sub={trip.route_note} />
          <Fact icon={<TrendingUpIcon />} label="Route overlap" value={`${trip.overlap_pct}%`} />
          <Fact icon={<CurrencyRupeeOutlinedIcon />} label="Fuel-split" value={`₹${trip.fare}`} sub="Zero surge surcharge" />
          <Fact icon={<DirectionsWalkOutlinedIcon />} label="Walk to pickup" value={trip.walk_note} />
        </Box>

        <Box style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#2f3550", marginTop: 16 }}>
          <SportsMotorsportsOutlinedIcon style={{ fontSize: 18, color: teal }} />
          {trip.helmet_note}
        </Box>

        <Box style={{ display: "flex", gap: 10, background: "#eceefd", borderRadius: 12, padding: "12px 14px", marginTop: 16, fontSize: 12.5, color: "#3b4357", lineHeight: 1.5 }}>
          <LockOutlinedIcon style={{ fontSize: 17, color: muted, flexShrink: 0, marginTop: 1 }} />
          {copy.privacy}
        </Box>
      </Box>
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

function EmptyState({ copy, onAction }) {
  return (
    <Box style={{ ...cardStyle, padding: "48px 24px", textAlign: "center", marginTop: 24 }}>
      <Box
        style={{
          width: 60,
          height: 60,
          borderRadius: 18,
          background: "#d6f3ef",
          color: teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <TwoWheelerOutlinedIcon style={{ fontSize: 32 }} />
      </Box>
      <Typography style={{ fontSize: 20, fontWeight: 800 }}>{copy.emptyTitle}</Typography>
      <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "8px auto 22px", maxWidth: 460 }}>
        {copy.emptyBody}
      </Typography>
      <Button
        disableElevation
        onClick={onAction}
        endIcon={<ArrowForwardIcon style={{ fontSize: 18 }} />}
        style={{ background: teal, color: "#fff", borderRadius: 12, padding: "10px 24px", textTransform: "none", fontWeight: 800, fontSize: 14.5 }}
      >
        {copy.cta.label}
      </Button>
    </Box>
  );
}

// "PNT Naka Safe Transit Stop, North Gate" -> "PNT Naka Safe Transit Stop"
function shortName(value) {
  const first = (value || "").split(",")[0].trim();
  return first.length > 26 ? `${first.slice(0, 25).trimEnd()}…` : first;
}
