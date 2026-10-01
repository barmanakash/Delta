import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Popover,
  Typography,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

const teal = "#007d73";
const dark = "#182136";

const ID_TYPE_LABELS = {
  aadhaar: "Aadhaar",
  driving: "Driving Licence",
  passport: "Passport",
  voter: "Voter ID",
};

const ID_STATUS_STYLES = {
  verified: { background: "#e3f6ec", color: "#16794a", label: "Verified" },
  pending: { background: "#fff4dc", color: "#9a6700", label: "Pending review" },
  rejected: { background: "#fde8e8", color: "#b42318", label: "Rejected" },
};

const capitalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

// "YYYY-MM-DD" -> "12 Mar 1999" (built from parts so there is no timezone shift)
const formatDob = (iso) => {
  if (!iso) return "Not added";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatMemberSince = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

function DetailRow({ icon, label, children }) {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "9px 0",
      }}
    >
      <Box
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "#f0f1fc",
          color: teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box style={{ minWidth: 0, flex: 1 }}>
        <Typography
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            color: "#7a8190",
            letterSpacing: "0.4px",
            textTransform: "uppercase",
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
        <Box
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: dark,
            marginTop: 2,
            wordBreak: "break-word",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Header profile button + dropdown.
 *
 * Shows the signed-in user's details (from GET /api/auth/me) and a Log out
 * button that clears the session and sends the user back to /signin.
 *
 * Props:
 *   user     - the user object returned by the API (null while loading)
 *   photoUrl - absolute URL of the profile photo (or null)
 *   variant  - "default" (avatar, name, shield, arrow) or "stacked"
 *              (name over a "Verified Commuter" line, avatar on the right)
 */
export default function ProfileMenu({ user, photoUrl, variant = "default" }) {
  const stacked = variant === "stacked";
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fullName = user?.full_name || "";
  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "?";

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/signin", { replace: true });
  };

  const idDoc = user?.id_document;
  const idStatus = idDoc
    ? ID_STATUS_STYLES[idDoc.status] || ID_STATUS_STYLES.pending
    : null;
  const memberSince = formatMemberSince(user?.created_at);
  const roleLabel = user?.role === "lift" ? "Lift taker" : "Rider";

  return (
    <>
      {/* TRIGGER */}
      <Box
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open profile menu"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setAnchorEl(e.currentTarget);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: 10,
          background: open ? "#f0f1fc" : "transparent",
          userSelect: "none",
        }}
      >
        <Avatar
          src={photoUrl || undefined}
          style={{
            width: stacked ? 38 : 34,
            height: stacked ? 38 : 34,
            order: stacked ? 2 : 0,
            fontSize: 12,
            background: "#d8b293",
            color: "#172033",
            border: "2px solid #fff",
          }}
        >
          {!photoUrl && initials}
        </Avatar>

        <Box style={{ minWidth: 0, textAlign: stacked ? "right" : "left" }}>
        <Typography
          style={{
            fontSize: 14,
            fontWeight: 700,
            maxWidth: 160,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {fullName || "Loading\u2026"}
        </Typography>
        {stacked && (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 4,
              fontSize: 11.5,
              fontWeight: 600,
              color: teal,
              marginTop: 1,
            }}
          >
            Verified Commuter
            <VerifiedOutlinedIcon style={{ fontSize: 13 }} />
          </Box>
        )}
        </Box>

        {!stacked && (
          <>
            <ShieldOutlinedIcon style={{ fontSize: 17, color: teal }} />

            <KeyboardArrowDownIcon
              style={{
                fontSize: 19,
                color: "#596066",
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform 0.15s ease",
              }}
            />
          </>
        )}
      </Box>

      {/* DROPDOWN */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            style: {
              width: 340,
              maxWidth: "calc(100vw - 24px)",
              marginTop: 8,
              borderRadius: 16,
              boxShadow: "0 12px 36px rgba(24,33,54,0.18)",
              border: "1px solid #e7e8f1",
              padding: "18px 18px 14px",
              boxSizing: "border-box",
            },
          },
        }}
      >
        {/* Identity */}
        <Box style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar
            src={photoUrl || undefined}
            style={{
              width: 58,
              height: 58,
              fontSize: 20,
              fontWeight: 700,
              background: "#d8b293",
              color: "#172033",
            }}
          >
            {!photoUrl && initials}
          </Avatar>
          <Box style={{ minWidth: 0 }}>
            <Typography
              style={{
                fontSize: 16.5,
                fontWeight: 700,
                color: dark,
                wordBreak: "break-word",
                lineHeight: 1.25,
              }}
            >
              {fullName || "Your profile"}
            </Typography>
            <Chip
              label={roleLabel.toUpperCase()}
              size="small"
              style={{
                marginTop: 6,
                height: 18,
                borderRadius: 9,
                background: "#71e7df",
                color: "#006c66",
                fontWeight: 800,
                fontSize: 9,
              }}
            />
          </Box>
        </Box>

        <Divider style={{ margin: "14px 0 4px" }} />

        {/* Details */}
        <DetailRow icon={<MailOutlinedIcon style={{ fontSize: 17 }} />} label="Email">
          {user?.email || "-"}
        </DetailRow>

        <DetailRow icon={<PhoneOutlinedIcon style={{ fontSize: 17 }} />} label="Mobile">
          {user?.mobile ? `+91 ${user.mobile}` : "-"}
        </DetailRow>

        <DetailRow
          icon={<CalendarMonthOutlinedIcon style={{ fontSize: 17 }} />}
          label="Date of birth"
        >
          {formatDob(user?.date_of_birth)}
        </DetailRow>

        <DetailRow icon={<WcOutlinedIcon style={{ fontSize: 17 }} />} label="Gender">
          {capitalize(user?.gender) || "Not added"}
        </DetailRow>

        <DetailRow
          icon={<TwoWheelerOutlinedIcon style={{ fontSize: 17 }} />}
          label="Mode"
        >
          {roleLabel}
        </DetailRow>

        <DetailRow icon={<BadgeOutlinedIcon style={{ fontSize: 17 }} />} label="Government ID">
          {idDoc ? (
            <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span>{ID_TYPE_LABELS[idDoc.id_type] || idDoc.id_type}</span>
              <Chip
                label={idStatus.label}
                size="small"
                style={{
                  height: 18,
                  borderRadius: 9,
                  background: idStatus.background,
                  color: idStatus.color,
                  fontWeight: 700,
                  fontSize: 10,
                }}
              />
            </Box>
          ) : (
            "Not uploaded"
          )}
        </DetailRow>

        {memberSince && (
          <Typography
            style={{
              fontSize: 11.5,
              color: "#7a8190",
              marginTop: 6,
              textAlign: "center",
            }}
          >
            Member since {memberSince}
          </Typography>
        )}

        <Divider style={{ margin: "12px 0" }} />

        {/* Logout */}
        <Button
          fullWidth
          disableElevation
          onClick={handleLogout}
          startIcon={<LogoutOutlinedIcon style={{ fontSize: 18 }} />}
          style={{
            height: 42,
            borderRadius: 10,
            background: "#fde8e8",
            color: "#b42318",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Log out
        </Button>
      </Popover>
    </>
  );
}
