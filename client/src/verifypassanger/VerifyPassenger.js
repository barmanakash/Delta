import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

/* -------------------------------------------------------
   Small reusable icon component.
   Uses text symbols instead of @mui/icons-material
   so there is no dependency on the icons package.
------------------------------------------------------- */
const Icon = ({ children, size = 20, color = "#00796b" }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      color,
      fontSize: size * 0.8,
      lineHeight: 1,
      flexShrink: 0,
    }}
  >
    {children}
  </Box>
);

/* -------------------------------------------------------
   Map
------------------------------------------------------- */
const MapPanel = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 390, md: 425 },
        borderRadius: "18px",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #f4f5ff 0%, #eef0ff 52%, #f8f8ff 100%)",
        border: "1px solid #edf0fa",
      }}
    >
      {/* Road lines */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(82deg,
              transparent 0%,
              transparent 47%,
              rgba(176,184,190,.65) 47.3%,
              rgba(176,184,190,.65) 48%,
              transparent 48.3%,
              transparent 100%
            ),
            linear-gradient(171deg,
              transparent 0%,
              transparent 57%,
              rgba(188,196,201,.65) 57.2%,
              rgba(188,196,201,.65) 58%,
              transparent 58.3%,
              transparent 100%
            )
          `,
          opacity: 0.8,
        }}
      />

      {/* Main horizontal road */}
      <Box
        sx={{
          position: "absolute",
          left: "-5%",
          right: "-5%",
          top: "60%",
          height: 76,
          transform: "rotate(-7deg)",
          borderTop: "12px solid #cbd2d5",
          borderBottom: "12px solid #cbd2d5",
          background: "#ffffff",
          boxShadow: "0 0 0 1px rgba(170,180,185,.25)",
        }}
      />

      {/* Dashed green route */}
      <Box
        sx={{
          position: "absolute",
          left: "-4%",
          right: "-4%",
          top: "61.5%",
          height: 4,
          transform: "rotate(-7deg)",
          background:
            "repeating-linear-gradient(90deg, #008f80 0 12px, transparent 12px 19px)",
          zIndex: 2,
        }}
      />

      {/* Vertical road */}
      <Box
        sx={{
          position: "absolute",
          width: 48,
          height: "130%",
          left: "57%",
          top: "-15%",
          transform: "rotate(-5deg)",
          background: "#fff",
          borderLeft: "10px solid #d3d8db",
          borderRight: "10px solid #d3d8db",
          zIndex: 1,
        }}
      />

      {/* Vertical dashed road */}
      <Box
        sx={{
          position: "absolute",
          width: 3,
          height: "130%",
          left: "58.7%",
          top: "-15%",
          transform: "rotate(-5deg)",
          background:
            "repeating-linear-gradient(180deg, #b8c0c5 0 8px, transparent 8px 15px)",
          zIndex: 2,
        }}
      />

      {/* Large safe-zone circle */}
      <Box
        sx={{
          position: "absolute",
          left: "59%",
          top: "50%",
          width: 165,
          height: 165,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "2px dashed #008f80",
          background: "rgba(0,150,136,.07)",
          boxShadow: "0 0 50px rgba(0,150,136,.18)",
          zIndex: 3,
        }}
      />

      {/* Inner circle */}
      <Box
        sx={{
          position: "absolute",
          left: "59%",
          top: "50%",
          width: 90,
          height: 90,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "2px solid #00796b",
          background: "rgba(255,255,255,.2)",
          zIndex: 4,
        }}
      />

      {/* Two-wheeler marker */}
      <Box
        sx={{
          position: "absolute",
          left: "59%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#008577",
          border: "4px solid #fff",
          boxShadow: "0 5px 20px rgba(0,121,107,.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 7,
          color: "#fff",
          fontSize: 26,
        }}
      >
        🛵
      </Box>

      {/* Top-left arrival chip */}
      <Box
        sx={{
          position: "absolute",
          left: 20,
          top: 20,
          background: "#fff",
          borderRadius: "24px",
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          boxShadow: "0 5px 20px rgba(30,40,80,.08)",
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#008577",
          }}
        />
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: "#20283b",
          }}
        >
          You've Arrived • Geofence Verified Active
        </Typography>
      </Box>

      {/* Zoom controls */}
      <Box
        sx={{
          position: "absolute",
          right: 18,
          top: 18,
          display: "flex",
          background: "#fff",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 5px 20px rgba(30,40,80,.08)",
          zIndex: 10,
        }}
      >
        <Box sx={{ px: 2, py: 1.5, fontSize: 21 }}>+</Box>
        <Box sx={{ px: 2, py: 1.5, fontSize: 21 }}>−</Box>
        <Box sx={{ px: 1.8, py: 1.5, fontSize: 19 }}>◎</Box>
      </Box>

      {/* Vehicle label */}
      <Box
        sx={{
          position: "absolute",
          left: "59%",
          top: "32%",
          transform: "translateX(-50%)",
          background: "#1d2941",
          color: "#fff",
          px: 1.7,
          py: 0.8,
          borderRadius: "8px",
          zIndex: 10,
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        🛵 &nbsp; Your Two-Wheeler (Parked at Bay 1B) ●
      </Box>

      {/* Safe bay label */}
      <Box
        sx={{
          position: "absolute",
          left: "59%",
          top: "58%",
          transform: "translateX(-50%)",
          background: "#fff",
          borderRadius: "8px",
          px: 2,
          py: 1,
          boxShadow: "0 3px 15px rgba(30,40,80,.08)",
          zIndex: 10,
          minWidth: 190,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            color: "#00796b",
          }}
        >
          Napier Town Designated Safe Bay
        </Typography>

        <Typography
          sx={{
            fontSize: 10,
            color: "#657080",
            mt: 0.3,
          }}
        >
          City Hospital Gate 1 • CCTV Monitored
        </Typography>
      </Box>

      {/* Bottom-left safe zone */}
      <Box
        sx={{
          position: "absolute",
          left: 20,
          bottom: 18,
          background: "#fff",
          borderRadius: "8px",
          px: 1.5,
          py: 0.8,
          zIndex: 10,
          fontSize: 11,
          fontWeight: 700,
          color: "#344054",
        }}
      >
        ⚙ &nbsp; AIS-140 Safe Zone: 50m geofence intact
      </Box>

      {/* Coordinates */}
      <Typography
        sx={{
          position: "absolute",
          right: 20,
          bottom: 20,
          fontSize: 10,
          color: "#687386",
          zIndex: 10,
        }}
      >
        LAT: 23.1685° N • LON: 79.9339° E
      </Typography>
    </Box>
  );
};

/* -------------------------------------------------------
   Header
------------------------------------------------------- */
const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        height: 86,
        background: "#fff",
        borderBottom: "1px solid #e9ebf2",
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 4 },
        gap: { xs: 2, md: 4 },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          minWidth: { md: 300 },
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            background: "#008577",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 900,
            boxShadow: "0 4px 10px rgba(0,121,107,.15)",
          }}
        >
          ✓
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 800,
              lineHeight: 1,
              color: "#101828",
            }}
          >
            SafeRoute
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".04em",
              color: "#00796b",
            }}
          >
            RIDE MOBILITY
          </Typography>
        </Box>

        <Chip
          label="● At Pickup"
          size="small"
          sx={{
            ml: 1,
            height: 25,
            background: "#e7f8f5",
            color: "#00796b",
            fontSize: 11,
            fontWeight: 700,
          }}
        />
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          gap: { xs: 1, md: 2 },
        }}
      >
        {["Home", "My Route", "Requests", "Trips"].map((item) => (
          <Box
            key={item}
            sx={{
              px: { xs: 1.5, md: 2.5 },
              py: 1.4,
              borderRadius: "10px",
              background: item === "Trips" ? "#008577" : "transparent",
              color: item === "Trips" ? "#fff" : "#344054",
              fontWeight: item === "Trips" ? 800 : 600,
              fontSize: 14,
            }}
          >
            {item}
          </Box>
        ))}
      </Box>

      {/* Right side */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ minWidth: { md: 350 }, justifyContent: "flex-end" }}
      >
        <Chip
          label="🚨 POLICE SOS"
          sx={{
            background: "#ffe4e1",
            color: "#d92d20",
            fontWeight: 800,
            fontSize: 11,
          }}
        />

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#fff",
            border: "1px solid #e6e8ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🔔
        </Box>

        <Avatar
          sx={{
            width: 38,
            height: 38,
            background: "#d6e8e6",
            color: "#00796b",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          H
        </Avatar>

        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 800,
              color: "#172033",
            }}
          >
            Harshit Bhargava
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: "#00796b",
              fontWeight: 700,
            }}
          >
            ✓ Verified Daily Pooler
          </Typography>
        </Box>

        <Typography sx={{ fontSize: 16 }}>⌄</Typography>
      </Stack>
    </Box>
  );
};

/* -------------------------------------------------------
   Top status bar
------------------------------------------------------- */
const StatusBar = () => {
  return (
    <Box
      sx={{
        minHeight: 50,
        background: "#f9f9fd",
        borderBottom: "1px solid #e8eaf1",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 4 },
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography
          sx={{
            fontSize: 13,
            color: "#344054",
            fontWeight: 600,
          }}
        >
          ← Back to Trips
        </Typography>

        <Typography sx={{ color: "#b4bac5" }}>/</Typography>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 800,
            color: "#172033",
          }}
        >
          #TRIP-8421
        </Typography>

        <Chip
          label="● At Pickup • Napier Town Safe Hub"
          size="small"
          sx={{
            background: "#e5f8f4",
            color: "#00796b",
            fontWeight: 700,
            fontSize: 10,
          }}
        />
      </Stack>

      <Stack direction="row" spacing={1.2}>
        <Chip
          label="⌖ Geofence Locked: Rider in Bay (±2m)"
          sx={{
            background: "#fff",
            border: "1px solid #e5e8f1",
            color: "#344054",
            fontSize: 11,
            fontWeight: 700,
          }}
        />

        <Chip
          label="◷ Wait time: 01:44 / 05:00 max"
          sx={{
            background: "#fffaf0",
            color: "#695500",
            fontSize: 11,
            fontWeight: 700,
          }}
        />
      </Stack>
    </Box>
  );
};

/* -------------------------------------------------------
   Inspector bar
------------------------------------------------------- */
const InspectorBar = () => {
  return (
    <Box
      sx={{
        height: 45,
        px: { xs: 2, md: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fbfbfe",
        borderBottom: "1px solid #edf0f5",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          color: "#6b7280",
          fontWeight: 700,
          letterSpacing: ".05em",
        }}
      >
        ⚙ STATE INSPECTOR (INTERACTIVE DEMO):
      </Typography>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          background: "#e6e9fa",
          borderRadius: "15px",
          p: 0.4,
        }}
      >
        {[
          "Active / Entered",
          "Empty Box",
          "Incorrect Code",
          "Verified Match",
        ].map((item, index) => (
          <Box
            key={item}
            sx={{
              px: 1.5,
              py: 0.6,
              borderRadius: "12px",
              background: index === 0 ? "#fff" : "transparent",
              color: index === 0 ? "#344054" : "#667085",
              fontSize: 10,
              fontWeight: index === 0 ? 800 : 600,
              boxShadow:
                index === 0 ? "0 1px 4px rgba(20,30,80,.08)" : "none",
            }}
          >
            {item}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

/* -------------------------------------------------------
   Passenger card
------------------------------------------------------- */
const PassengerCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: "18px",
        border: "1px solid #edf0f5",
        background: "#fff",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 54,
              height: 54,
              background: "#dbe8e8",
              color: "#00796b",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            R
          </Avatar>

          <Box>
            <Stack direction="row" spacing={0.7} alignItems="center">
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#172033",
                }}
              >
                Rohit
              </Typography>

              <Chip
                label="✓ Verified"
                size="small"
                sx={{
                  height: 20,
                  background: "#e8f8f5",
                  color: "#00796b",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              />
            </Stack>

            <Typography
              sx={{
                fontSize: 12,
                color: "#344054",
                mt: 0.3,
              }}
            >
              ⭐ 4.9 • 38 shared rides
            </Typography>

            <Typography
              sx={{
                fontSize: 11,
                color: "#5548db",
                fontWeight: 700,
              }}
            >
              Same-Gender Match
              <br />
              Verified
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            background: "#e7eaff",
            borderRadius: "12px",
            px: 1.7,
            py: 1,
            textAlign: "center",
            minWidth: 82,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 900,
              color: "#29325c",
            }}
          >
            96% Route
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: "#667085",
            }}
          >
            Overlap
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          mt: 2,
          p: 1.7,
          borderRadius: "12px",
          background: "#f3f3ff",
        }}
      >
        <Stack spacing={1.3}>
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                color: "#667085",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              ● &nbsp;PICKUP POINT
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                color: "#20283b",
                ml: 1.5,
              }}
            >
              Napier Town (City Hospital Gate 1 Safe Bay)
            </Typography>

            <Typography
              sx={{
                fontSize: 11,
                color: "#00796b",
                fontWeight: 700,
                ml: 1.5,
                mt: 0.5,
              }}
            >
              │ &nbsp; Scheduled: 8:30 AM (On Time)
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 10,
                color: "#667085",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              ● &nbsp;DROP DESTINATION
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                color: "#20283b",
                ml: 1.5,
              }}
            >
              Madan Mahal Station Gate 2
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Typography
        sx={{
          mt: 1.5,
          fontSize: 12,
          fontWeight: 700,
          color: "#475467",
        }}
      >
        ◔ &nbsp;Pillion Gear: Carrying ISI Helmet • 1 Laptop Backpack
      </Typography>

      <Box
        sx={{
          mt: 1,
          px: 1.3,
          py: 0.8,
          borderRadius: "8px",
          background: "#e9eaff",
          color: "#697386",
          fontSize: 10,
          fontWeight: 600,
        }}
      >
        🔒 Strict Privacy Active: Phone number & direct contacts masked.
      </Box>
    </Paper>
  );
};

/* -------------------------------------------------------
   Safe Hub Protocols
------------------------------------------------------- */
const SafeHubProtocols = () => {
  const items = [
    {
      icon: "P",
      title: "Marked Bay Parking",
      text: "Park strictly inside two-wheeler demarcated line.",
    },
    {
      icon: "◉",
      title: "Profile Face Match",
      text: "Match Rohit's physical presence with his verified photo.",
    },
    {
      icon: "⌒",
      title: "Pillion Helmet Check",
      text: "Inspect ISI-standard strap fasten before seating.",
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: 2.2,
        borderRadius: "18px",
        border: "1px solid #edf0f5",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1.8}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "9px",
              background: "#edf0ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00796b",
              fontSize: 17,
            }}
          >
            ◉
          </Box>

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 800,
              color: "#20283b",
            }}
          >
            Safe Hub Protocols
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: 11,
            color: "#00796b",
            fontWeight: 900,
            letterSpacing: ".04em",
          }}
        >
          MANDATORY CHECK
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 1.3,
        }}
      >
        {items.map((item) => (
          <Box
            key={item.title}
            sx={{
              p: 1.5,
              borderRadius: "12px",
              background: "#f2f3ff",
              minHeight: 82,
            }}
          >
            <Stack direction="row" spacing={1}>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#00796b",
                }}
              >
                {item.icon}
              </Typography>

              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#344054",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: 11,
                    lineHeight: 1.4,
                    color: "#667085",
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        mt={2}
        gap={1}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: "#475467",
          }}
        >
          ⚠ Report Pickup Bay Obstruction
        </Typography>

        <Button
          variant="text"
          sx={{
            color: "#00796b",
            fontSize: 11,
            fontWeight: 800,
            textTransform: "none",
          }}
        >
          ⚙ Audio Chime to Passenger
        </Button>
      </Stack>
    </Paper>
  );
};

/* -------------------------------------------------------
   Verification code
------------------------------------------------------- */
const VerificationCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: { xs: 2, md: 2.5 },
        borderRadius: "18px",
        border: "1px solid #edf0f5",
        background: "#fff",
      }}
    >
      <Typography
        sx={{
          fontSize: 19,
          fontWeight: 800,
          color: "#20283b",
        }}
      >
        Enter passenger verification code
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 12,
          color: "#667085",
        }}
      >
        Ask Rohit for the 4-digit verification code displayed on his
        SafeRoute app.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1.2,
          mt: 2.2,
        }}
      >
        {["8", "4", "2", "1"].map((number) => (
          <Box
            key={number}
            sx={{
              height: 62,
              borderRadius: "12px",
              background: "#f1f2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "#00796b",
            }}
          >
            {number}
          </Box>
        ))}
      </Box>

      <Typography
        sx={{
          textAlign: "center",
          mt: 1.5,
          fontSize: 10,
          color: "#667085",
        }}
      >
        ◷ Code refreshes every 2 minutes for security.
      </Typography>

      <Box
        sx={{
          mt: 2,
          p: 1.3,
          borderRadius: "10px",
          background: "#f0f1ff",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Icon size={23}>✥</Icon>

        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#344054",
          }}
        >
          MoRTH AIS-140 Verification Protocol: Only start the trip after the
          passenger is physically present and the code is verified.
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 2.2,
          height: 52,
          borderRadius: "11px",
          background: "#00796b",
          textTransform: "none",
          fontSize: 14,
          fontWeight: 800,
          boxShadow: "0 5px 12px rgba(0,121,107,.15)",
          "&:hover": {
            background: "#00695c",
          },
        }}
      >
        🔒 &nbsp; Verify & Start Trip
      </Button>

      <Button
        fullWidth
        sx={{
          mt: 1,
          height: 44,
          borderRadius: "10px",
          background: "#f0f1ff",
          color: "#475467",
          textTransform: "none",
          fontSize: 12,
          fontWeight: 700,
          "&:hover": {
            background: "#e9eaff",
          },
        }}
      >
        ♧ &nbsp; Passenger hasn't arrived
      </Button>
    </Paper>
  );
};

/* -------------------------------------------------------
   Progress
------------------------------------------------------- */
const ProgressCard = () => {
  const steps = [
    { title: "Match", sub: "Confirmed", active: false, done: true },
    { title: "Pickup", sub: "Arrived 8:28", active: false, done: true },
    { title: "Verification", sub: "In Progress", active: true, done: false },
    { title: "Shared Trip", sub: "Upcoming", active: false, done: false },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: 2,
        borderRadius: "18px",
        border: "1px solid #edf0f5",
      }}
    >
      <Stack direction="row" alignItems="center">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <Box
              sx={{
                flex: 1,
                textAlign: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  mx: "auto",
                  background: step.done
                    ? "#00796b"
                    : step.active
                    ? "#45c9bb"
                    : "#edf0fa",
                  color: step.done || step.active ? "#fff" : "#98a2b3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 900,
                  boxShadow: step.active
                    ? "0 0 0 5px rgba(69,201,187,.16)"
                    : "none",
                }}
              >
                {step.done ? "✓" : step.active ? "♙" : "△"}
              </Box>

              <Typography
                sx={{
                  mt: 0.7,
                  fontSize: 10,
                  fontWeight: 800,
                  color: step.active ? "#00796b" : "#344054",
                }}
              >
                {step.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 9,
                  color: step.active ? "#00796b" : "#98a2b3",
                }}
              >
                {step.sub}
              </Typography>
            </Box>

            {index !== steps.length - 1 && (
              <Box
                sx={{
                  height: 2,
                  flex: 0.55,
                  background:
                    index < 2 ? "#00796b" : "#e5e7ef",
                  mt: -4,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Paper>
  );
};

/* -------------------------------------------------------
   Footer
------------------------------------------------------- */
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        background: "#f2f3ff",
        borderTop: "1px solid #e6e8f2",
        px: { xs: 2, md: 4 },
        py: 2.5,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        gap={2}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2.5 }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: "#344054",
              fontWeight: 700,
            }}
          >
            ⚙ AIS-140 & MoRTH Compliant
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#344054",
              fontWeight: 700,
            }}
          >
            🛡 ISO 27001 Certified Security
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#d92d20",
              fontWeight: 700,
            }}
          >
            ⛑ 24/7 Police SOS Standby
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2.5}>
          <Typography sx={{ fontSize: 11, color: "#475467" }}>
            Emergency Protocols
          </Typography>

          <Typography sx={{ fontSize: 11, color: "#475467" }}>
            Terms of Transit
          </Typography>

          <Typography sx={{ fontSize: 11, color: "#475467" }}>
            Safety Guidelines
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2, opacity: 0.5 }} />

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        gap={1}
      >
        <Typography
          sx={{
            fontSize: 10,
            color: "#667085",
          }}
        >
          © 2025 SafeRoute Technologies Inc. All rights reserved. Urban
          Transit Network.
        </Typography>

        <Typography
          sx={{
            fontSize: 10,
            color: "#667085",
          }}
        >
          Telemetry Hub: IN-DL-NCR-01 &nbsp;•&nbsp;
          <Box
            component="span"
            sx={{
              color: "#00796b",
              fontWeight: 800,
            }}
          >
            ● Operational
          </Box>
        </Typography>
      </Stack>
    </Box>
  );
};

/* -------------------------------------------------------
   MAIN PAGE
------------------------------------------------------- */
export default function VerifyPassenger() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(135deg, #fbfbff 0%, #f6f6fc 45%, #f3f3ff 100%)",
        color: "#172033",
        fontFamily:
          '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <Header />

      <StatusBar />

      <InspectorBar />

      <Box
        component="main"
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: 2.2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1.35fr .95fr",
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <Box>
            <MapPanel />

            <SafeHubProtocols />
          </Box>

          {/* RIGHT */}
          <Box>
            <Box sx={{ mb: 1.8 }}>
              <Typography
                sx={{
                  color: "#00796b",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: ".05em",
                }}
              >
                RIDER TERMINAL VERIFICATION
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: { xs: 28, md: 32 },
                  lineHeight: 1.1,
                  fontWeight: 900,
                  color: "#101828",
                }}
              >
                Verify your passenger
              </Typography>

              <Typography
                sx={{
                  mt: 0.7,
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: "#667085",
                  maxWidth: 500,
                }}
              >
                Ensure passenger identity and exchange verification code to
                initiate encrypted corridor telemetry.
              </Typography>
            </Box>

            <PassengerCard />

            <VerificationCard />

            <ProgressCard />
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}