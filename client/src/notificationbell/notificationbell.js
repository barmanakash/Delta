import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Popover, Typography } from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {
  apiRequest,
  formatClock,
  formatDayLabel,
  formatExpiry,
  initialsOf,
  toAbsoluteUrl,
} from "../riderrequests/riderrequests";

/**
 * The rider's notification bell.
 *
 * A "notification" here is a lift request from a lift taker whose trip fits
 * the rider's commute (the server only returns requests on the rider's route,
 * see GET /api/rides/requests/incoming).
 *
 *   - It checks for new requests every few seconds while the tab is open.
 *   - A request the rider hasn't looked at yet counts as unread: the bell
 *     shows a red number and shakes when a new one arrives.
 *   - While the rider is on any page, a small alert slides in announcing the
 *     new request, with a button that opens it.
 *   - Opening the bell lists the requests; opening a request marks it read.
 *   - Which requests were already seen is remembered in localStorage, so the
 *     badge is right after a reload.
 */

const teal = "#007d73";
const dark = "#182136";
const muted = "#5b6475";

const POLL_MS = 6000; // how often to look for new requests
const TOAST_MS = 9000; // how long the "new request" alert stays
const MAX_LISTED = 8; // requests shown in the panel (the rest are on the Requests page)

/* ---- which requests the rider has already seen ---------------------- */

const seenKeyFor = (user) => `fr_seen_requests:${user?.email || user?.id || "rider"}`;

function loadSeen(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key)) || []);
  } catch {
    return new Set();
  }
}

function saveSeen(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    // storage full / blocked: the badge just won't survive a reload
  }
}

/* ------------------------------------------------------------------ */

