import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Dialog, Typography } from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import ProfileMenu from "../profilemenu/profilemenu";

/**
 * Header + footer shared by the lift taker screens (lift taker only,
 * the rider screens have their own layout).
 *
 *   <LiftTakerHeader active="find" user={user} photoUrl={photoUrl} />
 *   <LiftTakerFooter />
 */

export const LT = {
  teal: "#00695f",
  tealBright: "#007d73",
  indigo: "#5559e2",
  dark: "#141b34",
  muted: "#5b6475",
  pageBg: "#f6f6fd",
};

const { tealBright, dark, muted } = LT;

const activateOnKey = (fn) => (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn(e);
  }
};

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

export function LiftTakerHeader({ active = "home", user, photoUrl }) {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(false);

  return (
    <>
      <style>{`
        .ltl-btn:focus-visible { outline: 2px solid ${tealBright}; outline-offset: 2px; }
        @media (max-width: 760px) {
          .ltl-nav { display: none !important; }
          .ltl-sos-text { display: none !important; }
        }
        @media (max-width: 600px) {
          .ltl-pad { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>

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
          className="ltl-pad"
          style={{
            maxWidth: 1280,
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
            <Box
              className="ltl-btn"
              role="link"
              tabIndex={0}
              onClick={() => navigate("/lifttakerhome")}
              onKeyDown={activateOnKey(() => navigate("/lifttakerhome"))}
              style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}
            >
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
                Safe<span style={{ color: tealBright }}>Route</span>
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
              <SwapVertOutlinedIcon style={{ fontSize: 13, transform: "rotate(90deg)" }} />
            </Box>
          </Box>

          {/* nav */}
          <Box
            className="ltl-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "#f1f2fb",
              borderRadius: 30,
              padding: 4,
            }}
          >
            <NavTab active={active === "home"} onClick={() => navigate("/lifttakerhome")}>
              Home
            </NavTab>
            <NavTab active={active === "find"} onClick={() => navigate("/findlift")}>
              Find a Lift
            </NavTab>
            <NavTab active={active === "trips"} onClick={() => navigate("/trips")}>
              My Trips
            </NavTab>
          </Box>

          {/* actions */}
          <Box style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Box
              className="ltl-btn"
              role="button"
              tabIndex={0}
              aria-label="Police SOS"
              onClick={() => setDialog(true)}
              onKeyDown={activateOnKey(() => setDialog(true))}
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
              <span className="ltl-sos-text">POLICE SOS</span>
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

      {/* Police SOS dialog */}
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
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
                background: "#ffe3e3",
                color: "#c0262d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldOutlinedIcon />
            </Box>
            <Typography style={{ fontSize: 19, fontWeight: 800 }}>Police SOS</Typography>
          </Box>

          <Typography style={{ fontSize: 14, color: muted, lineHeight: 1.55, marginTop: 14 }}>
            If you are in danger, call the police on 112 right away. This opens your
            phone's dialer so you can place the call.
          </Typography>

          <Box style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
            <Button
              onClick={() => setDialog(false)}
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
    </>
  );
}

function NavTab({ active, onClick, children }) {
  return (
    <Box
      className="ltl-btn"
      role="button"
      tabIndex={0}
      aria-current={active ? "page" : undefined}
      onClick={active ? undefined : onClick}
      onKeyDown={active ? undefined : activateOnKey(onClick)}
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

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

const DEFAULT_FOOTER_TEXT =
  "SafeRoute Intercity & Metro Commuter Network. Certified pooled mobility engineered for institutional passenger security, verified identity networks, and continuous telemetry across Indian metros.";

const DEFAULT_FOOTER_COLUMNS = [
  {
    title: "Passenger Assurance",
    items: ["Safety Charter", "Emergency SOS Protocols", "Driver Verification Grid", "Insurance Coverage"],
  },
  {
    title: "Network & Governance",
    items: ["Metro Mobility Grid", "Privacy Policy", "Terms of Service", "Help & Contact Support"],
  },
];

export function LiftTakerFooter({
  description = DEFAULT_FOOTER_TEXT,
  columns = DEFAULT_FOOTER_COLUMNS,
}) {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" style={{ background: "#f0f1fc", marginTop: 64 }}>
      <style>{`
        @media (max-width: 960px) {
          .ltl-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .ltl-footer-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>

      <Box
        className="ltl-pad"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 32px 24px",
          boxSizing: "border-box",
        }}
      >
        <Box
          className="ltl-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `1.6fr ${columns.map(() => "1fr").join(" ")}`,
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
              <Typography style={{ fontSize: 18, fontWeight: 800 }}>SafeRoute</Typography>
            </Box>
            <Typography
              style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "14px 0 16px", maxWidth: 460 }}
            >
              {description}
            </Typography>
            <Box style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Badge icon={<ShieldOutlinedIcon style={{ fontSize: 14 }} />}>AIS-140 Compliant</Badge>
              <Badge icon={<LockOutlinedIcon style={{ fontSize: 14 }} />}>ISO 27001 Certified</Badge>
              <Badge icon={<SupportAgentOutlinedIcon style={{ fontSize: 14 }} />}>24/7 Response Desk</Badge>
            </Box>
          </Box>

          {columns.map((col) => (
            <FooterColumn key={col.title} title={col.title} items={col.items} />
          ))}
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
            © {year} SafeRoute Technologies India Pvt Ltd. Intercity &amp; Metro Commuter
            Network. All rights reserved.
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <Box style={{ width: 7, height: 7, borderRadius: "50%", background: tealBright }} />
            Operational in Bengaluru, Hyderabad, Pune, NCR &amp; Mumbai
          </span>
        </Box>
      </Box>
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
