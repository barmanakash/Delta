import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

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
  MailOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  CheckCircle,
  ArrowForward,
  HubOutlined,
  VerifiedOutlined,
  LockOutlined,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:8000";

function App() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // ---------------------------------------------------------------------------
  //  Validation
  // ---------------------------------------------------------------------------

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail) {
          if (typeof data.detail === "string") {
            setError(data.detail);
          } else if (Array.isArray(data.detail)) {
            const messages = data.detail.map((err) => err.msg).join(". ");
            setError(messages);
          }
        } else {
          setError("Login failed. Please try again.");
        }
        return;
      }

      // Success — store token and user data
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Resume onboarding wherever this account left off, instead of
      // always starting from scratch.
      const user = data.user;
      if (!user.date_of_birth || !user.profile_photo_url) {
        navigate("/profile");
      } else if (!user.id_document) {
        navigate("/identity");
      } else if (!user.role) {
        navigate("/roleandmode");
      } else if (!user.gender) {
        navigate("/gender");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("Unable to connect to server. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
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
    fontSize: "11px",
    color: "#d32f2f",
    marginTop: "4px",
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
            minHeight: "640px",
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
              Welcome back to SafeRoute.
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
              Sign in to continue your verified, shared commute along your
              usual route.
            </Typography>

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
              padding: "62px 66px 40px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
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
              Log in to your account
            </Typography>

            <Typography
              style={{
                fontSize: "14px",
                color: "#596166",
                marginBottom: "32px",
              }}
            >
              Enter your details to access your SafeRoute account.
            </Typography>

            {/* Email */}
            <Box style={{ marginBottom: "18px" }}>
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
                  onKeyDown={handleKeyDown}
                  style={{
                    ...inputStyle,
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
                />
              </Box>
              {fieldErrors.email && (
                <Typography style={errorTextStyle}>{fieldErrors.email}</Typography>
              )}
            </Box>

            {/* Password */}
            <Box style={{ marginBottom: "10px" }}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  onKeyDown={handleKeyDown}
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

            {/* Remember me + forgot password */}
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "26px",
              }}
            >
              <FormControlLabel
                style={{ margin: 0, alignItems: "center" }}
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      padding: "0 8px 0 0",
                      color: "#70777c",
                    }}
                  />
                }
                label={
                  <Typography style={{ fontSize: "12px", color: "#4f575c" }}>
                    Remember me
                  </Typography>
                }
              />

              <Typography
                style={{
                  fontSize: "12px",
                  color: "#007c70",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            {/* Log In */}
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
              {loading ? "Logging In..." : "Log In"}
            </Button>

            {/* Sign up */}
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
                Don't have an account?
              </Typography>

              <Typography
                component={RouterLink}
                to="/login"
                style={{
                  fontSize: "13px",
                  color: "#007c70",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Typography>
            </Box>

            {/* Security */}
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LockOutlined
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
