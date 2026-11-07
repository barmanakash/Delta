import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Popover, Snackbar, Typography } from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import { apiRequest } from "../riderrequests/riderrequests";

/* ------------------------------------------------------------------ */
/*  The notification bell (rider and lift taker headers)               */
/*                                                                     */
/*  Looks for new notifications every few seconds, shows the unread    */
/*  count on the bell, lists them in a dropdown, and pops a small      */
/*  toast when something new arrives while the page is open.           */
/* ------------------------------------------------------------------ */

const teal = "#007d73";
const dark = "#182136";
const muted = "#5b6475";
const POLL_MS = 8000;

// icon + colours for each kind of notification
const KINDS = {
  request_received: { icon: PersonAddAltOutlinedIcon, bg: "#e9ebfb", fg: "#4b4fd8" },
  request_accepted: { icon: CheckCircleOutlineIcon, bg: "#d6f3ef", fg: teal },
  payment_received: { icon: AccountBalanceWalletOutlinedIcon, bg: "#d6f3ef", fg: teal },
  trip_cancelled: { icon: CancelOutlinedIcon, bg: "#fde2e2", fg: "#a12626" },
};

function KindIcon({ kind, size = 40 }) {
  const { icon: Icon, bg, fg } = KINDS[kind] || {
    icon: NotificationsNoneOutlinedIcon,
    bg: "#eceefb",
    fg: muted,
  };
  return (
    <Box
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon style={{ fontSize: size * 0.55 }} />
    </Box>
  );
}

// The server sends UTC times without a "Z"; add it so the browser reads them right
function timeAgo(iso) {
  const hasZone = /[zZ]$|[+-]\d\d:?\d\d$/.test(iso);
  const then = new Date(hasZone ? iso : `${iso}Z`).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export default function NotificationBell({ iconSize = 24 }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [anchor, setAnchor] = useState(null);
  const [toast, setToast] = useState(null); // the newest notification, shown briefly

  const known = useRef(new Set()); // notifications already seen on this page
  const seeded = useRef(false); // the first look never pops a toast

  const load = useCallback(async () => {
    if (document.hidden || !localStorage.getItem("access_token")) return;
    try {
      const { ok, data } = await apiRequest("/api/notifications");
      if (!ok || !data) return;
      const list = data.notifications || [];

      if (seeded.current) {
        const fresh = list.find((n) => !n.read && !known.current.has(n.id));
        if (fresh) setToast(fresh);
      }
      list.forEach((n) => known.current.add(n.id));
      seeded.current = true;

      setItems(list);
      setUnread(data.unread_count || 0);
    } catch {
      // offline: try again next time
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const markRead = (ids) => {
    // update the screen straight away, then tell the server
    const wasUnread = items.filter((n) => !n.read && (!ids || ids.includes(n.id))).length;
    setItems((cur) => cur.map((n) => (!ids || ids.includes(n.id) ? { ...n, read: true } : n)));
    setUnread((cur) => Math.max(0, cur - wasUnread));
    apiRequest("/api/notifications/read", { method: "POST", body: ids ? { ids } : {} }).catch(() => {
      // not saved: it will show as unread again next time
    });
  };

  const open = (n) => {
    if (!n.read) markRead([n.id]);
    setAnchor(null);
    setToast(null);
    if (n.link) navigate(n.link);
  };

  return (
    <>
      <Box
        component="button"
        type="button"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        onClick={(e) => setAnchor(e.currentTarget)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          padding: 4,
          cursor: "pointer",
          borderRadius: 10,
        }}
      >
        <NotificationsNoneOutlinedIcon style={{ fontSize: iconSize, color: "#343b43" }} />
        {unread > 0 && (
          <Box
            component="span"
            style={{
              position: "absolute",
              top: -3,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: "0 4px",
              boxSizing: "border-box",
              borderRadius: 9,
              background: "#dc2929",
              color: "#fff",
              fontSize: 10.5,
              fontWeight: 800,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #fff",
            }}
          >
            {unread > 9 ? "9+" : unread}
          </Box>
        )}
      </Box>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { style: { borderRadius: 16, marginTop: 8, boxShadow: "0 12px 36px rgba(24,33,54,0.18)" } } }}
      >
        <Box style={{ width: "min(380px, calc(100vw - 24px))", fontFamily: "Inter, Arial, sans-serif" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 16px 10px",
              borderBottom: "1px solid #eceef6",
            }}
          >
            <Typography style={{ fontSize: 16, fontWeight: 800, color: dark }}>Notifications</Typography>
            {unread > 0 && (
              <Button
                onClick={() => markRead(null)}
                style={{ textTransform: "none", fontWeight: 700, fontSize: 12.5, color: teal, padding: "2px 8px" }}
              >
                Mark all as read
              </Button>
            )}
          </Box>

          <Box style={{ maxHeight: 420, overflowY: "auto" }}>
            {items.length === 0 ? (
              <Box style={{ padding: "36px 20px", textAlign: "center" }}>
                <NotificationsNoneOutlinedIcon style={{ fontSize: 34, color: "#b4b9c6" }} />
                <Typography style={{ fontSize: 14, fontWeight: 700, color: dark, marginTop: 6 }}>
                  You're all caught up
                </Typography>
                <Typography style={{ fontSize: 13, color: muted, marginTop: 2 }}>
                  Requests, accepted lifts and payments will show up here.
                </Typography>
              </Box>
            ) : (
              items.map((n) => (
                <Box
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => open(n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      open(n);
                    }
                  }}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 16px",
                    cursor: "pointer",
                    background: n.read ? "#fff" : "#f3f9f8",
                    borderBottom: "1px solid #f1f2f8",
                    outline: "none",
                  }}
                >
                  <KindIcon kind={n.kind} />
                  <Box style={{ minWidth: 0, flex: 1 }}>
                    <Box style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <Typography style={{ fontSize: 14, fontWeight: n.read ? 600 : 800, color: dark }}>
                        {n.title}
                      </Typography>
                      <Typography style={{ fontSize: 11.5, color: "#8a91a1", whiteSpace: "nowrap" }}>
                        {timeAgo(n.created_at)}
                      </Typography>
                    </Box>
                    <Typography style={{ fontSize: 13, color: muted, lineHeight: 1.45, marginTop: 2, wordBreak: "break-word" }}>
                      {n.message}
                    </Typography>
                  </Box>
                  {!n.read && (
                    <Box style={{ width: 8, height: 8, borderRadius: "50%", background: teal, marginTop: 6, flexShrink: 0 }} />
                  )}
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Popover>

      {/* a small pop-up when something new arrives while the page is open */}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={7000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") setToast(null);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        style={{ top: 82 }}
      >
        <Box
          onClick={() => toast && open(toast)}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            width: "min(380px, calc(100vw - 32px))",
            boxSizing: "border-box",
            background: "#fff",
            borderRadius: 16,
            borderLeft: `5px solid ${teal}`,
            boxShadow: "0 12px 36px rgba(24,33,54,0.22)",
            padding: "14px 16px",
            cursor: "pointer",
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          {toast && <KindIcon kind={toast.kind} size={38} />}
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Typography style={{ fontSize: 14.5, fontWeight: 800, color: dark }}>{toast?.title}</Typography>
            <Typography style={{ fontSize: 13, color: muted, lineHeight: 1.45, marginTop: 2, wordBreak: "break-word" }}>
              {toast?.message}
            </Typography>
          </Box>
        </Box>
      </Snackbar>
    </>
  );
}
