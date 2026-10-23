import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip, Typography } from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import ProfileMenu from "../profilemenu/profilemenu";

/**
 * The rider's top navigation bar, the same one the rider home shows:
 * brand + RIDER chip, Home / My Route / Requests / Trips, notifications and
 * the signed-in user's profile menu. Pass the real user, never fixed text.
 *
 *   <RiderHeader active="trips" user={user} photoUrl={photoUrl} pendingCount={n} />
 */

const teal = "#007d73";

const NAV = [
  { key: "home", label: "Home", path: "/home", icon: HomeOutlinedIcon },
  { key: "route", label: "My Route", path: "/createcommute", icon: RouteOutlinedIcon },
  { key: "requests", label: "Requests", path: "/liftrequest", icon: PeopleAltOutlinedIcon },
  { key: "trips", label: "Trips", path: "/trips", icon: DirectionsCarOutlinedIcon },
];

export function RiderHeader({ active = "home", user, photoUrl, pendingCount = 0 }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .rh-btn:focus-visible { outline: 2px solid ${teal}; outline-offset: 2px; }
        @media (max-width: 860px) {
          .rh-nav-label { display: none; }
          .rh-nav-item { min-width: 44px !important; padding: 0 12px !important; }
        }
        @media (max-width: 560px) {
          .rh-pad { padding: 0 14px !important; }
          .rh-chip { display: none !important; }
        }
      `}</style>

      <Box
        component="header"
        className="rh-pad"
        style={{
          height: 67,
          width: "100%",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e7e8f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 1200,
        }}
      >
        {/* Brand + role */}
        <Box
          className="rh-btn"
          role="link"
          tabIndex={0}
          onClick={() => navigate("/home")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/home");
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            gap: 10,
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              background: teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldOutlinedIcon style={{ color: "#fff", fontSize: 19 }} />
          </Box>
          <Typography style={{ fontSize: 17, fontWeight: 700, whiteSpace: "nowrap", marginRight: 2 }}>
            FriendRide
          </Typography>
          <Chip
            className="rh-chip"
            label="RIDER"
            size="small"
            style={{
              height: 20,
              borderRadius: 9,
              background: "#71e7df",
              color: "#006c66",
              fontWeight: 800,
              fontSize: 11.5,
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Navigation */}
        <Box
          component="nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            margin: "0 20px",
            padding: 4,
            height: 48,
            boxSizing: "border-box",
            borderRadius: 30,
            background: "#f1f2fb",
          }}
        >
          {NAV.map(({ key, label, path, icon: Icon }) => {
            const isActive = key === active;
            const badge = key === "requests" && pendingCount > 0 ? String(pendingCount) : null;
            return (
              <Box
                key={key}
                className="rh-btn rh-nav-item"
                role="button"
                tabIndex={0}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                onClick={isActive ? undefined : () => navigate(path)}
                onKeyDown={(e) => {
                  if (!isActive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    navigate(path);
                  }
                }}
                style={{
                  height: 40,
                  width: key === "requests" || key === "route" ? 96 : 78,
                  padding: "0 10px",
                  borderRadius: 24,
                  background: isActive ? teal : "transparent",
                  color: isActive ? "#fff" : "#2b3347",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  boxSizing: "border-box",
                  flexShrink: 0,
                  cursor: isActive ? "default" : "pointer",
                  whiteSpace: "nowrap",
                  position: "relative",
                }}
              >
                <Icon style={{ fontSize: 17 }} />
                <Typography className="rh-nav-label" style={{ fontSize: 13, fontWeight: isActive ? 700 : 600 }}>
                  {label}
                </Typography>
                {badge && (
                  <Box
                    style={{
                      minWidth: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#71e7df",
                      color: "#006c66",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      position: "absolute",
                      top: -3,
                      right: -3,
                    }}
                  >
                    {badge}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Notifications + profile */}
        <Box style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 18, flexShrink: 0 }}>
          <Box style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <NotificationsNoneOutlinedIcon style={{ fontSize: 24, color: "#343b43" }} />
            {pendingCount > 0 && (
              <Box
                style={{
                  position: "absolute",
                  top: 1,
                  right: 0,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#dc2929",
                }}
              />
            )}
          </Box>

          <ProfileMenu user={user} photoUrl={photoUrl} />
        </Box>
      </Box>
    </>
  );
}

/** A small footer for rider pages that don't have their own. */
export function RiderFooter() {
  return (
    <Box
      component="footer"
      style={{
        borderTop: "1px solid #e7e8f1",
        background: "#f0f1fc",
        padding: "20px 30px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        fontSize: 12.5,
        color: "#3b4357",
      }}
    >
      <span>© {new Date().getFullYear()} FriendRide Technologies Inc. All rights reserved.</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        <Box style={{ width: 7, height: 7, borderRadius: "50%", background: teal }} />
        AIS-140 compliant · 24/7 response desk
      </span>
    </Box>
  );
}
