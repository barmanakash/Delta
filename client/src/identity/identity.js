import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";
const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_DOC_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const formatFileSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default function Identity() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [idType, setIdType] = useState("");
  const [file, setFile] = useState(null); // newly picked, not yet uploaded
  const [preview, setPreview] = useState(null); // blob: URL (images only)
  const [savedDoc, setSavedDoc] = useState(null); // document already stored on the server
  const [savedPhotoUrl, setSavedPhotoUrl] = useState(null); // header avatar
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const hasDocument = !!file || !!savedDoc;
  const canContinue = !!idType && hasDocument;

  const docTitle = file
    ? file.name
    : savedDoc
    ? savedDoc.original_filename
    : "Upload your ID";
  const docSubtitle = file
    ? `${formatFileSize(file.size)} \u00b7 Ready to upload`
    : savedDoc
    ? "Uploaded \u00b7 pending verification"
    : "";

  // Load what is already saved (so a returning user isn't asked again)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const loadUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/signin");
          return;
        }
        if (!response.ok) return;

        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        if (data.profile_photo_url) {
          setSavedPhotoUrl(`${API_BASE_URL}${data.profile_photo_url}`);
        }
        if (data.id_document) {
          setSavedDoc(data.id_document);
          setIdType(data.id_document.id_type);
        }
      } catch {
        setError("Unable to connect to server. Please make sure the backend is running.");
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  //  File picking (browse + drag & drop)
  // -------------------------------------------------------------------------

  const acceptFile = (picked) => {
    if (!picked) return;

    let problem = "";
    if (!ALLOWED_DOC_TYPES.includes(picked.type)) {
      problem = "Please upload a JPG, PNG or PDF file.";
    } else if (picked.size === 0) {
      problem = "That file is empty. Please choose another one.";
    } else if (picked.size > MAX_DOC_BYTES) {
      problem = "File is too large. Maximum size is 10 MB.";
    }

    if (problem) {
      setFieldErrors((prev) => ({ ...prev, document: problem }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, document: "" }));
    if (preview) URL.revokeObjectURL(preview);
    setFile(picked);
    setPreview(picked.type.startsWith("image/") ? URL.createObjectURL(picked) : null);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e) => {
    acceptFile(e.target.files && e.target.files[0]);
    e.target.value = ""; // allow picking the same file again
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    acceptFile(e.dataTransfer.files && e.dataTransfer.files[0]);
  };

  const handleRemoveFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  // -------------------------------------------------------------------------
  //  Submit
  // -------------------------------------------------------------------------

  const handleContinue = async () => {
    if (uploading) return;

    const errors = {};
    if (!idType) errors.idType = "Please select an ID type";
    if (!hasDocument) errors.document = "Please upload a photo or scan of your ID";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Nothing changed since the last save: just move on
    if (!file && savedDoc && savedDoc.id_type === idType) {
      navigate("/roleandmode");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const formData = new FormData();
    formData.append("id_type", idType);
    if (file) formData.append("document", file);

    setUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/identity`, {
        method: "PUT",
        // No Content-Type: the browser sets the multipart boundary itself.
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/signin");
        return;
      }

      if (!response.ok) {
        let message = "Unable to upload your document. Please try again.";
        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          message = data.detail.map((d) => d.msg).join(". ");
        }
        setError(message);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/roleandmode");
    } catch (err) {
      setError("Unable to connect to server. Please make sure the backend is running.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      style={{
        width: "100%",
        minHeight: "100vh",
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
          height: 64,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px 0 22px",
          boxSizing: "border-box",
          borderBottom: "1px solid #eeeeF5",
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

          <Typography
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#172033",
              marginLeft: 8,
            }}
          >
            SafeRoute
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 27,
          }}
        >
          <Typography
            style={{
              color: "#00766e",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Verification Protocol
          </Typography>

          <Typography
            style={{
              color: "#424a4d",
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            Safety Guidelines
          </Typography>

          <Typography
            style={{
              color: "#424a4d",
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            Support Desk
          </Typography>

          <Box
            style={{
              height: 25,
              padding: "0 11px",
              borderRadius: 15,
              background: "#f0f2ff",
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginLeft: 5,
            }}
          >
            <ShieldOutlinedIcon
              style={{
                color: "#007b73",
                fontSize: 14,
              }}
            />

            <Typography
              style={{
                color: "#40494e",
                fontSize: 10.5,
                fontWeight: 600,
              }}
            >
              Step 2 of 3
            </Typography>
          </Box>

          <Box
            style={{
              height: 25,
              padding: "0 11px",
              borderRadius: 15,
              background: "#f0f2ff",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <LockOutlinedIcon
              style={{
                color: "#5963d4",
                fontSize: 14,
              }}
            />

            <Typography
              style={{
                color: "#4c535d",
                fontSize: 10.5,
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
              overflow: "hidden",
            }}
          >
            {savedPhotoUrl ? (
              <Box
                component="img"
                src={savedPhotoUrl}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <AccountCircleOutlinedIcon
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* CONTENT AREA */}
      <Box
        style={{
          position: "relative",
          flex: 1,
          background:
            "linear-gradient(180deg, #f8f8ff 0%, #faf9ff 100%)",
          overflow: "hidden",
          paddingBottom: 25,
        }}
      >
        {/* BACKGROUND DECORATION */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1280 1120"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            <radialGradient
              id="leftGlow"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="#dffbfa"
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor="#dffbfa"
                stopOpacity="0"
              />
            </radialGradient>

            <radialGradient
              id="rightGlow"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="#e9e9ff"
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor="#e9e9ff"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          <ellipse
            cx="120"
            cy="390"
            rx="230"
            ry="230"
            fill="url(#leftGlow)"
          />

          <ellipse
            cx="1160"
            cy="450"
            rx="250"
            ry="250"
            fill="url(#rightGlow)"
          />

          <path
            d="M0 330 C190 280 360 335 520 390 C700 450 840 420 1010 395 C1120 378 1200 365 1280 350"
            fill="none"
            stroke="#e8e9f7"
            strokeWidth="1"
          />

          <path
            d="M0 470 C180 425 320 450 490 505 C680 566 815 535 990 500 C1100 478 1190 475 1280 460"
            fill="none"
            stroke="#e5e6f6"
            strokeWidth="1"
          />

          <path
            d="M130 85 L185 52 L240 85 L240 145 C240 178 214 203 185 215 C156 203 130 178 130 145 Z"
            fill="none"
            stroke="#eef0fa"
            strokeWidth="1"
          />

          <path
            d="M1040 560 L1090 530 L1140 560 L1140 620 C1140 650 1117 674 1090 686 C1063 674 1040 650 1040 620 Z"
            fill="none"
            stroke="#e9eaf8"
            strokeWidth="1"
          />

          <path
            d="M0 165 C200 160 355 190 520 235 C680 280 850 278 1030 235 C1130 211 1210 193 1280 195"
            fill="none"
            stroke="#ececfa"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        </svg>

        {/* STEPPER */}
        <Box
          style={{
            position: "relative",
            zIndex: 2,
            width: 580,
            height: 76,
            margin: "19px auto 0",
          }}
        >
          {/* LINE */}
          <Box
            style={{
              position: "absolute",
              left: 36,
              right: 36,
              top: 34,
              height: 3,
              background: "#dfe3f8",
              borderRadius: 4,
            }}
          />

          <Box
            style={{
              position: "absolute",
              left: 36,
              width: 258,
              top: 34,
              height: 3,
              background: "#007b73",
              borderRadius: 4,
            }}
          />

          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              position: "relative",
              height: "100%",
            }}
          >
            {/* PROFILE */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#007d74",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 0 5px #f8f8ff",
                }}
              >
                <CheckCircleOutlineOutlinedIcon
                  style={{
                    color: "#fff",
                    fontSize: 18,
                  }}
                />
              </Box>

              <Typography
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#00776f",
                  marginTop: 6,
                }}
              >
                Profile
              </Typography>

              <Typography
                style={{
                  fontSize: 10.5,
                  color: "#687174",
                }}
              >
                Verified
              </Typography>
            </Box>

            {/* VERIFICATION */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#007d74",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 0 0 5px #dcf8f5, 0 0 0 7px #f8f8ff",
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
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#182238",
                  marginTop: 5,
                }}
              >
                2. Verification
              </Typography>

              <Typography
                style={{
                  fontSize: 10.5,
                  color: "#007b73",
                  fontWeight: 600,
                }}
              >
                Government ID
              </Typography>
            </Box>

            {/* PREFERENCES */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Box
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#e9ebf9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 0 5px #f8f8ff",
                }}
              >
                <Box
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#c2ccc9",
                  }}
                />
              </Box>

              <Typography
                style={{
                  fontSize: 11.5,
                  color: "#737a7d",
                  marginTop: 6,
                }}
              >
                3. Preferences
              </Typography>

              <Typography
                style={{
                  fontSize: 10.5,
                  color: "#999fa1",
                }}
              >
                Commute Rules
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* PAGE TITLE */}
        <Box
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            marginTop: 23,
          }}
        >
          <Typography
            style={{
              fontSize: 29,
              fontWeight: 700,
              color: "#141b30",
              letterSpacing: "-0.6px",
              lineHeight: 1.2,
            }}
          >
            Verify your identity
          </Typography>

          <Typography
            style={{
              width: 500,
              margin: "8px auto 0",
              fontSize: 13.5,
              lineHeight: 1.45,
              color: "#4d5559",
            }}
          >
            SafeRoute uses identity verification to help create a trusted
            community for
            <br />
            shared commutes.
          </Typography>
        </Box>

        {/* MAIN VERIFICATION CARD */}
        <Box
          style={{
            position: "relative",
            zIndex: 2,
            width: 623,
            minHeight: 870,
            margin: "24px auto 0",
            background: "#ffffff",
            borderRadius: 19,
            boxShadow: "0 8px 25px rgba(40,48,90,0.08)",
            padding: "28px 29px 27px",
            boxSizing: "border-box",
          }}
        >
          {/* CARD HEADER */}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
              }}
            >
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 13,
                  background: "#f0f1ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldOutlinedIcon
                  style={{
                    color: "#007d74",
                    fontSize: 21,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#182238",
                    lineHeight: 1.2,
                  }}
                >
                  Identity Verification
                </Typography>

                <Typography
                  style={{
                    fontSize: 11.5,
                    color: "#4d5559",
                    marginTop: 2,
                  }}
                >
                  Verify using a valid government-issued ID card
                </Typography>
              </Box>
            </Box>

            <Box
              style={{
                height: 23,
                padding: "0 11px",
                borderRadius: 13,
                background: "#e9f9f8",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Box
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#007c73",
                }}
              />

              <Typography
                style={{
                  fontSize: 10.5,
                  color: "#00776f",
                  fontWeight: 700,
                }}
              >
                Required for matching
              </Typography>
            </Box>
          </Box>

          {/* ID TYPE */}
          <Box style={{ marginTop: 19 }}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Typography
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#182238",
                }}
              >
                Select ID type{" "}
                <span
                  style={{
                    color: "#db3e3e",
                  }}
                >
                  *
                </span>
              </Typography>

              <Typography
                style={{
                  fontSize: 11,
                  color: "#50595c",
                }}
              >
                Supported national documents
              </Typography>
            </Box>

            <Select
              fullWidth
              value={idType}
              onChange={(e) => {
                setIdType(e.target.value);
                setFieldErrors((prev) => ({ ...prev, idType: "" }));
              }}
              displayEmpty
              IconComponent={KeyboardArrowDownIcon}
              startAdornment={
                <BadgeOutlinedIcon
                  style={{
                    color: "#647074",
                    fontSize: 19,
                    marginRight: 8,
                  }}
                />
              }
              style={{
                height: 39,
                borderRadius: 9,
                background: "#f0f1fc",
                fontSize: 13,
                color: "#50595d",
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: fieldErrors.idType ? "1px solid #d32f2f" : "none",
                },
                "& .MuiSelect-select": {
                  padding: "9px 12px",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="">
                Select ID type
              </MenuItem>
              <MenuItem value="aadhaar">
                Aadhaar
              </MenuItem>
              <MenuItem value="driving">
                Driving Licence
              </MenuItem>
              <MenuItem value="passport">
                Passport
              </MenuItem>
              <MenuItem value="voter">
                Voter ID
              </MenuItem>
            </Select>

            {fieldErrors.idType && (
              <Typography
                style={{
                  fontSize: 11,
                  color: "#d32f2f",
                  fontWeight: 600,
                  marginTop: 6,
                }}
              >
                {fieldErrors.idType}
              </Typography>
            )}

            {/* ACCEPTED */}
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginTop: 9,
              }}
            >
              <Typography
                style={{
                  fontSize: 10.5,
                  color: "#afb6b7",
                  marginRight: 1,
                }}
              >
                Accepted:
              </Typography>

              <DocumentChip text="Aadhaar" icon="shield" />
              <DocumentChip text="Driving Licence" icon="card" />
              <DocumentChip text="Passport" icon="globe" />
              <DocumentChip text="Voter ID" icon="person" />
            </Box>
          </Box>

          {/* DOCUMENT PROOF */}
          <Typography
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#182238",
              marginTop: 20,
              marginBottom: 7,
            }}
          >
            Document Proof
          </Typography>

          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              minHeight: 295,
              borderRadius: 14,
              background: dragActive ? "#eaf7f5" : "#f4f4fc",
              border: fieldErrors.document
                ? "1.5px dashed #d32f2f"
                : dragActive
                ? "1.5px dashed #008078"
                : "1.5px dashed transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              padding: "24px 16px",
              transition: "background 0.15s, border-color 0.15s",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
            />

            {hasDocument ? (
              <>
                <Box
                  style={{
                    width: 57,
                    height: 57,
                    borderRadius: 14,
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 5px rgba(30,40,80,0.04)",
                    overflow: "hidden",
                  }}
                >
                  {preview ? (
                    <Box
                      component="img"
                      src={preview}
                      alt="Document preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <InsertDriveFileOutlinedIcon
                      style={{ color: "#008078", fontSize: 28 }}
                    />
                  )}
                </Box>

                <Typography
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#172033",
                    marginTop: 14,
                    maxWidth: 420,
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {docTitle}
                </Typography>

                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 4,
                  }}
                >
                  <CheckCircleOutlineOutlinedIcon
                    style={{ fontSize: 14, color: "#00867d" }}
                  />
                  <Typography style={{ fontSize: 12, color: "#4d565a" }}>
                    {docSubtitle}
                  </Typography>
                </Box>

                <Box style={{ display: "flex", gap: 10, marginTop: 18 }}>
                  <Button
                    disableElevation
                    onClick={handleBrowseClick}
                    startIcon={<AttachFileOutlinedIcon style={{ fontSize: 16 }} />}
                    style={{
                      height: 34,
                      minWidth: 116,
                      borderRadius: 18,
                      background: "#ffffff",
                      color: "#182238",
                      textTransform: "none",
                      fontSize: 11,
                      fontWeight: 700,
                      boxShadow: "0 2px 5px rgba(20,30,70,0.07)",
                    }}
                  >
                    Change File
                  </Button>

                  {file && (
                    <Button
                      disableElevation
                      onClick={handleRemoveFile}
                      style={{
                        height: 34,
                        minWidth: 90,
                        borderRadius: 18,
                        background: "transparent",
                        color: "#8a4141",
                        textTransform: "none",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    width: 57,
                    height: 57,
                    borderRadius: 14,
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 5px rgba(30,40,80,0.04)",
                  }}
                >
                  <CloudUploadOutlinedIcon
                    style={{
                      color: "#008078",
                      fontSize: 31,
                    }}
                  />
                </Box>

                <Typography
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#172033",
                    marginTop: 16,
                  }}
                >
                  Upload your ID
                </Typography>

                <Typography
                  style={{
                    fontSize: 13,
                    color: "#4d565a",
                    marginTop: 3,
                    textAlign: "center",
                  }}
                >
                  Drag &amp; drop your document here or browse from your
                  <br />
                  device
                </Typography>

                <Button
                  disableElevation
                  onClick={handleBrowseClick}
                  startIcon={
                    <AttachFileOutlinedIcon
                      style={{
                        fontSize: 16,
                      }}
                    />
                  }
                  style={{
                    height: 34,
                    minWidth: 116,
                    borderRadius: 18,
                    background: "#ffffff",
                    color: "#182238",
                    textTransform: "none",
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: 19,
                    boxShadow: "0 2px 5px rgba(20,30,70,0.07)",
                  }}
                >
                  Browse File
                </Button>
              </>
            )}

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 22,
              }}
            >
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <BadgeOutlinedIcon
                  style={{
                    fontSize: 15,
                    color: "#687174",
                  }}
                />

                <Typography
                  style={{
                    fontSize: 10.5,
                    color: "#50595c",
                  }}
                >
                  JPG, PNG, PDF (Max 10 MB)
                </Typography>
              </Box>

              <Box
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "#aeb5b6",
                }}
              />

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <CropFreeOutlinedIcon
                  style={{
                    fontSize: 15,
                    color: "#687174",
                  }}
                />

                <Typography
                  style={{
                    fontSize: 10.5,
                    color: "#50595c",
                  }}
                >
                  All 4 corners &amp; photo clearly visible
                </Typography>
              </Box>
            </Box>
          </Box>

          {fieldErrors.document && (
            <Typography
              style={{
                fontSize: 11,
                color: "#d32f2f",
                fontWeight: 600,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {fieldErrors.document}
            </Typography>
          )}

          {/* SECURITY MESSAGE */}
          <Box
            style={{
              minHeight: 78,
              borderRadius: 14,
              background: "#f0f1fc",
              marginTop: 20,
              padding: "15px 16px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "flex-start",
              gap: 11,
            }}
          >
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#dff4f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldOutlinedIcon
                style={{
                  color: "#007c73",
                  fontSize: 16,
                }}
              />
            </Box>

            <Box>
              <Typography
                style={{
                  fontSize: 11.5,
                  color: "#303a42",
                  lineHeight: 1.35,
                }}
              >
                Your documents are encrypted using AES-256 and used
                exclusively for commuter identity
                <br />
                verification.
              </Typography>

              <Typography
                style={{
                  fontSize: 11,
                  color: "#007970",
                  fontWeight: 600,
                  marginTop: 5,
                }}
              >
                Learn about SafeRoute trust &amp; verification →
              </Typography>
            </Box>
          </Box>

          {/* REQUIREMENTS */}
          <Box
            style={{
              minHeight: 61,
              borderRadius: 13,
              background: "#f0f1fc",
              marginTop: 19,
              padding: "12px 15px",
              boxSizing: "border-box",
            }}
          >
            <Typography
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#596164",
                letterSpacing: "0.3px",
                marginBottom: 7,
              }}
            >
              REQUIREMENTS FOR FAST APPROVAL:
            </Typography>

            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              <Requirement text="Govt. issued ID" />
              <Requirement text="Unblurred & readable" />
              <Requirement text="Matches profile name" />
            </Box>
          </Box>

          {/* CONTINUE */}
          <Button
            fullWidth
            disableElevation
            disabled={uploading}
            onClick={handleContinue}
            endIcon={
              uploading ? (
                <CircularProgress size={16} style={{ color: "#fff" }} />
              ) : (
                <ArrowForwardIcon
                  style={{
                    fontSize: 18,
                  }}
                />
              )
            }
            style={{
              height: 42,
              borderRadius: 10,
              background: uploading ? "#4fa39a" : "#007d74",
              color: "#ffffff",
              textTransform: "none",
              fontSize: 13,
              fontWeight: 700,
              marginTop: 22,
              cursor: uploading ? "default" : "pointer",
            }}
          >
            <LockOutlinedIcon
              style={{
                fontSize: 15,
                marginRight: 4,
              }}
            />
            {uploading ? "Uploading…" : "Continue"}
          </Button>

          {/* SKIP */}
          <Typography
            component={RouterLink}
            to="/roleandmode"
            align="center"
            style={{
              display: "block", // Fixes inline alignment issue
              width: "100%",    // Takes full width to center correctly
              fontSize: 11,
              fontWeight: 700,
              color: "#4d5659",
              marginTop: 16,
              textDecoration: "none", // Optional: removes the default link underline
            }}
          >
            Skip for now
          </Typography>

          {/* PRIVACY */}
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              marginTop: 31,
            }}
          >
            <LockOutlinedIcon
              style={{
                color: "#657071",
                fontSize: 14,
              }}
            />

            <Typography
              style={{
                fontSize: 10.5,
                color: "#737b7c",
              }}
            >
              Your personal information is protected by SafeRoute's
              privacy and security standards.
            </Typography>
          </Box>
        </Box>

        {/* STATISTICS */}
        <Box
          style={{
            position: "relative",
            zIndex: 2,
            width: 623,
            margin: "26px auto 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            textAlign: "center",
          }}
        >
          <Box>
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#182238",
              }}
            >
              100%
            </Typography>

            <Typography
              style={{
                fontSize: 10.5,
                color: "#535c60",
                marginTop: 3,
              }}
            >
              Verified Poolers
            </Typography>
          </Box>

          <Box>
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#008077",
              }}
            >
              &lt; 3 mins
            </Typography>

            <Typography
              style={{
                fontSize: 10.5,
                color: "#535c60",
                marginTop: 3,
              }}
            >
              Avg. Approval Time
            </Typography>
          </Box>

          <Box>
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#565bd0",
              }}
            >
              AIS-140
            </Typography>

            <Typography
              style={{
                fontSize: 10.5,
                color: "#535c60",
                marginTop: 3,
              }}
            >
              Compliant System
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        style={{
          height: 54,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
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
              fontSize: 10.5,
              color: "#3e494b",
            }}
          >
            AIS 140 &amp; MoRTH Two-Wheeler Ride-Pooling Safety
            Compliance
          </Typography>
        </Box>

        <Typography
          style={{
            fontSize: 10.5,
            color: "#3e494b",
          }}
        >
          © 2025 SafeRoute Technologies Inc. All commuter safety protocols
          active.
        </Typography>
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


/* DOCUMENT CHIP */

function DocumentChip({ text, icon }) {
  let Icon = ShieldOutlinedIcon;

  if (icon === "card") {
    Icon = BadgeOutlinedIcon;
  }

  if (icon === "globe") {
    Icon = DirectionsCarOutlinedIcon;
  }

  if (icon === "person") {
    Icon = PersonOutlineOutlinedIcon;
  }

  return (
    <Box
      style={{
        height: 21,
        padding: "0 8px",
        borderRadius: 12,
        background: "#e9ebfb",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Icon
        style={{
          fontSize: 12,
          color: "#46505a",
        }}
      />

      <Typography
        style={{
          fontSize: 9.5,
          color: "#3e4850",
          fontWeight: 600,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}


/* REQUIREMENT */

function Requirement({ text }) {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <CheckCircleOutlineOutlinedIcon
        style={{
          color: "#00867d",
          fontSize: 16,
        }}
      />

      <Typography
        style={{
          fontSize: 10.5,
          color: "#303a42",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}