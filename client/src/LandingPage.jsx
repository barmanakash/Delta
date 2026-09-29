import React from "react";
import { Box, Typography, Button, Stack, Avatar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Footer from '../src/footer/footer'


/* ---------------------------------------------------------------------- */
/*  Small inline SVG icons (no external icon package installed)           */
/* ---------------------------------------------------------------------- */

const IconCheck = ({ size = 12, color = "#0E9F76" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconArrowRight = ({ size = 16, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPlay = ({ size = 14, color = "#12151A" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" />
    <path d="M10 8.5l6 3.5-6 3.5v-7z" fill={color} />
  </svg>
);

const IconRoute = ({ size = 20, color = "#5B4CF0" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2l9 18H3L12 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const IconShield = ({ size = 20, color = "#0E9F76" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l8 3.5v6c0 5-3.4 8.7-8 10.5-4.6-1.8-8-5.5-8-10.5v-6L12 2z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const IconShieldPlus = ({ size = 20, color = "#0E9F76" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l8 3.5v6c0 5-3.4 8.7-8 10.5-4.6-1.8-8-5.5-8-10.5v-6L12 2z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M12 9v6M9 12h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconLock = ({ size = 20, color = "#D98A2B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M8 10V7a4 4 0 018 0v3" stroke={color} strokeWidth="1.8" />
  </svg>
);

const IconNetwork = ({ size = 20, color = "#5B4CF0" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="2.2" stroke={color} strokeWidth="1.6" />
    <circle cx="18" cy="6" r="2.2" stroke={color} strokeWidth="1.6" />
    <circle cx="12" cy="18" r="2.2" stroke={color} strokeWidth="1.6" />
    <path d="M7.8 7.3L10.5 16M16.2 7.3L13.5 16M8.2 6h7.6" stroke={color} strokeWidth="1.4" />
  </svg>
);

const IconLoop = ({ size = 20, color = "#0E9F76" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12a8 8 0 0113-6M20 12a8 8 0 01-13 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M17 4v3h-3M7 20v-3h3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconIdCard = ({ size = 20, color = "#0E9F76" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.7" />
    <circle cx="9" cy="12" r="2" stroke={color} strokeWidth="1.5" />
    <path d="M14 10h4M14 14h4M5 16.5c.6-1.4 2-2 4-2s3.4.6 4 2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconTarget = ({ size = 20, color = "#5B4CF0" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconRupee = ({ size = 18, color = "#D98A2B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 4h12M6 9h12M6 4c4.5 0 7 1.6 7 4.5S10.5 13 6 13l8 7"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const IconLeaf = ({ size = 18, color = "#0E9F76" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M5 19c3-4 6-7 11-11" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconThumb = ({ size = 18, color = "#5B4CF0" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M7 11v9H4v-9h3zm0 0l4-7 1 1v5h5.5a1.5 1.5 0 011.4 2l-1.7 6a2 2 0 01-1.9 1.4H7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCompass = ({ size = 18, color = "#0E9F76" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
    <path d="M15 9l-2 6-4 2 2-6 4-2z" fill={color} />
  </svg>
);

const IconUser = ({ size = 18, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8.5" r="3.4" stroke={color} strokeWidth="1.7" />
    <path d="M5 19.5c1.2-3 4-4.5 7-4.5s5.8 1.5 7 4.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

/* ---------------------------------------------------------------------- */
/*  Reusable bits                                                         */
/* ---------------------------------------------------------------------- */

const pageFont = "'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const Pill = ({ children, sx }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      px: "14px",
      py: "7px",
      borderRadius: "999px",
      fontSize: 12.5,
      fontWeight: 600,
      ...sx,
    }}
  >
    {children}
  </Box>
);

// Safe flex-row helper: this MUI version's <Stack> only forwards
// `direction` / `spacing` / `divider` to CSS — justifyContent/alignItems
// passed as bare props are silently dropped, so we always route them
// through sx here instead.
const Row = ({ justify, align = "center", spacing, wrap, sx, children }) => (
  <Stack
    direction="row"
    spacing={spacing}
    sx={{
      alignItems: align,
      ...(justify ? { justifyContent: justify } : {}),
      ...(wrap ? { flexWrap: "wrap" } : {}),
      ...sx,
    }}
  >
    {children}
  </Stack>
);

const FeatureCard = ({ iconBg, icon, title, desc }) => (
  <Box
    sx={{
      flex: 1,
      bgcolor: "#fff",
      borderRadius: "16px",
      border: "1px solid #ECEDF3",
      p: "22px 22px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: "12px",
        bgcolor: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 16.5, color: "#151A21" }}>
      {title}
    </Typography>
    <Typography sx={{ fontFamily: pageFont, fontSize: 14, lineHeight: 1.55, color: "#7A8090" }}>
      {desc}
    </Typography>
  </Box>
);

/* ---------------------------------------------------------------------- */
/*  Navbar                                                                 */
/* ---------------------------------------------------------------------- */

const NavLink = ({ children }) => (
  <Typography
    component="a"
    href="#"
    sx={{
      fontFamily: pageFont,
      fontSize: 14.5,
      fontWeight: 500,
      color: "#3C4250",
      textDecoration: "none",
      "&:hover": { color: "#12151A" },
    }}
  >
    {children}
  </Typography>
);

const Navbar = () => (
  <Box
    sx={{
      bgcolor: "#fff",
      borderBottom: "1px solid #ECEDF3",
      position: "sticky",
      top: 0,
      zIndex: 20,
    }}
  >
    <Row
      justify="space-between"
      sx={{
        maxWidth: 1180,
        mx: "auto",
        px: { xs: 3, md: 4 },
        height: 64,
      }}
    >
      {/* logo */}
      <Row spacing={1.4}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "9px",
            bgcolor: "#0E9F76",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconShield size={16} color="#fff" />
        </Box>
        <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 17, color: "#12151A" }}>
          Safe<Box component="span" sx={{ color: "#0E9F76" }}>Route</Box>
        </Typography>
        <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 17, color: "#12151A", ml: "6px" }}>
          SafeRoute
        </Typography>
      </Row>

      {/* center links */}
      <Stack direction="row" spacing={4.5} sx={{ display: { xs: "none", md: "flex" } }}>
        <NavLink>How It Works</NavLink>
        <NavLink>Safety</NavLink>
        <NavLink>About</NavLink>
      </Stack>

      {/* right actions */}
      <Row spacing={2.5}>
        <Typography
          // component="a"
          // href="/login"
          component={RouterLink}
          to="/signin"
          sx={{
            fontFamily: pageFont,
            fontSize: 14.5,
            fontWeight: 500,
            color: "#3C4250",
            textDecoration: "none",
            display: { xs: "none", sm: "inline" },
            "&:hover": { color: "#12151A" },
          }}
        >
          Log In
        </Typography>
        <Button
          sx={{
            bgcolor: "#0B6B4F",
            color: "#fff",
            textTransform: "none",
            fontFamily: pageFont,
            fontWeight: 600,
            fontSize: 14,
            borderRadius: "999px",
            px: "20px",
            py: "8px",
            "&:hover": { bgcolor: "#08543D" },
          }}
        >
          Get Started
        </Button>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "#0B6B4F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconUser size={17} />
        </Box>
      </Row>
    </Row>
  </Box>
);

/* ---------------------------------------------------------------------- */
/*  Hero                                                                  */
/* ---------------------------------------------------------------------- */

const Hero = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: { xs: 5, md: 6 },
      alignItems: "center",
      pt: { xs: 6, md: 9 },
      pb: { xs: 4, md: 6 },
    }}
  >
    {/* Left column */}
    <Box sx={{ flex: "0 0 46%", maxWidth: { md: "46%" } }}>
      <Pill sx={{ bgcolor: "#fff", border: "1px solid #E6E8EF", color: "#3C4250", mb: "22px" }}>
        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#0E9F76" }} />
        <IconCheck size={13} />
        Verified Community Two-Wheeler Commuting
      </Pill>

      <Typography
        sx={{
          fontFamily: pageFont,
          fontWeight: 800,
          fontSize: { xs: 34, md: 44 },
          lineHeight: 1.12,
          color: "#12151A",
          letterSpacing: "-0.5px",
        }}
      >
        Your Route.
        <br />
        <Box component="span" sx={{ color: "#0E9F76" }}>
          Your Ride.
        </Box>
        <br />
        Shared Safely.
      </Typography>

      <Typography
        sx={{
          fontFamily: pageFont,
          fontSize: 15.5,
          lineHeight: 1.7,
          color: "#6A7182",
          mt: "20px",
          maxWidth: 430,
        }}
      >
        Connect with verified people travelling along the same route and make
        everyday commutes simpler, safer, and more connected. No detours, no
        surge pricing—just genuine shared corridors.
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ mt: "26px" }}>
        <Button
          sx={{
            bgcolor: "#0B6B4F",
            color: "#fff",
            textTransform: "none",
            fontFamily: pageFont,
            fontWeight: 600,
            fontSize: 14.5,
            borderRadius: "10px",
            px: "20px",
            py: "10px",
            gap: "8px",
            "&:hover": { bgcolor: "#08543D" },
          }}
        >
          Get Started <IconArrowRight />
        </Button>
        <Button
          sx={{
            bgcolor: "#fff",
            color: "#12151A",
            textTransform: "none",
            fontFamily: pageFont,
            fontWeight: 600,
            fontSize: 14.5,
            borderRadius: "10px",
            border: "1px solid #E6E8EF",
            px: "18px",
            py: "10px",
            gap: "8px",
            "&:hover": { bgcolor: "#F7F8FB" },
          }}
        >
          <IconPlay /> How It Works
        </Button>
      </Stack>

      <Row spacing={1.2} sx={{ mt: "26px", flexWrap: "wrap" }}>
        <Stack direction="row" sx={{ "& > div": { border: "2px solid #fff", ml: "-8px" }, "& > div:first-of-type": { ml: 0 } }}>
          <Avatar sx={{ width: 26, height: 26, fontSize: 10, bgcolor: "#F2A65A" }}>RK</Avatar>
          <Avatar sx={{ width: 26, height: 26, fontSize: 10, bgcolor: "#7C6CF0" }}>SP</Avatar>
          <Avatar sx={{ width: 26, height: 26, fontSize: 10, bgcolor: "#0E9F76" }}>AM</Avatar>
        </Stack>
        <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, color: "#6A7182" }}>
          <Box component="span" sx={{ fontWeight: 700, color: "#151A21" }}>25,000+</Box> shared corridors{" "}
          <Box component="span" sx={{ mx: "2px" }}>·</Box>{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "#151A21" }}>99.8%</Box> verified{" "}
          <Box component="span" sx={{ mx: "2px" }}>·</Box> Zero detour guarantee
        </Typography>
      </Row>
    </Box>

    {/* Right column - map card */}
    <Box sx={{ flex: 1, position: "relative", width: "100%", maxWidth: 560, mt: { xs: 4, md: 0 } }}>
      {/* floating route-match badge */}
      <Box
        sx={{
          position: "absolute",
          top: -18,
          left: 8,
          zIndex: 3,
          bgcolor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 12px 24px rgba(20,20,40,0.14)",
          p: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 18, color: "#0E9F76" }}>88%</Typography>
        <Box>
          <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 12.5, color: "#151A21" }}>
            Route Match: 88%
          </Typography>
          <Typography sx={{ fontFamily: pageFont, fontSize: 11, color: "#8A9099" }}>
            +3 min detour only
          </Typography>
        </Box>
      </Box>

      {/* dark map panel */}
      <Box
        sx={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          height: { xs: 300, md: 340 },
          background:
            "radial-gradient(120% 140% at 15% 15%, #251A45 0%, #0A0E1C 55%, #0A0E1C 100%)",
          p: "18px 20px",
        }}
      >
        <Row justify="space-between" align="flex-start">
          <Typography sx={{ fontFamily: pageFont, fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600, letterSpacing: "0.5px" }}>
            OVERLAP
          </Typography>
          <Pill sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 11.5, py: "5px" }}>
            <IconRoute size={13} color="#8CF0C9" /> Active Corridors: 42
          </Pill>
        </Row>

        {/* route curve */}
        <Box sx={{ position: "absolute", left: 0, right: 0, top: "34%" }}>
          <svg viewBox="0 0 520 140" width="100%" height="150" style={{ overflow: "visible" }}>
            <path
              d="M20 110 C 120 20, 200 150, 280 65 S 430 10, 495 40"
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="4 6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M20 110 C 90 60, 180 15, 260 40 S 400 15, 495 40"
              stroke="#33D6A6"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="20" cy="110" r="6" fill="#33D6A6" />
            <circle cx="260" cy="40" r="9" fill="#33D6A6" stroke="#0A0E1C" strokeWidth="2" />
            <text x="260" y="44" fontSize="9" fill="#0A0E1C" textAnchor="middle" fontWeight="700">R</text>
            <circle cx="345" cy="24" r="9" fill="#7C6CF0" stroke="#0A0E1C" strokeWidth="2" />
            <text x="345" y="28" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="700">P</text>
            <circle cx="495" cy="40" r="6" fill="#33D6A6" />
          </svg>
        </Box>

        <Box sx={{ position: "absolute", left: 20, bottom: 18 }}>
          <Row spacing={0.7}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#33D6A6" }} />
            <Typography sx={{ fontFamily: pageFont, fontSize: 12, fontWeight: 700, color: "#fff" }}>
              PNT Naka
            </Typography>
          </Row>
          <Typography sx={{ fontFamily: pageFont, fontSize: 10.5, color: "rgba(255,255,255,0.5)", pl: "14px" }}>
            Origin · 8:15 AM
          </Typography>
        </Box>

        <Box sx={{ position: "absolute", right: 20, bottom: 18, textAlign: "right" }}>
          <Typography sx={{ fontFamily: pageFont, fontSize: 12, fontWeight: 700, color: "#fff" }}>
            Madan Mahal Tech Hub
          </Typography>
        </Box>
      </Box>

      {/* floating verified-community badge */}
      <Box
        sx={{
          position: "absolute",
          right: 12,
          bottom: -20,
          zIndex: 3,
          bgcolor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 12px 24px rgba(20,20,40,0.14)",
          p: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          maxWidth: 220,
        }}
      >
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            bgcolor: "#0E9F76",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconCheck size={14} color="#fff" />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 12, color: "#151A21" }}>
            Verified Community
          </Typography>
          <Typography sx={{ fontFamily: pageFont, fontSize: 10.5, color: "#8A9099" }}>
            Govt ID + Corp Email
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);

