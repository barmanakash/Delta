import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SosIcon from "@mui/icons-material/Sos";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ProfileMenu from "../profilemenu/profilemenu";
import {
  apiRequest,
  clearSession,
  toAbsoluteUrl,
  useCachedUser,
} from "../riderrequests/riderrequests";

const teal = "#00796b";
const dark = "#172033";
const purple = "#4b48d8";
const lightPurple = "#f0f1ff";

function App() {
  const navigate = useNavigate();
  const cachedUser = useCachedUser();
  const [user, setUser] = useState(cachedUser);
  const [photoUrl, setPhotoUrl] = useState(
    toAbsoluteUrl(cachedUser?.profile_photo_url)
  );

  useEffect(() => {
    if (!localStorage.getItem("access_token")) return undefined;

    let mounted = true;
    apiRequest("/api/auth/me")
      .then(({ ok, status, data }) => {
        if (status === 401) {
          clearSession();
          navigate("/signin", { replace: true });
          return;
        }
        if (!ok || !data) return;

        localStorage.setItem("user", JSON.stringify(data));
        if (mounted) {
          setUser(data);
          setPhotoUrl(toAbsoluteUrl(data.profile_photo_url));
        }
      })
      .catch(() => {
        // Keep showing the cached profile while the backend is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const requests = [
    {
      name: "Rohit",
      initials: "R",
      overlap: "94%",
      pickup: "Napier Town, Near City Hospital",
      drop: "Madan Mahal Station Gate 2",
      distance: "0.2 km diversion",
      expiry: "Expires in 12 mins",
      active: true,
    },
    {
      name: "Ankit",
      initials: "A",
      overlap: "86%",
      pickup: "Ranjhi Transit Junction",
      drop: "Wright Town Stadium",
      distance: "0.1 km diversion",
      expiry: "Expires in 28 mins",
      active: false,
    },
    {
      name: "Siddharth",
      initials: "SM",
      overlap: "78%",
      pickup: "Dhanvantari Nagar Chowk",
      drop: "Madan Mahal",
      distance: "Near ring road",
      expiry: "Expires in 45 mins",
      active: false,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f8f8fd",
        color: dark,
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          minHeight: 70,
          background: "#fff",
          borderBottom: "1px solid #e9e9f1",
          position: "sticky",
          top: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 1,
          boxSizing: "border-box",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: 1,
                background: "#007d73",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                color: dark,
                whiteSpace: "nowrap",
              }}
            >
              FriendRide
            </Typography>
          </Box>

          <Chip
            label="RIDER"
            size="small"
            sx={{
              height: 25,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".5px",
              background: "#71e7df",
              color: "#006c66",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            background: "#f1f2fb",
            borderRadius: 30,
            padding: 0.5,
            flex: "0 1 auto",
            overflowX: "auto",
          }}
        >
          {[
            { label: "Home", path: "/home", icon: <HomeOutlinedIcon sx={{ fontSize: 17 }} /> },
            { label: "My Route", path: "/createcommute", icon: <RouteOutlinedIcon sx={{ fontSize: 17 }} /> },
            { label: "Requests", path: "/liftrequest", icon: <PeopleAltOutlinedIcon sx={{ fontSize: 17 }} /> },
            { label: "Trips", path: "/trips", icon: <DirectionsCarOutlinedIcon sx={{ fontSize: 17 }} /> },
          ].map(({ label, path, icon }) => {
            const active = path === "/liftrequest";
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
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                  borderRadius: 24,
                  px: 1.5,
                  py: 1,
                  background: active ? "#007d73" : "transparent",
                  color: active ? "#fff" : "#2b3347",
                  fontSize: 12,
                  fontWeight: active ? 700 : 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {icon}
                {label}
                {active && (
                  <Box
                    component="span"
                    sx={{
                      minWidth: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#71e7df",
                      color: "#006c66",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {requests.length}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <IconButton size="small" aria-label="Notifications">
            <NotificationsNoneOutlinedIcon
              sx={{ fontSize: 21, color: "#343b43" }}
            />
          </IconButton>
          <ProfileMenu user={user} photoUrl={photoUrl} />
        </Box>
      </Box>

      {/* MAIN */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 7,
          flex: 1,
        }}
      >
        {/* TITLE */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2.5,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 750,
                  lineHeight: 1.1,
                }}
              >
                Lift Requests
              </Typography>

              <Chip
                label="CORRIDOR ACTIVE"
                size="small"
                sx={{
                  height: 23,
                  background: "#e0f2f0",
                  color: "#00786e",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: ".5px",
                }}
              />
            </Box>

            <Typography
              sx={{
                mt: 0.6,
                color: "#565b63",
                fontSize: 14.5,
              }}
            >
              Verified commuters searching for a pillion lift along your
              designated route.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                height: 40,
                px: 2,
                borderRadius: 4,
                background: "#fff",
                border: "1px solid #e7e8f2",
                display: "flex",
                alignItems: "center",
                gap: 1,
                boxShadow: "0 0 0 3px #e8eaff",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#008b7d",
                }}
              />
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                Available (3)
              </Typography>
            </Box>

            <Box
              sx={{
                height: 40,
                px: 2,
                borderRadius: 4,
                background: "#eef0ff",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: 13 }}>
                ◉ Empty State Preview
              </Typography>
            </Box>

            <Box
              sx={{
                height: 40,
                px: 2,
                borderRadius: 4,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TuneOutlinedIcon sx={{ fontSize: 17, color: teal }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                Filters
              </Typography>

              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#007f73",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                3
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ROUTE SUMMARY */}
        <Box
          sx={{
            background: "#fff",
            borderRadius: 3,
            border: "1px solid #ededf4",
            minHeight: 56,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                px: 1.3,
                height: 30,
                borderRadius: 3,
                background: "#e8f6f4",
                display: "flex",
                alignItems: "center",
                gap: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: teal,
                }}
              />

              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                Active Route:
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: teal,
                }}
              >
                PNT Naka → Madan Mahal
              </Typography>
            </Box>

            <Chip
              label="✓ Active"
              size="small"
              sx={{
                background: "#edf8f6",
                color: "#008073",
                fontSize: 12.5,
              }}
            />

            <Chip
              icon={
                <ShieldOutlinedIcon
                  sx={{ fontSize: "14px !important" }}
                />
              }
              label="AIS-140 Corridor Locked"
              size="small"
              sx={{
                background: "#eef0ff",
                color: "#5658c9",
                fontSize: 12.5,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              ♧ 3 Compatible Requests Found
            </Typography>

            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#d6d9f2",
              }}
            />

            <Typography sx={{ fontSize: 13, color: "#555b65" }}>
              ♧ Same-Gender Verified
            </Typography>

            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#d6d9f2",
              }}
            />

            <Typography sx={{ fontSize: 13, color: "#555b65" }}>
              🏍 1 Seat (Standard Pillion)
            </Typography>
          </Box>
        </Box>

        {/* FILTERS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                height: 32,
                px: 1.7,
                borderRadius: 4,
                background: "#007e73",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                fontSize: 13,
              }}
            >
              ⌁ Pickup Proximity: Within 500m (Selected)
            </Box>

            <Box
              sx={{
                height: 32,
                px: 1.7,
                borderRadius: 4,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                fontSize: 13,
                color: "#525761",
              }}
            >
              ◷ Travel Time: 08:15 AM - 09:30 AM
            </Box>

            <Box
              sx={{
                height: 32,
                px: 1.7,
                borderRadius: 4,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                fontSize: 13,
                color: "#525761",
              }}
            >
              ⌁ Route Overlap: &gt;70% Overlap
            </Box>
          </Box>

          <Box
            sx={{
              height: 32,
              px: 1.8,
              borderRadius: 4,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              fontSize: 13,
              color: "#4c5058",
            }}
          >
            <SwapVertIcon sx={{ fontSize: 15.5, mr: 0.5 }} />
            Sort by: Highest Overlap ↓
          </Box>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2.15fr) minmax(350px, 1fr)",
            gap: 2.5,
          }}
        >
          {/* LEFT REQUESTS */}
          <Box>
            {requests.map((request, index) => (
              <Box
                key={request.name}
                sx={{
                  height: 112,
                  background: "#fff",
                  borderRadius: 3,
                  borderLeft:
                    index === 0
                      ? "5px solid #007e73"
                      : index === 1
                      ? "5px solid #4c49d9"
                      : "5px solid #c7ccd0",
                  mb: 2,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 1px 2px rgba(20,25,40,.02)",
                }}
              >
                {/* AVATAR */}
                <Box
                  sx={{
                    width: 110,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      sx={{
                        width: 62,
                        height: 62,
                        background:
                          index === 2 ? "#6264ea" : "#dce4e7",
                        color: index === 2 ? "#fff" : "#24303a",
                        border:
                          index === 0
                            ? "2px solid #d4e5e3"
                            : "2px solid #d8dbf5",
                        fontWeight: 700,
                        fontSize: index === 2 ? 16 : 22,
                      }}
                    >
                      {request.initials}
                    </Avatar>

                    <Box
                      sx={{
                        position: "absolute",
                        right: -1,
                        bottom: -1,
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <VerifiedOutlinedIcon
                        sx={{
                          color: "#008a7c",
                          fontSize: 14.5,
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      mt: 0.3,
                    }}
                  >
                    {request.name}
                  </Typography>
                </Box>

                {/* DETAILS */}
                <Box sx={{ flex: 1, height: "100%", py: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={`♘ ${request.overlap} Route Overlap`}
                      size="small"
                      sx={{
                        height: 24,
                        background: "#e4f4f2",
                        color: "#007a70",
                        fontSize: 12.5,
                        fontWeight: 800,
                      }}
                    />

                    <Chip
                      label="♢ Same-Gender Verified • Male Commuter"
                      size="small"
                      sx={{
                        height: 24,
                        background: "#eef0ff",
                        color: "#555acb",
                        fontSize: 12.5,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: `3px solid ${teal}`,
                        mr: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        flex: 1,
                      }}
                    >
                      Pickup: {request.pickup}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: index === 0 ? "#008378" : "#555b65",
                        mr: 2,
                      }}
                    >
                      {request.distance}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: `3px solid ${purple}`,
                        mr: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        flex: 1,
                      }}
                    >
                      Drop-off: {request.drop}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: purple,
                        mr: 2,
                      }}
                    >
                      {index === 0
                        ? "Direct corridor stop"
                        : index === 1
                        ? "0.4 km diversion"
                        : "Main flyover end"}
                    </Typography>
                  </Box>
                </Box>

                {/* ACTION */}
                <Box
                  sx={{
                    width: 178,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 1.5,
                  }}
                >
                  <Chip
                    label={`◷ ${request.expiry}`}
                    size="small"
                    sx={{
                      height: 24,
                      background:
                        index === 0 ? "#ffe8e8" : "#e9edff",
                      color:
                        index === 0 ? "#d44d4d" : "#505a86",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />

                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/viewRequest')}
                    sx={{
                      textTransform: "none",
                      fontSize: 13,
                      fontWeight: 700,
                      borderRadius: 2,
                      height: 42,
                      px: 1.8,
                      background:
                        index === 0 ? "#007d72" : "#e3e7ff",
                      color: index === 0 ? "#fff" : "#28324c",
                      boxShadow: "none",
                      "&:hover": {
                        background:
                          index === 0 ? "#007d72" : "#e3e7ff",
                        boxShadow: "none",
                      },
                    }}
                  >
                    View Request Details
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          {/* RIGHT PANEL */}
          <Box
            sx={{
              background: "#fff",
              borderRadius: 3,
              p: 1.5,
              minHeight: 720,
            }}
          >
            <Box sx={{ px: 1.5, pt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  <DirectionsBikeOutlinedIcon
                    sx={{
                      color: teal,
                      fontSize: 19,
                      verticalAlign: "middle",
                      mr: 0.5,
                    }}
                  />
                  Your Active Route
                </Typography>

                <Chip
                  label="#SR-4092"
                  size="small"
                  sx={{
                    height: 23,
                    background: "#eef0ff",
                    color: "#646b86",
                    fontSize: 12,
                  }}
                />
              </Box>

              <Box
                sx={{
                  mt: 1,
                  p: 1.2,
                  background: "#f1f2ff",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    PNT Naka → Madan Mahal
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "#686c74",
                    }}
                  >
                    Main Arterial Flyover
                  </Typography>
                </Box>

                <Chip
                  label="8.4 km • 22 mins"
                  size="small"
                  sx={{
                    background: "#d9efeb",
                    color: "#007b70",
                    fontSize: 12.5,
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>

            {/* MAP */}
            <Box
              sx={{
                mt: 1.5,
                background: "#f1f2ff",
                borderRadius: 2,
                p: 1.2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                  px: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: "#575c66",
                  }}
                >
                  CORRIDOR RADAR MAP
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#008376",
                    fontWeight: 700,
                  }}
                >
                  ● Live AIS-140 Lock
                </Typography>
              </Box>

              <Box
                sx={{
                  height: 255,
                  borderRadius: 2,
                  background: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid #eef0f4",
                }}
              >
                {/* MAP GRID */}
                {[20, 40, 60, 80].map((x) => (
                  <Box
                    key={`v-${x}`}
                    sx={{
                      position: "absolute",
                      left: `${x}%`,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      background: "#e8e9ed",
                    }}
                  />
                ))}

                {[25, 50, 75].map((y) => (
                  <Box
                    key={`h-${y}`}
                    sx={{
                      position: "absolute",
                      top: `${y}%`,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: "#e8e9ed",
                    }}
                  />
                ))}

                {/* ROUTE LINE */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 255"
                  style={{
                    position: "absolute",
                    inset: 0,
                  }}
                >
                  <path
                    d="M 45 205 C 90 180, 120 170, 155 145 C 190 120, 205 105, 235 90 C 270 73, 310 58, 355 40"
                    fill="none"
                    stroke="#ccece7"
                    strokeWidth="13"
                    opacity="0.8"
                  />

                  <path
                    d="M 45 205 C 90 180, 120 170, 155 145 C 190 120, 205 105, 235 90 C 270 73, 310 58, 355 40"
                    fill="none"
                    stroke="#007e73"
                    strokeWidth="5"
                  />

                  <circle
                    cx="45"
                    cy="205"
                    r="7"
                    fill="#fff"
                    stroke="#008476"
                    strokeWidth="4"
                  />

                  <circle
                    cx="155"
                    cy="145"
                    r="7"
                    fill="#fff"
                    stroke="#008476"
                    strokeWidth="4"
                  />

                  <circle
                    cx="235"
                    cy="90"
                    r="7"
                    fill="#fff"
                    stroke="#4c49d9"
                    strokeWidth="4"
                  />

                  <circle
                    cx="355"
                    cy="40"
                    r="7"
                    fill="#fff"
                    stroke="#4c49d9"
                    strokeWidth="4"
                  />
                </svg>

                {/* MAP LABELS */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 13,
                    bottom: 11,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <div>PNT Naka</div>
                  <div style={{ fontSize: 12, fontWeight: 400 }}>
                    (Start)
                  </div>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    left: "54%",
                    top: "43%",
                    fontSize: 12,
                    fontWeight: 700,
                    background: "#fff",
                    borderRadius: 1,
                    px: 0.6,
                    py: 0.3,
                    boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                  }}
                >
                  1. Rohit (0.2km)
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    left: "62%",
                    top: "24%",
                    fontSize: 12,
                    fontWeight: 700,
                    background: "#fff",
                    borderRadius: 1,
                    px: 0.6,
                    py: 0.3,
                    boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                  }}
                >
                  2. Ankit (0.1km)
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    left: "52%",
                    top: "15%",
                    fontSize: 12,
                    fontWeight: 700,
                    background: "#fff",
                    borderRadius: 1,
                    px: 0.6,
                    py: 0.3,
                    boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                  }}
                >
                  3. Siddharth (0km)
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    right: 11,
                    top: 13,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Madan Mahal
                  <div style={{ fontSize: 12, fontWeight: 400 }}>
                    (Drop)
                  </div>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                  px: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#444b57",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 4,
                      borderRadius: 3,
                      background: "#007e73",
                      marginRight: 5,
                    }}
                  />
                  Your Route Line
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#444b57",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#4c49d9",
                      marginRight: 5,
                    }}
                  />
                  Request Pickup Points
                </Typography>
              </Box>
            </Box>

            {/* PARAMETERS */}
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                background: "#f2f3ff",
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: "#4e535c",
                  mb: 1,
                }}
              >
                COMMUTE PARAMETERS
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "#50555e" }}>
                  Scheduled Departure
                </Typography>

                <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>
                  Today, 09:15 AM
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "#50555e" }}>
                  Registered Vehicle
                </Typography>

                <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>
                  Bajaj Pulsar NS200
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "#50555e" }}>
                  Seat Availability
                </Typography>

                <Chip
                  label="1 Seat Available"
                  size="small"
                  sx={{
                    height: 21,
                    background: "#d9efeb",
                    color: "#007c71",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>

            {/* CORRIDOR LOCK */}
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                background: "#e9ecff",
                borderRadius: 2,
                display: "flex",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 37,
                  height: 37,
                  flexShrink: 0,
                  borderRadius: 2,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldOutlinedIcon
                  sx={{
                    color: "#008678",
                    fontSize: 22,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 15.5,
                    fontWeight: 800,
                    mb: 0.5,
                  }}
                >
                  FriendRide Corridor Lock
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#5d626b",
                    lineHeight: 1.35,
                  }}
                >
                  Only commuters within 500m of your exact trajectory are
                  surfaced.
                  <br />
                  Passenger identities and drop-off coordinates are
                  cryptographically verified.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          height: 68,
          background: "#fff",
          borderTop: "1px solid #ececf3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            sx={{
              fontSize: 12.5,
              color: "#4e555d",
            }}
          >
            <ShieldOutlinedIcon
              sx={{
                fontSize: 14.5,
                color: "#007d71",
                verticalAlign: "middle",
                mr: 0.5,
              }}
            />
            AIS 140 & MoRTH ride-pooling compliant
          </Typography>

          <Typography sx={{ color: "#bfc1c8" }}>•</Typography>

          <Typography
            sx={{
              fontSize: 12.5,
              color: "#4e555d",
            }}
          >
            <SecurityOutlinedIcon
              sx={{
                fontSize: 14.5,
                color: "#007d71",
                verticalAlign: "middle",
                mr: 0.5,
              }}
            />
            ISO 27001 Certified Security
          </Typography>

          <Typography sx={{ color: "#bfc1c8" }}>•</Typography>

          <Typography
            sx={{
              fontSize: 12.5,
              color: "#e12626",
            }}
          >
            <SosIcon
              sx={{
                fontSize: 14.5,
                verticalAlign: "middle",
                mr: 0.5,
              }}
            />
            24/7 Police SOS
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 12.5,
            color: "#4e555d",
          }}
        >
          © 2025 FriendRide. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;