import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";


export default function RolAndMode() {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f9f9ff",
        color: "#182238",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        style={{
          height: 87,
          background: "#fff",
          borderBottom: "1px solid #eeeeF5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 23px 0 32px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#079b90",
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
              fontSize: 16,
              fontWeight: 700,
              color: "#172033",
            }}
          >
            SafeRoute
          </Typography>

          <Box
            style={{
              marginLeft: 13,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Typography
                style={{
                  fontSize: 17,
                  lineHeight: 1,
                  fontWeight: 700,
                  color: "#172033",
                }}
              >
                SafeRoute
              </Typography>

              <Box
                style={{
                  height: 18,
                  padding: "0 7px",
                  borderRadius: 10,
                  background: "#9cefe9",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#00776f",
                    letterSpacing: "0.2px",
                  }}
                >
                  INSTITUTIONAL
                </Typography>
              </Box>
            </Box>

            <Typography
              style={{
                fontSize: 10,
                color: "#5f676b",
                marginTop: 3,
              }}
            >
              Urban Mobility Co-Ride Grid
            </Typography>
          </Box>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 25,
          }}
        >
          <Typography
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#454d50",
            }}
          >
            Verification Protocol
          </Typography>

          <Typography
            style={{
              fontSize: 12,
              color: "#202938",
              background: "#e7e8f8",
              borderRadius: 4,
              padding: "3px 4px",
            }}
          >
            Role Selection
          </Typography>

          <Typography
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#454d50",
            }}
          >
            Safety Guidelines
          </Typography>

          <Typography
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#454d50",
            }}
          >
            Support Desk
          </Typography>

          <Box
            style={{
              height: 30,
              padding: "0 13px",
              borderRadius: 16,
              background: "#f0f1fa",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontSize: 11,
                color: "#424a4e",
                fontWeight: 600,
              }}
            >
              Step 3 of 3
            </Typography>
          </Box>

          <Box
            style={{
              height: 30,
              padding: "0 12px",
              borderRadius: 16,
              background: "#dff8f5",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <LockOutlinedIcon
              style={{
                fontSize: 14,
                color: "#007c73",
              }}
            />

            <Typography
              style={{
                fontSize: 11,
                color: "#00766e",
                fontWeight: 600,
              }}
            >
              256-bit Encrypted
            </Typography>
          </Box>

          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#007970",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountCircleOutlinedIcon
              style={{
                color: "#fff",
                fontSize: 21,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* MAIN */}
      <Box
        style={{
          position: "relative",
          flex: 1,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #f9f9ff 0%, #fbfaff 100%)",
          paddingBottom: 28,
        }}
      >
        {/* BACKGROUND LINES */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1280 850"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          <path
            d="M270 0 C450 125 580 150 760 235 C920 310 1070 260 1280 340"
            fill="none"
            stroke="#eeeeFA"
            strokeWidth="1"
          />

          <path
            d="M0 190 C190 185 300 220 450 275 C610 333 750 315 920 285 C1070 258 1160 290 1280 355"
            fill="none"
            stroke="#eeeeFA"
            strokeWidth="1"
            strokeDasharray="5 6"
          />

          <path
            d="M0 490 C180 455 315 475 500 520 C700 568 865 505 1040 485 C1140 473 1210 492 1280 515"
            fill="none"
            stroke="#e9ebf8"
            strokeWidth="1"
          />

          <path
            d="M0 570 C180 535 300 560 490 608 C700 660 870 605 1030 575 C1140 555 1200 585 1280 620"
            fill="none"
            stroke="#edf0fa"
            strokeWidth="1"
          />
        </svg>

        {/* STEPPER */}
        <Box
          style={{
            position: "relative",
            width: 560,
            height: 83,
            margin: "23px auto 0",
          }}
        >
          <Box
            style={{
              position: "absolute",
              left: 37,
              right: 37,
              top: 28,
              height: 4,
              borderRadius: 4,
              background: "#007c73",
            }}
          />

          <Box
            style={{
              position: "relative",
              height: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
            <Step
              number="1. Profile"
              active
              completed
            />

            <Step
              number="2. Verification"
              active
              completed
            />

            <Step
              number="3. Role & Mode"
              active
              current
            />
          </Box>
        </Box>

        {/* TITLE */}
        <Box
          style={{
            position: "relative",
            textAlign: "center",
            marginTop: 15,
          }}
        >
          <Box
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              height: 22,
              padding: "0 11px",
              borderRadius: 12,
              background: "#e7e9fc",
            }}
          >
            <SwapHorizIcon
              style={{
                color: "#007b73",
                fontSize: 15,
              }}
            />

            <Typography
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#454d54",
                letterSpacing: "0.2px",
              }}
            >
              FINAL ONBOARDING STEP
            </Typography>
          </Box>

          <Typography
            style={{
              fontSize: 31,
              lineHeight: 1.15,
              fontWeight: 700,
              color: "#141c31",
              marginTop: 15,
              letterSpacing: "-0.7px",
            }}
          >
            How will you use SafeRoute?
          </Typography>

          <Typography
            style={{
              fontSize: 16,
              color: "#4c5558",
              marginTop: 11,
            }}
          >
            Choose how you'd like to use SafeRoute. You can change your mode later.
          </Typography>
        </Box>

        {/* ROLE CARDS */}
        <Box
          style={{
            position: "relative",
            width: 960,
            margin: "32px auto 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 23,
          }}
        >
          {/* RIDER */}
          <RoleCard
            selected={selectedRole === "rider"}
            onClick={() => setSelectedRole("rider")}
            icon={
              <TwoWheelerIcon
                style={{
                  fontSize: 34,
                  color: "#007b73",
                }}
              />
            }
            iconBackground="#c5f6f1"
            badge="Offer Shared Rides"
            badgeBackground="#b3f0e9"
            badgeColor="#007970"
            title="Rider"
            description="I’m travelling somewhere and can offer a lift along my route."
            items={[
              "Create your route",
              "Find compatible lift requests",
              "Share your available seat",
            ]}
            footerIcon={
              <TwoWheelerIcon
                style={{
                  fontSize: 15,
                  color: "#007b73",
                }}
              />
            }
            footer="Two-Wheeler Co-Ride"
            action="Select Rider"
          />

          {/* LIFT TAKER */}
          <RoleCard
            selected={selectedRole === "lift"}
            onClick={() => setSelectedRole("lift")}
            icon={
              <PersonPinIcon
                style={{
                  fontSize: 33,
                  color: "#4f50d9",
                }}
              />
            }
            iconBackground="#dedfff"
            badge="Find a Commute Lift"
            badgeBackground="#dfdfff"
            badgeColor="#4847c8"
            title="Lift Taker"
            description="I’m looking for a lift from someone travelling my way."
            items={[
              "Find matching routes",
              "Send lift requests",
              "Track your shared trip",
            ]}
            footerIcon={
              <ShieldOutlinedIcon
                style={{
                  fontSize: 15,
                  color: "#5559e2",
                }}
              />
            }
            footer="AIS 140 Protected Route"
            action="Select Lift Taker"
          />
        </Box>

        {/* SWITCH MESSAGE */}
        <Box
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            marginTop: 23,
          }}
        >
          <SwapHorizIcon
            style={{
              color: "#007d74",
              fontSize: 20,
            }}
          />

          <Typography
            style={{
              fontSize: 12,
              color: "#50595c",
            }}
          >
            You can switch between Rider and Lift Taker modes whenever you need.
          </Typography>
        </Box>

        {/* INFO */}
        <Box
          style={{
            position: "relative",
            width: 674,
            height: 74,
            margin: "19px auto 0",
            borderRadius: 14,
            background: "#f0f1fc",
            display: "flex",
            alignItems: "center",
            padding: "0 17px",
            boxSizing: "border-box",
            gap: 16,
          }}
        >
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#aef1eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldOutlinedIcon
              style={{
                color: "#007970",
                fontSize: 21,
              }}
            />
          </Box>

          <Typography
            style={{
              fontSize: 11.5,
              color: "#303b43",
            }}
          >
            SafeRoute uses verified profiles and compatible matching to help
            create safer shared commutes.
          </Typography>
        </Box>

        {/* CONTINUE */}
        <Button
          disabled={!selectedRole}
           component={RouterLink}
           to ='/gender'
          style={{
            position: "relative",
            display: "flex",
            width: 448,
            height: 50,
            margin: "30px auto 0",
            borderRadius: 11,
            background: selectedRole ? "#007d74" : "#dfe4ff",
            color: selectedRole ? "#fff" : "#4e585b",
            textTransform: "none",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          <LockOutlinedIcon
            style={{
              fontSize: 18,
              marginRight: 7,
            }}
          />
          Continue to SafeRoute
        </Button>

        {/* BACK */}
        <Typography
          align="center"
          style={{
            position: "relative",
            marginTop: 17,
            fontSize: 12,
            fontWeight: 600,
            color: "#485154",
          }}
        >
          ← Back to Verification
        </Typography>
      </Box>

      {/* FOOTER */}
      <Box
        style={{
          height: 60,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 31px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <ShieldOutlinedIcon
            style={{
              color: "#007b73",
              fontSize: 16,
            }}
          />

          <Typography
            style={{
              fontSize: 11,
              color: "#3f494c",
            }}
          >
            AIS 140 &amp; MoRTH Two-Wheeler Ride-Pooling Safety Compliance Protocol
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <Box
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#007d74",
            }}
          />

          <Typography
            style={{
              fontSize: 11,
              color: "#3f494c",
            }}
          >
            © 2025 SafeRoute Technologies Inc. All commuter safety protocols active.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}


/* STEP */

function Step({ number, completed, current }) {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        style={{
          width: current ? 40 : 40,
          height: current ? 40 : 40,
          borderRadius: "50%",
          background: "#007d74",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: current
            ? "0 0 0 5px #c9f2ee"
            : "none",
          position: "relative",
          zIndex: 2,
        }}
      >
        {completed ? (
          <CheckCircleIcon
            style={{
              color: "#fff",
              fontSize: 21,
            }}
          />
        ) : (
          <Box
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#fff",
            }}
          />
        )}
      </Box>

      <Typography
        style={{
          marginTop: 8,
          fontSize: 11,
          fontWeight: 700,
          color: "#172033",
        }}
      >
        {number}
      </Typography>
    </Box>
  );
}


