import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

export default function App() {
  const [code, setCode] = useState(["4", "8", "2", "1", "7", "3"]);

  const updateCode = (index, value) => {
    const next = [...code];
    next[index] = value.replace(/\D/g, "").slice(-1);
    setCode(next);
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f3f4ff",
        color: "#172033",
        fontFamily: "Inter, Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        style={{
          height: 80,
          background: "rgba(255,255,255,0.96)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 55px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ShieldOutlinedIcon
            style={{
              color: "#007d74",
              fontSize: 22,
            }}
          />

          <Typography
            style={{
              color: "#007d74",
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: "-0.4px",
            }}
          >
            SafeRoute
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <ShieldOutlinedIcon
            style={{
              color: "#007d74",
              fontSize: 15,
            }}
          />

          <Typography
            style={{
              color: "#39434b",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Institutional Mobility Security
          </Typography>
        </Box>
      </Box>

      {/* BACKGROUND DECORATION */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1296 814"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <path
          d="M268 586 C390 586 410 492 438 410 C474 303 586 247 708 267 C830 287 910 225 1038 199"
          fill="none"
          stroke="#d9eefe"
          strokeWidth="1.5"
        />

        <path
          d="M270 585 C356 573 370 510 408 443"
          fill="none"
          stroke="#d8e4ff"
          strokeWidth="2"
          strokeDasharray="5 8"
        />

        <circle
          cx="238"
          cy="568"
          r="7"
          fill="#91c3c8"
        />

        <circle
          cx="238"
          cy="568"
          r="15"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
        />

        <circle
          cx="1057"
          cy="405"
          r="6"
          fill="#a8acf0"
        />

        <circle
          cx="1057"
          cy="405"
          r="14"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
        />
      </svg>

      {/* MAIN */}
      <Box
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: 56,
          boxSizing: "border-box",
        }}
      >
        {/* CARD */}
        <Box
          style={{
            width: 540,
            minHeight: 656,
            background: "#ffffff",
            borderRadius: 16,
            boxShadow:
              "0 13px 32px rgba(39,49,93,0.10)",
            padding: "34px 32px 32px",
            boxSizing: "border-box",
          }}
        >
          {/* CARD HEADER */}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 21,
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
                  width: 29,
                  height: 29,
                  borderRadius: 7,
                  background: "#079d91",
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
                  color: "#182238",
                }}
              >
                SafeRoute
              </Typography>
            </Box>

            <Button
              disableRipple
              startIcon={
                <HeadsetMicOutlinedIcon
                  style={{ fontSize: 15 }}
                />
              }
              style={{
                minWidth: 108,
                height: 29,
                borderRadius: 17,
                background: "#f0f2ff",
                color: "#3b4352",
                textTransform: "none",
                fontSize: 12,
                fontWeight: 600,
                padding: "0 10px",
              }}
            >
              Need help?
            </Button>
          </Box>

          {/* LOCK ICON */}
          <Box
            style={{
              width: 57,
              height: 57,
              borderRadius: 17,
              background: "#e2e7ff",
              margin: "0 auto 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockOutlinedIcon
              style={{
                color: "#007c73",
                fontSize: 27,
              }}
            />
          </Box>

          {/* TITLE */}
          <Typography
            align="center"
            style={{
              fontSize: 23,
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: "-0.45px",
              color: "#172033",
              marginBottom: 5,
            }}
          >
            Verify your account
          </Typography>

          {/* SUBTITLE */}
          <Typography
            align="center"
            style={{
              fontSize: 14,
              color: "#4d555b",
              marginBottom: 12,
            }}
          >
            We've sent a 6-digit authentication code to
          </Typography>

          {/* PHONE */}
          <Box
            style={{
              height: 31,
              width: 254,
              margin: "0 auto 23px",
              borderRadius: 17,
              background: "#edf0ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <PhoneIphoneOutlinedIcon
              style={{
                fontSize: 15,
                color: "#007f76",
              }}
            />

            <Typography
              style={{
                fontSize: 13,
                color: "#1e2b3e",
                fontWeight: 600,
              }}
            >
              +91 ••••• ••4821
            </Typography>

            <Typography
              style={{
                fontSize: 12,
                color: "#00867c",
                fontWeight: 700,
                marginLeft: 2,
              }}
            >
              Change
            </Typography>

            <EditOutlinedIcon
              style={{
                fontSize: 13,
                color: "#00867c",
                marginLeft: -3,
              }}
            />
          </Box>

          {/* OTP INPUTS */}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 17,
            }}
          >
            {code.map((digit, index) => (
              <TextField
                key={index}
                value={digit}
                onChange={(e) =>
                  updateCode(index, e.target.value)
                }
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  inputMode: "numeric",
                  style: {
                    textAlign: "center",
                    fontSize: 23,
                    fontWeight: 700,
                    padding: 0,
                    color:
                      index === 5
                        ? "#007d74"
                        : "#172033",
                  },
                }}
                style={{
                  width: 69,
                  height: 69,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 69,
                    borderRadius: "13px",
                    background:
                      index === 5
                        ? "#ffffff"
                        : "#f1f3ff",
                  },

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      index === 5
                        ? "#007d74"
                        : "transparent",

                    borderWidth:
                      index === 5
                        ? "2px"
                        : "1px",
                  },

                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#007d74",
                    },
                }}
              />
            ))}
          </Box>

          {/* TIMER ROW */}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 23,
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <TimerOutlinedIcon
                style={{
                  color: "#9b6500",
                  fontSize: 17,
                }}
              />

              <Typography
                style={{
                  fontSize: 12,
                  color: "#3d474b",
                  fontWeight: 600,
                }}
              >
                Code expires in <b>01:42</b>
              </Typography>
            </Box>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Typography
                style={{
                  fontSize: 12,
                  color: "#717a79",
                  fontWeight: 600,
                }}
              >
                Resend code in <b>42s</b>
              </Typography>

              <Typography
                style={{
                  fontSize: 12,
                  color: "#8dc7c3",
                  fontWeight: 700,
                }}
              >
                Resend
              </Typography>
            </Box>
          </Box>

          {/* VERIFY BUTTON */}
          <Button
            fullWidth
            disableElevation
            endIcon={
              <ArrowForwardIcon
                style={{ fontSize: 21 }}
              />
            }
            style={{
              height: 52,
              borderRadius: 11,
              background: "#00766e",
              color: "#fff",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 700,
              boxShadow:
                "0 7px 13px rgba(0,118,110,0.20)",
              marginBottom: 12,
            }}
          >
            Verify &amp; Continue
          </Button>

          {/* TERMS */}
          <Typography
            align="center"
            style={{
              fontSize: 11.5,
              lineHeight: 1.5,
              color: "#535b60",
              marginBottom: 25,
            }}
          >
            By continuing, you agree to SafeRoute's{" "}
            <span
              style={{
                textDecoration: "underline",
              }}
            >
              Terms of Service
            </span>{" "}
            and{" "}
            <span
              style={{
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </span>
            .
          </Typography>

          {/* SAFETY PROTOCOL */}
          <Box
            style={{
              minHeight: 120,
              background: "#f4f5fc",
              borderRadius: 11,
              display: "flex",
              alignItems: "flex-start",
              padding: "17px 16px",
              boxSizing: "border-box",
            }}
          >
            <Box
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginRight: 12,
              }}
            >
              <ShieldOutlinedIcon
                style={{
                  color: "#00857b",
                  fontSize: 18,
                }}
              />
            </Box>

            <Box>
              <Typography
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#253047",
                  marginBottom: 2,
                }}
              >
                Institutional Safety Protocol
              </Typography>

              <Typography
                style={{
                  width: 300,
                  fontSize: 11.5,
                  lineHeight: 1.18,
                  color: "#3f474d",
                }}
              >
                Your verification confirms passenger
                authenticity and safeguards the SafeRoute
                pooled transit network.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        style={{
          height: 43,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          flexShrink: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          style={{
            fontSize: 11.5,
            color: "#354044",
          }}
        >
          © 2025 SafeRoute Technologies Inc. All commuter
          safety protocols active.
        </Typography>

        <Box
          style={{
            display: "flex",
            gap: 22,
          }}
        >
          <Typography
            style={{
              fontSize: 11.5,
              color: "#354044",
            }}
          >
            Privacy Policy
          </Typography>

          <Typography
            style={{
              fontSize: 11.5,
              color: "#354044",
            }}
          >
            Terms of Service
          </Typography>

          <Typography
            style={{
              fontSize: 11.5,
              color: "#354044",
            }}
          >
            Safety Standards
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}