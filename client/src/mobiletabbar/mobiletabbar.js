import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

/**
 * Bottom tab bar for phones (screens 760px wide or less).
 *
 * The headers hide their top navigation at that width and render this
 * instead, so each screen keeps its main navigation within thumb's reach.
 * Above 760px it renders nothing visible at all.
 *
 *   <MobileTabBar active="trips" items={[{ key, label, path, icon, badge? }]} />
 *
 * It is drawn straight into <body> (a portal) on purpose: pages fade in with
 * CSS transforms, and a fixed element inside a transformed parent is placed
 * against that parent instead of the screen.
 */

const teal = "#007d73";
const muted = "#5b6475";

export default function MobileTabBar({ items, active }) {
  const navigate = useNavigate();

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <style>{`
        .mtb { display: none; }
        @media (max-width: 760px) {
          .mtb { display: flex; }
          /* keeps the end of every page from hiding behind the bar */
          body { padding-bottom: calc(66px + env(safe-area-inset-bottom, 0px)); }
        }
        .mtb-item:focus-visible { outline: 2px solid ${teal}; outline-offset: -2px; }
      `}</style>

      <Box
        component="nav"
        className="mtb"
        aria-label="Main"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1250,
          background: "#fff",
          borderTop: "1px solid #e7e8f1",
          boxShadow: "0 -4px 18px rgba(30,35,90,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxSizing: "border-box",
        }}
      >
        {items.map(({ key, label, path, icon: Icon, badge }) => {
          const isActive = key === active;
          const go = () => navigate(path);
          return (
            <Box
              key={key}
              className="mtb-item"
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={isActive ? undefined : go}
              onKeyDown={(e) => {
                if (!isActive && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  go();
                }
              }}
              style={{
                flex: 1,
                minWidth: 0,
                height: 62,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                position: "relative",
                color: isActive ? teal : muted,
                fontSize: 11,
                fontWeight: isActive ? 800 : 600,
                cursor: isActive ? "default" : "pointer",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {isActive && (
                <Box
                  style={{
                    position: "absolute",
                    top: 0,
                    width: 28,
                    height: 3,
                    borderRadius: "0 0 3px 3px",
                    background: teal,
                  }}
                />
              )}

              <Box style={{ position: "relative", display: "flex" }}>
                <Icon style={{ fontSize: 23 }} />
                {badge ? (
                  <Box
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -10,
                      minWidth: 17,
                      height: 17,
                      borderRadius: 9,
                      padding: "0 4px",
                      boxSizing: "border-box",
                      background: "#dc2929",
                      color: "#fff",
                      fontSize: 10.5,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {badge}
                  </Box>
                ) : null}
              </Box>

              <span
                style={{
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  padding: "0 2px",
                }}
              >
                {label}
              </span>
            </Box>
          );
        })}
      </Box>
    </>,
    document.body
  );
}
