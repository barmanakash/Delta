import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";

const teal = "#00796B";
const dark = "#172033";
const lightBg = "#F8F8FF";
const lavender = "#F0F1FF";
const purple = "#4F46E5";

const Icon = ({ children, size = 18, color = teal }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size,
      color,
      lineHeight: 1,
    }}
  >
    {children}
  </span>
);

const Card = ({ children, style = {} }) => (
  <Paper
    elevation={0}
    style={{
      background: "#fff",
      border: "1px solid #f0f0f5",
      borderRadius: 14,
      boxShadow: "0 2px 8px rgba(30,40,80,0.04)",
      ...style,
    }}
  >
    {children}
  </Paper>
);

const SmallBadge = ({ children, bg = "#E7F7F5", color = teal }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 10px",
      borderRadius: 14,
      background: bg,
      color,
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const CheckRow = ({ children }) => (
  <Box
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 10,
    }}
  >
    <span
      style={{
        width: 16,
        height: 16,
        minWidth: 16,
        borderRadius: "50%",
        background: "#E5F8F5",
        color: teal,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      ✓
    </span>

    <Typography
      style={{
        fontSize: 12,
        lineHeight: 1.35,
        color: "#20283A",
      }}
    >
      {children}
    </Typography>
  </Box>
);

function Header() {
  return (
    <Box
      style={{
        height: 70,
        background: "#fff",
        borderBottom: "1px solid #ededf5",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
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
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Box
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: "#079C8D",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            ♢
          </Box>

          <Typography
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: dark,
            }}
          >
            Safe<span style={{ color: teal }}>Route</span>
          </Typography>
        </Box>

        <Typography
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: dark,
            marginLeft: 2,
          }}
        >
          SafeRoute
        </Typography>

        <SmallBadge bg="#CFF8F2" color="#00796B">
          RIDER
        </SmallBadge>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 38,
            marginLeft: 25,
          }}
        >
          <Typography style={{ fontSize: 14, color: "#3F4652" }}>
            Home
          </Typography>

          <Typography style={{ fontSize: 14, color: "#3F4652" }}>
            My Route
          </Typography>

          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#343A48",
              fontSize: 14,
            }}
          >
            Requests
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#65D9D1",
                color: "#075D59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              3
            </span>
          </Box>

          <Typography style={{ fontSize: 14, color: "#3F4652" }}>
            Trips
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
        <Typography
          style={{
            fontSize: 20,
            color: "#333",
          }}
        >
          ♧
        </Typography>

        <Avatar
          style={{
            width: 34,
            height: 34,
            fontSize: 13,
            background: "#D9E7E7",
            color: "#145E5A",
          }}
        >
          H
        </Avatar>

        <Typography
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: dark,
          }}
        >
          Harshit Bhargava
        </Typography>

        <span style={{ color: teal, fontSize: 17 }}>♢</span>
        <span style={{ fontSize: 12 }}>⌄</span>
      </Box>
    </Box>
  );
}

function ProfileCard() {
  return (
    <Card
      style={{
        padding: 20,
        height: 235,
      }}
    >
      <Box
        style={{
          height: 5,
          background: "linear-gradient(90deg,#00796B 0%,#4F46E5 100%)",
          borderRadius: "8px 8px 0 0",
          margin: "-20px -20px 18px",
        }}
      />

      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box style={{ display: "flex", gap: 14 }}>
          <Box style={{ position: "relative" }}>
            <Avatar
              style={{
                width: 62,
                height: 62,
                border: "2px solid #D9ECEA",
                background: "#EDF4F3",
                color: "#167A72",
                fontWeight: 700,
              }}
            >
              R
            </Avatar>

            <Box
              style={{
                position: "absolute",
                right: -2,
                bottom: 0,
                width: 17,
                height: 17,
                borderRadius: "50%",
                background: teal,
                color: "#fff",
                fontSize: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </Box>
          </Box>

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
                  fontSize: 18,
                  fontWeight: 700,
                  color: dark,
                }}
              >
                Rohit
              </Typography>

              <SmallBadge bg="#E8EBFF" color="#4B5563">
                First Name Only
              </SmallBadge>
            </Box>

            <Typography
              style={{
                fontSize: 13,
                color: "#505866",
                marginTop: 2,
              }}
            >
              Daily IT Analyst • North-
              <br />
              South Corridor
            </Typography>

            <Box
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 6,
                fontSize: 12,
                color: "#666",
              }}
            >
              <span style={{ color: "#9A6500", fontWeight: 700 }}>
                ★ 4.9
              </span>
              <span>•</span>
              <span>38 shared rides</span>
              <span>•</span>
              <span>Member Oct '23</span>
            </Box>
          </Box>
        </Box>

        <SmallBadge bg="#EEF0FF" color="#4F46E5">
          ♂ Male
        </SmallBadge>
      </Box>

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: 25,
        }}
      >
        <Box
          style={{
            background: lavender,
            borderRadius: 8,
            padding: "9px 10px",
          }}
        >
          <Typography
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#343A4C",
            }}
          >
            ▣ &nbsp; Aadhaar Govt ID
          </Typography>

          <Typography
            style={{
              fontSize: 11,
              color: "#707788",
              marginTop: 3,
            }}
          >
            Verified & Escrow Locked
          </Typography>
        </Box>

        <Box
          style={{
            background: lavender,
            borderRadius: 8,
            padding: "9px 10px",
          }}
        >
          <Typography
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#343A4C",
            }}
          >
            ▣ &nbsp; Corporate ID
          </Typography>

          <Typography
            style={{
              fontSize: 11,
              color: "#707788",
              marginTop: 3,
            }}
          >
            Tech Mahindra Limited
          </Typography>
        </Box>
      </Box>

      <Box
        style={{
          marginTop: 15,
          padding: "7px 10px",
          borderRadius: 7,
          background: "#DFF9F4",
          color: "#087A70",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        🛡 AIS-140 Background Screened • Zero Safety Incidents
      </Box>
    </Card>
  );
}

