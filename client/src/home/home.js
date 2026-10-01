// App.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
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
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ProfileMenu from "../profilemenu/profilemenu";

const teal = "#007d73";
const dark = "#182136";
const lightBg = "#f8f8ff";
const lavender = "#f0f1fc";
const API_BASE_URL = "http://localhost:8000";

export default function App() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [role, setRole] = useState("rider");
  const [user, setUser] = useState(null); // full profile, shown in the profile menu

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

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* HEADER */}
      <Box
        style={{
          height: 67,
          background: "#fff",
          borderBottom: "1px solid #e7e8f1",
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          boxSizing: "border-box",
          justifyContent: "space-between",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginRight: 18,
            }}
          >
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldOutlinedIcon
                style={{
                  color: "#fff",
                  fontSize: 19,
                }}
              />
            </Box>

            <Typography
              style={{
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              SafeRoute
            </Typography>
          </Box>

          <Typography
            style={{
              fontSize: 17,
              fontWeight: 700,
              marginRight: 10,
            }}
          >
            SafeRoute
          </Typography>

          <Chip
            label={role === "lift" ? "LIFT TAKER" : "RIDER"}
            size="small"
            style={{
              height: 18,
              borderRadius: 9,
              background: "#71e7df",
              color: "#006c66",
              fontWeight: 800,
              fontSize: 9,
            }}
          />

          <Box
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              marginLeft: 24,
              gap: 5,
            }}
          >
            <NavItem
              active
              icon={<HomeOutlinedIcon style={{ fontSize: 17 }} />}
              text="Home"
            />
            <NavItem
              icon={<RouteOutlinedIcon style={{ fontSize: 17 }} />}
              text="My Route"
            />
            {/* <NavItem
              icon={<PeopleAltOutlinedIcon style={{ fontSize: 17 }} />}
              text="Requests"
              badge="2"
              // component={RouterLink}
              // to ='/liftrequest'
              onClick={() => navigate('/liftrequest')}
            /> */}
            <div
              onClick={() => navigate('/liftrequest')}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              <NavItem
                icon={<PeopleAltOutlinedIcon style={{ fontSize: 17 }} />}
                text="Requests"
                badge="2"
              />
            </div>
            <div
              onClick={() => navigate('/trips')}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              <NavItem
                icon={<DirectionsCarOutlinedIcon style={{ fontSize: 17 }} />}
                text="Trips"
              />
            </div>

          </Box>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <Box style={{ position: "relative" }}>
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
                  fontSize: 10,
                }}
              />
            </Box>

            <Typography
              style={{
                fontSize: 13,
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
              startIcon={<AddRoadOutlinedIcon />}
              style={{
                height: 36,
                minWidth: 155,
                borderRadius: 20,
                background: teal,
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              + Create Route
            </Button>

            <Button
              startIcon={<HistoryOutlinedIcon />}
              style={{
                height: 36,
                minWidth: 108,
                borderRadius: 20,
                background: "#e9ebfb",
                color: dark,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 13,
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
                  fontSize: 13,
                  fontWeight: 700,
                  color: dark,
                }}
              >
                ₹1,480
              </Typography>

              <Typography
                style={{
                  fontSize: 11,
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
                            fontSize: 9,
                            fontWeight: 800,
                            color: "#4b5361",
                          }}
                        >
                          ROUTE #SR-4092
                        </Typography>
                      </Box>

                      <Typography
                        style={{
                          fontSize: 10,
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
                  label="♙ 1 Seat Available"
                  style={{
                    height: 25,
                    background: "#75e7df",
                    color: "#006f68",
                    fontSize: 10,
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
                      fontSize: 9,
                      color: "#505960",
                      letterSpacing: "0.3px",
                    }}
                  >
                    DEPARTURE POINT
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    PNT Naka
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
                      fontSize: 9,
                      color: "#505960",
                      letterSpacing: "0.3px",
                      marginTop: 1,
                    }}
                  >
                    DESTINATION
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    Madan Mahal Station
                  </Typography>
                </Box>

                <Box
                  style={{
                    borderLeft: "1px solid #dce1f2",
                    height: 43,
                    marginRight: 18,
                  }}
                />

                <Metric title="Est. Distance" value="8.4 km" />
                <Metric title="Travel Time" value="22 mins" teal />
                <Box style={{ marginLeft: 19 }}>
                  <Typography
                    style={{
                      fontSize: 10,
                      color: "#4c555a",
                    }}
                  >
                    Vehicle
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Bajaj Pulsar NS200
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 9,
                      color: "#555c62",
                    }}
                  >
                    MP 20 ZB 4821
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
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    Via Napier Town Corridor
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 11,
                      color: "#60666b",
                    }}
                  >
                    • No roadblocks reported
                  </Typography>
                </Box>

                <Chip
                  label="Optimal Corridor"
                  style={{
                    height: 20,
                    background: "#dddfff",
                    color: "#5b4ee4",
                    fontSize: 9,
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
                    startIcon={<NearMeOutlinedIcon />}
                    style={{
                      height: 36,
                      background: teal,
                      color: "#fff",
                      borderRadius: 7,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: 12,
                      padding: "0 16px",
                    }}
                  >
                    View Route
                  </Button>

                  <Button
                    startIcon={<EditOutlinedIcon />}
                    style={{
                      height: 36,
                      background: "#e9ebfb",
                      color: "#303b46",
                      borderRadius: 7,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: 12,
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
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Pause Sharing Today
                  </Typography>
                </Box>
              </Box>
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
                    label="2 New Requests"
                    style={{
                      height: 21,
                      background: "#5753df",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  />
                </Box>

                <Typography
                  style={{
                    fontSize: 11,
                    color: "#687075",
                  }}
                >
                  Filtered by institution security criteria
                </Typography>
              </Box>

              <RequestCard
                first
                name="Rohit Sharma"
                rating="4.9"
                route="Pickup: Ranjhi Crossing"
                drop="Dropoff: Madan Mahal Gate 2"
                match="98% Route Match"
                fare="₹45"
              />

              <RequestCard
                name="Ankit Verma"
                rating="4.8"
                route="Damoh Naka → Wright Town"
                match="92% Match"
                fare="₹40 Split"
                second
              />

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Typography
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: teal,
                  }}
                >
                  View All Incoming Requests (2) →
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
                        fontSize: 15,
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
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  <Typography
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      marginTop: 3,
                    }}
                  >
                    Morning Departure: 09:15 AM (Today) &nbsp; •
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      marginTop: 3,
                    }}
                  >
                    Return Slot: 06:30 PM (Evening Commute)
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 10,
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
                startIcon={<EditOutlinedIcon />}
                style={{
                  height: 34,
                  background: "#e8ebfb",
                  color: "#34404a",
                  borderRadius: 7,
                  textTransform: "none",
                  fontSize: 11,
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
                      fontSize: 10,
                      color: "#626a6d",
                      marginTop: 2,
                    }}
                  >
                    Jabalpur Metro Transit Spine
                  </Typography>
                </Box>

                <Box
                  style={{
                    height: 35,
                    display: "flex",
                    alignItems: "center",
                    background: "#e9ebfb",
                    borderRadius: 8,
                  }}
                >
                  <IconButton size="small">
                    <AddOutlinedIcon style={{ fontSize: 17 }} />
                  </IconButton>
                  <IconButton size="small">
                    <RemoveOutlinedIcon style={{ fontSize: 17 }} />
                  </IconButton>
                  <IconButton size="small">
                    <FullscreenOutlinedIcon style={{ fontSize: 17 }} />
                  </IconButton>
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
                {/* MAP GRID */}
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(#d8ddec 1px, transparent 1px), linear-gradient(90deg,#d8ddec 1px,transparent 1px)",
                    backgroundSize: "74px 64px",
                    opacity: 0.75,
                  }}
                />

                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 350 270"
                  style={{
                    position: "absolute",
                    inset: 0,
                  }}
                >
                  <path
                    d="M50 65 C95 78 125 120 170 140 C220 165 230 185 295 215"
                    fill="none"
                    stroke="#159d91"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M50 65 C95 78 125 120 170 140 C220 165 230 185 295 215"
                    fill="none"
                    stroke="#b6eee8"
                    strokeWidth="9"
                    strokeLinecap="round"
                    opacity="0.28"
                  />

                  <circle
                    cx="50"
                    cy="65"
                    r="9"
                    fill="#504fd7"
                    stroke="#fff"
                    strokeWidth="4"
                  />

                  <circle
                    cx="205"
                    cy="164"
                    r="9"
                    fill="#b67808"
                    stroke="#fff"
                    strokeWidth="4"
                  />

                  <circle
                    cx="295"
                    cy="215"
                    r="9"
                    fill="#007c74"
                    stroke="#fff"
                    strokeWidth="4"
                  />
                </svg>

                <MapLabel
                  text="PNT Naka"
                  style={{
                    left: 23,
                    top: 38,
                  }}
                />

                <MapLabel
                  text="◉ Ranjhi Pickup"
                  style={{
                    left: 174,
                    top: 119,
                    color: "#514ad8",
                  }}
                />

                <MapLabel
                  text="⚑ Madan Mahal"
                  style={{
                    right: 29,
                    bottom: 46,
                    background: teal,
                    color: "#fff",
                  }}
                />

                <Box
                  style={{
                    position: "absolute",
                    left: 11,
                    right: 11,
                    bottom: 10,
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
                  <Typography
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ color: teal }}>●</span> Live Traffic: Moderate
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: teal,
                    }}
                  >
                    22 min ETA
                  </Typography>
                </Box>
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
                    fontSize: 10,
                    color: teal,
                    fontWeight: 600,
                  }}
                >
                  △ GPS lock active
                </Typography>

                <Typography
                  style={{
                    fontSize: 10,
                    color: "#544bdf",
                    fontWeight: 700,
                  }}
                >
                  Congestion-Free Route
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
                      fontSize: 10,
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
                  fontSize: 13,
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
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#d82323",
                    }}
                  >
                    SOS
                  </Typography>

                  <Typography
                    style={{
                      fontSize: 12,
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
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Institutional Trust Policy
                </Typography>

                <Typography
                  style={{
                    fontSize: 11,
                    lineHeight: 1.55,
                    color: "#515a62",
                    marginTop: 5,
                  }}
                >
                  SafeRoute pairs verified riders and passengers based
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
                fontSize: 13,
              }}
            >
              ●
            </Typography>

            <Typography
              style={{
                fontSize: 10,
                color: "#465055",
              }}
            >
              AIS 140 &amp; MoRTH Intelligent Commute Safety Compliant
            </Typography>
          </Box>

          <Typography
            style={{
              fontSize: 10,
              color: "#465055",
              marginTop: 4,
            }}
          >
            © 2025 SafeRoute Technologies Inc. All rights reserved.
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
    </Box>
  );
}

