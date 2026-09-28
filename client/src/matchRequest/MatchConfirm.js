import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

const teal = "#00796B";
const dark = "#172033";
const lavender = "#F1F2FF";
const lightBg = "#F8F8FF";
const indigo = "#4F46E5";

export default function MatchConfirm() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eefcff 0%, #faf9ff 35%, #f2f1ff 100%)",
        color: dark,
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          height: 70,
          backgroundColor: "#fff",
          borderBottom: "1px solid #eeeeF7",
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          gap: 3,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 125,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "7px",
              backgroundColor: "#009688",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            ✓
          </Box>

          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 700,
              color: "#172033",
            }}
          >
            Safe<span style={{ color: "#009688" }}>Route</span>
          </Typography>
        </Box>

        {/* Brand */}
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            lineHeight: 1,
            minWidth: 105,
          }}
        >
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 700,
              color: "#172033",
            }}
          >
            SafeRoute
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: "#008577",
              fontWeight: 600,
              letterSpacing: 0.3,
              mt: 0.3,
            }}
          >
            RIDE-POOL
          </Typography>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, md: 4 },
            ml: { xs: 0, md: 2 },
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#31343B",
            }}
          >
            Home
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#31343B",
            }}
          >
            My Route
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#31343B",
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Requests
            </Typography>

            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#FFD8DC",
                color: "#D84A55",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              3
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#31343B",
            }}
          >
            Trips
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Notification */}
        <Typography
          sx={{
            fontSize: 24,
            color: "#172033",
            lineHeight: 1,
          }}
        >
          ♧
        </Typography>

        {/* User */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            src="/match-user.jpg"
            sx={{
              width: 38,
              height: 38,
              border: "2px solid #eeeeF7",
            }}
          />

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              lineHeight: 1.2,
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#172033",
              }}
            >
              Harshit Bhargava
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                color: "#6D7480",
              }}
            >
              Verified Daily Pooler
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 15,
              color: "#626873",
            }}
          >
            ⌄
          </Typography>
        </Box>
      </Box>

      {/* MAIN */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 2,
          py: { xs: 4, md: 5 },
        }}
      >
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
          {/* Top gradient line */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background:
                "linear-gradient(90deg, #62D7CB, #008577, #4F46E5)",
            }}
          />

          {/* Confirmation Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                backgroundColor: "#E4FAF7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: teal,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 27,
                  fontWeight: 700,
                }}
              >
                ★
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  right: -3,
                  bottom: -1,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  backgroundColor: indigo,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                ♧
              </Box>
            </Box>
          </Box>

          {/* Status */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Chip
              label="● Trip Scheduled & Confirmed"
              size="small"
              sx={{
                backgroundColor: "#E1F8F5",
                color: "#00796B",
                fontSize: 11,
                fontWeight: 700,
                height: 24,
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          </Box>

          {/* Heading */}
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: "Georgia, serif",
              fontSize: { xs: 27, md: 30 },
              fontWeight: 700,
              color: "#172033",
              mt: 1,
            }}
          >
            Match Confirmed
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#5D626B",
              fontFamily: "Georgia, serif",
              fontSize: 13,
              mt: 0.5,
            }}
          >
            You're now matched with Rohit for this commute corridor.
          </Typography>

          {/* PROFILE CARD */}
          <Box
            sx={{
              mt: 2,
              backgroundColor: lavender,
              borderRadius: "8px",
              p: 2,
            }}
          >
            {/* Profile */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  src="/match-user.jpg"
                  sx={{
                    width: 48,
                    height: 48,
                    border: "3px solid #fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,.12)",
                  }}
                />

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.7,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#172033",
                      }}
                    >
                      Rohit
                    </Typography>

                    <Chip
                      label="Co-Rider"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 9,
                        backgroundColor: "#E4E8FA",
                        color: "#56617A",
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#656A72",
                      mt: 0.2,
                    }}
                  >
                    4.9 ★ • Verified Commuter
                  </Typography>
                </Box>
              </Box>

              <Chip
                label="🛡 Safety match confirmed"
                size="small"
                sx={{
                  backgroundColor: "#CFF7F0",
                  color: "#00796B",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              />
            </Box>

            {/* Journey */}
            <Box
              sx={{
                mt: 2,
                backgroundColor: "#fff",
                borderRadius: "8px",
                px: 1.5,
                py: 1.5,
              }}
            >
              {/* Pickup */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.2,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "3px solid #009688",
                    backgroundColor: "#C9F3ED",
                    mt: 0.3,
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#202738",
                    }}
                  >
                    Pickup: Napier Town
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#686D76",
                    }}
                  >
                    Requested pickup • 0.2 km minor corridor detour
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#00796B",
                  }}
                >
                  8:30 AM
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 1,
                  height: 17,
                  borderLeft: "1px dashed #B8C0D0",
                  ml: "7px",
                }}
              />

              {/* Dropoff */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.2,
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "3px solid #5148D8",
                    backgroundColor: "#E0DEFF",
                    mt: 0.3,
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#202738",
                    }}
                  >
                    Drop-off: Madan Mahal
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#686D76",
                    }}
                  >
                    Direct corridor alignment • Destination match
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#666C75",
                  }}
                >
                  ~8:48 AM
                </Typography>
              </Box>
            </Box>

            {/* Fuel */}
            <Box
              sx={{
                mt: 1.5,
                backgroundColor: "#E9EAFF",
                borderRadius: "6px",
                px: 1.5,
                py: 0.8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#596070",
                }}
              >
                ▣ &nbsp; Estimated Fuel Sharing Split
              </Typography>

              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  px: 1.2,
                  py: 0.4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#242B42",
                }}
              >
                ₹45 Fixed Fuel Split
              </Box>
            </Box>
          </Box>

          {/* ROUTE OVERLAP */}
          <Box
            sx={{
              mt: 2,
              backgroundColor: lavender,
              borderRadius: "8px",
              px: 1.5,
              py: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#00796B",
                }}
              >
                ↝ 94% Corridor Overlap
              </Typography>

              <Typography
                sx={{
                  fontSize: 10,
                  color: "#646A76",
                }}
              >
                ♟ 1 of 1 Pillion Seat Reserved
              </Typography>
            </Box>

            {/* Route line */}
            <Box
              sx={{
                position: "relative",
                height: 35,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 10,
                  right: 10,
                  height: 5,
                  borderRadius: 5,
                  background:
                    "linear-gradient(90deg, #65D8CC 0%, #00796B 30%, #00796B 100%)",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: 6,
                  left: 2,
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: "2px solid #6E777C",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: 6,
                  left: "45%",
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  backgroundColor: "#00796B",
                  border: "2px solid #fff",
                  boxShadow: "0 0 0 1px #00796B",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 2,
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: "2px solid #5148D8",
                }}
              />

              <Typography
                sx={{
                  position: "absolute",
                  top: 28,
                  left: 0,
                  fontSize: 8,
                  color: "#777C84",
                }}
              >
                PNT Naka
              </Typography>

              <Typography
                sx={{
                  position: "absolute",
                  top: 28,
                  left: "39%",
                  fontSize: 8,
                  color: "#00796B",
                  fontWeight: 700,
                }}
              >
                Napier Town (8:30)
              </Typography>

              <Typography
                sx={{
                  position: "absolute",
                  top: 28,
                  right: 0,
                  fontSize: 8,
                  color: "#777C84",
                }}
              >
                Madan Mahal
              </Typography>
            </Box>
          </Box>

          {/* SAFETY NOTE */}
          <Box
            sx={{
              mt: 2,
              backgroundColor: "#E4FAF7",
              borderRadius: "8px",
              p: 1.5,
              display: "flex",
              gap: 1.2,
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: "#fff",
                color: "#00796B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              ✿
            </Box>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: 10.5,
                lineHeight: 1.55,
                color: "#515963",
              }}
            >
              Only accept when you are comfortable with the pickup, route, and
              timing. Once confirmed, SafeRoute reserves your rear pillion
              seat and initiates encrypted trip coordination.
            </Typography>
          </Box>

          {/* BUTTONS */}
          <Box
            sx={{
              display: "flex",
              gap: 0,
              mt: 2.5,
            }}
          >
            <Button
              fullWidth
              sx={{
                height: 43,
                backgroundColor: "#E0E4FF",
                color: "#29304A",
                borderRadius: "10px 0 0 10px",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#E0E4FF",
                },
              }}
            >
              Review More
            </Button>

            <Button
              fullWidth
              sx={{
                height: 43,
                backgroundColor: "#00796B",
                color: "#fff",
                borderRadius: "0 10px 10px 0",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#00796B",
                },
              }}
            >
              ♙ &nbsp; Confirm & Accept
            </Button>
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          minHeight: 65,
          backgroundColor: "#F3F3FF",
          borderTop: "1px solid #EEEEF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: "#424952",
              fontWeight: 600,
            }}
          >
            🛡 AIS-140 & MoRTH Compliant
          </Typography>

          <Typography sx={{ color: "#A7ACB5", fontSize: 12 }}>
            •
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: "#424952",
              fontWeight: 600,
            }}
          >
            🛡 ISO 27001 Certified Security
          </Typography>

          <Typography sx={{ color: "#A7ACB5", fontSize: 12 }}>
            •
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: "#E53935",
              fontWeight: 600,
            }}
          >
            🚨 24/7 Police SOS
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 10,
            color: "#686D76",
          }}
        >
          © 2025 SafeRoute Technologies Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}