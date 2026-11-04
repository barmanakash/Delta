import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { apiRequest } from "../riderrequests/riderrequests";

/* ------------------------------------------------------------------ */
/*  "Payment received" popup for riders                                */
/*                                                                     */
/*  Mounted once inside RiderHeader, so it shows on every rider page.  */
/*  It asks the server every few seconds for payments the rider has    */
/*  not been told about yet, and keeps showing one until the rider     */
/*  dismisses it (so a payment made while they were away is still      */
/*  announced next time they open the app).                            */
/* ------------------------------------------------------------------ */

const teal = "#007d73";
const dark = "#182136";
const muted = "#5b6475";
const POLL_MS = 10000;

export default function PaymentReceivedToast({ enabled }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const dismissed = useRef(new Set()); // notices closed during this visit

  const poll = useCallback(async () => {
    if (document.hidden || !localStorage.getItem("access_token")) return;
    try {
      const { ok, data } = await apiRequest("/api/payments/received");
      if (!ok || !data) return;
      setItems((data.payments || []).filter((p) => !dismissed.current.has(p.trip_id)));
    } catch {
      // offline: we'll look again next time
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    poll();
    const id = setInterval(poll, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, poll]);

  const dismissAll = () => {
    const ids = items.map((p) => p.trip_id);
    ids.forEach((id) => dismissed.current.add(id));
    setItems([]);
    apiRequest("/api/payments/received/seen", { method: "POST", body: { trip_ids: ids } }).catch(() => {
      // not marked as seen: it may show again later, which is fine
    });
  };

  if (!enabled || items.length === 0) return null;

  const latest = items[0];
  const total = items.reduce((sum, p) => sum + p.amount, 0);
  const many = items.length > 1;

  return (
    <Box
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 82,
        right: 20,
        zIndex: 2000,
        width: "min(380px, calc(100vw - 32px))",
        boxSizing: "border-box",
        background: "#fff",
        borderRadius: 16,
        borderLeft: `5px solid ${teal}`,
        boxShadow: "0 12px 36px rgba(24,33,54,0.22)",
        padding: "16px 16px 14px 16px",
        animation: "prt-in 0.35s ease-out",
      }}
    >
      <style>{`@keyframes prt-in { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: none; } }`}</style>

      <Box style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Box
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "#d6f3ef",
            color: teal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AccountBalanceWalletOutlinedIcon />
        </Box>

        <Box style={{ minWidth: 0, flex: 1 }}>
          <Typography style={{ fontSize: 15.5, fontWeight: 800, color: dark }}>
            {many ? `${items.length} payments received` : "Payment received"}
          </Typography>
          <Typography style={{ fontSize: 22, fontWeight: 800, color: teal, letterSpacing: "-0.4px", marginTop: 2 }}>
            ₹{many ? total : latest.amount}
          </Typography>
          <Typography style={{ fontSize: 13, color: muted, lineHeight: 1.5, marginTop: 2, wordBreak: "break-word" }}>
            {many
              ? `Latest: ₹${latest.amount} from ${latest.from_name}.`
              : `From ${latest.from_name} for the trip ${latest.pickup} → ${latest.destination}.`}
          </Typography>
        </Box>

        <Box
          component="button"
          type="button"
          aria-label="Dismiss"
          onClick={dismissAll}
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
      </Box>

      <Box style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <Button
          disableElevation
          onClick={dismissAll}
          style={{ textTransform: "none", fontWeight: 700, fontSize: 13.5, color: muted, borderRadius: 10 }}
        >
          Got it
        </Button>
        <Button
          disableElevation
          onClick={() => {
            dismissAll();
            navigate("/trips");
          }}
          style={{
            background: teal,
            color: "#fff",
            textTransform: "none",
            fontWeight: 800,
            fontSize: 13.5,
            borderRadius: 10,
            padding: "6px 16px",
          }}
        >
          View trips
        </Button>
      </Box>
    </Box>
  );
}
