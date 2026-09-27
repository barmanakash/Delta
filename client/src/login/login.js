import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";

import {
  ShieldOutlined,
  Shield,
  PersonOutlined,
  PhoneOutlined,
  MailOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  CheckCircle,
  InfoOutlined,
  ArrowForward,
  HubOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputStyle = {
    height: "44px",
    backgroundColor: "#f1f1fb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#263238",
    padding: "0 14px",
    boxSizing: "border-box",
  };

  const inputContainerStyle = {
    display: "flex",
    alignItems: "center",
    height: "44px",
    backgroundColor: "#f1f1fb",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#182033",
    marginBottom: "7px",
    display: "block",
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7ff",
        fontFamily: "Inter, Roboto, Arial, sans-serif",
        color: "#182033",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        style={{
          height: "70px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e9e9f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 55px",
          boxSizing: "border-box",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ShieldOutlined
            style={{
              color: "#007c70",
              fontSize: "23px",
            }}
          />

          <Typography
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#007c70",
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
            gap: "7px",
            color: "#374047",
          }}
        >
          <ShieldOutlined
            style={{
              fontSize: "15px",
              color: "#007c70",
            }}
          />

          <Typography
            style={{
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Institutional Mobility Security
          </Typography>
        </Box>
      </Box>

      {/* Main */}
      <Box
        style={{
          flex: 1,
          padding: "56px 40px 48px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          style={{
            width: "100%",
            maxWidth: "1216px",
            minHeight: "764px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "42% 58%",
            boxShadow: "0 18px 35px rgba(35, 42, 70, 0.16)",
          }}
        >
          {/* Left Section */}
          <Box
            style={{
              background:
                "linear-gradient(135deg, #d8f7f4 0%, #e7eaff 38%, #dcdfff 100%)",
              padding: "50px 48px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Left Logo */}
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "30px",
              }}
            >
              <Box
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "#079b91",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield
                  style={{
                    color: "#ffffff",
                    fontSize: "23px",
                  }}
                />
              </Box>

              <Typography
                style={{
                  fontSize: "19px",
                  fontWeight: 700,
                  color: "#172031",
                }}
              >
                SafeRoute
              </Typography>
            </Box>

            {/* Badge */}
            <Box
              style={{
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
                backgroundColor: "rgba(255,255,255,0.88)",
                borderRadius: "20px",
                padding: "5px 12px",
                marginBottom: "12px",
              }}
            >
              <VerifiedOutlined
                style={{
                  fontSize: "14px",
                  color: "#00877d",
                  marginRight: "6px",
                }}
              />

              <Typography
                style={{
                  fontSize: "11px",
                  color: "#006f68",
                  fontWeight: 500,
                }}
              >
                Institutional Daily Transit
              </Typography>
            </Box>

            {/* Heading */}
            <Typography
              style={{
                fontSize: "31px",
                lineHeight: 1.18,
                fontWeight: 750,
                letterSpacing: "-1.1px",
                color: "#182033",
                maxWidth: "390px",
                marginBottom: "12px",
              }}
            >
              Start your journey with SafeRoute.
            </Typography>

            <Typography
              style={{
                fontSize: "14px",
                lineHeight: 1.5,
                color: "#4f5961",
                maxWidth: "390px",
                marginBottom: "25px",
              }}
            >
              Create your account and connect with verified people travelling
              along your route.
            </Typography>

            {/* Route Card */}
            <Box
              style={{
                backgroundColor: "rgba(255,255,255,0.75)",
                borderRadius: "12px",
                padding: "17px 16px 12px",
                marginBottom: "27px",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <Typography
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "#454b52",
                    letterSpacing: "0.4px",
                  }}
                >
                  SIMULATED CORRIDOR PATH
                </Typography>

                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Box
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#008b80",
                    }}
                  />

                  <Typography
                    style={{
                      fontSize: "10px",
                      color: "#00766e",
                      fontWeight: 600,
                    }}
                  >
                    Active Mesh
                  </Typography>
                </Box>
              </Box>

              <Box
                style={{
                  width: "100%",
                  height: "105px",
                  position: "relative",
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 390 105"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M12 82 C90 77, 102 28, 185 35 C250 41, 275 78, 378 73"
                    fill="none"
                    stroke="#cbd1f2"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 82 C90 77, 102 28, 185 35 C250 41, 275 78, 378 73"
                    fill="none"
                    stroke="#007c70"
                    strokeWidth="3"
                    strokeDasharray="7 4"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="20"
                    cy="81"
                    r="6"
                    fill="#007c70"
                  />

                  <circle
                    cx="378"
                    cy="73"
                    r="6"
                    fill="#4d4bd6"
                  />

                  <circle
                    cx="185"
                    cy="35"
                    r="13"
                    fill="#ffffff"
                    stroke="#e3e5f5"
                    strokeWidth="2"
                  />

                  <circle
                    cx="185"
                    cy="35"
                    r="7"
                    fill="#d5f4ef"
                  />

                  <path
                    d="M181 35 L184 38 L189 32"
                    fill="none"
                    stroke="#008c80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="280"
                    cy="61"
                    r="13"
                    fill="#ffffff"
                    stroke="#e3e5f5"
                    strokeWidth="2"
                  />

                  <circle
                    cx="280"
                    cy="61"
                    r="7"
                    fill="#5a56dd"
                  />

                  <circle
                    cx="280"
                    cy="61"
                    r="3"
                    fill="#ffffff"
                  />
                </svg>

                <Typography
                  style={{
                    position: "absolute",
                    left: "4px",
                    bottom: "0px",
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "#41484d",
                  }}
                >
                  Origin A
                </Typography>

                <Typography
                  style={{
                    position: "absolute",
                    right: "5px",
                    bottom: "0px",
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "#41484d",
                  }}
                >
                  Drop B
                </Typography>
              </Box>
            </Box>

            {/* Features */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "17px",
              }}
            >
              <Feature
                title="Verified community"
                description="Govt ID & corporate email checks on all profiles"
              />

              <Feature
                title="Route-based matching"
                description="Minimal data synced tightly along your daily path"
              />

              <Feature
                title="Safety-focused experience"
                description="Live corridor monitoring & emergency SOS architecture"
              />
            </Box>

            {/* Bottom Statistic */}
            <Box
              style={{
                marginTop: "auto",
                backgroundColor: "rgba(255,255,255,0.78)",
                borderRadius: "11px",
                padding: "12px 15px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <HubOutlined
                style={{
                  fontSize: "21px",
                  color: "#008d82",
                }}
              />

              <Typography
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#27313b",
                }}
              >
                25,000+ daily shared corridors across tech hubs
              </Typography>
            </Box>
          </Box>

          {/* Right Section */}
          <Box
            style={{
              padding: "49px 66px 35px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              style={{
                fontSize: "32px",
                fontWeight: 750,
                lineHeight: 1.2,
                letterSpacing: "-1px",
                color: "#182033",
                marginBottom: "5px",
              }}
            >
              Create your account
            </Typography>

            <Typography
              style={{
                fontSize: "14px",
                color: "#596166",
                marginBottom: "27px",
              }}
            >
              Join SafeRoute for safer, smarter shared commutes.
            </Typography>

            {/* Full Name */}
            <Box style={{ marginBottom: "15px" }}>
              <Typography style={labelStyle}>
                Full Name <span style={{ color: "#d32f2f" }}>*</span>
              </Typography>

              <Box style={inputContainerStyle}>
                <PersonOutlined
                  style={{
                    color: "#788187",
                    fontSize: "19px",
                    marginLeft: "14px",
                    marginRight: "10px",
                  }}
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  style={{
                    ...inputStyle,
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
                />
              </Box>
            </Box>

            {/* Mobile Number */}
            <Box style={{ marginBottom: "15px" }}>
              <Typography style={labelStyle}>
                Mobile Number <span style={{ color: "#d32f2f" }}>*</span>
              </Typography>

              <Box style={inputContainerStyle}>
                <PhoneOutlined
                  style={{
                    color: "#788187",
                    fontSize: "18px",
                    marginLeft: "14px",
                    marginRight: "9px",
                  }}
                />

                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "25px",
                    paddingRight: "12px",
                    borderRight: "1px solid #cfd1dc",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#263238",
                    }}
                  >
                    +91
                  </Typography>
                </Box>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  style={{
                    ...inputStyle,
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    paddingLeft: "14px",
                  }}
                />
              </Box>
            </Box>

            {/* Email */}
            <Box style={{ marginBottom: "15px" }}>
              <Typography style={labelStyle}>
                Email Address <span style={{ color: "#d32f2f" }}>*</span>
              </Typography>

              <Box style={inputContainerStyle}>
                <MailOutlined
                  style={{
                    color: "#788187",
                    fontSize: "19px",
                    marginLeft: "14px",
                    marginRight: "10px",
                  }}
                />

                <input
                  type="email"
                  placeholder="Enter your email address"
                  style={{
                    ...inputStyle,
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
                />
              </Box>

              <Typography
                style={{
                  fontSize: "11px",
                  color: "#555d62",
                  marginTop: "7px",
                }}
              >
                Work or personal email for account notifications
              </Typography>
            </Box>

            {/* Passwords */}
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "7px",
              }}
            >
              <Box>
                <Typography style={labelStyle}>
                  Password <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>

                <Box style={inputContainerStyle}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    style={{
                      ...inputStyle,
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                    }}
                  />

                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      padding: "8px",
                      color: "#747d82",
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlined style={{ fontSize: "19px" }} />
                    ) : (
                      <VisibilityOutlined style={{ fontSize: "19px" }} />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography style={labelStyle}>
                  Confirm Password{" "}
                  <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>

                <Box style={inputContainerStyle}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    style={{
                      ...inputStyle,
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                    }}
                  />

                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    style={{
                      padding: "8px",
                      color: "#747d82",
                    }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffOutlined style={{ fontSize: "19px" }} />
                    ) : (
                      <VisibilityOutlined style={{ fontSize: "19px" }} />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Password Info */}
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "22px",
              }}
            >
              <InfoOutlined
                style={{
                  fontSize: "15px",
                  color: "#00877c",
                }}
              />

              <Typography
                style={{
                  fontSize: "11px",
                  color: "#4e595d",
                }}
              >
                Minimum 8 characters with at least 1 number
              </Typography>
            </Box>

            {/* Terms */}
            <FormControlLabel
              style={{
                margin: 0,
                marginBottom: "18px",
                alignItems: "center",
              }}
              control={
                <Checkbox
                  size="small"
                  style={{
                    padding: "0 9px 0 0",
                    color: "#70777c",
                  }}
                />
              }
              label={
                <Typography
                  style={{
                    fontSize: "12px",
                    color: "#4f575c",
                  }}
                >
                  I agree to the{" "}
                  <span style={{ color: "#007c72" }}>Terms of Service</span>{" "}
                  and{" "}
                  <span style={{ color: "#007c72" }}>Privacy Policy</span>
                </Typography>
              }
            />

            {/* Create Account */}
            <Button
              variant="contained"
              disableElevation
              endIcon={<ArrowForward />}
              style={{
                height: "51px",
                borderRadius: "10px",
                backgroundColor: "#007c70",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "28px",
              }}
            >
              Create Account
            </Button>

            {/* Login */}
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                marginBottom: "30px",
              }}
            >
              <Typography
                style={{
                  fontSize: "13px",
                  color: "#565d61",
                }}
              >
                Already have an account?
              </Typography>

              <Typography
                style={{
                  fontSize: "13px",
                  color: "#007c70",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Log In
              </Typography>
            </Box>

            {/* Security */}
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
                marginTop: "auto",
              }}
            >
              <Shield
                style={{
                  fontSize: "16px",
                  color: "#007c70",
                }}
              />

              <Typography
                style={{
                  fontSize: "11px",
                  color: "#737a7d",
                }}
              >
                Your information is protected and securely stored.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        style={{
          height: "48px",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <Typography
          style={{
            fontSize: "11px",
            color: "#343b40",
          }}
        >
          © 2025 SafeRoute Technologies Inc. All commuter safety protocols
          active.
        </Typography>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "23px",
          }}
        >
          <Typography
            style={{
              fontSize: "11px",
              color: "#343b40",
            }}
          >
            Privacy Policy
          </Typography>

          <Typography
            style={{
              fontSize: "11px",
              color: "#343b40",
            }}
          >
            Terms of Service
          </Typography>

          <Typography
            style={{
              fontSize: "11px",
              color: "#343b40",
            }}
          >
            Safety Standards
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function Feature({ title, description }) {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "9px",
      }}
    >
      <CheckCircle
        style={{
          fontSize: "20px",
          color: "#51e5d5",
          marginTop: "1px",
          flexShrink: 0,
        }}
      />

      <Box>
        <Typography
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#27303d",
            lineHeight: 1.3,
            marginBottom: "2px",
          }}
        >
          {title}
        </Typography>

        <Typography
          style={{
            fontSize: "11px",
            color: "#59636a",
            lineHeight: 1.35,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

export default App;