function RequestedJourney() {
  return (
    <Card style={{ padding: 20 }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: dark,
          }}
        >
          ♧ &nbsp;Requested Journey
        </Typography>

        <SmallBadge bg="#E6F6F3" color={teal}>
          94% Route Overlap
        </SmallBadge>
      </Box>

      <Box
        style={{
          position: "relative",
          marginTop: 22,
          paddingLeft: 23,
        }}
      >
        <Box
          style={{
            position: "absolute",
            left: 8,
            top: 18,
            height: 125,
            borderLeft: "2px dashed #C4D3D2",
          }}
        />

        <Box style={{ position: "relative", marginBottom: 22 }}>
          <Box
            style={{
              position: "absolute",
              left: -22,
              top: 0,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: teal,
              border: "4px solid #E7F6F4",
            }}
          />

          <Typography
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: teal,
            }}
          >
            PICKUP REQUEST
          </Typography>

          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: dark,
              }}
            >
              Napier Town
            </Typography>

            <Typography
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: dark,
              }}
            >
              08:30 AM (±10m)
            </Typography>
          </Box>

          <Typography
            style={{
              fontSize: 12,
              color: "#6A7180",
            }}
          >
            Near City Hospital Gate 1
          </Typography>

          <Typography
            style={{
              fontSize: 11,
              color: teal,
              marginTop: 6,
            }}
          >
            ⚯ Only 0.2 km detour from your primary corridor
          </Typography>
        </Box>

        <Box style={{ position: "relative" }}>
          <Box
            style={{
              position: "absolute",
              left: -22,
              top: 0,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#4F46E5",
              border: "4px solid #E9E9FF",
            }}
          />

          <Typography
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#4F46E5",
            }}
          >
            DROP-OFF DESTINATION
          </Typography>

          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: dark,
              }}
            >
              Madan Mahal Station Gate 2
            </Typography>

            <Typography
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#333",
              }}
            >
              ~08:48 AM
            </Typography>
          </Box>

          <Typography
            style={{
              fontSize: 12,
              color: "#6A7180",
            }}
          >
            Direct corridor stop on your regular itinerary
          </Typography>

          <Typography
            style={{
              fontSize: 11,
              color: "#59606F",
              marginTop: 6,
            }}
          >
            ▱ 0.0 km detour (Exact match)
          </Typography>
        </Box>
      </Box>

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginTop: 25,
        }}
      >
        <Box
          style={{
            background: lavender,
            borderRadius: 8,
            padding: 10,
          }}
        >
          <Typography style={{ fontSize: 11, color: "#707788" }}>
            Shared Time
          </Typography>
          <Typography
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: dark,
            }}
          >
            18 mins
          </Typography>
          <Typography style={{ fontSize: 10, color: teal }}>
            +2m total vs solo
          </Typography>
        </Box>

        <Box
          style={{
            background: lavender,
            borderRadius: 8,
            padding: 10,
          }}
        >
          <Typography style={{ fontSize: 11, color: "#707788" }}>
            Fuel Split
          </Typography>
          <Typography
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: teal,
            }}
          >
            ₹45
            <span
              style={{
                fontSize: 10,
                color: "#707788",
                marginLeft: 3,
              }}
            >
              fixed
            </span>
          </Typography>
          <Typography style={{ fontSize: 10, color: "#707788" }}>
            UPI escrow credit
          </Typography>
        </Box>

        <Box
          style={{
            background: lavender,
            borderRadius: 8,
            padding: 10,
          }}
        >
          <Typography style={{ fontSize: 11, color: "#707788" }}>
            Pillion Gear
          </Typography>
          <Typography
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: dark,
            }}
          >
            ◯ Own ISI Helmet
          </Typography>
          <Typography style={{ fontSize: 10, color: "#707788" }}>
            1 Laptop backpack
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

