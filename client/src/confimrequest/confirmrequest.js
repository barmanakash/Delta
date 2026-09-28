// src/confirmrequest/ConfirmRequest.js

import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LocalPoliceOutlinedIcon from "@mui/icons-material/LocalPoliceOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarIcon from "@mui/icons-material/Star";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Link as RouterLink, useNavigate } from "react-router-dom";


const ConfirmRequest = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(135deg, #f8f8ff 0%, #f7f7ff 45%, #eeeeff 100%)",
        color: "#182238",
        fontFamily: "Arial, Helvetica, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          height: "72px",
          background: "#ffffff",
          borderBottom: "1px solid #eeeeF5",
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: { md: "260px" },
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "7px",
              background: "#008579",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldOutlinedIcon
              sx={{
                color: "#fff",
                fontSize: 21,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#182238",
            }}
          >
            Safe
            <Box
              component="span"
              sx={{
                color: "#008579",
              }}
            >
              Route
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              ml: 0.5,
            }}
          >
            SafeRoute
          </Typography>

          <Box
            sx={{
              ml: 0.5,
              px: 1,
              py: 0.35,
              borderRadius: "10px",
              background: "#c9f8f4",
              color: "#00796f",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            RIDE-POOL
          </Box>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, md: 4 },
            height: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#343941",
            }}
          >
            Home
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#343941",
            }}
          >
            My Route
          </Typography>

          <Box
            sx={{
              height: 38,
              px: 2,
              borderRadius: "8px",
              background: "#008579",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#fff",
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Requests
            </Typography>

            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#f3b8bd",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              3
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#343941",
            }}
          >
            Trips
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Right Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <NotificationsNoneOutlinedIcon
            sx={{
              color: "#30363d",
              fontSize: 23,
            }}
          />

          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: 14,
              background: "#b9b9c7",
              color: "#fff",
              border: "2px solid #e9e9f5",
            }}
          >
            H
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#252b38",
                lineHeight: 1.2,
              }}
            >
              Harshit Bhargava
            </Typography>

            <Typography
              sx={{
                fontSize: 11,
                color: "#737887",
                lineHeight: 1.3,
              }}
            >
              Verified Daily Pooler
            </Typography>
          </Box>

          <KeyboardArrowDownIcon
            sx={{
              fontSize: 19,
              color: "#5e6570",
            }}
          />
        </Box>
      </Box>

      {/* MAIN AREA */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 4, md: 7 },
          px: 2,
        }}
      >
        {/* CARD */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "560px",
            background: "#ffffff",
            borderRadius: "18px",
            boxShadow: "0 16px 38px rgba(42, 48, 90, 0.14)",
            overflow: "hidden",
            position: "relative",
            borderTop: "5px solid transparent",
            borderImage:
              "linear-gradient(90deg, #65d8cb, #007e72, #4e4ddd) 1",
          }}
        >
          <Box
            sx={{
              px: { xs: 3, md: 4 },
              pt: 4,
              pb: 3.5,
            }}
          >
            {/* TOP ICON */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: "50%",
                  background: "#d9fbf7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#007d72",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShieldOutlinedIcon
                    sx={{
                      color: "#ffffff",
                      fontSize: 22,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    right: -2,
                    bottom: 5,
                    width: 23,
                    height: 23,
                    borderRadius: "50%",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,.12)",
                  }}
                >
                  <DirectionsBikeOutlinedIcon
                    sx={{
                      color: "#4a48d8",
                      fontSize: 15,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* TITLE */}
            <Typography
              sx={{
                textAlign: "center",
                fontFamily: "Georgia, serif",
                fontSize: { xs: 24, md: 25 },
                fontWeight: 700,
                color: "#172038",
                mb: 0.7,
              }}
            >
              Accept this lift request?
            </Typography>

            <Typography
              sx={{
                textAlign: "center",
                color: "#63666d",
                fontFamily: "Georgia, serif",
                fontSize: 14,
                lineHeight: 1.5,
                maxWidth: 430,
                mx: "auto",
                mb: 2.7,
              }}
            >
              You're about to confirm this passenger for your upcoming
              corridor commute.
            </Typography>

            {/* PASSENGER CARD */}
            <Box
              sx={{
                background: "#f1f1ff",
                borderRadius: "11px",
                p: 2,
              }}
            >
              {/* Passenger Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      sx={{
                        width: 49,
                        height: 49,
                        background:
                          "linear-gradient(145deg,#d8e9ed,#a8bec7)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 16,
                        border: "3px solid #ffffff",
                      }}
                    >
                      R
                    </Avatar>

                    <Box
                      sx={{
                        position: "absolute",
                        right: -2,
                        bottom: -2,
                        width: 17,
                        height: 17,
                        borderRadius: "50%",
                        background: "#008579",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "2px solid #fff",
                        fontSize: 9,
                      }}
                    >
                      ✓
                    </Box>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.7,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1c2437",
                        }}
                      >
                        Rohit
                      </Typography>

                      <Chip
                        label="Co-Rider"
                        size="small"
                        sx={{
                          height: 19,
                          borderRadius: "10px",
                          background: "#dce1fa",
                          color: "#4d5871",
                          fontSize: 9,
                          fontWeight: 500,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                        mt: 0.25,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "#4e5360",
                        }}
                      >
                        4.9
                      </Typography>

                      <StarIcon
                        sx={{
                          color: "#b47b13",
                          fontSize: 13,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 10,
                          color: "#707580",
                        }}
                      >
                        • Verified Commuter
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    background: "#c8f8f2",
                    borderRadius: "10px",
                    px: 1,
                    py: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.4,
                  }}
                >
                  <ShieldOutlinedIcon
                    sx={{
                      fontSize: 12,
                      color: "#007b70",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#007b70",
                    }}
                  >
                    Safety match confirmed
                  </Typography>
                </Box>
              </Box>

              {/* JOURNEY */}
              <Box
                sx={{
                  background: "#ffffff",
                  borderRadius: "9px",
                  px: 1.5,
                  py: 1.2,
                }}
              >
                {/* Pickup */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 19,
                      height: 19,
                      borderRadius: "50%",
                      background: "#d3f8f3",
                      border: "3px solid #008579",
                      mt: 0.1,
                      mr: 1,
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#273044",
                      }}
                    >
                      Pickup: Napier Town
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10.5,
                        color: "#646873",
                        mt: 0.15,
                      }}
                    >
                      Requested pickup • 0.2 km minor corridor detour
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#007c70",
                      pt: 0.2,
                    }}
                  >
                    8:30 AM
                  </Typography>
                </Box>

                {/* Vertical Line */}
                <Box
                  sx={{
                    width: 1,
                    height: 14,
                    background: "#b8c3d3",
                    ml: "9px",
                  }}
                />

                {/* Dropoff */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: 19,
                      height: 19,
                      borderRadius: "50%",
                      background: "#e0e0ff",
                      border: "3px solid #4c49db",
                      mt: 0.1,
                      mr: 1,
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#273044",
                      }}
                    >
                      Drop-off: Madan Mahal
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10.5,
                        color: "#646873",
                        mt: 0.15,
                      }}
                    >
                      Direct corridor alignment • Destination match
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#555b67",
                      pt: 0.2,
                    }}
                  >
                    ~8:48 AM
                  </Typography>
                </Box>
              </Box>

              {/* FUEL SPLIT */}
              <Box
                sx={{
                  mt: 1.5,
                  background: "#e7e8ff",
                  borderRadius: "7px",
                  px: 1.3,
                  py: 0.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                  }}
                >
                  <PaymentsOutlinedIcon
                    sx={{
                      color: "#9b7200",
                      fontSize: 18,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#555b68",
                    }}
                  >
                    Estimated Fuel Sharing Split
                  </Typography>
                </Box>

                <Box
                  sx={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    px: 1.1,
                    py: 0.45,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#26304a",
                    }}
                  >
                    ₹45 Fixed Fuel Split
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ROUTE OVERLAP */}
            <Box
              sx={{
                mt: 1.5,
                background: "#f1f1ff",
                borderRadius: "11px",
                px: 1.5,
                py: 1.3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#007b70",
                  }}
                >
                  ↗ 94% Corridor Overlap
                </Typography>

                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#666b77",
                  }}
                >
                  ♙ 1 of 1 Pillion Seat Reserved
                </Typography>
              </Box>

              {/* Route Line */}
              <Box
                sx={{
                  position: "relative",
                  height: 13,
                  display: "flex",
                  alignItems: "center",
                  px: 0.8,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 5,
                    borderRadius: "5px",
                    background:
                      "linear-gradient(90deg,#63d8ca 0%,#007e73 52%,#007e73 100%)",
                  }}
                />

                {/* Start */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#ffffff",
                    border: "2px solid #7b8587",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#7b8587",
                    }}
                  />
                </Box>

                {/* Pickup */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#007d72",
                    border: "2px solid #ffffff",
                    boxShadow: "0 0 0 1px #007d72",
                  }}
                />

                {/* End */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#4b48dd",
                    border: "2px solid #ffffff",
                  }}
                />
              </Box>

              {/* Route Labels */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1.2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 9,
                    color: "#626978",
                  }}
                >
                  PNT Naka
                </Typography>

                <Typography
                  sx={{
                    fontSize: 9,
                    color: "#007b70",
                    fontWeight: 700,
                  }}
                >
                  Napier Town (8:30)
                </Typography>

                <Typography
                  sx={{
                    fontSize: 9,
                    color: "#4b48dd",
                    fontWeight: 700,
                  }}
                >
                  Madan Mahal
                </Typography>
              </Box>
            </Box>

            {/* INFO */}
            <Box
              sx={{
                mt: 1.5,
                background: "#dcfaf6",
                borderRadius: "10px",
                p: 1.4,
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <VerifiedUserOutlinedIcon
                sx={{
                  color: "#007d72",
                  fontSize: 22,
                  mt: 0.1,
                }}
              />

              <Typography
                sx={{
                  fontSize: 10.5,
                  lineHeight: 1.55,
                  color: "#596169",
                }}
              >
                Only accept when you are comfortable with the pickup, route,
                and timing. Once confirmed, SafeRoute reserves your rear
                pillion seat and initiates encrypted trip coordination.
              </Typography>
            </Box>

            {/* BUTTONS */}
            <Box
              sx={{
                display: "flex",
                gap: 0,
                mt: 2.3,
              }}
            >
              <Button
                fullWidth
                sx={{
                  height: 43,
                  borderRadius: "10px 0 0 10px",
                  background: "#e0e3ff",
                  color: "#242b42",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    background: "#e0e3ff",
                  },
                }}
              >
                Review More
              </Button>

              <Button
                onClick={() => navigate('/matchrequest')}
                fullWidth
                startIcon={
                  <AccountCircleOutlinedIcon
                    sx={{
                      fontSize: 18,
                    }}
                  />
                }
                sx={{
                  height: 43,
                  borderRadius: "0 10px 10px 0",
                  background: "#007d72",
                  color: "#ffffff",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    background: "#007d72",
                  },
                }}
              >
                Confirm & Accept
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          minHeight: "64px",
          background: "#f1f1ff",
          borderTop: "1px solid #e8e8f4",
          px: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              color: "#3d4a4c",
              fontWeight: 600,
            }}
          >
            🛡 AIS-140 & MoRTH Compliant
          </Typography>

          <Typography
            sx={{
              color: "#b7b9c0",
              fontSize: 11,
            }}
          >
            •
          </Typography>

          <Typography
            sx={{
              fontSize: 10.5,
              color: "#3d4a4c",
              fontWeight: 600,
            }}
          >
            🛡 ISO 27001 Certified Security
          </Typography>

          <Typography
            sx={{
              color: "#b7b9c0",
              fontSize: 11,
            }}
          >
            •
          </Typography>

          <Typography
            sx={{
              fontSize: 10.5,
              color: "#e53535",
              fontWeight: 600,
            }}
          >
            🚨 24/7 Police SOS
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 10.5,
            color: "#555b63",
          }}
        >
          © 2025 SafeRoute Technologies Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default ConfirmRequest;