export default function NotificationBell({ user, enabled = true }) {
  const navigate = useNavigate();
  const seenKey = seenKeyFor(user);

  const [pending, setPending] = useState([]); // lift requests waiting for an answer
  const [loaded, setLoaded] = useState(false);
  const [seen, setSeen] = useState(() => loadSeen(seenKey));
  const [highlight, setHighlight] = useState(() => new Set()); // unread when the panel was opened
  const [anchorEl, setAnchorEl] = useState(null);
  const [toast, setToast] = useState(null); // { request, count } for the live alert
  const [ringKey, setRingKey] = useState(0);

  const open = Boolean(anchorEl);
  const openRef = useRef(false);
  openRef.current = open;
  const keyRef = useRef(seenKey);
  const seenRef = useRef(seen);
  const knownIds = useRef(null); // ids from the previous check (null = first check not done)

  const commitSeen = useCallback((next) => {
    seenRef.current = next;
    setSeen(next);
    saveSeen(keyRef.current, next);
  }, []);

  // The signed-in user can arrive after the first render: switch to their own record
  useEffect(() => {
    keyRef.current = seenKey;
    const stored = loadSeen(seenKey);
    seenRef.current = stored;
    setSeen(stored);
  }, [seenKey]);

  /* ---- look for requests on the rider's route ----------------------- */
  const poll = useCallback(async () => {
    if (document.hidden || !localStorage.getItem("access_token")) return;
    try {
      const { ok, data } = await apiRequest("/api/rides/requests/incoming");
      if (!ok || !data) return;

      const list = (data.requests || []).filter((r) => r.status === "pending");
      const ids = new Set(list.map((r) => r.id));
      setPending(list);
      setLoaded(true);

      // forget requests that are gone (accepted, declined, expired)
      const kept = new Set([...seenRef.current].filter((id) => ids.has(id)));
      if (kept.size !== seenRef.current.size) commitSeen(kept);

      // anything that wasn't there on the previous check is new
      if (knownIds.current) {
        const fresh = list.filter((r) => !knownIds.current.has(r.id));
        if (fresh.length) {
          setRingKey((k) => k + 1);
          if (!openRef.current) setToast({ request: fresh[0], count: fresh.length });
        }
      }
      knownIds.current = ids;
    } catch {
      // offline / backend down: we'll look again on the next check
    }
  }, [commitSeen]);

  useEffect(() => {
    if (!enabled) return undefined;
    poll();
    const timer = setInterval(poll, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, poll]);

  // the live alert goes away by itself
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ---- unread / read ------------------------------------------------ */
  const unreadCount = pending.filter((r) => !seen.has(r.id)).length;

  // While the panel is open everything in it counts as read; remember which
  // ones were new so they can keep their "new" dot until it is closed
  useEffect(() => {
    if (!open) return;
    const unseen = pending.filter((r) => !seenRef.current.has(r.id));
    if (!unseen.length) return;
    setHighlight((h) => new Set([...h, ...unseen.map((r) => r.id)]));
    const next = new Set(seenRef.current);
    unseen.forEach((r) => next.add(r.id));
    commitSeen(next);
  }, [open, pending, commitSeen]);

  const markRead = (id) => {
    if (seenRef.current.has(id)) return;
    const next = new Set(seenRef.current);
    next.add(id);
    commitSeen(next);
  };

  const closePanel = () => {
    setAnchorEl(null);
    setHighlight(new Set());
  };

  const openRequest = (request) => {
    markRead(request.id);
    setToast(null);
    closePanel();
    navigate(`/viewRequest/${request.id}`);
  };

  const label = `Notifications${unreadCount ? `, ${unreadCount} new` : ""}`;
  const listed = pending.slice(0, MAX_LISTED);

  return (
    <>
      <style>{`
        @keyframes nb-ring {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(9deg); }
          60% { transform: rotate(-6deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes nb-pop {
          0% { transform: scale(0.4); }
          60% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes nb-toast-in {
          from { opacity: 0; transform: translate(-50%, -14px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .nb-ring { animation: nb-ring 900ms ease-in-out; }
        .nb-badge { animation: nb-pop 320ms ease-out; }
        .nb-item:hover { background: #f4f5fd; }
        .nb-bell:focus-visible,
        .nb-item:focus-visible,
        .nb-link:focus-visible { outline: 2px solid ${teal}; outline-offset: 2px; }
      `}</style>

      {/* ---- the bell ---- */}
      <Box
        component="button"
        type="button"
        className="nb-bell"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          margin: "0 -6px", // keeps the header spacing the same as the old plain icon
          padding: 0,
          border: "none",
          borderRadius: "50%",
          background: open ? "#f0f1fc" : "transparent",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Box
          key={ringKey}
          component="span"
          className={ringKey ? "nb-ring" : undefined}
          style={{ display: "flex", transformOrigin: "50% 3px" }}
        >
          <NotificationsNoneOutlinedIcon style={{ fontSize: 24, color: "#343b43" }} />
        </Box>

        {unreadCount > 0 && (
          <Box
            key={unreadCount}
            component="span"
            className="nb-badge"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 2,
              right: 0,
              minWidth: 17,
              height: 17,
              padding: "0 4px",
              boxSizing: "border-box",
              borderRadius: 9,
              background: "#dc2929",
              border: "2px solid #fff",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Box>
        )}
      </Box>

      {/* ---- the panel ---- */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={closePanel}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            style: {
              width: 380,
              maxWidth: "calc(100vw - 24px)",
              maxHeight: "min(72vh, 540px)",
              marginTop: 8,
              borderRadius: 16,
              boxShadow: "0 12px 36px rgba(24,33,54,0.18)",
              border: "1px solid #e7e8f1",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "16px 18px 12px",
            borderBottom: "1px solid #eef0f6",
            flexShrink: 0,
          }}
        >
          <Typography style={{ fontSize: 16.5, fontWeight: 800, color: dark }}>Notifications</Typography>
          {pending.length > 0 && (
            <Box
              style={{
                background: "#e0f2f0",
                color: "#00786e",
                borderRadius: 10,
                padding: "3px 10px",
                fontSize: 11.5,
                fontWeight: 800,
              }}
            >
              {pending.length} on your route
            </Box>
          )}
        </Box>

        <Box style={{ overflowY: "auto", flex: 1 }}>
          {listed.length === 0 ? (
            <Box style={{ padding: "34px 24px", textAlign: "center" }}>
              <Box
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: "#d6f3ef",
                  color: teal,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <NotificationsNoneOutlinedIcon style={{ fontSize: 28 }} />
              </Box>
              <Typography style={{ fontSize: 15, fontWeight: 800, color: dark }}>
                {loaded ? "You're all caught up" : "Checking for requests…"}
              </Typography>
              <Typography style={{ fontSize: 13, color: muted, lineHeight: 1.55, marginTop: 6 }}>
                When a verified commuter's trip fits your route, you'll be notified here straight away.
              </Typography>
            </Box>
          ) : (
            listed.map((r) => (
              <Box
                key={r.id}
                className="nb-item"
                role="button"
                tabIndex={0}
                onClick={() => openRequest(r)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openRequest(r);
                  }
                }}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 18px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f2f8",
                  background: highlight.has(r.id) ? "#f2fbf9" : "transparent",
                }}
              >
                <Avatar
                  src={toAbsoluteUrl(r.requester_photo_url) || undefined}
                  style={{
                    width: 42,
                    height: 42,
                    background: "#dce4e7",
                    color: "#24303a",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {initialsOf(r.requester_name)}
                </Avatar>

                <Box style={{ minWidth: 0, flex: 1 }}>
                  <Typography style={{ fontSize: 13.5, color: dark, lineHeight: 1.35 }}>
                    New lift request from <b>{r.requester_name}</b>
                  </Typography>
                  <Typography style={{ fontSize: 12.5, color: muted, marginTop: 3, wordBreak: "break-word" }}>
                    {r.pickup} → {r.destination}
                  </Typography>
                  <Box style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 10px", marginTop: 7 }}>
                    <span style={chip("#e4f4f2", "#007a70")}>{r.overlap_pct}% route match</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: teal }}>₹{r.fare}</span>
                    <span style={{ fontSize: 12, color: muted }}>
                      {formatDayLabel(r.travel_date)}
                      {r.pickup_time ? `, ${formatClock(r.pickup_time)}` : ""}
                    </span>
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: r.expires_in_min <= 15 ? "#d44d4d" : muted,
                    }}
                  >
                    <AccessTimeOutlinedIcon style={{ fontSize: 13 }} />
                    Expires in {formatExpiry(r.expires_in_min)}
                  </Box>
                </Box>

                {highlight.has(r.id) && (
                  <Box
                    aria-label="New"
                    style={{ width: 9, height: 9, borderRadius: "50%", background: teal, marginTop: 6, flexShrink: 0 }}
                  />
                )}
              </Box>
            ))
          )}
        </Box>

        <Box
          className="nb-link"
          role="link"
          tabIndex={0}
          onClick={() => {
            closePanel();
            navigate("/liftrequest");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              closePanel();
              navigate("/liftrequest");
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "13px 18px",
            borderTop: "1px solid #eef0f6",
            fontSize: 13.5,
            fontWeight: 800,
            color: teal,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {pending.length > MAX_LISTED
            ? `View all ${pending.length} requests`
            : "View all requests"}
          <ArrowForwardIcon style={{ fontSize: 16 }} />
        </Box>
      </Popover>

      {/* ---- live alert: a request just came in on the rider's route ---- */}
      {toast &&
        typeof document !== "undefined" &&
        createPortal(
          <Box
            role="status"
            aria-live="polite"
            style={{
              position: "fixed",
              top: 78,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2100,
              width: "min(420px, calc(100vw - 24px))",
              boxSizing: "border-box",
              background: "#fff",
              borderRadius: 16,
              borderLeft: `5px solid ${teal}`,
              boxShadow: "0 12px 36px rgba(24,33,54,0.22)",
              padding: "14px 14px 14px 16px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              animation: "nb-toast-in 0.35s ease-out",
            }}
          >
            <Box
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "#d6f3ef",
                color: teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <NotificationsActiveOutlinedIcon />
            </Box>

            <Box style={{ minWidth: 0, flex: 1 }}>
              <Typography style={{ fontSize: 14.5, fontWeight: 800, color: dark }}>
                {toast.count > 1
                  ? `${toast.count} new lift requests on your route`
                  : "New lift request on your route"}
              </Typography>
              <Typography style={{ fontSize: 13, color: muted, lineHeight: 1.45, marginTop: 2, wordBreak: "break-word" }}>
                {toast.request.requester_name} · {toast.request.pickup} → {toast.request.destination}
              </Typography>
              <Box style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => openRequest(toast.request)}
                  style={{
                    border: "none",
                    background: teal,
                    color: "#fff",
                    borderRadius: 9,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {toast.count > 1 ? "View first" : "View request"}
                </Box>
                {toast.count > 1 && (
                  <Box
                    component="button"
                    type="button"
                    onClick={() => {
                      setToast(null);
                      navigate("/liftrequest");
                    }}
                    style={{
                      border: "none",
                      background: "#e9ebfb",
                      color: dark,
                      borderRadius: 9,
                      padding: "6px 14px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    See all
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              component="button"
              type="button"
              aria-label="Dismiss"
              onClick={() => setToast(null)}
              style={{
                border: "none",
                background: "transparent",
                color: muted,
                cursor: "pointer",
                padding: 2,
                display: "flex",
                flexShrink: 0,
              }}
            >
              <CloseIcon style={{ fontSize: 20 }} />
            </Box>
          </Box>,
          document.body
        )}
    </>
  );
}

function chip(bg, fg) {
  return {
    background: bg,
    color: fg,
    borderRadius: 8,
    padding: "2px 8px",
    fontSize: 11.5,
    fontWeight: 800,
    whiteSpace: "nowrap",
  };
}