/* ROLE CARD */

function RoleCard({
  selected,
  onClick,
  icon,
  iconBackground,
  badge,
  badgeBackground,
  badgeColor,
  title,
  description,
  items,
  footerIcon,
  footer,
  action,
}) {
  return (
    <Box
      onClick={onClick}
      style={{
        height: 332,
        background: "#fff",
        borderRadius: 16,
        boxShadow: selected
          ? "0 7px 20px rgba(0,125,116,0.13)"
          : "0 5px 13px rgba(35,42,80,0.08)",
        border: selected
          ? "2px solid #008078"
          : "1px solid #f0f0f5",
        padding: "31px 32px 25px",
        boxSizing: "border-box",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* RADIO */}
      <Box
        style={{
          position: "absolute",
          right: 23,
          top: 23,
          width: 29,
          height: 29,
          borderRadius: "50%",
          background: selected ? "#d9f7f4" : "#e9ebfa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Radio
          checked={selected}
          disableRipple
          value="role"
          style={{
            padding: 0,
            color: selected ? "#007c73" : "transparent",
          }}
        />
      </Box>

      {/* ICON + TITLE */}
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Box
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            background: iconBackground,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Box
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 19,
              padding: "0 9px",
              borderRadius: 10,
              background: badgeBackground,
              marginBottom: 5,
            }}
          >
            <Typography
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: badgeColor,
              }}
            >
              {badge}
            </Typography>
          </Box>

          <Typography
            style={{
              fontSize: 21,
              lineHeight: 1,
              fontWeight: 700,
              color: "#172033",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* DESCRIPTION */}
      <Typography
        style={{
          fontSize: 13.5,
          color: "#4e575a",
          marginTop: 22,
        }}
      >
        {description}
      </Typography>

      {/* DIVIDER */}
      <Box
        style={{
          height: 1,
          background: "#e9eaf4",
          marginTop: 22,
          marginBottom: 17,
        }}
      />

      {/* FEATURES */}
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map((item) => (
          <Box
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
            }}
          >
            <CheckCircleIcon
              style={{
                color: "#007c73",
                fontSize: 17,
              }}
            />

            <Typography
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#202b3b",
              }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* FOOTER */}
      <Box
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          bottom: 27,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {footerIcon}

          <Typography
            style={{
              fontSize: 11.5,
              color: "#465053",
            }}
          >
            {footer}
          </Typography>
        </Box>

        <Typography
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: badgeColor,
          }}
        >
          {action} ›
        </Typography>
      </Box>
    </Box>
  );
}