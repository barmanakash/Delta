// App.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  IconButton,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AddRoadOutlinedIcon from "@mui/icons-material/AddRoadOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ProfileMenu from "../profilemenu/profilemenu";
import { RiderHeader } from "../riderlayout/riderlayout";
import RouteMap from "../createcommute/routemap";
import {
  useIncomingRequests,
  declineRequest,
  formatExpiry,
  initialsOf,
  toAbsoluteUrl as absoluteUrl,
} from "../riderrequests/riderrequests";

const teal = "#007d73";
const dark = "#182136";
const lightBg = "#f8f8ff";
const lavender = "#f0f1fc";
const API_BASE_URL = "http://localhost:8000";

const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
const WEEKDAY_CODES = ["mon", "tue", "wed", "thu", "fri"];

// ["mon","tue","wed","thu","fri"] -> "Mon–Fri"
function describeDays(days = []) {
  if (days.length === 7) return "Every day";
  if (days.length === 5 && WEEKDAY_CODES.every((d) => days.includes(d))) return "Mon–Fri";
  return days.map((d) => DAY_LABELS[d] || d).join(", ");
}

// "18:30" -> "6:30 PM"
function formatClock(t) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function App() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [role, setRole] = useState("rider");
  const [user, setUser] = useState(null); // full profile, shown in the profile menu
  const [commute, setCommute] = useState(null); // the rider's active commute (null = none yet)
  const [commuteLoading, setCommuteLoading] = useState(true);
  const [routeLine, setRouteLine] = useState(null); // road geometry for the map

  // Lift requests from lift takers whose trips fit this rider's commute
  const incoming = useIncomingRequests();
  const pendingRequests = incoming.requests.filter((r) => r.status === "pending");
  const [busyId, setBusyId] = useState(null);
  const [routeOpen, setRouteOpen] = useState(false); // the "View Route" map dialog
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const todayCode = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
  const runsToday = Boolean(commute && commute.days.includes(todayCode));

  const handleDecline = async (requestId) => {
    if (busyId) return;
    setBusyId(requestId);
    const result = await declineRequest(requestId);
    setBusyId(null);
    setToast({
      open: true,
      message: result.ok ? "Request declined. It stays open for other riders." : result.message,
      severity: result.ok ? "info" : "error",
    });
    incoming.reload();
  };

  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  const toAbsoluteUrl = (path) =>
    path ? (path.startsWith("http") ? path : `${API_BASE_URL}${path}`) : null;

  const applyUser = (userData) => {
    setUser(userData);
    setFullName(userData.full_name || "");
    setPhotoUrl(toAbsoluteUrl(userData.profile_photo_url));
    setRole(userData.role || "rider");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Show the cached user immediately so the page never flashes
    // placeholder content, then refresh from the server.
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        const cached = JSON.parse(cachedUser);
        if (cached.role === "lift") {
          navigate("/lifttakerhome", { replace: true }); // lift takers have their own home
          return;
        }
        applyUser(cached);
      } catch {
        // ignore malformed cache, the fetch below will populate it
      }
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/signin");
          return;
        }
        if (!response.ok) return;

        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        if (data.role === "lift") {
          navigate("/lifttakerhome", { replace: true });
          return;
        }
        applyUser(data);
      } catch {
        // Offline / backend down: keep showing whatever was cached above.
      }
    };

    // The commute the rider created on the Create Your Commute screen
    const loadCommute = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rides/commutes/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) setCommute(await response.json());
      } catch {
        // backend offline: the card shows its empty state
      } finally {
        setCommuteLoading(false);
      }
    };

    fetchUser();
    loadCommute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw the commute's real road route on the map (needs the saved coordinates)
  useEffect(() => {
    if (!commute || commute.pickup_lat == null || commute.destination_lat == null) {
      setRouteLine(null);
      return undefined;
    }

    let cancelled = false;
    const points = [
      [commute.pickup_lng, commute.pickup_lat],
      ...(commute.stop_lat != null ? [[commute.stop_lng, commute.stop_lat]] : []),
      [commute.destination_lng, commute.destination_lat],
    ];
    const url =
      `https://router.project-osrm.org/route/v1/driving/${points.map((p) => p.join(",")).join(";")}` +
      "?overview=full&geometries=geojson";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const route = data.routes && data.routes[0];
        if (!cancelled && route) {
          setRouteLine(route.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
        }
      })
      .catch(() => {
        // no line: the map still shows the pickup and destination markers
      });

    return () => {
      cancelled = true;
    };
  }, [commute]);

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: lightBg,
        color: dark,
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RiderHeader active="home" user={user} photoUrl={photoUrl} pendingCount={incoming.pendingCount} />

      {/* HEADER */}

      <Box
        style={{
          height: 67,
          width: "100%",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e7e8f1",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
        }}
      >
        {/* Left section: Logo and brand */}
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            gap: 10,
            flexShrink: 0,
          }}
        >
          {/* Logo */}
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
            <ShieldOutlinedIcon
              style={{
                color: "#fff",
                fontSize: 19,
              }}
            />
          </Box>

          {/* Brand name */}
          <Typography
            style={{
              fontSize: 17,
              fontWeight: 700,
              whiteSpace: "nowrap",
              marginRight: 2,
            }}
          >
            FriendRide
          </Typography>

          {/* User role */}
          <Chip
            label={role === "lift" ? "LIFT TAKER" : "RIDER"}
            size="small"
            style={{
              height: 20,
              borderRadius: 9,
              background: "#71e7df",
              color: "#006c66",
              fontWeight: 800,
              fontSize: 12,
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Center section: Navigation */}
        <Box
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
          {[
            { label: "Home", path: "/home", icon: <HomeOutlinedIcon style={{ fontSize: 17 }} /> },
            { label: "My Route", path: "/createcommute", icon: <RouteOutlinedIcon style={{ fontSize: 17 }} /> },
            { label: "Requests", path: "/liftrequest", icon: <PeopleAltOutlinedIcon style={{ fontSize: 17 }} /> },
            { label: "Trips", path: "/trips", icon: <DirectionsCarOutlinedIcon style={{ fontSize: 17 }} /> },
          ].map(({ label, path, icon }) => {
            const active = path === "/home";
            const badge = label === "Requests" && incoming.pendingCount > 0
              ? String(incoming.pendingCount)
              : undefined;
            return (
              <Box
                key={path}
                role="button"
                tabIndex={0}
                aria-current={active ? "page" : undefined}
                onClick={() => navigate(path)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(path);
                  }
                }}
                style={{
                  height: 40,
                  minWidth: active ? 74 : 88,
                  padding: active ? "0 13px" : "0 10px",
                  borderRadius: 24,
                  background: active ? teal : "transparent",
                  color: active ? "#fff" : "#2b3347",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  boxSizing: "border-box",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {icon}
                <Typography style={{ fontSize: 13, fontWeight: active ? 700 : 600 }}>
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
                      fontSize: 12.5,
                      fontWeight: 700,
                    }}
                  >
                    {badge}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Right section: Notifications and profile */}
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 18,
            flexShrink: 0,
          }}
        >
          {/* Notifications */}
          <Box
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <NotificationsNoneOutlinedIcon
              style={{
                fontSize: 24,
                color: "#343b43",
              }}
            />

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
          </Box>

          {/* Profile menu */}
          <ProfileMenu user={user} photoUrl={photoUrl} />
        </Box>
      </Box>


      {/* MAIN CONTENT */}
      <Box
        style={{
          padding: "22px 30px 28px",
          boxSizing: "border-box",
          flex: 1,
        }}
      >
        {/* WELCOME */}
        <Box
          style={{
            height: 107,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(30,35,70,0.035)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 23px",
            boxSizing: "border-box",
            marginBottom: 22,
          }}
        >
          <Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Typography
                style={{
                  fontSize: 30,
                  lineHeight: 1,
                  fontWeight: 700,
                  letterSpacing: "-0.7px",
                }}
              >
                Good morning, {firstName}
              </Typography>

              <Chip
                label="● Rider Mode — Active"
                style={{
                  height: 24,
                  background: "#e7e9fb",
                  color: "#006f68",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
            </Box>

            <Typography
              style={{
                fontSize: 14,
                color: "#555d60",
                marginTop: 8,
              }}
            >
              Ready to share your commute route safely today?
            </Typography>
          </Box>

          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/createcommute")}
              startIcon={<AddRoadOutlinedIcon />}
              style={{
                height: 36,
                minWidth: 155,
                borderRadius: 20,
                background: teal,
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              + Create Route
            </Button>

            <Button
              onClick={() => navigate("/trips")}
              startIcon={<HistoryOutlinedIcon />}
              style={{
                height: 36,
                minWidth: 108,
                borderRadius: 20,
                background: "#e9ebfb",
                color: dark,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              My Trips
            </Button>

            <Box
              style={{
                height: 36,
                minWidth: 132,
                borderRadius: 20,
                background: "#e9ebfb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <AccountBalanceWalletOutlinedIcon
                style={{
                  fontSize: 17,
                  color: "#4d52db",
                }}
              />

              <Typography
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: dark,
                }}
              >
                {`₹${incoming.earnings.toLocaleString("en-IN")}`}
              </Typography>

              <Typography
                style={{
                  fontSize: 12.5,
                  color: "#596069",
                }}
              >
                Earnings
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* TWO COLUMN LAYOUT */}
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 22,
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <Box>
            {/* ACTIVE COMMUTE */}
            <Box
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "23px 22px",
                boxSizing: "border-box",
                marginBottom: 22,
              }}
            >
              {commuteLoading ? (
                <Box style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <Typography style={{ fontSize: 14, color: "#626a6d" }}>
                    Loading your commute…
                  </Typography>
                </Box>
              ) : !commute ? (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "28px 12px",
                  }}
                >
                  <TwoWheelerOutlinedIcon style={{ fontSize: 40, color: teal }} />
                  <Typography style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>
                    No active commute yet
                  </Typography>
                  <Typography style={{ fontSize: 13, color: "#626a6d", marginTop: 6, maxWidth: 360 }}>
                    Create your daily commute so verified lift takers on your route can find you.
                  </Typography>
                  <Button
                    onClick={() => navigate("/createcommute")}
                    startIcon={<AddRoadOutlinedIcon />}
                    style={{
                      marginTop: 18,
                      height: 38,
                      padding: "0 20px",
                      borderRadius: 20,
                      background: teal,
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    + Create Route
                  </Button>
                </Box>
              ) : (
                <>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <TwoWheelerOutlinedIcon
                        style={{
                          fontSize: 29,
                          color: "#007c74",
                        }}
                      />

                      <Box>
                        <Typography
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            lineHeight: 1.1,
                          }}
                        >
                          Your Active Commute
                        </Typography>

                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            marginTop: 5,
                          }}
                        >
                          <Box
                            style={{
                              background: "#e7e9f6",
                              padding: "2px 7px",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              style={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: "#4b5361",
                              }}
                            >
                              {`ROUTE #SR-${commute.id.slice(-4).toUpperCase()}`}
                            </Typography>
                          </Box>

                          <Typography
                            style={{
                              fontSize: 12,
                              color: teal,
                              fontWeight: 700,
                            }}
                          >
                            ● Live Broadcast Active
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Chip
                      label={`♙ ${commute.seats} Seat${commute.seats === 1 ? "" : "s"} Available`}
                      style={{
                        height: 25,
                        background: "#75e7df",
                        color: "#006f68",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    />
                  </Box>

                  <Box
                    style={{
                      marginTop: 25,
                      height: 98,
                      background: lavender,
                      borderRadius: 11,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 14px",
                      boxSizing: "border-box",
                    }}
                  >
                    <Box
                      style={{
                        width: 405,
                        position: "relative",
                        paddingLeft: 25,
                        boxSizing: "border-box",
                      }}
                    >
                      <Box
                        style={{
                          position: "absolute",
                          left: 6,
                          top: 7,
                          height: 51,
                          borderLeft: "1px dashed #a8c9d0",
                        }}
                      />

                      <Box
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 7,
                          width: 13,
                          height: 13,
                          borderRadius: "50%",
                          background: "#4e51d9",
                        }}
                      />

                      <Typography
                        style={{
                          fontSize: 12,
                          color: "#505960",
                          letterSpacing: "0.3px",
                        }}
                      >
                        DEPARTURE POINT
                      </Typography>

                      <Typography
                        title={commute.pickup}
                        style={{
                          fontSize: 14.5,
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {commute.pickup}
                      </Typography>

                      <Box
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 1,
                          width: 13,
                          height: 13,
                          borderRadius: "50%",
                          border: "2px solid #007d73",
                          boxSizing: "border-box",
                          background: "#fff",
                        }}
                      />

                      <Typography
                        style={{
                          fontSize: 12,
                          color: "#505960",
                          letterSpacing: "0.3px",
                          marginTop: 1,
                        }}
                      >
                        DESTINATION
                      </Typography>

                      <Typography
                        title={commute.destination}
                        style={{
                          fontSize: 14.5,
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {commute.destination}
                      </Typography>
                    </Box>

                    <Box
                      style={{
                        borderLeft: "1px solid #dce1f2",
                        height: 43,
                        marginRight: 18,
                      }}
                    />

                    <Metric
                      title="Est. Distance"
                      value={commute.distance_km ? `${commute.distance_km} km` : "—"}
                    />
                    <Metric title="Travel Time" value={`${commute.duration_min} mins`} teal />
                    <Box style={{ marginLeft: 19 }}>
                      <Typography
                        style={{
                          fontSize: 12,
                          color: "#4c555a",
                        }}
                      >
                        Vehicle
                      </Typography>

                      <Typography
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {commute.vehicle_model}
                      </Typography>

                      <Typography
                        style={{
                          fontSize: 12,
                          color: "#555c62",
                        }}
                      >
                        {commute.vehicle_plate}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    style={{
                      marginTop: 18,
                      height: 40,
                      borderRadius: 9,
                      background: "#eef0fc",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 13px",
                      boxSizing: "border-box",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <NearMeOutlinedIcon
                        style={{
                          color: teal,
                          fontSize: 18,
                        }}
                      />

                      <Typography
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                        }}
                      >
                        {commute.stop ? `Via ${commute.stop}` : "Direct route"}
                      </Typography>

                      <Typography
                        style={{
                          fontSize: 12.5,
                          color: "#60666b",
                        }}
                      >
                        {`• ${formatClock(commute.outbound_time)}${commute.return_enabled && commute.return_time
                          ? `, return ${formatClock(commute.return_time)}`
                          : ""
                          }`}
                      </Typography>
                    </Box>

                    <Chip
                      label={describeDays(commute.days)}
                      style={{
                        height: 20,
                        background: "#dddfff",
                        color: "#5b4ee4",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 26,
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <Button
                        onClick={() => setRouteOpen(true)}
                        startIcon={<NearMeOutlinedIcon />}
                        style={{
                          height: 36,
                          background: teal,
                          color: "#fff",
                          borderRadius: 7,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          padding: "0 16px",
                        }}
                      >
                        View Route
                      </Button>

                      <Button
                        onClick={() => navigate("/createcommute")}
                        startIcon={<EditOutlinedIcon />}
                        style={{
                          height: 36,
                          background: "#e9ebfb",
                          color: "#303b46",
                          borderRadius: 7,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          padding: "0 16px",
                        }}
                      >
                        Edit Route
                      </Button>
                    </Box>

                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "#596066",
                      }}
                    >
                      <PauseCircleOutlineIcon style={{ fontSize: 17 }} />
                      <Typography
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                        }}
                      >
                        Pause Sharing Today
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            {/* LIFT REQUESTS */}
            <Box
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "23px 22px 24px",
                boxSizing: "border-box",
                marginBottom: 22,
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    Lift Requests
                  </Typography>

                  <Chip
                    label={
                      pendingRequests.length
                        ? `${pendingRequests.length} New Request${pendingRequests.length === 1 ? "" : "s"}`
                        : "No new requests"
                    }
                    style={{
                      height: 21,
                      background: pendingRequests.length ? "#5753df" : "#9aa1b5",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                </Box>

                <Typography
                  style={{
                    fontSize: 12.5,
                    color: "#687075",
                  }}
                >
                  Filtered by institution security criteria
                </Typography>
              </Box>

              {incoming.loading ? (
                <Typography style={{ fontSize: 13, color: "#687075", textAlign: "center", padding: "26px 0" }}>
                  Loading lift requests…
                </Typography>
              ) : incoming.error ? (
                <Typography style={{ fontSize: 13, color: "#b42318", textAlign: "center", padding: "26px 0" }}>
                  {incoming.error}
                </Typography>
              ) : pendingRequests.length === 0 ? (
                <Box style={{ background: lavender, borderRadius: 9, padding: "26px 18px", textAlign: "center" }}>
                  <Typography style={{ fontSize: 14.5, fontWeight: 700 }}>
                    No lift requests right now
                  </Typography>
                  <Typography style={{ fontSize: 12.5, color: "#626a6e", marginTop: 5 }}>
                    {commute
                      ? "When a verified commuter's trip fits your route, it will show up here."
                      : "Create your commute so lift takers on your route can find you."}
                  </Typography>
                </Box>
              ) : (
                pendingRequests.slice(0, 3).map((request, index) => (
                  <RequestCard
                    key={request.id}
                    first={index === 0}
                    second={index > 0}
                    name={request.requester_name}
                    initials={initialsOf(request.requester_name)}
                    photoUrl={absoluteUrl(request.requester_photo_url)}
                    verified={request.requester_verification}
                    sameGender={request.same_gender}
                    route={
                      index === 0
                        ? `Pickup: ${request.pickup}`
                        : `${request.pickup} → ${request.destination}`
                    }
                    drop={`Dropoff: ${request.destination}`}
                    match={
                      index === 0 ? `${request.overlap_pct}% Route Match` : `${request.overlap_pct}% Match`
                    }
                    fare={index === 0 ? `₹${request.fare}` : `₹${request.fare} Split`}
                    diversion={request.walk_note}
                    expires={`Expires in ${formatExpiry(request.expires_in_min)}`}
                    busy={busyId === request.id}
                    onAccept={() => navigate(`/confirmrequest/${request.id}`)}
                    onDecline={() => handleDecline(request.id)}
                    onView={() => navigate(`/viewRequest/${request.id}`)}
                  />
                ))
              )}

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Typography
                  onClick={() => navigate("/liftrequest")}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: teal,
                    cursor: "pointer",
                  }}
                >
                  {`View All Incoming Requests (${pendingRequests.length}) →`}
                </Typography>
              </Box>
            </Box>

            {/* TODAY'S SCHEDULE */}
            <Box
              style={{
                height: 131,
                background: "#fff",
                borderRadius: 16,
                padding: "20px 22px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <Box
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: "#e8ebfb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarMonthOutlinedIcon
                    style={{
                      color: teal,
                      fontSize: 25,
                    }}
                  />
                </Box>

                <Box>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: 15.5,
                        fontWeight: 700,
                      }}
                    >
                      Today's Route Schedule
                    </Typography>

                    <Chip
                      label="Active Routine"
                      style={{
                        height: 20,
                        background: "#73e5dc",
                        color: "#00736c",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  <Typography
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginTop: 3,
                    }}
                  >
                    {commute
                      ? `Morning Departure: ${formatClock(commute.outbound_time)} (${runsToday ? "Today" : describeDays(commute.days)
                      }) •`
                      : "No commute scheduled yet"}
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginTop: 3,
                    }}
                  >
                    {commute
                      ? commute.return_enabled && commute.return_time
                        ? `Return Slot: ${formatClock(commute.return_time)} (Evening Commute)`
                        : "No evening return offered"
                      : "Create a route to start sharing rides"}
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 12,
                      color: teal,
                      fontWeight: 600,
                      marginTop: 5,
                    }}
                  >
                    ◉ Discoverable to matching corporate commuters along corridor
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={() => navigate("/createcommute")}
                startIcon={<EditOutlinedIcon />}
                style={{
                  height: 34,
                  background: "#e8ebfb",
                  color: "#34404a",
                  borderRadius: 7,
                  textTransform: "none",
                  fontSize: 12.5,
                  fontWeight: 700,
                  padding: "0 14px",
                }}
              >
                Edit Schedule
              </Button>
            </Box>
          </Box>

          {/* RIGHT */}
          <Box>
            {/* LIVE VIEW */}
            <Box
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 18px",
                boxSizing: "border-box",
                marginBottom: 22,
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <Box>
                  <Typography
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    Corridor Live View
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 12,
                      color: "#626a6d",
                      marginTop: 2,
                    }}
                  >
                    Jabalpur Metro Transit Spine
                  </Typography>
                </Box>
              </Box>

              <Box
                style={{
                  height: 270,
                  borderRadius: 11,
                  overflow: "hidden",
                  position: "relative",
                  background:
                    "linear-gradient(135deg,#eceeff 0%,#e5e8fa 100%)",
                  border: "1px solid #e0e3f2",
                }}
              >
                {commute && commute.pickup_lat != null && commute.destination_lat != null ? (
                  <RouteMap
                    start={{ lat: commute.pickup_lat, lng: commute.pickup_lng }}
                    stop={
                      commute.stop_lat != null
                        ? { lat: commute.stop_lat, lng: commute.stop_lng }
                        : null
                    }
                    end={{ lat: commute.destination_lat, lng: commute.destination_lng }}
                    line={routeLine}
                    minHeight={270}
                    padTop={50}
                    padBottom={30}
                  >
                    <Box
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 11,
                        right: 66,
                        zIndex: 1000,
                        height: 34,
                        background: "#fff",
                        borderRadius: 17,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 13px",
                        boxSizing: "border-box",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      }}
                    >
                      <Typography style={{ fontSize: 12, fontWeight: 700 }}>
                        <span style={{ color: teal }}>●</span> Fastest road route
                      </Typography>
                      <Typography style={{ fontSize: 12, fontWeight: 700, color: teal }}>
                        {commute.duration_min} min ETA
                      </Typography>
                    </Box>
                  </RouteMap>
                ) : (
                  <Box
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 24,
                      textAlign: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 13, color: "#626a6d", maxWidth: 260 }}>
                      {commuteLoading
                        ? "Loading your route…"
                        : commute
                          ? "No map preview was saved for this route. Edit your route to add one."
                          : "Create a commute to see your route on the map."}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 13,
                }}
              >
                <Typography
                  style={{
                    fontSize: 12,
                    color: teal,
                    fontWeight: 600,
                  }}
                >
                  △ GPS lock active
                </Typography>

                <Typography
                  style={{
                    fontSize: 12,
                    color: "#544bdf",
                    fontWeight: 700,
                  }}
                >
                  {commute && commute.distance_km ? `${commute.distance_km} km route` : "Route preview"}
                </Typography>
              </Box>
            </Box>

            {/* SAFETY CENTER */}
            <Box
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "22px 22px",
                boxSizing: "border-box",
                marginBottom: 22,
              }}
            >
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Box
                  style={{
                    width: 43,
                    height: 43,
                    borderRadius: 9,
                    background: "#72e5dc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShieldOutlinedIcon
                    style={{
                      fontSize: 25,
                      color: "#00776f",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    Safety Center
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 12,
                      color: teal,
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    Continuous Protection Protocol
                  </Typography>
                </Box>
              </Box>

              <Typography
                style={{
                  fontSize: 14,
                  color: "#5b6264",
                  lineHeight: 1.45,
                  marginTop: 17,
                }}
              >
                Your journey verification and emergency protocols
                <br />
                remain armed throughout the ride.
              </Typography>

              <Box
                style={{
                  background: lavender,
                  borderRadius: 10,
                  padding: "12px 13px",
                  marginTop: 14,
                }}
              >
                <SafetyItem text="AIS 140 Telemetry tracking enabled" />
                <SafetyItem text="Gender-compatible verified matching" />
                <SafetyItem text="24/7 Rapid Emergency Response" />
              </Box>

              <Box
                style={{
                  height: 40,
                  marginTop: 15,
                  background: "#e8ebfb",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 13px",
                  boxSizing: "border-box",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#d82323",
                    }}
                  >
                    SOS
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Safety &amp; Emergency Hub
                  </Typography>
                </Box>

                <Typography
                  style={{
                    fontSize: 20,
                    color: "#535c63",
                  }}
                >
                  ›
                </Typography>
              </Box>
            </Box>

            {/* TRUST POLICY */}
            <Box
              style={{
                minHeight: 113,
                background: "#dfe4ff",
                borderRadius: 15,
                padding: "18px 19px",
                boxSizing: "border-box",
                display: "flex",
                gap: 12,
              }}
            >
              <LockOutlinedIcon
                style={{
                  color: "#4c50d9",
                  fontSize: 24,
                  marginTop: 1,
                }}
              />

              <Box>
                <Typography
                  style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                  }}
                >
                  Institutional Trust Policy
                </Typography>

                <Typography
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: "#515a62",
                    marginTop: 5,
                  }}
                >
                  FriendRide pairs verified riders and passengers based
                  <br />
                  strictly on official corporate IDs, government
                  <br />
                  credentials, and verified safety reviews.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        style={{
          minHeight: 72,
          background: "#fff",
          borderTop: "1px solid #e4e5ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          boxSizing: "border-box",
        }}
      >
        <Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Typography
              style={{
                color: teal,
                fontSize: 14,
              }}
            >
              ●
            </Typography>

            <Typography
              style={{
                fontSize: 12,
                color: "#465055",
              }}
            >
              AIS 140 &amp; MoRTH Intelligent Commute Safety Compliant
            </Typography>
          </Box>

          <Typography
            style={{
              fontSize: 12,
              color: "#465055",
              marginTop: 4,
            }}
          >
            © 2025 FriendRide. All rights reserved.
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            gap: 24,
          }}
        >
          <Typography style={footerLink}>Safety Standards</Typography>
          <Typography style={footerLink}>Privacy</Typography>
          <Typography style={footerLink}>Terms</Typography>
          <Typography style={footerLink}>Support Desk</Typography>
        </Box>
      </Box>
      {/* View Route: the whole route on a large map */}
      <Dialog
        open={routeOpen}
        onClose={() => setRouteOpen(false)}
        fullWidth
        maxWidth="lg"
        aria-labelledby="route-dialog-title"
        slotProps={{ paper: { style: { borderRadius: 18, margin: 16, width: "100%" } } }}
      >
        {commute && (
          <Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                padding: "20px 24px 14px",
              }}
            >
              <Box style={{ minWidth: 0 }}>
                <Typography id="route-dialog-title" style={{ fontSize: 20, fontWeight: 800 }}>
                  Your Route
                </Typography>
                <Typography style={{ fontSize: 13, color: "#626a6d", marginTop: 3, wordBreak: "break-word" }}>
                  {commute.pickup} → {commute.destination}
                  {commute.stop ? ` · via ${commute.stop}` : ""}
                </Typography>
              </Box>
              <IconButton aria-label="Close route view" onClick={() => setRouteOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box style={{ height: "min(62vh, 560px)", position: "relative", background: "#eceeff" }}>
              {commute.pickup_lat != null && commute.destination_lat != null ? (
                <RouteMap
                  start={{ lat: commute.pickup_lat, lng: commute.pickup_lng }}
                  stop={
                    commute.stop_lat != null
                      ? { lat: commute.stop_lat, lng: commute.stop_lng }
                      : null
                  }
                  end={{ lat: commute.destination_lat, lng: commute.destination_lng }}
                  line={routeLine}
                  minHeight={360}
                  padTop={70}
                  padBottom={40}
                  startName={(commute.pickup || "").split(",")[0].trim()}
                  startTag="START"
                  endName={(commute.destination || "").split(",")[0].trim()}
                  endTag="DESTINATION"
                >
                  <Box
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      zIndex: 1000,
                      background: "#fff",
                      borderRadius: 18,
                      padding: "7px 14px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      fontSize: 12.5,
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ color: teal }}>●</span> Fastest road route · {commute.duration_min} min ETA
                  </Box>
                </RouteMap>
              ) : (
                <Box
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                    textAlign: "center",
                  }}
                >
                  <Typography style={{ fontSize: 13.5, color: "#626a6d", maxWidth: 320 }}>
                    No map was saved for this route. Edit your route to add one.
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 12,
                padding: "18px 24px 22px",
              }}
            >
              {[
                ["Distance", commute.distance_km ? `${commute.distance_km} km` : "—"],
                ["Travel time", `${commute.duration_min} mins`],
                ["Departs", formatClock(commute.outbound_time)],
                [
                  "Return",
                  commute.return_enabled && commute.return_time
                    ? formatClock(commute.return_time)
                    : "No return",
                ],
                ["Runs", describeDays(commute.days)],
                ["Vehicle", `${commute.vehicle_model} · ${commute.vehicle_plate}`],
              ].map(([label, value]) => (
                <Box key={label} style={{ background: "#f4f5fd", borderRadius: 12, padding: "12px 14px", minWidth: 0 }}>
                  <Typography style={{ fontSize: 12, color: "#626a6d" }}>{label}</Typography>
                  <Typography style={{ fontSize: 14.5, fontWeight: 800, marginTop: 4, wordBreak: "break-word" }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
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

/* ---------------- COMPONENTS ---------------- */

function Metric({ title, value, teal: isTeal }) {
  return (
    <Box style={{ marginLeft: 17 }}>
      <Typography
        style={{
          fontSize: 12,
          color: "#4d565c",
        }}
      >
        {title}
      </Typography>

      <Typography
        style={{
          fontSize: 17,
          lineHeight: 1.3,
          fontWeight: 700,
          color: isTeal ? teal : dark,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function RequestCard({
  first,
  second,
  name,
  initials,
  photoUrl,
  verified,
  sameGender,
  route,
  drop,
  match,
  fare,
  diversion,
  expires,
  busy,
  onAccept,
  onDecline,
  onView,
}) {
  if (second) {
    return (
      <Box
        className="hover-lift"
        style={{
          height: 69,
          borderRadius: 9,
          background: lavender,
          marginTop: 10,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Avatar
            src={photoUrl || undefined}
            style={{
              width: 38,
              height: 38,
              background: "#64778b",
              fontSize: 12.5,
            }}
          >
            {!photoUrl && initials}
          </Avatar>

          <Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Typography
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {name}
              </Typography>

              <Typography
                style={{
                  fontSize: 12,
                  color: teal,
                  fontWeight: 600,
                }}
              >
                {verified}
              </Typography>
            </Box>

            <Typography
              style={{
                fontSize: 12,
                color: "#555e64",
                marginTop: 3,
              }}
            >
              {route}
            </Typography>
          </Box>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Box style={{ textAlign: "right" }}>
            <Chip
              label={match}
              style={{
                height: 20,
                background: "#dbe1fa",
                color: "#4f52c8",
                fontSize: 12,
                fontWeight: 700,
              }}
            />

            <Typography
              style={{
                fontSize: 12,
                color: teal,
                fontWeight: 700,
              }}
            >
              {fare}
            </Typography>
          </Box>

          <Button
            onClick={onView}
            style={{
              height: 32,
              background: "#e5e8fa",
              color: "#3d4650",
              borderRadius: 7,
              textTransform: "none",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className="hover-lift"
      style={{
        background: lavender,
        borderRadius: 9,
        padding: "13px 14px 15px",
        boxSizing: "border-box",
      }}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Avatar
            src={photoUrl || undefined}
            style={{
              width: 42,
              height: 42,
              background: "#8da0a2",
              fontSize: 12.5,
            }}
          >
            {!photoUrl && initials}
          </Avatar>

          <Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Typography
                style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                }}
              >
                {name}
              </Typography>

            </Box>

            <Typography
              style={{
                fontSize: 12,
                color: "#626a6e",
                marginTop: 3,
              }}
            >
              {verified}
              {sameGender && (
                <>
                  &nbsp;&nbsp; • &nbsp;
                  <span style={{ color: teal, fontWeight: 700 }}>
                    Same-Gender Verified
                  </span>
                </>
              )}
            </Typography>
          </Box>
        </Box>

        <Box style={{ textAlign: "right" }}>
          <Typography
            style={{
              fontSize: 27,
              fontWeight: 700,
              color: teal,
              lineHeight: 1,
            }}
          >
            {fare}
          </Typography>

          <Typography
            style={{
              fontSize: 12,
              color: "#596167",
              marginTop: 3,
            }}
          >
            Fixed Fuel Split
          </Typography>
        </Box>
      </Box>

      <Box
        style={{
          marginTop: 11,
          background: "#fff",
          borderRadius: 7,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            style={{
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span style={{ color: "#514fd4" }}>●</span>&nbsp; {route}
          </Typography>

          <Typography
            style={{
              fontSize: 12,
              fontWeight: 700,
              marginTop: 7,
            }}
          >
            <span style={{ color: teal }}>●</span>&nbsp; {drop}
          </Typography>
        </Box>

        <Box style={{ textAlign: "right" }}>
          <Chip
            label={match}
            style={{
              height: 20,
              background: "#dce0fa",
              color: "#5151c8",
              fontSize: 12,
              fontWeight: 700,
            }}
          />

          <Typography
            style={{
              fontSize: 12,
              color: "#62696d",
              marginTop: 4,
            }}
          >
            {diversion}
          </Typography>
        </Box>
      </Box>

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 13,
        }}
      >
        <Button
          onClick={onAccept}
          disabled={busy}
          startIcon={<CheckCircleOutlineIcon />}
          style={{
            height: 32,
            background: teal,
            color: "#fff",
            borderRadius: 7,
            textTransform: "none",
            fontSize: 12.5,
            fontWeight: 700,
            padding: "0 14px",
          }}
        >
          Accept Lift
        </Button>

        <Button
          onClick={onDecline}
          disabled={busy}
          style={{
            height: 32,
            color: "#555e64",
            textTransform: "none",
            fontSize: 12.5,
            fontWeight: 600,
            marginLeft: 5,
          }}
        >
          Decline
        </Button>

        <Typography
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "#525a5e",
          }}
        >
          {expires}
        </Typography>
      </Box>
    </Box>
  );
}

function SafetyItem({ text }) {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 7,
      }}
    >
      <CheckCircleOutlineIcon
        style={{
          fontSize: 17,
          color: teal,
        }}
      />

      <Typography
        style={{
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

const footerLink = {
  fontSize: 12,
  color: "#555e63",
};