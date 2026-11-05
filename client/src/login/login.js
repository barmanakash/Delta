import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
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

const API_BASE_URL = "http://localhost:8000";

function App() {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // ---------------------------------------------------------------------------
  //  Validation
  // ---------------------------------------------------------------------------

  const validateForm = () => {
    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile.replace(/[\s\-]/g, ""))) {
      errors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Minimum 8 characters";
    } else if (!/\d/.test(password)) {
      errors.password = "Must contain at least 1 number";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      errors.terms = "You must agree to the terms";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------------------------------------------------------------------------
  //  Submit handler
  // ---------------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          mobile: mobile.replace(/[\s\-]/g, ""),
          email: email.trim().toLowerCase(),
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from FastAPI
        if (data.detail) {
          if (typeof data.detail === "string") {
            setError(data.detail);
          } else if (Array.isArray(data.detail)) {
            // Pydantic validation errors
            const messages = data.detail.map((err) => err.msg).join(". ");
            setError(messages);
          }
        } else {
          setError("Registration failed. Please try again.");
        }
        return;
      }

      // Success — store token and user data, then navigate to verify
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/verify");
    } catch (err) {
      setError("Unable to connect to server. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

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

  const errorTextStyle = {
    fontSize: "12px",
    color: "#d32f2f",
    marginTop: "4px",
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7ff",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#182033",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @media (max-width: 880px) {
          .auth-main { padding: 20px 14px 28px !important; }
          .auth-card { grid-template-columns: minmax(0, 1fr) !important; min-height: 0 !important; border-radius: 16px !important; }
          .auth-left { padding: 26px 22px !important; }
          .auth-hide-sm { display: none !important; }
          .auth-left-title { font-size: 25px !important; letter-spacing: -0.6px !important; max-width: none !important; }
          .auth-left-text { max-width: none !important; margin-bottom: 0 !important; }
          .auth-right { padding: 30px 24px 26px !important; }
          /* 16px stops phones from zooming in when a field is tapped */
          .auth-card input { font-size: 16px !important; }
        }
        @media (max-width: 700px) {
          .auth-header { padding: 0 16px !important; }
          .auth-tagline { display: none !important; }
          .auth-footer { height: auto !important; padding: 14px 16px !important; flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          .auth-footer-links { flex-wrap: wrap !important; justify-content: center !important; gap: 8px 18px !important; }
        }
        @media (max-width: 640px) {
          .auth-pass-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .auth-title { font-size: 26px !important; }
        }
        @media (max-width: 420px) {
          .auth-right { padding: 24px 16px 22px !important; }
        }
      `}</style>

      {/* Header */}
      <Box
        className="auth-header"
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
            FriendRide
          </Typography>
        </Box>

        <Box
          className="auth-tagline"
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
        className="auth-main"
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
          className="auth-card"
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
            className="auth-left"
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
              className="auth-hide-sm"
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
                FriendRide
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
                  fontSize: "12px",
                  color: "#006f68",
                  fontWeight: 500,
                }}
              >
                Institutional Daily Transit
              </Typography>
            </Box>

            {/* Heading */}
            <Typography
              className="auth-left-title"
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
              className="auth-left-text"
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
            <Box className="auth-hide-sm">
              <RouteCard />
            </Box>

            {/* Features */}
            <Box
              className="auth-hide-sm"
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
              className="auth-hide-sm"
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
            className="auth-right"
            style={{
              padding: "49px 66px 35px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              className="auth-title"
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
              Join FriendRide for safer, smarter shared commutes.
            </Typography>

            {/* Full Name */}
            <Box style={{ marginBottom: "15px" }}>
              <Typography style={labelStyle}>
                Full Name <span style={{ color: "#d32f2f" }}>*</span>
              </Typography>

              <Box
                style={{
                  ...inputContainerStyle,
                  border: fieldErrors.fullName ? "1px solid #d32f2f" : "none",
                }}
              >
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
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                  }}
                  style={{
                    ...inputStyle,
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
                />
              </Box>
              {fieldErrors.fullName && (
                <Typography style={errorTextStyle}>{fieldErrors.fullName}</Typography>
              )}
            </Box>

            {/* Mobile Number */}
            <Box style={{ marginBottom: "15px" }}>
              <Typography style={labelStyle}>
                Mobile Number <span style={{ color: "#d32f2f" }}>*</span>
              </Typography>

              <Box
                style={{
                  ...inputContainerStyle,
                  border: fieldErrors.mobile ? "1px solid #d32f2f" : "none",
                }}
              >
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
                  value={mobile}
                  onChange={(e) => {
                    // Allow only digits, max 10
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(val);
                    setFieldErrors((prev) => ({ ...prev, mobile: "" }));
                  }}
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
              {fieldErrors.mobile && (
                <Typography style={errorTextStyle}>{fieldErrors.mobile}</Typography>
              )}
            </Box>

            {/* Email */}
            <Box style={{ marginBottom: "15px" }}>
              <Typography style={labelStyle}>
                Email Address <span style={{ color: "#d32f2f" }}>*</span>
              </Typography>

              <Box
                style={{
                  ...inputContainerStyle,
                  border: fieldErrors.email ? "1px solid #d32f2f" : "none",
                }}
              >
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  style={{
                    ...inputStyle,
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
                />
              </Box>

              {fieldErrors.email ? (
                <Typography style={errorTextStyle}>{fieldErrors.email}</Typography>
              ) : (
                <Typography
                  style={{
                    fontSize: "12px",
                    color: "#555d62",
                    marginTop: "7px",
                  }}
                >
                  Work or personal email for account notifications
                </Typography>
              )}
            </Box>

            {/* Passwords */}
            <Box
              className="auth-pass-grid"
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

                <Box
                  style={{
                    ...inputContainerStyle,
                    border: fieldErrors.password ? "1px solid #d32f2f" : "none",
                  }}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, password: "" }));
                    }}
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
                {fieldErrors.password && (
                  <Typography style={errorTextStyle}>{fieldErrors.password}</Typography>
                )}
              </Box>

              <Box>
                <Typography style={labelStyle}>
                  Confirm Password{" "}
                  <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>

                <Box
                  style={{
                    ...inputContainerStyle,
                    border: fieldErrors.confirmPassword
                      ? "1px solid #d32f2f"
                      : "none",
                  }}
                >
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setFieldErrors((prev) => ({
                        ...prev,
                        confirmPassword: "",
                      }));
                    }}
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
                {fieldErrors.confirmPassword && (
                  <Typography style={errorTextStyle}>
                    {fieldErrors.confirmPassword}
                  </Typography>
                )}
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
                  fontSize: "12px",
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
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setFieldErrors((prev) => ({ ...prev, terms: "" }));
                  }}
                  style={{
                    padding: "0 9px 0 0",
                    color: fieldErrors.terms ? "#d32f2f" : "#70777c",
                  }}
                />
              }
              label={
                <Typography
                  style={{
                    fontSize: "12px",
                    color: fieldErrors.terms ? "#d32f2f" : "#4f575c",
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
              disabled={loading}
              onClick={handleSubmit}
              endIcon={
                loading ? (
                  <CircularProgress size={18} style={{ color: "#fff" }} />
                ) : (
                  <ArrowForward />
                )
              }
              style={{
                height: "51px",
                borderRadius: "10px",
                backgroundColor: loading ? "#4da89f" : "#007c70",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "28px",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
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
                component={RouterLink}
                to="/signin"
                style={{
                  fontSize: "13px",
                  color: "#007c70",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
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
                  fontSize: "12px",
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
        className="auth-footer"
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
            fontSize: "12px",
            color: "#343b40",
          }}
        >
          © 2025 FriendRide Technologies Inc. All commuter safety protocols
          active.
        </Typography>

        <Box
          className="auth-footer-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "23px",
          }}
        >
          <Typography
            style={{
              fontSize: "12px",
              color: "#343b40",
            }}
          >
            Privacy Policy
          </Typography>

          <Typography
            style={{
              fontSize: "12px",
              color: "#343b40",
            }}
          >
            Terms of Service
          </Typography>

          <Typography
            style={{
              fontSize: "12px",
              color: "#343b40",
            }}
          >
            Safety Standards
          </Typography>
        </Box>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Corridor path card (left panel): animated + interactive             */
/* ------------------------------------------------------------------ */

const EASE = "cubic-bezier(0.22, 0.8, 0.24, 1)";
const ROUTE_D = "M12 82 C90 77, 102 28, 185 35 C250 41, 275 78, 378 73";
const VB_W = 390;
const VB_H = 105;
const TRIP_START = 2.2; // seconds before the first trip starts (after the route has drawn)
const TRIP_TIME = 7; // seconds one trip takes

const NODES = [
  { id: "check", label: "Verified pickup point", enterDelay: 1.0 },
  { id: "rider", label: "Rider nearby", enterDelay: 1.4 },
];

const cardIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const drawIn = keyframes`from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; }`;
const march = keyframes`to { stroke-dashoffset: -22; }`;
const ringOut = keyframes`
  0%   { transform: scale(0.5); opacity: 0.8; }
  100% { transform: scale(2.8); opacity: 0; }
`;
const meshPing = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(0, 139, 128, 0.55); }
  70%  { box-shadow: 0 0 0 7px rgba(0, 139, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 139, 128, 0); }
`;
const nodeIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.25); opacity: 1; }
  to   { transform: scale(1); opacity: 1; }
`;
// the two stops swell as the commuter dot passes them (about 49% and 74% along the route)
const passA = keyframes`
  0%, 44% { transform: scale(1); }
  49%     { transform: scale(1.4); }
  56%, 100% { transform: scale(1); }
`;
const passB = keyframes`
  0%, 69% { transform: scale(1); }
  74%     { transform: scale(1.4); }
  81%, 100% { transform: scale(1); }
`;
const dotLoop = keyframes`
  0%   { opacity: 0; }
  5%   { opacity: 1; }
  93%  { opacity: 1; }
  100% { opacity: 0; }
`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// expanding ring used on the start and end markers
const Ring = ({ cx, cy, r, color, delay }) => (
  <Box
    component="circle"
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke={color}
    strokeWidth="2"
    sx={{
      opacity: 0,
      transformBox: "fill-box",
      transformOrigin: "center",
      animation: `${ringOut} 2.6s ease-out ${delay}s infinite`,
    }}
  />
);

function RouteCard() {
  const reduce = prefersReducedMotion();
  const [hovered, setHovered] = useState(null);

  // the same swelling on hover, kept on an outer group so it never fights the keyframes
  const nodeHover = (id) => ({
    transformBox: "fill-box",
    transformOrigin: "center",
    transform: hovered === id ? "scale(1.25)" : "scale(1)",
    transition: `transform 280ms ${EASE}`,
  });
  const nodeInner = (pass, enterDelay) => ({
    transformBox: "fill-box",
    transformOrigin: "center",
    animation: `${nodeIn} 500ms ${EASE} ${enterDelay}s backwards, ${pass} ${TRIP_TIME}s ease-in-out ${TRIP_START}s infinite`,
  });

  const labelSx = {
    position: "absolute",
    bottom: 0,
    fontSize: "12px",
    fontWeight: 600,
    color: "#41484d",
    transition: "color 200ms ease, transform 250ms " + EASE,
    animation: `${fadeIn} 600ms ease 0.6s backwards`,
  };

  return (
    <Box
      data-no-lift
      sx={{
        backgroundColor: "rgba(255,255,255,0.75)",
        borderRadius: "12px",
        padding: "17px 16px 12px",
        marginBottom: "27px",
        animation: `${cardIn} 700ms ${EASE} 250ms backwards`,
        transition: `transform 300ms ${EASE}, box-shadow 300ms ease, background-color 300ms ease`,
        "&:hover": {
          transform: "translateY(-4px)",
          backgroundColor: "rgba(255,255,255,0.92)",
          boxShadow: "0 16px 30px rgba(35, 42, 70, 0.14)",
        },
        "&:hover .fr-band": { stroke: "#b6bdee" },
        "&:hover .fr-route": { strokeWidth: 3.6 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography
          sx={{ fontSize: "12px", fontWeight: 500, color: "#454b52", letterSpacing: "0.4px" }}
        >
          SIMULATED CORRIDOR PATH
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Box
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#008b80",
              animation: `${meshPing} 2s ease-out infinite`,
            }}
          />
          <Typography sx={{ fontSize: "12px", color: "#00766e", fontWeight: 600 }}>
            Active Mesh
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: "105px", position: "relative" }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Animated route from Origin A to Drop B with two stops"
        >
          <defs>
            {/* the route is revealed by a line that draws itself from A to B */}
            <mask id="frRouteReveal" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
              <Box
                component="path"
                d={ROUTE_D}
                pathLength="1"
                fill="none"
                stroke="#fff"
                strokeWidth="26"
                strokeLinecap="round"
                strokeDasharray="1"
                sx={{ animation: `${drawIn} 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s backwards` }}
              />
            </mask>
          </defs>

          <g mask="url(#frRouteReveal)">
            <Box
              component="path"
              className="fr-band"
              d={ROUTE_D}
              fill="none"
              stroke="#cbd1f2"
              strokeWidth="16"
              strokeLinecap="round"
              sx={{ transition: "stroke 300ms ease" }}
            />
            {/* dashes keep marching from A towards B */}
            <Box
              component="path"
              className="fr-route"
              d={ROUTE_D}
              fill="none"
              stroke="#007c70"
              strokeWidth="3"
              strokeDasharray="7 4"
              strokeLinecap="round"
              sx={{
                transition: "stroke-width 300ms ease",
                animation: `${march} 1.2s linear infinite`,
              }}
            />
          </g>

          {/* origin A and drop B */}
          <Box
            component="circle"
            cx="20"
            cy="81"
            r="6"
            fill="#007c70"
            sx={{ animation: `${fadeIn} 400ms ease 0.2s backwards` }}
          />
          <Ring cx={20} cy={81} r={6} color="#007c70" delay={1.0} />

          <Box
            component="circle"
            cx="378"
            cy="73"
            r="6"
            fill="#4d4bd6"
            sx={{ animation: `${fadeIn} 400ms ease 1.7s backwards` }}
          />
          <Ring cx={378} cy={73} r={6} color="#4d4bd6" delay={1.9} />

          {/* stop 1: verified pickup */}
          <Box component="g" sx={nodeHover("check")}>
            <Box component="g" sx={nodeInner(passA, NODES[0].enterDelay)}>
              <circle cx="185" cy="35" r="13" fill="#ffffff" stroke="#e3e5f5" strokeWidth="2" />
              <circle cx="185" cy="35" r="7" fill="#d5f4ef" />
              <path
                d="M181 35 L184 38 L189 32"
                fill="none"
                stroke="#008c80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Box>
          </Box>

          {/* stop 2: rider nearby */}
          <Box component="g" sx={nodeHover("rider")}>
            <Box component="g" sx={nodeInner(passB, NODES[1].enterDelay)}>
              <circle cx="280" cy="61" r="13" fill="#ffffff" stroke="#e3e5f5" strokeWidth="2" />
              <circle cx="280" cy="61" r="7" fill="#5a56dd" />
              <circle cx="280" cy="61" r="3" fill="#ffffff" />
            </Box>
          </Box>

          {/* the commuter, travelling A to B on a loop */}
          {!reduce && (
            <Box
              component="g"
              sx={{ opacity: 0, animation: `${dotLoop} ${TRIP_TIME}s linear ${TRIP_START}s infinite` }}
            >
              <circle r="11" fill="rgba(0,124,112,0.18)">
                <animate attributeName="r" values="8;13;8" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle r="5" fill="#007c70" stroke="#ffffff" strokeWidth="2" />
              <animateMotion
                dur={`${TRIP_TIME}s`}
                begin={`${TRIP_START}s`}
                repeatCount="indefinite"
                path={ROUTE_D}
                calcMode="linear"
              />
            </Box>
          )}
        </svg>

        {/* hover / focus targets over the two stops, each with a small label */}
        {NODES.map((n, i) => {
          const x = i === 0 ? 185 : 280;
          const y = i === 0 ? 35 : 61;
          const on = hovered === n.id;
          return (
            <Box
              key={n.id}
              tabIndex={0}
              aria-label={n.label}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(n.id)}
              onBlur={() => setHovered(null)}
              sx={{
                position: "absolute",
                left: `${(x / VB_W) * 100}%`,
                top: `${(y / VB_H) * 100}%`,
                width: 30,
                height: 30,
                ml: "-15px",
                mt: "-15px",
                borderRadius: "50%",
                cursor: "pointer",
                outline: "none",
                zIndex: 2,
                "&:focus-visible": { boxShadow: "0 0 0 2px #007c70" },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: on ? "translate(-50%, -2px)" : "translate(-50%, 5px)",
                  opacity: on ? 1 : 0,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  backgroundColor: "#182033",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 9px",
                  borderRadius: "7px",
                  transition: `opacity 200ms ease, transform 250ms ${EASE}`,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    marginLeft: "-4px",
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "4px solid #182033",
                  },
                }}
              >
                {n.label}
              </Box>
            </Box>
          );
        })}

        <Typography
          sx={{
            ...labelSx,
            left: "4px",
            "&:hover": { color: "#007c70", transform: "translateX(2px)" },
          }}
        >
          Origin A
        </Typography>

        <Typography
          sx={{
            ...labelSx,
            right: "5px",
            animationDelay: "1.8s",
            "&:hover": { color: "#4d4bd6", transform: "translateX(-2px)" },
          }}
        >
          Drop B
        </Typography>
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
            fontSize: "12px",
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