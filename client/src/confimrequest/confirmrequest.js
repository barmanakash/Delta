import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Avatar, Box, Button, CircularProgress, Typography } from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import { RiderHeader, RiderFooter } from "../riderlayout/riderlayout";
import {
  acceptRequest,
  apiRequest,
  clearSession,
  formatClock,
  initialsOf,
  toAbsoluteUrl,
  useCachedUser,
  useIncomingRequest,
  useIncomingRequests,
} from "../riderrequests/riderrequests";

const teal = "#007d72";
const dark = "#182238";

/**
 * "Accept this lift request?" Confirming reserves the rider's pillion seat on
 * the server; the lift taker then sees who accepted.
 */
export default function ConfirmRequest() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const cachedUser = useCachedUser();

  const [user, setUser] = useState(cachedUser);
  const [photoUrl, setPhotoUrl] = useState(toAbsoluteUrl(cachedUser?.profile_photo_url));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { loading, error: loadError, notFound, request } = useIncomingRequest(requestId);
  const { pendingCount } = useIncomingRequests();

  /* ---- the real signed-in user ------------------------------------- */
  useEffect(() => {
    if (!localStorage.getItem("access_token")) return undefined;

    let mounted = true;
    apiRequest("/api/auth/me")
      .then(({ ok, status, data }) => {
        if (status === 401) {
          clearSession();
          navigate("/signin", { replace: true });
          return;
        }
        if (!ok || !data) return;
        localStorage.setItem("user", JSON.stringify(data));
        if (mounted) {
          setUser(data);
          setPhotoUrl(toAbsoluteUrl(data.profile_photo_url));
        }
      })
      .catch(() => {
        // keep showing the cached profile while the backend is unavailable
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Already accepted (a refresh, or the back button): go straight to the result
  useEffect(() => {
    if (request?.status === "accepted") {
      navigate(`/matchrequest/${request.id}`, { replace: true });
    }
  }, [request, navigate]);

  const handleAccept = async () => {
    if (submitting || !request) return;
    setError("");
    setSubmitting(true);
    const result = await acceptRequest(request.id);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(`/matchrequest/${request.id}`, { replace: true });
  };

  /* ---------------------------------------------------------------- */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #f8f8ff 0%, #f7f7ff 45%, #eeeeff 100%)",
        color: dark,
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RiderHeader active="requests" user={user} photoUrl={photoUrl} pendingCount={pendingCount} />

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", py: { xs: 4, md: 7 }, px: 2 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: "560px",
            background: "#ffffff",
            borderRadius: "18px",
            boxShadow: "0 16px 38px rgba(42, 48, 90, 0.14)",
            overflow: "hidden",
            borderTop: "5px solid transparent",
            borderImage: "linear-gradient(90deg, #65d8cb, #007e72, #4e4ddd) 1",
          }}
        >
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 9 }}>
              <CircularProgress sx={{ color: teal }} />
            </Box>
          )}

          {!loading && (notFound || loadError) && (
            <Box sx={{ px: 4, py: 5, textAlign: "center" }}>
              <Typography sx={{ fontSize: 21, fontWeight: 800 }}>
                {notFound ? "This request is no longer available" : "Couldn't load this request"}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#63666d", mt: 1, mb: 3, lineHeight: 1.55 }}>
                {notFound
                  ? "It may have been cancelled, expired, or accepted by another rider."
                  : loadError}
              </Typography>
              <Button
                disableElevation
                onClick={() => navigate("/liftrequest")}
                sx={{ background: teal, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700, px: 3, "&:hover": { background: teal } }}
              >
                View Lift Requests
              </Button>
            </Box>
          )}

          {!loading && request && request.status === "pending" && (
            <Box sx={{ px: { xs: 3, md: 4 }, pt: 4, pb: 3.5 }}>
              {/* top icon */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1.2 }}>
                <Box sx={{ width: 62, height: 62, borderRadius: "50%", background: "#d9fbf7", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: "50%", background: teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
                  </Box>
                  <Box sx={{ position: "absolute", right: -2, bottom: 5, width: 23, height: 23, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,.12)" }}>
                    <DirectionsBikeOutlinedIcon sx={{ color: "#4a48d8", fontSize: 15.5 }} />
                  </Box>
                </Box>
              </Box>

              <Typography sx={{ textAlign: "center", fontSize: { xs: 24, md: 25 }, fontWeight: 700, color: "#172038", mb: 0.7 }}>
                Accept this lift request?
              </Typography>
              <Typography sx={{ textAlign: "center", color: "#63666d", fontSize: 14.5, lineHeight: 1.5, maxWidth: 430, mx: "auto", mb: 2.7 }}>
                You're about to confirm this passenger for your upcoming corridor commute.
              </Typography>

              {/* passenger card */}
              <Box sx={{ background: "#f1f1ff", borderRadius: "11px", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
                    <Avatar
                      src={toAbsoluteUrl(request.requester_photo_url) || undefined}
                      sx={{ width: 49, height: 49, background: "linear-gradient(145deg,#d8e9ed,#a8bec7)", color: "#fff", fontWeight: 700, fontSize: 16, border: "3px solid #ffffff" }}
                    >
                      {initialsOf(request.requester_name)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 15.5, fontWeight: 700, color: "#1c2437" }}>
                        {request.requester_name}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#707580", mt: 0.25 }}>
                        {request.requester_verification}
                        {request.same_gender ? " • Same-gender" : ""}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ background: "#c8f8f2", borderRadius: "10px", px: 1, py: 0.5, display: "flex", alignItems: "center", gap: 0.4 }}>
                    <ShieldOutlinedIcon sx={{ fontSize: 13, color: "#007b70" }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#007b70" }}>
                      Safety match confirmed
                    </Typography>
                  </Box>
                </Box>

                {/* journey */}
                <Box sx={{ background: "#ffffff", borderRadius: "9px", px: 1.5, py: 1.2 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Box sx={{ width: 19, height: 19, borderRadius: "50%", background: "#d3f8f3", border: "3px solid #008579", boxSizing: "border-box", mt: 0.1, mr: 1, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#273044", wordBreak: "break-word" }}>
                        Pickup: {request.pickup}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#646873", mt: 0.15 }}>
                        Requested pickup • {request.walk_note}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#007c70", pt: 0.2, pl: 1, whiteSpace: "nowrap" }}>
                      {formatClock(request.pickup_time)}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 1, height: 14, background: "#b8c3d3", ml: "9px" }} />

                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Box sx={{ width: 19, height: 19, borderRadius: "50%", background: "#e0e0ff", border: "3px solid #4c49db", boxSizing: "border-box", mt: 0.1, mr: 1, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#273044", wordBreak: "break-word" }}>
                        Drop-off: {request.destination}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#646873", mt: 0.15 }}>
                        {request.route_note} • Destination match
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "#555b67", pt: 0.2, pl: 1, whiteSpace: "nowrap" }}>
                      ~{formatClock(request.arrival_time)}
                    </Typography>
                  </Box>
                </Box>

                {/* fuel split */}
                <Box sx={{ mt: 1.5, background: "#e7e8ff", borderRadius: "7px", px: 1.3, py: 0.8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <PaymentsOutlinedIcon sx={{ color: "#9b7200", fontSize: 18 }} />
                    <Typography sx={{ fontSize: 12.5, color: "#555b68" }}>Estimated Fuel Sharing Split</Typography>
                  </Box>
                  <Box sx={{ background: "#ffffff", borderRadius: "12px", px: 1.1, py: 0.45 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#26304a" }}>
                      ₹{request.fare} Fixed Fuel Split
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* overlap */}
              <Box sx={{ mt: 1.5, background: "#f1f1ff", borderRadius: "11px", px: 1.5, py: 1.3, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#007b70" }}>
                  ↗ {request.overlap_pct}% Corridor Overlap
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#666b77" }}>
                  ♙ 1 of 1 Pillion Seat Reserved
                </Typography>
              </Box>

              {/* info */}
              <Box sx={{ mt: 1.5, background: "#dcfaf6", borderRadius: "10px", p: 1.4, display: "flex", alignItems: "flex-start", gap: 1 }}>
                <VerifiedUserOutlinedIcon sx={{ color: teal, fontSize: 22, mt: 0.1 }} />
                <Typography sx={{ fontSize: 12, lineHeight: 1.55, color: "#596169" }}>
                  Only accept when you are comfortable with the pickup, route, and timing. Once confirmed,
                  FriendRide reserves your rear pillion seat and initiates encrypted trip coordination.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" role="alert" sx={{ mt: 2, borderRadius: "10px" }}>
                  {error}
                </Alert>
              )}

              {/* buttons */}
              <Box sx={{ display: "flex", gap: 0, mt: 2.3 }}>
                <Button
                  fullWidth
                  disabled={submitting}
                  onClick={() => navigate(`/viewRequest/${request.id}`)}
                  sx={{ height: 43, borderRadius: "10px 0 0 10px", background: "#e0e3ff", color: "#242b42", fontSize: 13, fontWeight: 700, textTransform: "none", boxShadow: "none", "&:hover": { background: "#e0e3ff" } }}
                >
                  Review More
                </Button>

                <Button
                  fullWidth
                  disabled={submitting}
                  onClick={handleAccept}
                  startIcon={!submitting && <AccountCircleOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{ height: 43, borderRadius: "0 10px 10px 0", background: teal, color: "#ffffff", fontSize: 13, fontWeight: 700, textTransform: "none", boxShadow: "none", "&:hover": { background: teal }, "&.Mui-disabled": { background: "#7fb3ad", color: "#fff" } }}
                >
                  {submitting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Confirm & Accept"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <RiderFooter />
    </Box>
  );
}
