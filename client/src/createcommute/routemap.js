import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";

/**
 * Interactive route map (Leaflet + OpenStreetMap tiles).
 *
 * Leaflet is loaded from a CDN the first time a map is shown, so there is
 * nothing extra to `npm install`. If it can't be loaded (offline, blocked)
 * the page still works and a short notice is shown instead of the map.
 *
 * Props
 *   start, stop, end - { lat, lng } or null
 *   line             - [[lat, lng], ...] route geometry, or null
 *   children         - overlays drawn on top of the map (info cards etc.)
 */

const LEAFLET_JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";

// Jabalpur, shown until a route has been found
const DEFAULT_CENTER = [23.1815, 79.9864];

let leafletPromise = null;

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = LEAFLET_CSS;
        document.head.appendChild(link);
      }
      const script = document.createElement("script");
      script.src = LEAFLET_JS;
      script.async = true;
      script.onload = () =>
        window.L ? resolve(window.L) : reject(new Error("Map library failed to start"));
      script.onerror = () => {
        leafletPromise = null; // allow a retry on the next visit
        reject(new Error("Could not load the map library"));
      };
      document.body.appendChild(script);
    });
  }
  return leafletPromise;
}

const markerHtml = (color) =>
  `<div style="width:18px;height:18px;border-radius:50%;background:${color};` +
  `border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,0.35)"></div>`;

const controlStyle = {
  width: 40,
  height: 40,
  borderRadius: 10,
  background: "#fff",
  color: "#141b34",
  boxShadow: "0 2px 8px rgba(30,35,90,0.18)",
};

export default function RouteMap({ start, stop, end, line, children }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const boundsRef = useRef([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Create the map once
  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        const map = L.map(containerRef.current, { zoomControl: false }).setView(
          DEFAULT_CENTER,
          12
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        }).addTo(map);
        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
      setReady(false);
    };
  }, []);

  const fitToRoute = useCallback(() => {
    const map = mapRef.current;
    const bounds = boundsRef.current;
    if (!map || !bounds.length) return;
    if (bounds.length === 1) {
      map.setView(bounds[0], 15);
    } else {
      // Extra padding on top / bottom keeps the route clear of the overlays
      map.fitBounds(bounds, {
        paddingTopLeft: [40, 190],
        paddingBottomRight: [40, 80],
        maxZoom: 16,
      });
    }
  }, []);

  // Redraw whenever the route changes
  useEffect(() => {
    const L = window.L;
    const layer = layerRef.current;
    if (!ready || !L || !layer) return;

    layer.clearLayers();
    const bounds = [];

    if (line && line.length > 1) {
      L.polyline(line, { color: "#0b7a70", weight: 6, opacity: 0.9 }).addTo(layer);
      bounds.push(...line);
    }

    [
      [start, "#007d73"],
      [stop, "#c28a00"],
      [end, "#141b34"],
    ].forEach(([point, color]) => {
      if (!point) return;
      L.marker([point.lat, point.lng], {
        icon: L.divIcon({
          className: "",
          html: markerHtml(color),
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
        interactive: false,
      }).addTo(layer);
      bounds.push([point.lat, point.lng]);
    });

    boundsRef.current = bounds;
    if (bounds.length) fitToRoute();
  }, [ready, start, stop, end, line, fitToRoute]);

  return (
    <Box
      style={{
        position: "relative",
        isolation: "isolate",
        height: "100%",
        minHeight: 520,
        borderRadius: 20,
        overflow: "hidden",
        background: "#e8ecf2",
      }}
    >
      <div
        ref={containerRef}
        role="img"
        aria-label="Map preview of your commute route"
        style={{ position: "absolute", inset: 0 }}
      />

      {failed && (
        <Box
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <Typography style={{ fontSize: 14, color: "#5b6475", maxWidth: 320 }}>
            The map couldn't load. Check your internet connection. You can still
            fill in your commute and continue.
          </Typography>
        </Box>
      )}

      {/* zoom / recenter */}
      {ready && (
        <Box
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <IconButton
            aria-label="Zoom in"
            onClick={() => mapRef.current && mapRef.current.zoomIn()}
            style={controlStyle}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            aria-label="Zoom out"
            onClick={() => mapRef.current && mapRef.current.zoomOut()}
            style={controlStyle}
          >
            <RemoveIcon />
          </IconButton>
          <IconButton
            aria-label="Fit route on screen"
            onClick={fitToRoute}
            style={controlStyle}
          >
            <MyLocationOutlinedIcon />
          </IconButton>
        </Box>
      )}

      {/* overlays from the parent (route info card, badges, ...) */}
      {children}
    </Box>
  );
}
