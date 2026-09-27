import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Link as RouterLink } from "react-router-dom";


export default function Profile() {
  return (
    <Box
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f8f7ff",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#182238",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        style={{
          height: 71,
          background: "#ffffff",
          borderBottom: "1px solid #eeeeF5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 25px 0 32px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <Box
            style={{
              width: 29,
              height: 29,
              borderRadius: 7,
              background: "#079b90",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldOutlinedIcon
              style={{
                color: "#ffffff",
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

          <Typography
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#172033",
              marginLeft: 10,
            }}
          >
            SafeRoute
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <Typography
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#3f464b",
            }}
          >
            Profile
          </Typography>

          <Typography
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#3f464b",
            }}
          >
            Vehicle
          </Typography>

          <Typography
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#3f464b",
            }}
          >
            Safety
          </Typography>

          <Box
            style={{
              height: 25,
              padding: "0 13px",
              borderRadius: 15,
              background: "#f0f3ff",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                color: "#007d74",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              STEP 1 OF 3
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
                color: "#ffffff",
                fontSize: 20,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* MAIN BACKGROUND */}
      <Box
        style={{
          position: "relative",
          flex: 1,
          minHeight: 879,
          overflow: "hidden",
          background: "#f9f8ff",
        }}
      >
        {/* BACKGROUND WAVES */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1280 880"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <path
            d="M-20 185 C180 135 275 215 440 285 C600 350 730 300 860 310 C1030 323 1110 425 1300 460 L1300 600 L-20 600 Z"
            fill="#f1f1ff"
          />

          <path
            d="M-20 600 C170 540 300 535 470 585 C650 640 755 685 940 630 C1080 588 1190 600 1300 650 L1300 880 L-20 880 Z"
            fill="#f0f0ff"
          />

          <path
            d="M-20 650 C210 575 345 590 510 635 C680 680 770 715 960 675 C1090 648 1190 660 1300 700"
            fill="none"
            stroke="#e9e9fc"
            strokeWidth="1"
          />
        </svg>

        {/* STEPPER */}
        <Box
          style={{
            position: "relative",
            zIndex: 2,
            width: 680,
            margin: "23px auto 0",
          }}
        >
          {/* LINE */}
          <Box
            style={{
              position: "absolute",
              left: 33,
              right: 33,
              top: 37,
              height: 2,
              background: "#d9dfff",
            }}
          />

          <Box
            style={{
              position: "absolute",
              left: 0,
              width: 33,
              top: 37,
              height: 2,
              background: "#007c73",
            }}
          />

          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              position: "relative",
            }}
          >
            {/* STEP 1 */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                style={{
                  width: 37,
                  height: 37,
                  borderRadius: "50%",
                  background: "#007c73",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 0 6px #f9f8ff",
                }}
              >
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    background: "#ffffff",
                    borderRadius: "50%",
                  }}
                />
              </Box>

              <Typography
                style={{
                  marginTop: 7,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#00766e",
                }}
              >
                1. Profile
              </Typography>

              <Typography
                style={{
                  fontSize: 11.5,
                  color: "#3d4749",
                  marginTop: 1,
                }}
              >
                In Progress
              </Typography>
            </Box>

            {/* STEP 2 */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  width: 37,
                  height: 37,
                  borderRadius: "50%",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 0 6px #f9f8ff",
                }}
              >
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    background: "#bcc9c8",
                    borderRadius: "50%",
                  }}
                />
              </Box>

              <Typography
                style={{
                  marginTop: 7,
                  fontSize: 12,
                  color: "#303a3e",
                }}
              >
                2. Verification
              </Typography>

              <Typography
                style={{
                  fontSize: 11.5,
                  color: "#656d70",
                  marginTop: 1,
                }}
              >
                Government ID
              </Typography>
            </Box>

            {/* STEP 3 */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Box
                style={{
                  width: 37,
                  height: 37,
                  borderRadius: "50%",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 0 6px #f9f8ff",
                }}
              >
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    background: "#bcc9c8",
                    borderRadius: "50%",
                  }}
                />
              </Box>

              <Typography
                style={{
                  marginTop: 7,
                  fontSize: 12,
                  color: "#303a3e",
                }}
              >
                3. Preferences
              </Typography>

              <Typography
                style={{
                  fontSize: 11.5,
                  color: "#656d70",
                  marginTop: 1,
                }}
              >
                Commute Rules
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* MAIN CARD */}
        <Box
          style={{
            position: "relative",
            zIndex: 2,
            width: 897,
            height: 636,
            background: "#ffffff",
            borderRadius: 12,
            margin: "23px auto 0",
            boxShadow: "0 3px 7px rgba(32,38,65,0.10)",
            display: "flex",
            padding: 32,
            boxSizing: "border-box",
            gap: 32,
          }}
        >
          {/* LEFT PANEL */}
          <Box
            style={{
              width: 329,
              height: 572,
              background: "#f5f5ff",
              borderRadius: 7,
              padding: "20px 20px",
              boxSizing: "border-box",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* RIDER PERSONA */}
            <Box
              style={{
                display: "inline-flex",
                alignItems: "center",
                alignSelf: "flex-start",
                height: 24,
                padding: "0 9px",
                borderRadius: 12,
                background: "#78e9df",
              }}
            >
              <SecurityOutlinedIcon
                style={{
                  fontSize: 14,
                  color: "#006f68",
                  marginRight: 3,
                }}
              />

              <Typography
                style={{
                  fontSize: 10.5,
                  color: "#005f59",
                  fontWeight: 700,
                }}
              >
                Rider Persona
              </Typography>
            </Box>

            <Typography
              style={{
                fontSize: 21,
                fontWeight: 700,
                color: "#182238",
                marginTop: 8,
                lineHeight: 1.2,
              }}
            >
              Let's set up your profile
            </Typography>

            <Typography
              style={{
                fontSize: 13.5,
                lineHeight: 1.4,
                color: "#50595c",
                marginTop: 5,
                width: 270,
              }}
            >
              A few verified details ensure seamless safety
              and community trust on SafeRoute.
            </Typography>

            {/* PROFILE IMAGE */}
            <Box
              style={{
                width: 144,
                height: 144,
                borderRadius: "50%",
                background: "#f0f1ff",
                border: "2px solid #e6e7f6",
                margin: "27px auto 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <PersonOutlineOutlinedIcon
                style={{
                  color: "#007a71",
                  fontSize: 68,
                  strokeWidth: 1,
                }}
              />

              {/* CAMERA */}
              <Box
                style={{
                  position: "absolute",
                  right: -1,
                  bottom: 3,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#007b72",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid #f5f5ff",
                }}
              >
                <CameraAltOutlinedIcon
                  style={{
                    color: "#ffffff",
                    fontSize: 18,
                  }}
                />
              </Box>
            </Box>

            <Typography
              align="center"
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#182238",
                marginTop: 21,
              }}
            >
              Add profile photo
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#535c5e",
                  marginLeft: 4,
                }}
              >
                (Optional)
              </span>
            </Typography>

            <Typography
              align="center"
              style={{
                fontSize: 12,
                lineHeight: 1.5,
                color: "#555e61",
                width: 235,
                margin: "4px auto 0",
              }}
            >
              Use a clear, front-facing photo so co-riders
              can recognize you at pickup hubs.
            </Typography>

            <Button
              disableElevation
              startIcon={
                <UploadOutlinedIcon
                  style={{ fontSize: 14 }}
                />
              }
              style={{
                height: 25,
                minHeight: 25,
                width: 128,
                borderRadius: 15,
                background: "#e9ebff",
                color: "#007970",
                textTransform: "none",
                fontSize: 11,
                fontWeight: 700,
                margin: "17px auto 0",
              }}
            >
              Upload Photo
            </Button>

            {/* SECURITY BOX */}
            <Box
              style={{
                position: "absolute",
                left: 20,
                right: 20,
                bottom: 20,
                height: 49,
                borderRadius: 8,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                boxSizing: "border-box",
                boxShadow: "0 1px 2px rgba(30,40,70,0.04)",
              }}
            >
              <VerifiedOutlinedIcon
                style={{
                  color: "#00877d",
                  fontSize: 22,
                  marginRight: 8,
                }}
              />

              <Box>
                <Typography
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#263047",
                    lineHeight: 1.15,
                  }}
                >
                  Institutional Security
                </Typography>

                <Typography
                  style={{
                    fontSize: 10.5,
                    color: "#4b5558",
                    lineHeight: 1.15,
                    marginTop: 2,
                  }}
                >
                  Photos are strictly kept private for ride mat
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT FORM */}
          <Box
            style={{
              flex: 1,
              paddingTop: 1,
              boxSizing: "border-box",
            }}
          >
            <Typography
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#182238",
                lineHeight: 1.3,
              }}
            >
              Your basic information
            </Typography>

            <Typography
              style={{
                fontSize: 14,
                color: "#4b5558",
                marginTop: 2,
                marginBottom: 17,
              }}
            >
              Tell us a little about yourself to initialize your
              pooled journey log.
            </Typography>

            {/* FULL NAME */}
            <FormLabel
              label="Full Name"
              required
              hint="As on official ID"
            />

            <TextField
              fullWidth
              value="Harshit Bhargava"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon
                      style={{
                        fontSize: 20,
                        color: "#49545a",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={fieldStyle}
            />

            {/* EMAIL */}
            <Box style={{ marginTop: 14 }}>
              <FormLabel
                label="Email Address"
                required
                hint="For ride receipts"
              />

              <TextField
                fullWidth
                value="harshit@example.com"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon
                        style={{
                          fontSize: 20,
                          color: "#49545a",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={fieldStyle}
              />
            </Box>

            {/* MOBILE */}
            <Box style={{ marginTop: 14 }}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#182238",
                    }}
                  >
                    Mobile Number
                  </Typography>

                  <span
                    style={{
                      color: "#df3f3f",
                      fontSize: 13,
                      marginLeft: 3,
                    }}
                  >
                    *
                  </span>
                </Box>

                <Typography
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#007b72",
                  }}
                >
                  Primary Auth Handle
                </Typography>
              </Box>

              <TextField
                fullWidth
                value="+91 98765 43210"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneOutlinedIcon
                        style={{
                          fontSize: 20,
                          color: "#49545a",
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box
                        style={{
                          height: 23,
                          padding: "0 9px",
                          borderRadius: 13,
                          background: "#73e5db",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <CheckCircleOutlinedIcon
                          style={{
                            color: "#007970",
                            fontSize: 15,
                          }}
                        />

                        <Typography
                          style={{
                            color: "#00746d",
                            fontSize: 10.5,
                            fontWeight: 700,
                          }}
                        >
                          Verified
                        </Typography>
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={fieldStyle}
              />
            </Box>

            {/* DATE OF BIRTH */}
            <Box style={{ marginTop: 14 }}>
              <FormLabel
                label="Date of Birth"
                required
                hint="Must be 18+"
              />

              <TextField
                fullWidth
                placeholder="DD / MM / YYYY"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon
                        style={{
                          fontSize: 20,
                          color: "#49545a",
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarMonthOutlinedIcon
                        style={{
                          fontSize: 20,
                          color: "#49545a",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...fieldStyle,
                  "& input::placeholder": {
                    color: "#737d80",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* INFO */}
            <Box
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                marginTop: 22,
                marginBottom: 19,
              }}
            >
              <InfoOutlinedIcon
                style={{
                  color: "#007c73",
                  fontSize: 17,
                  marginTop: 1,
                }}
              />

              <Typography
                style={{
                  fontSize: 11.5,
                  lineHeight: 1.35,
                  color: "#4b5558",
                }}
              >
                Your profile information is used to authenticate
                identity and personalize your SafeRoute experience.
              </Typography>
            </Box>

            {/* CONTINUE */}
            <Button
              fullWidth
              disableElevation
              component={RouterLink}
              to ='/identity'
              endIcon={
                <ArrowForwardIcon
                  style={{ fontSize: 20 }}
                />
              }
              style={{
                height: 47,
                borderRadius: 11,
                background: "#00786f",
                color: "#ffffff",
                textTransform: "none",
                fontSize: 15.5,
                fontWeight: 700,
                boxShadow:
                  "0 4px 8px rgba(0,120,111,0.18)",
              }}
            >
              Continue to Verification
            </Button>

            {/* SKIP */}
            <Typography
              align="center"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#4c5558",
                marginTop: 15,
              }}
            >
              Skip for now
            </Typography>

            {/* ENCRYPTION */}
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 7,
                marginTop: 31,
              }}
            >
              <LockOutlinedIcon
                style={{
                  color: "#007d74",
                  fontSize: 16,
                }}
              />

              <Typography
                style={{
                  fontSize: 11,
                  color: "#394447",
                }}
              >
                SafeRoute protects member data with institutional-grade
                256-bit encryption.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        style={{
          height: 62,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
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
              color: "#007d74",
              fontSize: 16,
            }}
          />

          <Typography
            style={{
              fontSize: 11.5,
              color: "#3b4548",
            }}
          >
            AIS 140 &amp; MoRTH Two-Wheeler Ride-Pooling Safety
            Compliance
          </Typography>
        </Box>

        <Typography
          style={{
            fontSize: 11.5,
            color: "#3b4548",
          }}
        >
          © 2024 SafeRoute Technologies Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}


/* FORM LABEL */

function FormLabel({ label, required, hint }) {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
      }}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#182238",
          }}
        >
          {label}
        </Typography>

        {required && (
          <span
            style={{
              color: "#df3f3f",
              fontSize: 13,
              marginLeft: 3,
            }}
          >
            *
          </span>
        )}
      </Box>

      <Typography
        style={{
          fontSize: 11,
          color: "#4e595b",
        }}
      >
        {hint}
      </Typography>
    </Box>
  );
}


/* INPUT STYLE */

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    height: 45,
    borderRadius: "8px",
    background: "#f0f1fc",
    fontSize: "14px",
    color: "#202a3f",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #00857b",
  },

  "& .MuiInputBase-input": {
    padding: "10px 0",
  },

  "& .MuiInputAdornment-root": {
    marginRight: "8px",
  },
};