function SafetyCard() {
  return (
    <Card style={{ padding: 20 }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: dark,
          }}
        >
          🛡 Safety Match Confirmed
        </Typography>

        <span style={{ color: "#666" }}>♙</span>
      </Box>

      <Box style={{ marginTop: 20 }}>
        <CheckRow>
          <b>Gender-Matched Corridor:</b> Male-to-Male rider & commuter
          preference enforced.
        </CheckRow>

        <CheckRow>
          <b>Corridor Perimeter:</b> Within approved 500-meter geo-fenced
          safety zone.
        </CheckRow>

        <CheckRow>
          <b>Emergency Hub:</b> Live SOS, collision sensor & MoRTH telemetry
          standby enabled.
        </CheckRow>
      </Box>

      <Box
        style={{
          marginTop: 17,
          background: "#E8EAFF",
          borderRadius: 6,
          padding: "7px 10px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#50586A",
        }}
      >
        <span>Encrypted Corridor Protocol: AIS-140 v2</span>
        <b style={{ color: "#4F46E5" }}>ACTIVE</b>
      </Box>
    </Card>
  );
}

function CorridorMap() {
  return (
    <Card style={{ padding: 14 }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "3px 4px 12px",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 23,
              color: teal,
            }}
          >
            🗺
          </span>

          <Typography
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: dark,
            }}
          >
            Corridor Verification View
          </Typography>

          <SmallBadge bg="#E7EAFF" color="#454C66">
            Jabalpur Metro Corridor
          </SmallBadge>
        </Box>

        <Box style={{ display: "flex", gap: 7 }}>
          <Button
            style={{
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#F1F2FF",
              color: dark,
              fontSize: 17,
              padding: 0,
            }}
          >
            ⚙
          </Button>

          <Button
            style={{
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#F1F2FF",
              color: dark,
              fontSize: 21,
              padding: 0,
            }}
          >
            +
          </Button>

          <Button
            style={{
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#F1F2FF",
              color: dark,
              fontSize: 21,
              padding: 0,
            }}
          >
            −
          </Button>
        </Box>
      </Box>

      <Box
        style={{
          height: 445,
          borderRadius: 12,
          background:
            "linear-gradient(180deg,#EFF0FF 0%,#EEF0FF 48%,#E8ECFF 100%)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #E5E6F5",
        }}
      >
        {/* Map grid */}
        <Box
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.55,
            backgroundImage: `
              linear-gradient(#CBD0E4 1px, transparent 1px),
              linear-gradient(90deg, #CBD0E4 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        {/* Water/road background */}
        <Box
          style={{
            position: "absolute",
            left: -50,
            right: -50,
            bottom: 40,
            height: 70,
            borderRadius: "50%",
            borderTop: "10px solid rgba(150,165,235,.16)",
            transform: "rotate(3deg)",
          }}
        />

        <Box
          style={{
            position: "absolute",
            left: 40,
            top: 35,
            width: 155,
            padding: "9px 12px",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 7px rgba(20,30,70,.12)",
            fontSize: 12,
            fontWeight: 700,
            color: dark,
          }}
        >
          <span style={{ color: "#111827" }}>●</span>&nbsp; PNT Naka (Start)
          <div
            style={{
              color: "#7A8190",
              fontWeight: 400,
              marginTop: 3,
            }}
          >
            Your departure origin
          </div>
        </Box>

        <Box
          style={{
            position: "absolute",
            right: 15,
            top: 15,
            background: "#fff",
            padding: "9px 13px",
            borderRadius: 18,
            fontSize: 12,
            fontWeight: 700,
            boxShadow: "0 2px 6px rgba(20,30,70,.08)",
          }}
        >
          ↔ &nbsp;7.8 km Compatible Segment
        </Box>

        {/* Main route */}
        <svg
          viewBox="0 0 700 450"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <path
            d="M75 105 C210 125, 280 160, 330 220 C405 275, 485 310, 625 365"
            fill="none"
            stroke="rgba(87,207,192,.23)"
            strokeWidth="42"
            strokeLinecap="round"
          />

          <path
            d="M75 105 C210 125, 280 160, 330 220 C405 275, 485 310, 625 365"
            fill="none"
            stroke="#118D82"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M330 220 C405 275, 485 310, 625 365"
            fill="none"
            stroke="#3F52CC"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M75 105 C210 125, 280 160, 350 205 C440 265, 520 300, 625 365"
            fill="none"
            stroke="#9299A5"
            strokeWidth="4"
            strokeDasharray="8 7"
            strokeLinecap="round"
          />

          <circle
            cx="75"
            cy="105"
            r="9"
            fill="#fff"
            stroke="#172033"
            strokeWidth="4"
          />

          <circle
            cx="330"
            cy="220"
            r="13"
            fill="#00796B"
            stroke="#fff"
            strokeWidth="5"
          />

          <circle
            cx="625"
            cy="365"
            r="12"
            fill="#fff"
            stroke="#4F46E5"
            strokeWidth="5"
          />

          <circle
            cx="330"
            cy="220"
            r="45"
            fill="none"
            stroke="#00796B"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        </svg>

        {/* Pickup label */}
        <Box
          style={{
            position: "absolute",
            left: "42%",
            top: "31%",
            width: 245,
            background: "#fff",
            border: "2px solid #73BEB8",
            borderRadius: 13,
            padding: "10px 14px",
            boxShadow: "0 3px 9px rgba(30,50,80,.1)",
          }}
        >
          <Typography
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: teal,
            }}
          >
            ● Pickup: Napier Town&nbsp;&nbsp; 8:30 AM
          </Typography>

          <Typography
            style={{
              fontSize: 11,
              color: "#65707D",
              marginTop: 3,
            }}
          >
            Gate 1 • 0.2 km minor corridor detour
          </Typography>
        </Box>

        {/* Drop off label */}
        <Box
          style={{
            position: "absolute",
            right: 38,
            bottom: 62,
            width: 220,
            background: "#fff",
            border: "2px solid #8B8BEB",
            borderRadius: 13,
            padding: "10px 14px",
            boxShadow: "0 3px 9px rgba(30,50,80,.1)",
          }}
        >
          <Typography
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#4F46E5",
            }}
          >
            ⚑ Drop-off: Madan Mahal Gate 2
          </Typography>

          <Typography
            style={{
              fontSize: 11,
              color: "#65707D",
              marginTop: 3,
            }}
          >
            Exact corridor align • 0 km detour
          </Typography>
        </Box>

        <Box
          style={{
            position: "absolute",
            left: 15,
            bottom: 15,
            background: "#fff",
            padding: "6px 10px",
            borderRadius: 12,
            fontSize: 10,
            color: "#6A7180",
          }}
        >
          <span style={{ color: "#63D4C6" }}>━</span> 200m AIS-140 Safe Zone
          Buffer
        </Box>
      </Box>

      <Box
        style={{
          marginTop: 10,
          padding: "9px 12px",
          background: "#F8F5EC",
          borderRadius: 7,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
        }}
      >
        <span>
          ⚙ &nbsp;<b>Minor Detour: 200 meters</b> (approx 1 min 20 secs)
        </span>

        <span style={{ color: teal, fontWeight: 700 }}>
          Corridor Deviation Score: 98/100 (Optimal)
        </span>
      </Box>
    </Card>
  );
}

function StatCards() {
  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
      }}
    >
      <Card
        style={{
          padding: 18,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Box
          style={{
            width: 48,
            height: 48,
            borderRadius: 13,
            background: "#D4F8F3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: teal,
            fontSize: 22,
          }}
        >
          ◉
        </Box>

        <Box>
          <Typography style={{ fontSize: 11, color: "#717886" }}>
            Environmental Impact
          </Typography>

          <Typography
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: teal,
            }}
          >
            1.4 kg CO₂
          </Typography>

          <Typography style={{ fontSize: 11, color: "#666" }}>
            Prevented through this shared ride
          </Typography>
        </Box>
      </Card>

      <Card
        style={{
          padding: 18,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Box
          style={{
            width: 48,
            height: 48,
            borderRadius: 13,
            background: "#E5E7FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: purple,
            fontSize: 21,
          }}
        >
          ♧
        </Box>

        <Box>
          <Typography style={{ fontSize: 11, color: "#717886" }}>
            Capacity Utilization
          </Typography>

          <Typography
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: purple,
            }}
          >
            1 of 1 Pillion
          </Typography>

          <Typography style={{ fontSize: 11, color: "#666" }}>
            Solo ETA 22m → Shared ETA 24m (+2m)
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

function PrivacyCard() {
  return (
    <Card
      style={{
        padding: 18,
        display: "flex",
        gap: 12,
      }}
    >
      <Box
        style={{
          color: teal,
          fontSize: 23,
        }}
      >
        🛡
      </Box>

      <Box>
        <Typography
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: dark,
          }}
        >
          SafeRoute Two-Way Privacy Guarantee
        </Typography>

        <Typography
          style={{
            fontSize: 12,
            color: "#68707B",
            lineHeight: 1.45,
            marginTop: 4,
            maxWidth: 560,
          }}
        >
          Exact live GPS coordinates and direct caller proxy are masked until
          you review and confirm this request. Your registered two-wheeler
          plate number is revealed to Rohit only within 10 minutes of scheduled
          pickup.
        </Typography>
      </Box>
    </Card>
  );
}

function OfferCard() {
  return (
    <Card
      style={{
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
      }}
    >
      <Box style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <Box
          style={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            background: "#D7F8F4",
            color: teal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          ⚖
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
                color: dark,
              }}
            >
              Review & Accept Offer
            </Typography>

            <SmallBadge bg="#E3F7F3" color={teal}>
              No Penalty for Declining
            </SmallBadge>
          </Box>

          <Typography
            style={{
              fontSize: 11,
              color: "#656D79",
              marginTop: 4,
            }}
          >
            Accepting reserves your rear pillion seat and instantly routes ₹45
            fuel split to your in-app balance upon drop-off.
          </Typography>
        </Box>
      </Box>

      <Box style={{ display: "flex", gap: 15 }}>
        <Button
          style={{
            background: "#E6E8FF",
            color: dark,
            borderRadius: 8,
            padding: "11px 23px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          × &nbsp; Decline
        </Button>

        <Button
          style={{
            background: "#00796B",
            color: "#fff",
            borderRadius: 8,
            padding: "11px 23px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          ✓ &nbsp; Accept Lift Request (₹45)
        </Button>
      </Box>
    </Card>
  );
}

function Footer() {
  return (
    <Box
      style={{
        height: 55,
        background: "#fff",
        borderTop: "1px solid #eeeeF5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px",
        fontSize: 11,
        color: "#505866",
      }}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        <span style={{ color: teal }}>
          🛡 AIS 140 & MoRTH ride-pooling compliant
        </span>

        <span style={{ color: "#B8BBC2" }}>•</span>

        <span style={{ color: teal }}>
          🛡 ISO 27001 Certified Security
        </span>

        <span style={{ color: "#B8BBC2" }}>•</span>

        <span style={{ color: "#E52C32" }}>
          ⛨ 24/7 Police SOS
        </span>
      </Box>

      <Typography style={{ fontSize: 11, color: "#505866" }}>
        © 2025 SafeRoute Technologies Inc. All rights reserved.
      </Typography>
    </Box>
  );
}

export default function Home() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#F8F8FF",
        color: dark,
        fontFamily:
          "Inter, Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Header />

      {/* Second navigation/status bar */}
      <Box
        style={{
          height: 48,
          background: "#fff",
          borderBottom: "1px solid #ECECF3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            color: "#273043",
          }}
        >
          <span style={{ color: "#333" }}>←</span>
          <span>Lift Requests</span>
          <span style={{ color: "#A7ABB4" }}>/</span>

          <b style={{ fontSize: 17 }}>Request #RQ-8421</b>

          <SmallBadge bg="#E7EAFF" color="#53607B">
            Pending Verification
          </SmallBadge>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <SmallBadge bg="#EEF8F5" color="#475A58">
            <span style={{ color: teal }}>●</span>&nbsp; AIS-140 GPS Telemetry
            Sync: <b>Active</b>
          </SmallBadge>

          <SmallBadge bg="#FFF6E8" color="#87631D">
            ⏱ &nbsp;Expires in 11:39
          </SmallBadge>
        </Box>
      </Box>

      <Box
        style={{
          padding: "22px 24px 25px",
        }}
      >
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "40.5% 59.5%",
            gap: 22,
            maxWidth: 1240,
            margin: "0 auto",
          }}
        >
          {/* LEFT */}
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <ProfileCard />

            <RequestedJourney />

            <SafetyCard />
          </Box>

          {/* RIGHT */}
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <CorridorMap />

            <StatCards />

            <PrivacyCard />
          </Box>
        </Box>

        <Box
          style={{
            maxWidth: 1240,
            margin: "24px auto 0",
          }}
        >
          <OfferCard />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}