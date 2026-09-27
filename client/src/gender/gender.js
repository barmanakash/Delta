import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function Gender() {
  const [gender, setGender] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f8f8ff",
        color: "#172033",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        style={{
          height: 88,
          background: "#ffffff",
          borderBottom: "1px solid #eeeeF6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px 0 40px",
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
              alignItems: "center",
              gap: 9,
            }}
          >
            <Typography
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#172033",
              }}
            >
              SafeRoute
            </Typography>

            <Box
              style={{
                height: 20,
                padding: "0 9px",
                borderRadius: 11,
                background: "#e4e7f8",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  fontSize: 10,
                  color: "#41495b",
                  letterSpacing: "0.3px",
                  fontWeight: 600,
                }}
              >
                INSTITUTIONAL SAFETY
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          <Typography
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#007a72",
            }}
          >
            Overview
          </Typography>

          <Typography
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#4b5357",
            }}
          >
            Safety Charter
          </Typography>

          <Typography
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#4b5357",
            }}
          >
            Verification Hub
          </Typography>

          <Typography
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#4b5357",
            }}
          >
            Compliance &amp; Help
          </Typography>

          <Box
            style={{
              minWidth: 151,
              height: 42,
              borderRadius: 22,
              background: "#f3f4fb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "0 12px",
              boxSizing: "border-box",
            }}
          >
            <ShieldOutlinedIcon
              style={{
                color: "#007970",
                fontSize: 16,
              }}
            />

            <Box>
              <Typography
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.05,
                  color: "#333b43",
                }}
              >
                Safety First
              </Typography>

              <Typography
                style={{
                  fontSize: 10,
                  lineHeight: 1.05,
                  color: "#4d5559",
                }}
              >
                256-Bit Encrypted
              </Typography>
            </Box>
          </Box>

          <Box
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#f0f2fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HelpOutlinedIcon
              style={{
                color: "#33404a",
                fontSize: 19,
              }}
            />
          </Box>

          <Box
            style={{
              width: 34,
              height: 34,
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
                fontSize: 22,
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
            "linear-gradient(180deg, #fafaff 0%, #f6f6ff 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 31,
          boxSizing: "border-box",
        }}
      >
        {/* BACKGROUND DECORATION */}
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
            d="M198 35 C285 155 410 165 555 210 C720 260 855 220 1030 180 C1125 158 1190 160 1280 176"
            fill="none"
            stroke="#eeeeFA"
            strokeWidth="1"
          />

          <path
            d="M0 360 C160 330 255 355 390 415 C530 475 675 490 825 445 C970 400 1090 400 1280 450"
            fill="none"
            stroke="#cceef0"
            strokeWidth="1.5"
            strokeDasharray="6 7"
          />

          <path
            d="M0 525 C165 490 275 520 425 570 C570 618 735 610 875 570 C1040 525 1140 535 1280 575"
            fill="none"
            stroke="#ebecfa"
            strokeWidth="1"
          />

          <circle
            cx="1035"
            cy="185"
            r="130"
            fill="#dcf7f5"
            opacity="0.55"
          />

          <circle
            cx="115"
            cy="660"
            r="170"
            fill="#e8e9fc"
            opacity="0.35"
          />
        </svg>

        {/* TOP BADGE */}
        <Box
          style={{
            position: "relative",
            height: 24,
            padding: "0 13px",
            borderRadius: 13,
            background: "#dff1f2",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <ShieldOutlinedIcon
            style={{
              fontSize: 15,
              color: "#007970",
            }}
          />

          <Typography
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#007970",
              letterSpacing: "0.4px",
            }}
          >
            COMMUTE SAFETY PROTOCOL
          </Typography>

          <Typography
            style={{
              color: "#007970",
              fontSize: 12,
            }}
          >
            •
          </Typography>

          <Typography
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#007970",
              letterSpacing: "0.3px",
            }}
          >
            STEP 3 OF 4
          </Typography>
        </Box>

        {/* TITLE */}
        <Typography
          style={{
            position: "relative",
            fontSize: 31,
            lineHeight: 1.15,
            fontWeight: 700,
            color: "#141c31",
            marginTop: 13,
            letterSpacing: "-0.8px",
          }}
        >
          Set your safety preferences
        </Typography>

        <Typography
          style={{
            position: "relative",
            fontSize: 15,
            color: "#51595c",
            marginTop: 6,
          }}
        >
          These preferences help SafeRoute connect you with compatible people.
        </Typography>

        {/* MAIN CARD */}
        <Box
          style={{
            position: "relative",
            width: 680,
            minHeight: 628,
            marginTop: 24,
            background: "#ffffff",
            borderRadius: 14,
            boxShadow: "0 7px 18px rgba(35, 42, 80, 0.10)",
            padding: "33px 32px 31px",
            boxSizing: "border-box",
          }}
        >
          {/* GENDER HEADER */}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#182136",
                }}
              >
                Your gender{" "}
                <span style={{ color: "#e32626" }}>*</span>
              </Typography>

              <Typography
                style={{
                  fontSize: 12,
                  color: "#5b6266",
                  marginTop: 5,
                }}
              >
                Used exclusively for verified same-gender ride matching.
              </Typography>
            </Box>

            <Typography
              style={{
                fontSize: 11,
                color: "#485053",
                marginTop: 5,
              }}
            >
              Matching requirement
            </Typography>
          </Box>

          {/* GENDER OPTIONS */}
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 17,
            }}
          >
            <GenderCard
              selected={gender === "male"}
              onClick={() => setGender("male")}
              title="Male"
              icon={<PersonIcon style={{ fontSize: 21 }} />}
            />

            <GenderCard
              selected={gender === "female"}
              onClick={() => setGender("female")}
              title="Female"
              icon={<WcIcon style={{ fontSize: 21 }} />}
            />
          </Box>

          {/* MATCHING RULE */}
          <Box
            style={{
              marginTop: 24,
              minHeight: 184,
              borderRadius: 7,
              background: "#f0f1fc",
              padding: "22px 20px",
              boxSizing: "border-box",
              display: "flex",
              gap: 16,
            }}
          >
            <Box
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#008d83",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <VerifiedIcon
                style={{
                  color: "#fff",
                  fontSize: 22,
                }}
              />
            </Box>

            <Box
              style={{
                flex: 1,
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#182136",
                  }}
                >
                  Gender-compatible matching
                </Typography>

                <Box
                  style={{
                    height: 19,
                    padding: "0 8px",
                    borderRadius: 3,
                    background: "#dce3f8",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <LockOutlinedIcon
                    style={{
                      fontSize: 12,
                      color: "#43505b",
                    }}
                  />

                  <Typography
                    style={{
                      fontSize: 9,
                      color: "#46505a",
                      fontWeight: 600,
                      letterSpacing: "0.2px",
                    }}
                  >
                    ENFORCED SYSTEM RULE
                  </Typography>
                </Box>
              </Box>

              <Typography
                style={{
                  fontSize: 14,
                  lineHeight: 1.4,
                  color: "#293443",
                  marginTop: 4,
                  maxWidth: 500,
                }}
              >
                For safety, SafeRoute only connects male riders with male lift
                takers and female riders with female lift takers.
              </Typography>

              <Typography
                style={{
                  fontSize: 12,
                  lineHeight: 1.4,
                  color: "#555e62",
                  marginTop: 9,
                  maxWidth: 510,
                }}
              >
                This protocol ensures peace of mind for every daily commuter
                on the network. There are zero exceptions across shared
                two-wheeler trips.
              </Typography>

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginTop: 13,
                }}
              >
                <LockOutlinedIcon
                  style={{
                    fontSize: 16,
                    color: "#007970",
                  }}
                />

                <Typography
                  style={{
                    fontSize: 11,
                    color: "#007970",
                    fontWeight: 600,
                  }}
                >
                  Hardware-level routing lock active for all pooling dispatches
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* AGREEMENT */}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disableRipple
              style={{
                padding: 0,
                marginRight: 11,
                color: "#dfe4fa",
              }}
              sx={{
                "&.Mui-checked": {
                  color: "#007d74",
                },
              }}
            />

            <Typography
              style={{
                fontSize: 13,
                color: "#293443",
              }}
            >
              I understand and agree to SafeRoute's safety-based matching rule.
            </Typography>
          </Box>

          {/* BUTTONS */}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 28,
            }}
          >
            <Button
              style={{
                minWidth: 102,
                height: 52,
                borderRadius: 28,
                background: "#edf0ff",
                color: "#485258",
                textTransform: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <ArrowBackIcon
                style={{
                  fontSize: 18,
                  marginRight: 7,
                }}
              />
              Back
            </Button>

            <Button
              disabled={!gender || !agreed}
              style={{
                width: 238,
                height: 52,
                borderRadius: 28,
                background:
                  gender && agreed ? "#007d74" : "#e0e5ff",
                color:
                  gender && agreed ? "#fff" : "#6c7579",
                textTransform: "none",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Continue to SafeRoute
              <ArrowForwardIcon
                style={{
                  fontSize: 18,
                  marginLeft: 7,
                }}
              />
            </Button>
          </Box>
        </Box>

        {/* SECURITY MESSAGE */}
        <Box
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 19,
          }}
        >
          <ShieldOutlinedIcon
            style={{
              fontSize: 17,
              color: "#008279",
            }}
          />

          <Typography
            style={{
              fontSize: 11.5,
              color: "#4d5659",
            }}
          >
            SafeRoute adheres strictly to commuter verification and institutional
            safety guidelines.
          </Typography>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        style={{
          height: 58,
          background: "#f2f3fc",
          borderTop: "1px solid #e7e8f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
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
              color: "#414b4e",
            }}
          >
            AIS 140 &amp; MoRTH Ride-Pooling Safety Compliance Protocol
          </Typography>
        </Box>

        <Typography
          style={{
            fontSize: 11,
            color: "#414b4e",
          }}
        >
          © 2025 SafeRoute Technologies Inc. All commuter safety protocols active.
        </Typography>
      </Box>
    </Box>
  );
}

function GenderCard({
  selected,
  onClick,
  title,
  icon,
}) {
  return (
    <Box
      onClick={onClick}
      style={{
        height: 153,
        borderRadius: 8,
        background: "#f0f1fc",
        border: selected
          ? "2px solid #00847b"
          : "1px solid transparent",
        padding: "20px",
        boxSizing: "border-box",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* RADIO */}
      <Box
        style={{
          position: "absolute",
          right: 19,
          top: 19,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: selected ? "#d3f5f1" : "#e2e6fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <Box
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#007d74",
            }}
          />
        )}
      </Box>

      {/* ICON */}
      <Box
        style={{
          width: 43,
          height: 43,
          borderRadius: "50%",
          background: "#dce3ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#007b73",
        }}
      >
        {icon}
      </Box>

      <Typography
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#182136",
          marginTop: 30,
        }}
      >
        {title}
      </Typography>

      <Typography
        style={{
          fontSize: 12,
          color: "#555d61",
          marginTop: 1,
        }}
      >
        Verified commuter
      </Typography>
    </Box>
  );
}