/* ---------------------------------------------------------------------- */
/*  Feature cards row                                                     */
/* ---------------------------------------------------------------------- */

const FeatureRow = () => (
  <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} sx={{ mt: { xs: 3, md: 5 } }}>
    <FeatureCard
      iconBg="#E4F6EE"
      icon={<IconShield color="#0E9F76" />}
      title="Verified Members"
      desc="Identity-focused verification. Aadhaar and work email verified commuters only."
    />
    <FeatureCard
      iconBg="#EAE7FC"
      icon={<IconRoute color="#5B4CF0" />}
      title="Route-Based Matching"
      desc="Find people travelling your way. Instant corridor overlap calculation with minimal detours."
    />
    <FeatureCard
      iconBg="#FBEAD6"
      icon={<IconLock color="#D98A2B" />}
      title="Safety First"
      desc="Designed around safer shared commutes. Live ride monitoring, emergency SOS, and dual helmet checks."
    />
  </Stack>
);

/* ---------------------------------------------------------------------- */
/*  Process section                                                       */
/* ---------------------------------------------------------------------- */

const ProcessCard = ({ number, iconBg, icon, title, desc, children }) => (
  <Box
    sx={{
      flex: 1,
      bgcolor: "#fff",
      borderRadius: "18px",
      border: "1px solid #ECEDF3",
      p: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    }}
  >
    <Row justify="space-between" align="flex-start">
      <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 30, color: "#DDE0E8" }}>
        {number}
      </Typography>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "10px",
          bgcolor: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
    </Row>
    <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 17, color: "#151A21" }}>
      {title}
    </Typography>
    <Typography sx={{ fontFamily: pageFont, fontSize: 13.5, lineHeight: 1.6, color: "#7A8090" }}>
      {desc}
    </Typography>
    {children}
  </Box>
);