/* ---------------- COMPONENTS ---------------- */

function NavItem({ active, icon, text, badge }) {
  return (
    <Box
      style={{
        height: 40,
        minWidth: active ? 74 : 88,
        padding: active ? "0 13px" : "0 10px",
        borderRadius: active ? 8 : 0,
        background: active ? teal : "transparent",
        color: active ? "#fff" : "#3f474c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        boxSizing: "border-box",
      }}
    >
      {icon}

      <Typography
        style={{
          fontSize: 12,
          fontWeight: active ? 700 : 600,
        }}
      >
        {text}
      </Typography>

      {badge && (
        <Box
          style={{
            minWidth: 17,
            height: 17,
            borderRadius: 9,
            background: "#5b52dc",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {badge}
        </Box>
      )}
    </Box>
  );
}

function Metric({ title, value, teal: isTeal }) {
  return (
    <Box style={{ marginLeft: 17 }}>
      <Typography
        style={{
          fontSize: 10,
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
  name,
  rating,
  route,
  drop,
  match,
  fare,
  second,
}) {
  if (second) {
    return (
      <Box
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
            style={{
              width: 38,
              height: 38,
              background: "#64778b",
              fontSize: 11,
            }}
          >
            AV
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
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {name}
              </Typography>

              <Typography
                style={{
                  fontSize: 10,
                  color: "#99731b",
                }}
              >
                ☆{rating}
              </Typography>
            </Box>

            <Typography
              style={{
                fontSize: 10,
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
                fontSize: 9,
                fontWeight: 700,
              }}
            />

            <Typography
              style={{
                fontSize: 10,
                color: teal,
                fontWeight: 700,
              }}
            >
              {fare}
            </Typography>
          </Box>

          <Button
            style={{
              height: 32,
              background: "#e5e8fa",
              color: "#3d4650",
              borderRadius: 7,
              textTransform: "none",
              fontSize: 10,
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
            style={{
              width: 42,
              height: 42,
              background: "#8da0a2",
              fontSize: 11,
            }}
          >
            RS
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
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {name}
              </Typography>

              <Typography
                style={{
                  fontSize: 10,
                  color: "#9b741b",
                  fontWeight: 700,
                  background: "#fff2cb",
                  padding: "2px 5px",
                  borderRadius: 4,
                }}
              >
                ★ {rating}
              </Typography>
            </Box>

            <Typography
              style={{
                fontSize: 10,
                color: "#626a6e",
                marginTop: 3,
              }}
            >
              Verified Commuter&nbsp;&nbsp; • &nbsp;
              <span style={{ color: teal, fontWeight: 700 }}>
                Same-Gender Verified
              </span>
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
              fontSize: 9,
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
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            <span style={{ color: "#514fd4" }}>●</span>&nbsp; {route}
          </Typography>

          <Typography
            style={{
              fontSize: 10,
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
              fontSize: 9,
              fontWeight: 700,
            }}
          />

          <Typography
            style={{
              fontSize: 9,
              color: "#62696d",
              marginTop: 4,
            }}
          >
            Along corridor • 0.3 km diversion
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
          startIcon={<CheckCircleOutlineIcon />}
          style={{
            height: 32,
            background: teal,
            color: "#fff",
            borderRadius: 7,
            textTransform: "none",
            fontSize: 11,
            fontWeight: 700,
            padding: "0 14px",
          }}
        >
          Accept Lift
        </Button>

        <Button
          style={{
            height: 32,
            color: "#555e64",
            textTransform: "none",
            fontSize: 11,
            fontWeight: 600,
            marginLeft: 5,
          }}
        >
          Decline
        </Button>

        <Typography
          style={{
            marginLeft: "auto",
            fontSize: 9,
            color: "#525a5e",
          }}
        >
          Expires in 14 mins
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
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

function MapLabel({ text, style }) {
  return (
    <Box
      style={{
        position: "absolute",
        background: "#fff",
        borderRadius: 4,
        padding: "3px 7px",
        boxShadow: "0 1px 4px rgba(0,0,0,.12)",
        fontSize: 9,
        fontWeight: 700,
        color: "#303746",
        ...style,
      }}
    >
      {text}
    </Box>
  );
}

const footerLink = {
  fontSize: 10,
  color: "#555e63",
};