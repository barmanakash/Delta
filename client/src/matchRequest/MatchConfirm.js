import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Box, Button, Chip, CircularProgress, Typography } from "@mui/material";

import { RiderHeader, RiderFooter } from "../riderlayout/riderlayout";
import {
  apiRequest,
  clearSession,
  formatClock,
  formatDayLabel,
  initialsOf,
  toAbsoluteUrl,
  useCachedUser,
  useIncomingRequest,
  useIncomingRequests,
} from "../riderrequests/riderrequests";

const teal = "#00796B";
const dark = "#172033";
const lavender = "#F1F2FF";
const indigo = "#4F46E5";

/**
 * "Match Confirmed": shown once the rider has accepted a lift request.
 */
export default function MatchConfirm() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const cachedUser = useCachedUser();

  const [user, setUser] = useState(cachedUser);
  const [photoUrl, setPhotoUrl] = useState(toAbsoluteUrl(cachedUser?.profile_photo_url));

  const { loading, error, notFound, request } = useIncomingRequest(requestId);
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

  // A request that hasn't been accepted yet isn't a match: send them to decide
  useEffect(() => {
    if (request && request.status !== "accepted") {
      navigate(`/confirmrequest/${request.id}`, { replace: true });
    }
  }, [request, navigate]);

  const confirmed = request && request.status === "accepted";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eefcff 0%, #faf9ff 35%, #f2f1ff 100%)",
        color: dark,
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RiderHeader active="requests" user={user} photoUrl={photoUrl} pendingCount={pendingCount} />

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", px: 2, py: { xs: 4, md: 5 } }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 630,
            backgroundColor: "#fff",
            borderRadius: "18px",
            boxShadow: "0 15px 35px rgba(35, 42, 75, 0.10)",
            px: { xs: 3, sm: 5 },
            py: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg, #62D7CB, #008577, #4F46E5)" }} />

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: teal }} />
            </Box>
          )}

          {!loading && (notFound || error) && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography sx={{ fontSize: 21, fontWeight: 800 }}>
                {notFound ? "This match isn't available" : "Couldn't load this match"}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#5D626B", mt: 1, mb: 3, lineHeight: 1.55 }}>
                {notFound ? "The lift taker may have cancelled the request." : error}
              </Typography>
              <Button
                disableElevation
                onClick={() => navigate("/liftrequest")}
                sx={{ backgroundColor: teal, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700, px: 3, "&:hover": { backgroundColor: teal } }}
              >
                View Lift Requests
              </Button>
            </Box>
          )}

          {!loading && confirmed && (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Box sx={{ width: 62, height: 62, borderRadius: "50%", backgroundColor: "#E4FAF7", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 27, fontWeight: 700 }}>
                    ✓
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Chip
                  label="● Trip Scheduled & Confirmed"
                  size="small"
                  sx={{ backgroundColor: "#E1F8F5", color: teal, fontSize: 12.5, fontWeight: 700, height: 24, "& .MuiChip-label": { px: 1.5 } }}
                />
              </Box>

              <Typography sx={{ textAlign: "center", fontSize: { xs: 27, md: 30 }, fontWeight: 700, color: dark, mt: 1 }}>
                Match Confirmed
              </Typography>
              <Typography sx={{ textAlign: "center", color: "#5D626B", fontSize: 14, mt: 0.5 }}>
                You're now matched with {request.requester_name} for this commute corridor.
              </Typography>

              {/* profile + journey */}
              <Box sx={{ mt: 2, backgroundColor: lavender, borderRadius: "8px", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Avatar
                      src={toAbsoluteUrl(request.requester_photo_url) || undefined}
                      sx={{ width: 48, height: 48, border: "3px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,.12)", background: "#d8b293", color: "#172033", fontWeight: 700 }}
                    >
                      {initialsOf(request.requester_name)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 16, fontWeight: 700, color: dark }}>{request.requester_name}</Typography>
                      <Typography sx={{ fontSize: 12.5, color: "#656A72", mt: 0.2 }}>
                        {request.requester_verification}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="🛡 Safety match confirmed"
                    size="small"
                    sx={{ backgroundColor: "#CFF7F0", color: teal, fontSize: 12, fontWeight: 700 }}
                  />
                </Box>

                <Box sx={{ mt: 2, backgroundColor: "#fff", borderRadius: "8px", px: 1.5, py: 1.5 }}>
                  <Box sx={{ display: "flex", gap: 1.2 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: "50%", border: "3px solid #009688", boxSizing: "border-box", backgroundColor: "#C9F3ED", mt: 0.3, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#202738", wordBreak: "break-word" }}>
                        Pickup: {request.pickup}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#686D76" }}>
                        {formatDayLabel(request.travel_date)} • {request.walk_note}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: teal, whiteSpace: "nowrap" }}>
                      {formatClock(request.pickup_time)}
                    </Typography>
                  </Box>

                  <Box sx={{ height: 17, borderLeft: "1px dashed #B8C0D0", ml: "7px" }} />

                  <Box sx={{ display: "flex", gap: 1.2 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: "50%", border: "3px solid #5148D8", boxSizing: "border-box", backgroundColor: "#E0DEFF", mt: 0.3, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#202738", wordBreak: "break-word" }}>
                        Drop-off: {request.destination}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#686D76" }}>
                        {request.route_note} • Destination match
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "#666C75", whiteSpace: "nowrap" }}>
                      ~{formatClock(request.arrival_time)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 1.5, backgroundColor: "#E9EAFF", borderRadius: "6px", px: 1.5, py: 0.8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Typography sx={{ fontSize: 12, color: "#596070" }}>▣ &nbsp; Estimated Fuel Sharing Split</Typography>
                  <Box sx={{ backgroundColor: "#fff", borderRadius: 5, px: 1.2, py: 0.4, fontSize: 12.5, fontWeight: 700, color: "#242B42" }}>
                    ₹{request.fare} Fixed Fuel Split
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 2, backgroundColor: lavender, borderRadius: "8px", px: 1.5, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: teal }}>
                  ↝ {request.overlap_pct}% Corridor Overlap
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#646A76" }}>♟ 1 of 1 Pillion Seat Reserved</Typography>
              </Box>

              <Box sx={{ mt: 2, backgroundColor: "#E4FAF7", borderRadius: "8px", p: 1.5 }}>
                <Typography sx={{ fontSize: 12, lineHeight: 1.55, color: "#515963" }}>
                  Your pillion seat is reserved. Phone numbers stay masked, and contact happens inside
                  FriendRide only.
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 0, mt: 2.5 }}>
                <Button
                  fullWidth
                  onClick={() => navigate("/liftrequest")}
                  sx={{ height: 43, backgroundColor: "#E0E4FF", color: "#29304A", borderRadius: "10px 0 0 10px", textTransform: "none", fontSize: 14, fontWeight: 700, "&:hover": { backgroundColor: "#E0E4FF" } }}
                >
                  More Requests
                </Button>
                <Button
                  fullWidth
                  onClick={() => navigate("/trips")}
                  sx={{ height: 43, backgroundColor: teal, color: "#fff", borderRadius: "0 10px 10px 0", textTransform: "none", fontSize: 14, fontWeight: 700, "&:hover": { backgroundColor: teal } }}
                >
                  View My Trips
                </Button>
              </Box>

              <Typography sx={{ textAlign: "center", fontSize: 12, color: indigo, mt: 1.5 }}>
                You can find this lift under Trips at any time.
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <RiderFooter />
    </Box>
  );
}