const ProcessSection = () => (
  <Box sx={{ py: { xs: 7, md: 10 }, textAlign: "center" }}>
    <Pill sx={{ bgcolor: "#EEF0F6", color: "#5B6472", mb: "18px" }}>PROCESS</Pill>
    <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: { xs: 26, md: 34 }, color: "#12151A" }}>
      Simple, Predictable Commuting
    </Typography>
    <Typography
      sx={{
        fontFamily: pageFont,
        fontSize: 15,
        color: "#7A8090",
        maxWidth: 480,
        mx: "auto",
        mt: "12px",
        lineHeight: 1.6,
      }}
    >
      Three intuitive steps to transform your daily transit routine from congested to collaborative.
    </Typography>

    <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} sx={{ mt: 5, textAlign: "left" }}>
      <ProcessCard
        number="01"
        iconBg="#E4F6EE"
        icon={<IconShieldPlus size={18} />}
        title="Set Your Route"
        desc="Tell SafeRoute where you're starting and where you're going. Choose your regular morning or evening schedule."
      >
        <Box sx={{ bgcolor: "#F7F8FB", borderRadius: "10px", p: "12px 14px", mt: "4px" }}>
          <Row spacing={1}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#0E9F76" }} />
            <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, color: "#151A21", fontWeight: 600 }}>
              South Extn. Metro, Gate 2
            </Typography>
          </Row>
          <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#B5BAC4", pl: "15px", lineHeight: 1.6 }}>
            ⋮
          </Typography>
          <Row spacing={1}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#7C6CF0" }} />
            <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, color: "#151A21", fontWeight: 600 }}>
              Cyber Park Tower B
            </Typography>
          </Row>
        </Box>
      </ProcessCard>

      <ProcessCard
        number="02"
        iconBg="#EAE7FC"
        icon={<IconNetwork size={18} />}
        title="Find a Match"
        desc="Discover compatible people travelling along the same corridor with transparent detour metrics and profile verification."
      >
        <Box sx={{ bgcolor: "#F7F8FB", borderRadius: "10px", p: "12px 14px", mt: "4px" }}>
          <Row justify="space-between">
            <Row spacing={1}>
              <Avatar sx={{ width: 26, height: 26, fontSize: 10, bgcolor: "#0E9F76" }}>AS</Avatar>
              <Box>
                <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, fontWeight: 700, color: "#151A21" }}>
                  Arjun S.
                </Typography>
                <Typography sx={{ fontFamily: pageFont, fontSize: 11, color: "#8A9099" }}>
                  TCS · 4.9 ★
                </Typography>
              </Box>
            </Row>
            <Pill sx={{ bgcolor: "#E4F6EE", color: "#0E9F76", fontSize: 10.5, py: "4px", px: "9px" }}>
              92% match
            </Pill>
          </Row>
          <Row justify="space-between" sx={{ mt: "8px" }}>
            <Typography sx={{ fontFamily: pageFont, fontSize: 11.5, color: "#8A9099" }}>
              Honda H'ness CB350
            </Typography>
            <Typography sx={{ fontFamily: pageFont, fontSize: 11.5, color: "#8A9099" }}>
              +2 min detour
            </Typography>
          </Row>
        </Box>
      </ProcessCard>

      <ProcessCard
        number="03"
        iconBg="#E4F6EE"
        icon={<IconLoop size={18} />}
        title="Travel Together"
        desc="Connect, coordinate pickup, and complete your shared commute with shared fuel contributions and peace of mind."
      >
        <Box sx={{ bgcolor: "#F7F8FB", borderRadius: "10px", p: "12px 14px", mt: "4px" }}>
          <Row justify="space-between">
            <Row spacing={1}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: "#0E9F76",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={12} color="#fff" />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, fontWeight: 700, color: "#151A21" }}>
                  Ready to Roll
                </Typography>
                <Typography sx={{ fontFamily: pageFont, fontSize: 11, color: "#8A9099" }}>
                  OTP &amp; Helmet Verified
                </Typography>
              </Box>
            </Row>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontFamily: pageFont, fontSize: 13, fontWeight: 800, color: "#151A21" }}>
                ₹45
              </Typography>
              <Typography sx={{ fontFamily: pageFont, fontSize: 10.5, color: "#8A9099" }}>
                Fuel share
              </Typography>
            </Box>
          </Row>
        </Box>
      </ProcessCard>
    </Stack>
  </Box>
);

/* ---------------------------------------------------------------------- */
/*  Safety section                                                        */
/* ---------------------------------------------------------------------- */

const SafetyCard = ({ iconBg, icon, title, desc }) => (
  <Box
    sx={{
      flex: 1,
      bgcolor: "#fff",
      borderRadius: "16px",
      p: "22px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: "10px",
        bgcolor: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 16, color: "#151A21" }}>
      {title}
    </Typography>
    <Typography sx={{ fontFamily: pageFont, fontSize: 13.5, lineHeight: 1.6, color: "#7A8090" }}>
      {desc}
    </Typography>
  </Box>
);

const SafetySection = () => (
  <Box
    sx={{
      borderRadius: "24px",
      background: "linear-gradient(135deg, #E4E7FB 0%, #ECEFFB 100%)",
      p: { xs: 3, md: 5 },
      mt: { xs: 3, md: 4 },
    }}
  >
    <Pill sx={{ bgcolor: "#0B4B3D", color: "#fff", mb: "18px" }}>
      <IconCompass size={13} color="#8CF0C9" /> SafeRoute Safety Architecture
    </Pill>
    <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: { xs: 24, md: 30 }, color: "#12151A" }}>
      Built Around Safer Commutes
    </Typography>
    <Typography sx={{ fontFamily: pageFont, fontSize: 14.5, color: "#5B6472", mt: "8px" }}>
      Safety isn't an afterthought; it's our core operating framework designed from day one.
    </Typography>

    <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} sx={{ mt: 4 }}>
      <SafetyCard
        iconBg="#DCF3E9"
        icon={<IconIdCard size={18} />}
        title="Verified Profiles"
        desc="Know who you're travelling with. Every rider and passenger completes multi-tier identity checks before taking a seat."
      />
      <SafetyCard
        iconBg="#E4E1FA"
        icon={<IconTarget size={18} />}
        title="Route Visibility"
        desc="Understand the shared commute before connecting. Precise pickup points, transparent detour times, and zero mystery."
      />
      <SafetyCard
        iconBg="#FBE2E4"
        icon={
          <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 11, color: "#E15366" }}>
            SOS
          </Typography>
        }
        title="Emergency Support"
        desc="Access safety tools when you need them. 24/7 dedicated corridor assistance, live route sharing, and instant SOS dispatch."
      />
    </Stack>

    <Row
      justify="space-between"
      sx={{
        bgcolor: "rgba(255,255,255,0.6)",
        borderRadius: "14px",
        p: "16px 20px",
        mt: 3,
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Row spacing={1.2}>
        <IconShield size={18} color="#0B4B3D" />
        <Typography sx={{ fontFamily: pageFont, fontSize: 13.5, fontWeight: 600, color: "#242B36" }}>
          Comprehensive ₹5,00,000 accidental cover included on all scheduled shared commutes.
        </Typography>
      </Row>
      <Typography sx={{ fontFamily: pageFont, fontSize: 13.5, fontWeight: 700, color: "#0B6B4F" }}>
        Read Policy &gt;
      </Typography>
    </Row>
  </Box>
);

/* ---------------------------------------------------------------------- */
/*  Stats row                                                             */
/* ---------------------------------------------------------------------- */

const StatCard = ({ iconBg, icon, tag, tagColor, value, desc }) => (
  <Box
    sx={{
      flex: 1,
      bgcolor: "#fff",
      borderRadius: "16px",
      border: "1px solid #ECEDF3",
      p: "22px",
    }}
  >
    <Row justify="space-between">
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          bgcolor: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Pill sx={{ bgcolor: "#F2F3F8", color: tagColor, fontSize: 11, py: "5px" }}>{tag}</Pill>
    </Row>
    <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 28, color: "#12151A", mt: "16px" }}>
      {value}
    </Typography>
    <Typography sx={{ fontFamily: pageFont, fontSize: 13, color: "#7A8090", mt: "4px" }}>
      {desc}
    </Typography>
  </Box>
);

const StatsRow = () => (
  <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} sx={{ mt: { xs: 6, md: 8 } }}>
    <StatCard
      iconBg="#FBEAD6"
      icon={<IconRupee size={16} />}
      tag="Cost Optimized"
      tagColor="#D98A2B"
      value="₹4,200"
      desc="avg. monthly fuel savings for daily commuters"
    />
    <StatCard
      iconBg="#E4F6EE"
      icon={<IconLeaf size={16} />}
      tag="Cleaner Cities"
      tagColor="#0E9F76"
      value="45%"
      desc="reduction in individual city two-wheeler emissions"
    />
    <StatCard
      iconBg="#EAE7FC"
      icon={<IconThumb size={16} />}
      tag="Verified Only"
      tagColor="#5B4CF0"
      value="98%"
      desc="rider safety and punctual trust rating score"
    />
  </Stack>
);

/* ---------------------------------------------------------------------- */
/*  CTA banner                                                            */
/* ---------------------------------------------------------------------- */

const CTASection = () => (
  <Box
    sx={{
      mt: { xs: 6, md: 8 },
      mb: { xs: 6, md: 8 },
      borderRadius: "24px",
      background: "linear-gradient(120deg, #0E7C5E 0%, #0B4F5C 55%, #0B2A3D 100%)",
      p: { xs: 5, md: 8 },
      textAlign: "center",
    }}
  >
    <Pill sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#DDEFE8", mb: "18px" }}>
      Start Travelling Together
    </Pill>
    <Typography
      sx={{
        fontFamily: pageFont,
        fontWeight: 800,
        fontSize: { xs: 26, md: 34 },
        color: "#fff",
        maxWidth: 640,
        mx: "auto",
        lineHeight: 1.25,
      }}
    >
      Ready to make your daily commute more connected?
    </Typography>
    <Typography
      sx={{
        fontFamily: pageFont,
        fontSize: 15,
        color: "rgba(255,255,255,0.75)",
        maxWidth: 480,
        mx: "auto",
        mt: "14px",
        lineHeight: 1.6,
      }}
    >
      Join SafeRoute and discover people travelling along your route today. Free to join, verified to ride.
    </Typography>

    <Row justify="center" spacing={1.5} sx={{ mt: "28px" }}>
      <Button
        sx={{
          bgcolor: "#fff",
          color: "#0B4F5C",
          textTransform: "none",
          fontFamily: pageFont,
          fontWeight: 700,
          fontSize: 14.5,
          borderRadius: "10px",
          px: "20px",
          py: "10px",
          gap: "8px",
          "&:hover": { bgcolor: "#F0F2F5" },
        }}
      >
        Get Started <IconArrowRight color="#0B4F5C" />
      </Button>
      <Button
        sx={{
          bgcolor: "rgba(255,255,255,0.1)",
          color: "#fff",
          textTransform: "none",
          fontFamily: pageFont,
          fontWeight: 600,
          fontSize: 14.5,
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.25)",
          px: "18px",
          py: "10px",
          gap: "8px",
          "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
        }}
      >
        <IconShield size={15} color="#fff" /> Explore Safety Guidelines
      </Button>
    </Row>
  </Box>
);

/* ---------------------------------------------------------------------- */
/*  Page                                                                  */
/* ---------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "#F6F7FB", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 3, md: 4 } }}>
        <Hero />
        <FeatureRow />
        <ProcessSection />
        <SafetySection />
        <StatsRow />
        <CTASection />
      </Box>
      <Footer />
    </Box>
  );
}
