import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Stack, Avatar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { keyframes } from "@emotion/react";
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

// One width and side gutter shared by the navbar, the page sections and the
// footer, so their edges line up and the page uses the screen instead of
// leaving wide empty margins. (The footer uses the same numbers.)
const pageContainer = {
  width: "100%",
  maxWidth: 1560,
  boxSizing: "border-box",
  mx: "auto",
  px: { xs: 3, sm: 4, md: 5, lg: 6 },
};

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

// Cards reveal themselves on scroll (RevealItem) and share one hover style:
// an accent bar grows across the top, the border tints, the icon tilts.
const FeatureCard = (props) => (
  <RevealItem>
    <FeatureCardBody {...props} />
  </RevealItem>
);

const FeatureCardBody = ({ iconBg, icon, title, desc, accent = "#0E9F76", visual, pingDelay = 0 }) => {
  // pointer position goes into CSS variables (no re-render): the glow follows the
  // cursor and the card tilts towards it
  const handleMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--sx", `${x}px`);
    el.style.setProperty("--sy", `${y}px`);
    el.style.setProperty("--tx", ((x / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--ty", ((y / r.height) * 2 - 1).toFixed(3));
  };
  const handleLeave = (e) => {
    e.currentTarget.style.setProperty("--tx", "0");
    e.currentTarget.style.setProperty("--ty", "0");
  };

  return (
    <Box
      data-no-lift
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      sx={{
        position: "relative",
        overflow: "hidden",
        flex: 1,
        bgcolor: "#fff",
        borderRadius: "16px",
        border: "1px solid #ECEDF3",
        p: "22px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transform:
          "perspective(900px) translateY(var(--lift, 0px)) rotateY(calc(var(--tx, 0) * 5deg)) rotateX(calc(var(--ty, 0) * -4deg))",
        transition: "border-color 260ms ease, box-shadow 300ms ease, transform 220ms ease-out",
        "& > *": { position: "relative", zIndex: 1 },
        // accent bar grows across the top
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          zIndex: 2,
          background: accent,
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: `transform 480ms ${EASE}`,
        },
        // soft glow that follows the mouse
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 300ms ease",
          background: `radial-gradient(300px circle at var(--sx, 50%) var(--sy, 0%), ${accent}1F, transparent 70%)`,
        },
        "&:hover": {
          "--lift": "-6px",
          borderColor: accent,
          boxShadow: `0 20px 38px ${accent}26`,
        },
        "&:hover::before": { transform: "scaleX(1)" },
        "&:hover::after": { opacity: 1 },
        "&:hover .fr-icon": { transform: "scale(1.12) rotate(-8deg)" },
      }}
    >
      <Box sx={{ position: "relative", width: 42, height: 42, alignSelf: "flex-start" }}>
        {/* a soft ping that leaves the icon tile every few seconds */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px",
            border: `2px solid ${accent}`,
            opacity: 0,
            animation: `${tilePing} 3.2s ease-out ${pingDelay}s infinite`,
          }}
        />
        <Box
          className="fr-icon"
          sx={{
            position: "relative",
            transition: `transform 300ms ${EASE}`,
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
      </Box>
      <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 16.5, color: "#151A21" }}>
        {title}
      </Typography>
      <Typography sx={{ fontFamily: pageFont, fontSize: 14, lineHeight: 1.55, color: "#7A8090" }}>
        {desc}
      </Typography>
      {visual}
    </Box>
  );
};

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
    <ScrollProgress />
    <Row
      justify="space-between"
      sx={{
        ...pageContainer,
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
         Friend<Box component="span" sx={{ color: "#0E9F76" }}>Ride</Box>
        </Typography>
      </Row>

      {/* center links */}
      <Stack direction="row" spacing={4.5} sx={{ display: { xs: "none", md: "flex" } }}>
        {/* <NavLink>How It Works</NavLink>
        <NavLink>Safety</NavLink>
        <NavLink>About</NavLink> */}
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

const EASE = "cubic-bezier(0.22, 0.8, 0.24, 1)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- keyframes (all hero-only; the global ones live in index.css) ---- */
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
`;
const wordUp = keyframes`
  from { opacity: 0; transform: translateY(105%) rotate(5deg); }
  to   { opacity: 1; transform: none; }
`;
const shimmer = keyframes`
  from { background-position: 0% 50%; }
  to   { background-position: 200% 50%; }
`;
const blobA = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(40px, 28px) scale(1.12); }
`;
const blobB = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(-36px, -26px) scale(1.1); }
`;
const pulseDot = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(14, 159, 118, 0.55); }
  70%  { box-shadow: 0 0 0 9px rgba(14, 159, 118, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 159, 118, 0); }
`;
const drawLine = keyframes`from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; }`;
const marching = keyframes`to { stroke-dashoffset: -24; }`;
const ringOut = keyframes`
  0%   { transform: scale(0.4); opacity: 0.9; }
  100% { transform: scale(2.6); opacity: 0; }
`;
const gridPan = keyframes`
  from { background-position: 0 0, 0 0; }
  to   { background-position: 44px 44px, 44px 44px; }
`;
const twinkle = keyframes`0%, 100% { opacity: 0.15; } 50% { opacity: 0.95; }`;
const sheen = keyframes`
  0%        { transform: translateX(-130%) skewX(-20deg); }
  55%, 100% { transform: translateX(260%) skewX(-20deg); }
`;
const statusIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
`;
const growBar = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

/* ---- small live pieces (own state, so the hero itself never re-renders) ---- */

// Eased count-up, e.g. <Count to={25000} />
const Count = ({ to, decimals = 0, duration = 1600, delay = 0, start = true }) => {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(to);
      return undefined;
    }
    if (!start) return undefined; // waits until it scrolls into view
    let raf;
    let startTime;
    const timer = setTimeout(() => {
      const tick = (now) => {
        if (startTime === undefined) startTime = now;
        const p = Math.min((now - startTime) / duration, 1);
        setValue(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, delay, start]);

  return decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN");
};

// "Active Corridors" counts up to 42, then keeps breathing 42 → 44 like a live feed
const CORRIDOR_WAVE = [0, 1, 2, 1];
const LiveCorridors = () => {
  const reduce = prefersReducedMotion();
  const [settled, setSettled] = useState(reduce);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return undefined;
    const t = setTimeout(() => setSettled(true), 2000);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce || !settled) return undefined;
    const id = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(id);
  }, [reduce, settled]);

  if (!settled) return <Count to={42} delay={500} duration={1400} />;
  return <>{42 + CORRIDOR_WAVE[tick % CORRIDOR_WAVE.length]}</>;
};

// Map status line that cycles through the "story" of a match
const STATUSES = ["Searching nearby riders…", "Match found · 88% overlap", "Pickup confirmed · 8:15 AM"];
const StatusTicker = () => {
  const reduce = prefersReducedMotion();
  const [i, setI] = useState(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % STATUSES.length), 2800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <Box
      key={i}
      component="span"
      sx={{ whiteSpace: "nowrap", animation: `${statusIn} 420ms ${EASE} backwards` }}
    >
      {STATUSES[i]}
    </Box>
  );
};

/* ---- headline: every word slides up from behind a mask ---- */
const HEADLINE = [
  { words: ["Your", "Route."] },
  { words: ["Your", "Ride."], accent: true },
  { words: ["Shared", "Safely."] },
];

const HeadlineWord = ({ index, accent, children }) => {
  const delay = 200 + index * 110;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
        pt: "0.12em",
        pb: "0.14em",
        mt: "-0.12em",
        mb: "-0.14em",
        mr: "0.26em",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-block",
          cursor: "default",
          transition: `transform 260ms ${EASE}`,
          // "backwards" (not "both") so the hover transform still works afterwards
          animation: accent
            ? `${wordUp} 800ms ${EASE} ${delay}ms backwards, ${shimmer} 7s linear 1.2s infinite`
            : `${wordUp} 800ms ${EASE} ${delay}ms backwards`,
          "&:hover": { transform: "translateY(-5px) rotate(-2deg)" },
          ...(accent
            ? {
                background: "linear-gradient(90deg, #0E9F76, #33D6A6, #5B4CF0, #33D6A6, #0E9F76)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }
            : {}),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

/* ---- soft animated backdrop behind the whole hero ---- */
const BACKDROP_MASK = "radial-gradient(ellipse 80% 85% at 50% 50%, #000 45%, transparent 100%)";

const HeroBackdrop = () => (
  <Box
    aria-hidden="true"
    sx={{
      position: "absolute",
      inset: "-40px -24px",
      pointerEvents: "none",
      zIndex: 0,
      WebkitMaskImage: BACKDROP_MASK,
      maskImage: BACKDROP_MASK,
    }}
  >
    {/* dotted grid */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(rgba(18,21,26,0.09) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />
    {/* drifting colour blobs */}
    <Box
      sx={{
        position: "absolute",
        top: "4%",
        left: "2%",
        width: "min(420px, 80%)",
        aspectRatio: "1",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,159,118,0.20), transparent 65%)",
        animation: `${blobA} 14s ease-in-out infinite`,
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        right: "6%",
        width: "min(460px, 85%)",
        aspectRatio: "1",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,108,240,0.20), transparent 65%)",
        animation: `${blobB} 17s ease-in-out infinite`,
      }}
    />
    {/* cursor spotlight (--mx / --my are set on the hero by the mouse handler) */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(380px circle at var(--mx, 25%) var(--my, 30%), rgba(14,159,118,0.12), transparent 65%)",
      }}
    />
  </Box>
);

/* ---- map card pieces ---- */
const ROUTE_PATH = "M30 210 C 110 150, 190 70, 270 95 C 350 120, 430 140, 490 55";
const PASSENGER_PATH = "M120 240 C 200 245, 255 190, 270 95";

const STARS = [
  [8, 22, 2, 0], [18, 70, 1.5, 0.8], [30, 12, 2, 1.6], [45, 82, 1.5, 0.4],
  [58, 18, 2, 2.1], [70, 76, 1.5, 1.2], [82, 28, 2, 0.6], [92, 64, 1.5, 1.9],
  [12, 46, 1.5, 2.4], [88, 12, 1.5, 0.2], [64, 50, 1.5, 1.4],
];

// expanding ring used for the pickup / origin / destination markers
const Ring = ({ cx, cy, color, delay = 0, r = 9 }) => (
  <Box
    component="circle"
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke={color}
    strokeWidth="2"
    sx={{
      transformBox: "fill-box",
      transformOrigin: "center",
      animation: `${ringOut} 2.6s ease-out ${delay}s infinite`,
    }}
  />
);

const RouteScene = ({ reduce }) => (
  <svg
    viewBox="0 0 520 260"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    style={{ overflow: "visible" }}
    role="img"
    aria-label="Animated route overlap between a rider and a passenger"
  >
    <defs>
      <linearGradient id="frRouteGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#33D6A6" />
        <stop offset="1" stopColor="#8CF0C9" />
      </linearGradient>
      <filter id="frGlow" x="-20%" y="-30%" width="140%" height="160%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>

    {/* passenger's own route: dashed, flowing */}
    <Box
      component="path"
      d={PASSENGER_PATH}
      fill="none"
      stroke="#9D90FF"
      strokeWidth="2"
      strokeDasharray="5 7"
      strokeLinecap="round"
      sx={{ animation: `${fadeIn} 600ms ease 1.6s backwards, ${marching} 1.2s linear infinite` }}
    />

    {/* rider route: glow + line that draws itself */}
    <Box
      component="path"
      d={ROUTE_PATH}
      pathLength="1"
      fill="none"
      stroke="#33D6A6"
      strokeWidth="9"
      strokeLinecap="round"
      strokeDasharray="1"
      sx={{
        opacity: 0.4,
        filter: "url(#frGlow)",
        animation: `${drawLine} 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s backwards`,
      }}
    />
    <Box
      component="path"
      d={ROUTE_PATH}
      pathLength="1"
      fill="none"
      stroke="url(#frRouteGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeDasharray="1"
      sx={{ animation: `${drawLine} 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s backwards` }}
    />

    {/* markers */}
    <circle cx="30" cy="210" r="6" fill="#33D6A6" />
    <Ring cx={30} cy={210} r={6} color="#33D6A6" />

    <circle cx="490" cy="55" r="6" fill="#33D6A6" />
    <Ring cx={490} cy={55} r={6} color="#33D6A6" delay={1.3} />

    <circle cx="120" cy="240" r="9" fill="#7C6CF0" stroke="#0A0E1C" strokeWidth="2" />
    <text x="120" y="243.5" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="700">P</text>
    <Ring cx={120} cy={240} color="#9D90FF" delay={0.6} />

    <circle cx="270" cy="95" r="4" fill="#fff" />
    <Ring cx={270} cy={95} r={7} color="#fff" delay={0.3} />
    <text x="270" y="64" fontSize="10" fill="rgba(255,255,255,0.75)" textAnchor="middle" fontWeight="600">
      Pickup point
    </text>

    {/* the rider, riding the route on a loop */}
    <g transform={reduce ? "translate(270 95)" : undefined}>
      <circle r="20" fill="rgba(51,214,166,0.18)">
        {!reduce && <animate attributeName="r" values="15;24;15" dur="2s" repeatCount="indefinite" />}
      </circle>
      <circle r="11" fill="#33D6A6" stroke="#0A0E1C" strokeWidth="2" />
      <text y="3.5" fontSize="10" fill="#0A0E1C" textAnchor="middle" fontWeight="700">R</text>
      {!reduce && <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE_PATH} calcMode="linear" />}
    </g>
  </svg>
);

/* ---- floating badge: outer = mouse parallax + hover pop, inner = idle float ---- */
const FloatingBadge = ({ position, depth, floatAnimation, children, maxWidth }) => {
  const move = `translate3d(calc(var(--nx, 0) * ${depth}px), calc(var(--ny, 0) * ${depth * 0.7}px), 0)`;
  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 3,
        ...position,
        transform: move,
        transition: `transform 260ms ease-out`,
        "&:hover": { transform: `${move} scale(1.06)` },
      }}
    >
      <Box
        sx={{
          animation: floatAnimation,
          bgcolor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 12px 24px rgba(20,20,40,0.14)",
          p: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          maxWidth,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const Hero = () => {
  const rootRef = useRef(null);
  const reduce = prefersReducedMotion();

  // Writes the pointer position into CSS variables on the hero. Everything that
  // reacts to the mouse (spotlight, card tilt, badge parallax) reads them in CSS,
  // so moving the mouse never triggers a React re-render.
  const handleMove = (e) => {
    const root = rootRef.current;
    if (!root || reduce) return;
    const r = root.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    root.style.setProperty("--mx", `${x}px`);
    root.style.setProperty("--my", `${y}px`);
    root.style.setProperty("--nx", ((x / r.width) * 2 - 1).toFixed(3));
    root.style.setProperty("--ny", ((y / r.height) * 2 - 1).toFixed(3));
  };

  const handleLeave = () => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--nx", "0");
    root.style.setProperty("--ny", "0");
  };

  const scrollToProcess = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      ref={rootRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 5, md: 6 },
        alignItems: "center",
        pt: { xs: 6, md: 9 },
        pb: { xs: 5, md: 7 },
      }}
    >
      <HeroBackdrop />

      {/* Left column */}
      <Box sx={{ position: "relative", zIndex: 1, flex: "0 0 48%", maxWidth: { md: "48%" } }}>
        <Pill
          sx={{
            bgcolor: "#fff",
            border: "1px solid #E6E8EF",
            color: "#3C4250",
            mb: "22px",
            animation: `${fadeUp} 600ms ${EASE} 60ms backwards`,
            transition: `transform 220ms ${EASE}, border-color 220ms ease, box-shadow 220ms ease`,
            "&:hover": {
              transform: "translateY(-2px)",
              borderColor: "#0E9F76",
              boxShadow: "0 8px 18px rgba(14,159,118,0.15)",
            },
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: "#0E9F76",
              animation: `${pulseDot} 2s ease-out infinite`,
            }}
          />
          <IconCheck size={13} />
          Verified Community Two-Wheeler Commuting
        </Pill>

        <Typography
          component="h1"
          sx={{
            fontFamily: pageFont,
            fontWeight: 800,
            fontSize: { xs: 38, sm: 46, lg: 58 },
            lineHeight: 1.12,
            color: "#12151A",
            letterSpacing: "-1px",
          }}
        >
          {HEADLINE.map((line, li) => (
            <Box component="span" key={li} sx={{ display: "block" }}>
              {line.words.map((word, wi) => (
                <HeadlineWord key={word} index={li * 2 + wi} accent={line.accent}>
                  {word}
                </HeadlineWord>
              ))}
            </Box>
          ))}
        </Typography>

        <Typography
          sx={{
            fontFamily: pageFont,
            fontSize: 15.5,
            lineHeight: 1.7,
            color: "#6A7182",
            mt: "22px",
            maxWidth: 430,
            animation: `${fadeUp} 700ms ${EASE} 750ms backwards`,
          }}
        >
          Connect with verified people travelling along the same route and make
          everyday commutes simpler, safer, and more connected. No detours, no
          surge pricing—just genuine shared corridors.
        </Typography>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mt: "28px", animation: `${fadeUp} 700ms ${EASE} 900ms backwards` }}
        >
          <Button
            component={RouterLink}
            to="/signin"
            sx={{
              position: "relative",
              overflow: "hidden",
              bgcolor: "#0B6B4F",
              color: "#fff",
              textTransform: "none",
              fontFamily: pageFont,
              fontWeight: 600,
              fontSize: 14.5,
              borderRadius: "10px",
              px: "22px",
              py: "11px",
              gap: "8px",
              boxShadow: "0 10px 22px rgba(11,107,79,0.30)",
              "&:hover": { bgcolor: "#08543D", boxShadow: "0 14px 28px rgba(11,107,79,0.40)" },
              // light sweep that glides across the button every few seconds
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "40%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                transform: "translateX(-130%) skewX(-20deg)",
                animation: `${sheen} 3.8s ease-in-out 2s infinite`,
                pointerEvents: "none",
              },
              "&:hover .fr-arrow": { transform: "translateX(6px)" },
            }}
          >
            Get Started{" "}
            <Box
              component="span"
              className="fr-arrow"
              sx={{ display: "inline-flex", transition: `transform 240ms ${EASE}` }}
            >
              <IconArrowRight />
            </Box>
          </Button>
          <Button
            onClick={scrollToProcess}
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
              py: "11px",
              gap: "8px",
              "&:hover": { bgcolor: "#F7F8FB", borderColor: "#0E9F76" },
              "&:hover .fr-play": { transform: "scale(1.18) rotate(360deg)" },
            }}
          >
            <Box
              component="span"
              className="fr-play"
              sx={{ display: "inline-flex", transition: `transform 600ms ${EASE}` }}
            >
              <IconPlay />
            </Box>{" "}
            How It Works
          </Button>
        </Stack>

        <Row
          spacing={1.2}
          sx={{ mt: "28px", flexWrap: "wrap", animation: `${fadeUp} 700ms ${EASE} 1050ms backwards` }}
        >
          <Stack
            direction="row"
            sx={{
              "& > div": {
                border: "2px solid #fff",
                ml: "-8px",
                transition: `margin 280ms ${EASE}, transform 220ms ${EASE}`,
              },
              "& > div:first-of-type": { ml: 0 },
              // the stack fans out when you hover it
              "&:hover > div:not(:first-of-type)": { ml: "3px" },
              "& > div:hover": { transform: "translateY(-4px) scale(1.12)", zIndex: 2 },
            }}
          >
            <Avatar sx={{ width: 26, height: 26, fontSize: 12, bgcolor: "#F2A65A" }}>RK</Avatar>
            <Avatar sx={{ width: 26, height: 26, fontSize: 12, bgcolor: "#7C6CF0" }}>SP</Avatar>
            <Avatar sx={{ width: 26, height: 26, fontSize: 12, bgcolor: "#0E9F76" }}>AM</Avatar>
          </Stack>
          <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, color: "#6A7182" }}>
            <Box component="span" sx={{ fontWeight: 700, color: "#151A21" }}>
              <Count to={25000} delay={900} duration={1800} />+
            </Box>{" "}
            shared corridors{" "}
            <Box component="span" sx={{ mx: "2px" }}>·</Box>{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "#151A21" }}>
              <Count to={99.8} decimals={1} delay={1000} duration={1800} />%
            </Box>{" "}
            verified{" "}
            <Box component="span" sx={{ mx: "2px" }}>·</Box> Zero detour guarantee
          </Typography>
        </Row>
      </Box>

      {/* Right column - live map card */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: { md: 720 },
          mt: { xs: 4, md: 0 },
          animation: `${fadeUp} 900ms ${EASE} 300ms backwards`,
        }}
      >
        {/* floating route-match badge */}
        <FloatingBadge
          position={{ top: -18, left: 8 }}
          depth={-16}
          floatAnimation="fr-float 6s ease-in-out infinite"
        >
          <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 18, color: "#0E9F76" }}>
            <Count to={88} delay={700} duration={1500} />%
          </Typography>
          <Box>
            <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 12.5, color: "#151A21" }}>
              Route Match: 88%
            </Typography>
            <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
              +3 min detour only
            </Typography>
            <Box sx={{ height: 4, borderRadius: 2, bgcolor: "#E4F6EE", mt: "6px", overflow: "hidden" }}>
              <Box
                sx={{
                  width: "88%",
                  height: "100%",
                  borderRadius: 2,
                  bgcolor: "#0E9F76",
                  transformOrigin: "left",
                  animation: `${growBar} 1500ms ${EASE} 700ms backwards`,
                }}
              />
            </Box>
          </Box>
        </FloatingBadge>

        {/* tilting dark map panel (data-no-lift: it tilts, so it must not also lift) */}
        <Box
          sx={{
            transform:
              "perspective(1100px) rotateY(calc(var(--nx, 0) * 6deg)) rotateX(calc(var(--ny, 0) * -5deg))",
            transition: "transform 240ms ease-out",
          }}
        >
          <Box
            data-no-lift
            sx={{
              position: "relative",
              borderRadius: "22px",
              overflow: "hidden",
              height: { xs: 320, md: 400 },
              background: "radial-gradient(120% 140% at 15% 15%, #251A45 0%, #0A0E1C 55%, #0A0E1C 100%)",
              p: "18px 20px",
              boxShadow: "0 24px 48px rgba(10,14,28,0.28)",
              transition: "box-shadow 300ms ease",
              "&:hover": {
                boxShadow: "0 28px 60px rgba(14,159,118,0.32), 0 0 0 1px rgba(51,214,166,0.35)",
              },
              // slowly panning street grid
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                backgroundSize: "44px 44px, 44px 44px",
                animation: `${gridPan} 8s linear infinite`,
                WebkitMaskImage: "radial-gradient(ellipse at 50% 55%, #000 35%, transparent 85%)",
                maskImage: "radial-gradient(ellipse at 50% 55%, #000 35%, transparent 85%)",
              },
            }}
          >
            {/* twinkling stars */}
            {STARS.map(([left, top, size, delay]) => (
              <Box
                key={`${left}-${top}`}
                sx={{
                  position: "absolute",
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  bgcolor: "#fff",
                  animation: `${twinkle} 3.2s ease-in-out ${delay}s infinite`,
                }}
              />
            ))}

            <Row
              justify="space-between"
              align="flex-start"
              wrap
              sx={{ position: "relative", zIndex: 2, gap: "8px" }}
            >
              <Pill sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 12, py: "5px" }}>
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: "#33D6A6",
                    animation: `${pulseDot} 1.8s ease-out infinite`,
                  }}
                />
                <StatusTicker />
              </Pill>
              <Pill sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 12, py: "5px" }}>
                <IconRoute size={13} color="#8CF0C9" /> Active Corridors: <LiveCorridors />
              </Pill>
            </Row>

            {/* route scene (drifts a little against the tilt for depth) */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "13%",
                bottom: "17%",
                px: "4px",
                transform: "translate3d(calc(var(--nx, 0) * 8px), calc(var(--ny, 0) * 6px), 0)",
                transition: "transform 260ms ease-out",
              }}
            >
              <RouteScene reduce={reduce} />
            </Box>

            <Box sx={{ position: "absolute", left: 20, bottom: 18, zIndex: 2 }}>
              <Row spacing={0.7}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#33D6A6" }} />
                <Typography sx={{ fontFamily: pageFont, fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  PNT Naka
                </Typography>
              </Row>
              <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "rgba(255,255,255,0.5)", pl: "14px" }}>
                Origin · 8:15 AM
              </Typography>
            </Box>

            <Box sx={{ position: "absolute", right: 20, bottom: 18, textAlign: "right", zIndex: 2 }}>
              <Typography sx={{ fontFamily: pageFont, fontSize: 12, fontWeight: 700, color: "#fff" }}>
                Madan Mahal Tech Hub
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* floating verified-community badge */}
        <FloatingBadge
          position={{ right: 12, bottom: -20 }}
          depth={18}
          floatAnimation="fr-float 7s ease-in-out -2s infinite"
          maxWidth={220}
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
              animation: `${pulseDot} 2.2s ease-out infinite`,
            }}
          >
            <IconCheck size={14} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 12, color: "#151A21" }}>
              Verified Community
            </Typography>
            <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
              Govt ID + Corp Email
            </Typography>
          </Box>
        </FloatingBadge>
      </Box>
    </Box>
  );
};

/* ---------------------------------------------------------------------- */
/*  Scroll animation helpers (used by every section below the hero)       */
/* ---------------------------------------------------------------------- */

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const spinSlow = keyframes`to { transform: rotate(360deg); }`;
const travelDot = keyframes`
  0%   { top: 0; opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { top: calc(100% - 8px); opacity: 0; }
`;
const sosPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(225, 83, 102, 0.45); transform: scale(1); }
  60%  { box-shadow: 0 0 0 10px rgba(225, 83, 102, 0); transform: scale(1.12); }
  100% { box-shadow: 0 0 0 0 rgba(225, 83, 102, 0); transform: scale(1); }
`;
const flowDash = keyframes`to { stroke-dashoffset: -64; }`;

// keeps the card lift from index.css working while we also animate border colour
const CARD_TRANSITION =
  "border-color 260ms ease, transform var(--motion-base) var(--motion-ease), filter var(--motion-base) var(--motion-ease)";

// put on a row of cards: the 2nd and 3rd card reveal a beat after the 1st
const staggerRow = {
  "& > *:nth-of-type(2)": { "--stagger": "130ms" },
  "& > *:nth-of-type(3)": { "--stagger": "260ms" },
};

// true once the element has scrolled into view (and stays true)
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, shown];
}

// Wraps one card: rises + fades in when scrolled to. Delay comes from staggerRow.
const RevealItem = ({ children }) => {
  const [ref, shown] = useInView(0.12);
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flex: 1,
        minWidth: 0,
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(34px) scale(0.97)",
        transition: `opacity 700ms ease, transform 800ms ${EASE}`,
        transitionDelay: "var(--stagger, 0ms)",
      }}
    >
      {children}
    </Box>
  );
};

// Number that counts up the moment it scrolls into view
const CountOnView = (props) => {
  const [ref, shown] = useInView(0.4);
  return (
    <Box component="span" ref={ref}>
      <Count {...props} start={shown} />
    </Box>
  );
};

/* ---- stat visuals: each card gets its own animated picture ---- */

const leafRise = keyframes`
  0%   { transform: translateY(12px) rotate(0deg); opacity: 0; }
  20%  { opacity: 0.9; }
  100% { transform: translateY(-58px) rotate(45deg); opacity: 0; }
`;
const pipWave = keyframes`
  0%, 100% { transform: scaleY(0.78); }
  50%      { transform: scaleY(1.1); }
`;

// Savings: bars that grow in one after another (decorative "growing savings")
const SAVINGS_BARS = [26, 34, 31, 42, 47, 45, 57, 64];
const BarsVisual = ({ color }) => {
  const [ref, shown] = useInView(0.4);
  return (
    <Box ref={ref} sx={{ display: "flex", alignItems: "flex-end", gap: "7px", height: 64, mt: "20px" }}>
      {SAVINGS_BARS.map((h, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: h,
            bgcolor: color,
            opacity: 0.28 + i * 0.1,
            borderRadius: "6px 6px 3px 3px",
            transformOrigin: "bottom",
            transform: shown ? "scaleY(1)" : "scaleY(0)",
            transition: `transform 700ms ${EASE} ${i * 90}ms, opacity 250ms ease`,
            "&:hover": { opacity: 1 },
          }}
        />
      ))}
    </Box>
  );
};

// Emissions: a ring that fills to the percentage, with leaves drifting up beside it
const LEAVES = [[8, 0, 3.4], [30, 1.1, 4], [54, 0.5, 3.6], [78, 1.8, 4.2]];
const RingVisual = ({ color, percent }) => {
  const [ref, shown] = useInView(0.4);
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <Box ref={ref} sx={{ display: "flex", alignItems: "center", gap: "18px", height: 64, mt: "20px" }}>
      <Box sx={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="32" cy="32" r={R} fill="none" stroke={`${color}22`} strokeWidth="7" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={shown ? C * (1 - percent / 100) : C}
            style={{ transition: `stroke-dashoffset 1600ms ${EASE} 300ms` }}
          />
        </svg>
        <Box sx={{ position: "absolute", top: 23, left: 23 }}>
          <IconLeaf size={18} color={color} />
        </Box>
      </Box>
      <Box sx={{ position: "relative", flex: 1, height: 64, overflow: "hidden" }}>
        {LEAVES.map(([left, delay, dur]) => (
          <Box
            key={left}
            sx={{
              position: "absolute",
              bottom: 0,
              left: `${left}%`,
              opacity: 0,
              animation: `${leafRise} ${dur}s ease-in ${delay}s infinite`,
            }}
          >
            <IconLeaf size={14} color={color} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Trust score: a level meter that lights up pip by pip, then keeps a gentle wave going
const PipsVisual = ({ color, percent }) => {
  const [ref, shown] = useInView(0.4);
  const total = 40;
  const lit = Math.round((percent / 100) * total);
  return (
    <Box ref={ref} sx={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 64, mt: "20px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: 22 + (Math.sin(i * 0.5) + 1) * 14,
            borderRadius: "3px",
            bgcolor: shown && i < lit ? color : "#E4E6EE",
            transformOrigin: "bottom",
            transition: `background-color 300ms ease ${i * 28}ms`,
            animation: `${pipWave} 2.6s ease-in-out ${i * 0.07}s infinite`,
          }}
        />
      ))}
    </Box>
  );
};

// Thin bar under the navbar that fills as you scroll down the page
const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <Box
      ref={barRef}
      aria-hidden="true"
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: 3,
        transformOrigin: "left",
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, #0E9F76, #33D6A6, #5B4CF0)",
        pointerEvents: "none",
      }}
    />
  );
};

/* ---------------------------------------------------------------------- */
/*  Feature cards row                                                     */
/* ---------------------------------------------------------------------- */

const tilePing = keyframes`
  0%       { transform: scale(1); opacity: 0.5; }
  70%, 100%{ transform: scale(1.55); opacity: 0; }
`;
const checkDraw = keyframes`
  0%, 10%  { stroke-dashoffset: 1; }
  35%, 85% { stroke-dashoffset: 0; }
  100%     { stroke-dashoffset: 1; }
`;
const shackleOpen = keyframes`
  0%, 55%, 100% { transform: translateY(0) rotate(0deg); }
  65%, 85%      { transform: translateY(-2.5px) rotate(-18deg); }
`;
const ecgScroll = keyframes`to { transform: translateX(-120px); }`;

/* ---- animated icons: each one idles with a motion that explains it ---- */

// shield whose check keeps drawing itself
const AnimatedShield = ({ size = 20, color = "#0E9F76" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l8 3.5v6c0 5-3.4 8.7-8 10.5-4.6-1.8-8-5.5-8-10.5v-6L12 2z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <Box
      component="path"
      d="M8.5 12.2l2.4 2.4 4.6-5"
      pathLength="1"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1"
      sx={{ animation: `${checkDraw} 4s ease-in-out infinite` }}
    />
  </svg>
);

// route triangle with a dot travelling around it
const AnimatedRoute = ({ size = 20, color = "#5B4CF0" }) => {
  const reduce = prefersReducedMotion();
  const path = "M12 2l9 18H3L12 2z";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d={path} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <circle r="2.2" fill={color} cx={reduce ? 12 : undefined} cy={reduce ? 2 : undefined}>
        {!reduce && <animateMotion dur="3.6s" repeatCount="indefinite" path={path} />}
      </circle>
    </svg>
  );
};

// lock whose shackle pops open for a moment
const AnimatedLock = ({ size = 20, color = "#D98A2B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8" />
    <Box
      component="path"
      d="M8 10V7a4 4 0 018 0v3"
      stroke={color}
      strokeWidth="1.8"
      sx={{
        transformBox: "fill-box",
        transformOrigin: "0% 100%",
        animation: `${shackleOpen} 4s ease-in-out infinite`,
      }}
    />
    <circle cx="12" cy="15" r="1.4" fill={color} />
  </svg>
);

/* ---- one small live demo per card ---- */

// 1) identity checks switch on one after another
const VERIFY_ITEMS = ["Aadhaar", "Work email", "Selfie"];
const VerifiedVisual = () => {
  const [ref, shown] = useInView(0.4);
  return (
    <Box ref={ref} sx={{ mt: "auto", pt: "8px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {VERIFY_ITEMS.map((label, i) => {
        const delay = 500 + i * 450;
        return (
          <Box
            key={label}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: "10px",
              py: "5px",
              borderRadius: "999px",
              fontFamily: pageFont,
              fontSize: 12,
              fontWeight: 600,
              bgcolor: shown ? "#E4F6EE" : "#F2F3F8",
              color: shown ? "#0B7A5A" : "#8A9099",
              border: `1px solid ${shown ? "#BFE8D8" : "#E6E8EF"}`,
              transition: `background-color 300ms ease ${delay}ms, color 300ms ease ${delay}ms, border-color 300ms ease ${delay}ms`,
              animation: shown ? `${dayPop} 500ms ${EASE} ${delay}ms backwards` : "none",
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                overflow: "hidden",
                width: shown ? 19 : 0,
                opacity: shown ? 1 : 0,
                transition: `width 300ms ease ${delay}ms, opacity 300ms ease ${delay}ms`,
              }}
            >
              <Box component="span" sx={{ display: "inline-flex", pr: "6px" }}>
                <IconCheck size={13} color="#0E9F76" />
              </Box>
            </Box>
            {label}
          </Box>
        );
      })}
    </Box>
  );
};

// 2) two riders' routes draw in, merge, and the shared stretch lights up
const SHARED_ROUTE = "M100 26 C 150 20, 200 38, 254 10";
const OverlapVisual = () => {
  const [ref, shown] = useInView(0.4);
  const draw = (delay, dur = 1100) => ({
    strokeDasharray: "1",
    strokeDashoffset: shown ? "0" : "1",
    transition: `stroke-dashoffset ${dur}ms ${EASE} ${delay}ms`,
  });
  return (
    <Box ref={ref} sx={{ mt: "auto", pt: "8px" }}>
      <Box sx={{ bgcolor: "#F7F8FB", borderRadius: "10px", p: "8px 12px 8px" }}>
        <svg viewBox="0 0 260 60" width="100%" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
          <Box component="path" d="M6 52 C 50 52, 70 30, 100 26" pathLength="1" fill="none" stroke="#9D90FF" strokeWidth="2.5" strokeLinecap="round" sx={draw(300)} />
          <Box component="path" d="M6 8 C 50 8, 70 22, 100 26" pathLength="1" fill="none" stroke="#F2A65A" strokeWidth="2.5" strokeLinecap="round" sx={draw(600)} />
          <Box component="path" d={SHARED_ROUTE} pathLength="1" fill="none" stroke="#33D6A6" strokeOpacity="0.3" strokeWidth="9" strokeLinecap="round" sx={draw(1500, 1200)} />
          <Box component="path" d={SHARED_ROUTE} pathLength="1" fill="none" stroke="#0E9F76" strokeWidth="3" strokeLinecap="round" sx={draw(1500, 1200)} />
          <circle cx="6" cy="52" r="4" fill="#9D90FF" />
          <circle cx="6" cy="8" r="4" fill="#F2A65A" />
          <Box
            component="circle"
            cx="100"
            cy="26"
            r="4"
            fill="#fff"
            stroke="#0E9F76"
            strokeWidth="2"
            sx={{ opacity: shown ? 1 : 0, transition: "opacity 300ms ease 1400ms" }}
          />
          <circle cx="254" cy="10" r="5" fill="#0E9F76" />
          {shown && <Ring cx={254} cy={10} r={5} color="#0E9F76" delay={2.6} />}
        </svg>
        <Row justify="space-between" sx={{ mt: "4px" }}>
          <Typography sx={{ fontFamily: pageFont, fontSize: 11.5, color: "#8A9099" }}>Shared corridor</Typography>
          <Typography sx={{ fontFamily: pageFont, fontSize: 12, fontWeight: 700, color: "#0E9F76" }}>
            <CountOnView to={88} duration={1400} delay={1500} />% overlap
          </Typography>
        </Row>
      </Box>
    </Box>
  );
};

// 3) a live heartbeat line for the trip, plus the dual-helmet check
const ECG_PATH = Array.from({ length: 4 }, (_, i) => {
  const o = i * 120;
  return `${i ? "" : "M0 20 "}H${o + 34} L${o + 40} 20 L${o + 46} 6 L${o + 54} 34 L${o + 62} 14 L${o + 68} 20 H${o + 120}`;
}).join(" ");

const MonitorVisual = () => {
  const [ref, shown] = useInView(0.4);
  const fade = "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)";
  return (
    <Box ref={ref} sx={{ mt: "auto", pt: "8px" }}>
      <Box sx={{ bgcolor: "#F7F8FB", borderRadius: "10px", p: "10px 12px 6px" }}>
        <Row justify="space-between" wrap sx={{ gap: "6px" }}>
          <Row spacing={0.8}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#D98A2B",
                animation: shown ? `${pulseDot} 1.6s ease-out infinite` : "none",
              }}
            />
            <Typography sx={{ fontFamily: pageFont, fontSize: 12, fontWeight: 600, color: "#151A21" }}>
              Live trip
            </Typography>
          </Row>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              px: "9px",
              py: "3px",
              borderRadius: "999px",
              fontFamily: pageFont,
              fontSize: 11.5,
              fontWeight: 700,
              bgcolor: "#FBEAD6",
              color: "#A8651A",
              opacity: shown ? 1 : 0,
              transition: "opacity 400ms ease 600ms",
              animation: shown ? `${dayPop} 500ms ${EASE} 600ms backwards` : "none",
            }}
          >
            <IconCheck size={11} color="#A8651A" /> Helmets 2/2
          </Box>
        </Row>
        <Box
          sx={{
            overflow: "hidden",
            mt: "4px",
            WebkitMaskImage: fade,
            maskImage: fade,
          }}
        >
          <svg viewBox="0 0 240 40" width="100%" height="34" preserveAspectRatio="none" style={{ display: "block" }} aria-hidden="true">
            <Box component="g" sx={{ animation: shown ? `${ecgScroll} 2.4s linear infinite` : "none" }}>
              <path d={ECG_PATH} fill="none" stroke="#D98A2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Box>
          </svg>
        </Box>
      </Box>
    </Box>
  );
};

const FeatureRow = () => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2.5}
    sx={{ mt: { xs: 3, md: 5 }, ...staggerRow }}
  >
    <FeatureCard
      accent="#0E9F76"
      iconBg="#E4F6EE"
      icon={<AnimatedShield color="#0E9F76" />}
      title="Verified Members"
      desc="Identity-focused verification. Aadhaar and work email verified commuters only."
      visual={<VerifiedVisual />}
      pingDelay={0}
    />
    <FeatureCard
      accent="#5B4CF0"
      iconBg="#EAE7FC"
      icon={<AnimatedRoute color="#5B4CF0" />}
      title="Route-Based Matching"
      desc="Find people travelling your way. Instant corridor overlap calculation with minimal detours."
      visual={<OverlapVisual />}
      pingDelay={1.1}
    />
    <FeatureCard
      accent="#D98A2B"
      iconBg="#FBEAD6"
      icon={<AnimatedLock color="#D98A2B" />}
      title="Safety First"
      desc="Designed around safer shared commutes. Live ride monitoring, emergency SOS, and dual helmet checks."
      visual={<MonitorVisual />}
      pingDelay={2.2}
    />
  </Stack>
);

/* ---------------------------------------------------------------------- */
/*  Process section                                                       */
/* ---------------------------------------------------------------------- */

/* ---- Process: one route that links the three steps ----------------------- */

const SEG = 1400; // ms the route takes to travel from one step to the next
const RAIL_INSET = "calc((100% - 40px) / 6)"; // centre of the first / last column

const otpPop = keyframes`
  0%, 6%   { opacity: 0; transform: scale(0.5); }
  12%      { opacity: 1; transform: scale(1.25); }
  18%, 80% { opacity: 1; transform: scale(1); }
  92%, 100%{ opacity: 0; transform: scale(0.8); }
`;
const dayPop = keyframes`
  0%   { transform: scale(0.6); }
  60%  { transform: scale(1.25); }
  100% { transform: scale(1); }
`;
const railDot = keyframes`
  0%   { left: 0%; opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { left: 100%; opacity: 0; }
`;
const roadRun = keyframes`
  0%   { left: 0; opacity: 0; }
  12%  { opacity: 1; }
  88%  { opacity: 1; }
  100% { left: calc(100% - 10px); opacity: 0; }
`;

const PROCESS_ACCENTS = ["#0E9F76", "#5B4CF0", "#0E9F76"];

// A line under the title that draws itself, like a route being planned
const TitleRoute = () => {
  const [ref, shown] = useInView(0.6);
  return (
    <Box ref={ref} aria-hidden="true" sx={{ display: "flex", justifyContent: "center", mt: "10px", height: 14 }}>
      <svg width="220" height="14" viewBox="0 0 220 14" fill="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="frTitleRoute" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0E9F76" />
            <stop offset="1" stopColor="#5B4CF0" />
          </linearGradient>
        </defs>
        <Box
          component="path"
          d="M4 9 C 40 2, 70 12, 110 7 S 180 2, 214 8"
          pathLength="1"
          stroke="url(#frTitleRoute)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1"
          sx={{
            strokeDashoffset: shown ? "0" : "1",
            transition: `stroke-dashoffset 1400ms ${EASE} 300ms`,
          }}
        />
        <Box
          component="circle"
          cx="214"
          cy="8"
          r="4"
          fill="#5B4CF0"
          sx={{
            opacity: shown ? 1 : 0,
            transition: "opacity 300ms ease 1500ms",
          }}
        />
      </svg>
    </Box>
  );
};

// The track above the cards: a route fills left to right and each step "checks in"
// as it arrives. Hovering a card enlarges its stop.
const JourneyTrack = ({ shown, hovered }) => (
  <Box
    aria-hidden="true"
    sx={{
      display: { xs: "none", md: "grid" },
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      columnGap: "20px",
      position: "relative",
      height: 40,
      mt: 5,
      mb: "14px",
    }}
  >
    {/* dashed rail */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: RAIL_INSET,
        right: RAIL_INSET,
        borderTop: "2px dashed #CBD0DB",
        transform: "translateY(-1px)",
      }}
    />
    {/* progress line */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: RAIL_INSET,
        right: RAIL_INSET,
        height: 3,
        mt: "-1.5px",
        borderRadius: 2,
        background: "linear-gradient(90deg, #0E9F76, #5B4CF0, #0E9F76)",
        transformOrigin: "left",
        transform: shown ? "scaleX(1)" : "scaleX(0)",
        transition: `transform ${SEG * 2}ms linear`,
      }}
    />
    {/* a glowing rider that keeps travelling the finished route */}
    <Box sx={{ position: "absolute", top: "50%", left: RAIL_INSET, right: RAIL_INSET, height: 0 }}>
      <Box
        sx={{
          position: "absolute",
          top: -6,
          ml: "-6px",
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: "#fff",
          border: "3px solid #0E9F76",
          boxShadow: "0 0 0 4px rgba(14,159,118,0.18), 0 4px 10px rgba(14,159,118,0.4)",
          opacity: 0,
          animation: shown ? `${railDot} 4.2s ease-in-out ${SEG * 2 + 400}ms infinite` : "none",
        }}
      />
    </Box>

    {PROCESS_ACCENTS.map((accent, i) => {
      const delay = i * SEG;
      return (
        <Box
          key={i}
          sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box
            sx={{
              position: "relative",
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: shown ? accent : "#fff",
              border: `2px solid ${accent}`,
              boxShadow: shown ? `0 6px 14px ${accent}55` : "none",
              transform: hovered === i ? "scale(1.25)" : "scale(1)",
              transition: `background-color 350ms ease ${delay}ms, box-shadow 350ms ease ${delay}ms, transform 300ms ${EASE}`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: "-2px",
                borderRadius: "50%",
                border: `2px solid ${accent}`,
                opacity: 0,
                animation: shown ? `${ringOut} 2.8s ease-out ${(delay + 500) / 1000}s infinite` : "none",
              }}
            />
            <Box
              sx={{
                display: "inline-flex",
                opacity: shown ? 1 : 0,
                transform: shown ? "scale(1)" : "scale(0.4)",
                transition: `opacity 250ms ease ${delay + 150}ms, transform 400ms ${EASE} ${delay + 150}ms`,
              }}
            >
              <IconCheck size={14} color="#fff" />
            </Box>
          </Box>
        </Box>
      );
    })}
  </Box>
);

/* ---- Process: the three live mini-demos ---------------------------------- */

const DemoPanel = ({ children, sx }) => (
  <Box sx={{ bgcolor: "#F7F8FB", borderRadius: "10px", p: "12px 14px", mt: "4px", ...sx }}>{children}</Box>
);

// Text that types itself in, one character at a time
const Wipe = ({ shown, delay, chars, children }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      whiteSpace: "nowrap",
      clipPath: shown ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
      transition: `clip-path ${chars * 45}ms steps(${chars}, end) ${delay}ms`,
    }}
  >
    {children}
  </Box>
);

// Step 1: the two places type in, a dot travels between them, then the weekdays switch on
const WEEKDAYS = ["M", "T", "W", "T", "F"];
const RouteDemo = () => {
  const [ref, shown] = useInView(0.4);
  return (
    <Box ref={ref}>
      <DemoPanel>
        <Row spacing={1}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#0E9F76" }} />
          <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, color: "#151A21", fontWeight: 600 }}>
            <Wipe shown={shown} delay={300} chars={24}>South Extn. Metro, Gate 2</Wipe>
          </Typography>
        </Row>
        {/* dashed link with a dot travelling from start to destination */}
        <Box sx={{ position: "relative", height: 22, ml: "3px", borderLeft: "2px dashed #CBD0DB" }}>
          <Box
            sx={{
              position: "absolute",
              left: "-5px",
              top: 0,
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#0E9F76",
              opacity: 0,
              animation: shown ? `${travelDot} 2.2s ease-in-out 1.4s infinite` : "none",
            }}
          />
        </Box>
        <Row spacing={1}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#7C6CF0" }} />
          <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, color: "#151A21", fontWeight: 600 }}>
            <Wipe shown={shown} delay={1500} chars={18}>Cyber Park Tower B</Wipe>
          </Typography>
        </Row>
      </DemoPanel>

      <Row justify="space-between" sx={{ mt: "12px" }}>
        <Box sx={{ display: "flex", gap: "6px" }}>
          {WEEKDAYS.map((d, i) => {
            const delay = 2600 + i * 140;
            return (
              <Box
                key={i}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: pageFont,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: shown ? "#0E9F76" : "#EEF0F6",
                  color: shown ? "#fff" : "#8A9099",
                  transition: `background-color 300ms ease ${delay}ms, color 300ms ease ${delay}ms`,
                  animation: shown ? `${dayPop} 500ms ${EASE} ${delay}ms backwards` : "none",
                }}
              >
                {d}
              </Box>
            );
          })}
        </Box>
        <Typography
          sx={{
            fontFamily: pageFont,
            fontSize: 12,
            fontWeight: 600,
            color: "#5B6472",
            opacity: shown ? 1 : 0,
            transition: "opacity 400ms ease 3400ms",
          }}
        >
          8:15 AM
        </Typography>
      </Row>
    </Box>
  );
};

// Step 2: a "searching" skeleton resolves into the matched rider, and the shared corridor fills in
const MatchDemo = () => {
  const [ref, shown] = useInView(0.4);
  return (
    <Box ref={ref}>
      <DemoPanel sx={{ position: "relative", overflow: "hidden" }}>
        <Row justify="space-between">
          <Row spacing={1}>
            <Avatar sx={{ width: 26, height: 26, fontSize: 12, bgcolor: "#0E9F76" }}>AS</Avatar>
            <Box>
              <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, fontWeight: 700, color: "#151A21" }}>
                Arjun S.
              </Typography>
              <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
                TCS · 4.9 ★
              </Typography>
            </Box>
          </Row>
          <Pill sx={{ bgcolor: "#E4F6EE", color: "#0E9F76", fontSize: 12, py: "4px", px: "9px" }}>
            <span>
              <CountOnView to={92} duration={1400} delay={1200} />% match
            </span>
          </Pill>
        </Row>

        {/* two routes, and how much of them is shared */}
        <Box sx={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", bgcolor: "#E2DEFB", mt: "12px" }}>
          <Box sx={{ width: "8%" }} />
          <Box
            sx={{
              flex: 1,
              bgcolor: "#0E9F76",
              transformOrigin: "left",
              transform: shown ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 1400ms ${EASE} 1200ms`,
            }}
          />
        </Box>

        <Row justify="space-between" sx={{ mt: "8px" }}>
          <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
            Honda H'ness CB350
          </Typography>
          <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
            +2 min detour
          </Typography>
        </Row>

        {/* "searching" skeleton that fades away once the match is found */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            overflow: "hidden",
            bgcolor: "#F7F8FB",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "9px",
            p: "14px",
            pointerEvents: "none",
            opacity: shown ? 0 : 1,
            transition: "opacity 450ms ease 1000ms",
          }}
        >
          <Box sx={{ height: 10, width: "55%", borderRadius: "5px", bgcolor: "#E6E8F0" }} />
          <Box sx={{ height: 8, width: "35%", borderRadius: "4px", bgcolor: "#E6E8F0" }} />
          <Typography sx={{ fontFamily: pageFont, fontSize: 11.5, color: "#8A9099", mt: "2px" }}>
            Matching riders on your corridor…
          </Typography>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "40%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              animation: `${sheen} 1.4s ease-in-out infinite`,
            }}
          />
        </Box>
      </DemoPanel>
    </Box>
  );
};

// Step 3: the OTP is keyed in digit by digit while a rider heads for the drop-off
const OTP_DIGITS = ["4", "2", "8", "1"];
const TravelDemo = () => {
  const [ref, shown] = useInView(0.4);
  return (
    <Box ref={ref}>
      <DemoPanel>
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
                animation: `${pulseDot} 2.2s ease-out infinite`,
              }}
            >
              <IconCheck size={12} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: pageFont, fontSize: 12.5, fontWeight: 700, color: "#151A21" }}>
                Ready to Roll
              </Typography>
              <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
                OTP &amp; Helmet Verified
              </Typography>
            </Box>
          </Row>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontFamily: pageFont, fontSize: 13, fontWeight: 800, color: "#151A21" }}>
              ₹<CountOnView to={45} />
            </Typography>
            <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
              Fuel share
            </Typography>
          </Box>
        </Row>

        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mt: "14px" }}>
          <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099", mr: "4px" }}>OTP</Typography>
          {OTP_DIGITS.map((d, i) => (
            <Box
              key={i}
              sx={{
                width: 24,
                height: 28,
                borderRadius: "7px",
                border: "1px solid #D5D9E4",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: pageFont,
                fontWeight: 800,
                fontSize: 13,
                color: "#151A21",
              }}
            >
              <Box
                component="span"
                sx={{
                  opacity: 0,
                  animation: shown ? `${otpPop} 7s ease-in-out ${0.4 + i * 0.45}s infinite` : "none",
                }}
              >
                {d}
              </Box>
            </Box>
          ))}
        </Box>

        {/* the ride itself: a dot heading for the drop-off */}
        <Box sx={{ position: "relative", height: 14, mt: "14px" }}>
          <Box sx={{ position: "absolute", top: "50%", left: 0, right: 0, borderTop: "2px dashed #CBD0DB" }} />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              mt: "-5px",
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#0E9F76",
              boxShadow: "0 0 0 4px rgba(14,159,118,0.2)",
              opacity: 0,
              animation: shown ? `${roadRun} 3.6s ease-in-out infinite` : "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              mt: "-5px",
              width: 10,
              height: 10,
              borderRadius: "3px",
              bgcolor: "#7C6CF0",
            }}
          />
        </Box>
      </DemoPanel>
    </Box>
  );
};

/* ---- Process: card shell (cursor glow + 3D tilt) and the section --------- */

const ProcessCard = (props) => (
  <RevealItem>
    <ProcessCardBody {...props} />
  </RevealItem>
);

const ProcessCardBody = ({ index, onHover, number, iconBg, icon, title, desc, children, accent = "#0E9F76" }) => {
  // pointer position goes into CSS variables (no re-render): the glow follows the
  // cursor and the card tilts towards it
  const handleMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--sx", `${x}px`);
    el.style.setProperty("--sy", `${y}px`);
    el.style.setProperty("--tx", ((x / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--ty", ((y / r.height) * 2 - 1).toFixed(3));
  };
  const handleLeave = (e) => {
    e.currentTarget.style.setProperty("--tx", "0");
    e.currentTarget.style.setProperty("--ty", "0");
    if (onHover) onHover(null);
  };

  return (
    <Box
      data-no-lift
      onMouseMove={handleMove}
      onMouseEnter={() => onHover && onHover(index)}
      onMouseLeave={handleLeave}
      sx={{
        position: "relative",
        overflow: "hidden",
        flex: 1,
        bgcolor: "#fff",
        borderRadius: "18px",
        border: "1px solid #ECEDF3",
        p: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transform:
          "perspective(900px) translateY(var(--lift, 0px)) rotateY(calc(var(--tx, 0) * 5deg)) rotateX(calc(var(--ty, 0) * -4deg))",
        transition: "border-color 260ms ease, box-shadow 300ms ease, transform 220ms ease-out",
        "& > *": { position: "relative", zIndex: 1 },
        // soft glow that follows the mouse
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 300ms ease",
          background: `radial-gradient(300px circle at var(--sx, 50%) var(--sy, 0%), ${accent}1F, transparent 70%)`,
        },
        // accent bar sweeps along the bottom on hover
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 3,
          background: accent,
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: `transform 480ms ${EASE}`,
        },
        "&:hover": {
          "--lift": "-6px",
          borderColor: accent,
          boxShadow: `0 22px 40px ${accent}26`,
        },
        "&:hover::before": { opacity: 1 },
        "&:hover::after": { transform: "scaleX(1)" },
        "&:hover .fr-num": { color: accent, transform: "translateX(4px)" },
        "&:hover .fr-icon": { transform: "scale(1.12) rotate(-8deg)" },
      }}
    >
      <Row justify="space-between" align="flex-start">
        <Typography
          className="fr-num"
          sx={{
            fontFamily: pageFont,
            fontWeight: 800,
            fontSize: 30,
            color: "#DDE0E8",
            transition: `color 300ms ease, transform 300ms ${EASE}`,
          }}
        >
          {number}
        </Typography>
        <Box
          className="fr-icon"
          sx={{
            transition: `transform 300ms ${EASE}`,
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
};

const ProcessSection = () => {
  const [ref, shown] = useInView(0.2);
  const [hovered, setHovered] = useState(null);

  return (
    <Box
      id="how-it-works"
      sx={{
        position: "relative",
        isolation: "isolate",
        py: { xs: 7, md: 10 },
        textAlign: "center",
        scrollMarginTop: "72px",
      }}
    >
      {/* two slow colour blobs drifting behind the section */}
      <Box
        aria-hidden="true"
        sx={{ position: "absolute", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "28%",
            left: "-6%",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,159,118,0.10), transparent 65%)",
            animation: `${blobA} 16s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-4%",
            right: "-6%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,108,240,0.12), transparent 65%)",
            animation: `${blobB} 19s ease-in-out infinite`,
          }}
        />
      </Box>

      <Reveal>
        <Pill sx={{ bgcolor: "#EEF0F6", color: "#5B6472", mb: "18px" }}>PROCESS</Pill>
        <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: { xs: 26, md: 34 }, color: "#12151A" }}>
          Simple, Predictable Commuting
        </Typography>
        <TitleRoute />
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
      </Reveal>

      <Box ref={ref}>
        <JourneyTrack shown={shown} hovered={hovered} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          sx={{ mt: { xs: 5, md: 0 }, textAlign: "left", ...staggerRow }}
        >
          <ProcessCard
            index={0}
            onHover={setHovered}
            accent="#0E9F76"
            number="01"
            iconBg="#E4F6EE"
            icon={<IconShieldPlus size={18} />}
            title="Set Your Route"
            desc="Tell FriendRide where you're starting and where you're going. Choose your regular morning or evening schedule."
          >
            <RouteDemo />
          </ProcessCard>

          <ProcessCard
            index={1}
            onHover={setHovered}
            accent="#5B4CF0"
            number="02"
            iconBg="#EAE7FC"
            icon={<IconNetwork size={18} />}
            title="Find a Match"
            desc="Discover compatible people travelling along the same corridor with transparent detour metrics and profile verification."
          >
            <MatchDemo />
          </ProcessCard>

          <ProcessCard
            index={2}
            onHover={setHovered}
            accent="#0E9F76"
            number="03"
            iconBg="#E4F6EE"
            icon={<IconLoop size={18} />}
            title="Travel Together"
            desc="Connect, coordinate pickup, and complete your shared commute with shared fuel contributions and peace of mind."
          >
            <TravelDemo />
          </ProcessCard>
        </Stack>
      </Box>
    </Box>
  );
};

/* ---------------------------------------------------------------------- */
/*  Safety section                                                        */
/* ---------------------------------------------------------------------- */

const SafetyCard = (props) => (
  <RevealItem>
    <SafetyCardBody {...props} />
  </RevealItem>
);

const SafetyCardBody = ({ icon, title, desc, accent = "#33D6A6", visual }) => {
  // cursor-follow glow: pointer position goes into CSS variables (no re-render)
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <Box
      className="hover-lift"
      onMouseMove={handleMove}
      sx={{
        position: "relative",
        overflow: "hidden",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        borderRadius: "20px",
        p: "24px",
        bgcolor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: `${CARD_TRANSITION}, background-color 300ms ease`,
        "& > *": { position: "relative", zIndex: 1 },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 300ms ease",
          background: `radial-gradient(300px circle at var(--sx, 50%) var(--sy, 0%), ${accent}33, transparent 70%)`,
        },
        "&:hover": { borderColor: accent, bgcolor: "rgba(255,255,255,0.09)" },
        "&:hover::before": { opacity: 1 },
        "&:hover .fr-icon": { transform: "scale(1.12) rotate(-8deg)" },
      }}
    >
      <Box
        className="fr-icon"
        sx={{
          transition: `transform 300ms ${EASE}`,
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: `${accent}26`,
          border: `1px solid ${accent}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontFamily: pageFont, fontWeight: 700, fontSize: 17, color: "#fff" }}>
        {title}
      </Typography>
      <Typography sx={{ fontFamily: pageFont, fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.66)" }}>
        {desc}
      </Typography>
      {visual}
    </Box>
  );
};

/* ---- Safety section: radar shield + one live mini-demo per card ---- */

const spinRev = keyframes`to { transform: rotate(-360deg); }`;
const radarPulse = keyframes`
  0%   { transform: scale(0.25); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0; }
`;
const scanDown = keyframes`
  0%   { transform: translateY(-120%); }
  100% { transform: translateY(520%); }
`;
const checkCycle = keyframes`
  0%, 8%   { opacity: 0.25; transform: scale(0.6); }
  16%      { opacity: 1; transform: scale(1.25); }
  24%, 86% { opacity: 1; transform: scale(1); }
  100%     { opacity: 0.25; transform: scale(0.6); }
`;
const sosWave = keyframes`
  0%   { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(2.6); opacity: 0; }
`;

const RADAR_SIZE = 230;
const SATELLITES = [
  { angle: 0, node: <IconIdCard size={16} color="#8CF0C9" /> },
  { angle: 120, node: <IconTarget size={16} color="#B9B1FF" /> },
  {
    angle: 240,
    node: (
      <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 9, color: "#FF8A99" }}>SOS</Typography>
    ),
  },
];

// Shield in the middle of a radar: sweep, expanding pulses, and three icons orbiting it
const ShieldRadar = () => (
  <Box
    aria-hidden="true"
    sx={{
      position: "relative",
      width: RADAR_SIZE,
      height: RADAR_SIZE,
      flexShrink: 0,
      display: { xs: "none", md: "block" },
    }}
  >
    {[100, 72, 46].map((p) => (
      <Box
        key={p}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${p}%`,
          height: `${p}%`,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px solid rgba(51,214,166,0.22)",
        }}
      />
    ))}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: "conic-gradient(from 0deg, rgba(51,214,166,0.38), rgba(51,214,166,0) 28%)",
        animation: `${spinSlow} 5s linear infinite`,
      }}
    />
    {[0, 1.5].map((d) => (
      <Box
        key={d}
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "2px solid rgba(51,214,166,0.5)",
          animation: `${radarPulse} 3s ease-out ${d}s infinite`,
        }}
      />
    ))}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 88,
        height: 88,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 30% 25%, #1C6B58, #0B3B34)",
        border: "1px solid rgba(140,240,201,0.45)",
        boxShadow: "0 0 40px rgba(51,214,166,0.35)",
      }}
    >
      <IconShield size={42} color="#8CF0C9" />
      <Box sx={{ position: "absolute", display: "flex" }}>
        <IconCheck size={16} color="#8CF0C9" />
      </Box>
    </Box>
    <Box sx={{ position: "absolute", inset: 0, animation: `${spinSlow} 22s linear infinite` }}>
      {SATELLITES.map(({ angle, node }) => (
        <Box
          key={angle}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 38,
            height: 38,
            mt: "-19px",
            ml: "-19px",
            // park the icon on the outer ring, then undo its own rotation so it stays upright
            transform: `rotate(${angle}deg) translateY(-${RADAR_SIZE / 2 - 6}px) rotate(-${angle}deg)`,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
              animation: `${spinRev} 22s linear infinite`,
            }}
          >
            {node}
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

const demoBox = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.14)",
  bgcolor: "rgba(255,255,255,0.05)",
};

// Card 1: an ID card being scanned, with the checks ticking on one after another
const ID_CHECKS = ["Govt ID verified", "Work email verified", "Selfie match"];
const IdScanVisual = () => (
  <Box sx={{ mt: "auto", pt: "18px" }}>
    <Box sx={{ ...demoBox, p: "12px" }}>
      <Row spacing={1.2}>
        <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "rgba(140,240,201,0.25)", flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ height: 7, width: "70%", borderRadius: "4px", bgcolor: "rgba(255,255,255,0.35)" }} />
          <Box sx={{ height: 6, width: "45%", borderRadius: "4px", bgcolor: "rgba(255,255,255,0.18)", mt: "7px" }} />
        </Box>
      </Row>
      <Stack spacing="6px" sx={{ mt: "12px" }}>
        {ID_CHECKS.map((label, i) => (
          <Row key={label} spacing={1}>
            <Box sx={{ display: "inline-flex", animation: `${checkCycle} 4.8s ease-in-out ${i * 0.7}s infinite` }}>
              <IconCheck size={13} color="#33D6A6" />
            </Box>
            <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
              {label}
            </Typography>
          </Row>
        ))}
      </Stack>
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "28%",
          pointerEvents: "none",
          background: "linear-gradient(180deg, transparent, rgba(51,214,166,0.4), transparent)",
          animation: `${scanDown} 2.8s ease-in-out infinite`,
        }}
      />
    </Box>
  </Box>
);

// Card 2: a tiny live map – dashed route, pickup pin, and a dot travelling along it
const MINI_ROUTE = "M12 72 C 60 74, 84 22, 132 40 S 204 70, 248 18";
const RouteShareVisual = () => {
  const reduce = prefersReducedMotion();
  return (
    <Box sx={{ mt: "auto", pt: "18px" }}>
      <Box sx={demoBox}>
        <svg viewBox="0 0 260 90" width="100%" style={{ display: "block" }} aria-hidden="true">
          <Box
            component="path"
            d={MINI_ROUTE}
            fill="none"
            stroke="#9D90FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5 7"
            sx={{ animation: `${marching} 1.2s linear infinite` }}
          />
          <circle cx="12" cy="72" r="4" fill="#B9B1FF" />
          <circle cx="248" cy="18" r="4" fill="#B9B1FF" />
          <circle cx="132" cy="40" r="4.5" fill="#fff" />
          <Ring cx={132} cy={40} r={6} color="#fff" />
          <g transform={reduce ? "translate(132 40)" : undefined}>
            <circle r="10" fill="rgba(157,144,255,0.25)" />
            <circle r="5" fill="#B9B1FF" />
            {!reduce && <animateMotion dur="6s" repeatCount="indefinite" path={MINI_ROUTE} />}
          </g>
        </svg>
        <Row justify="space-between" sx={{ px: "12px", pb: "10px" }}>
          <Typography sx={{ fontFamily: pageFont, fontSize: 11.5, color: "rgba(255,255,255,0.7)" }}>
            Pickup · 8:15 AM
          </Typography>
          <Typography sx={{ fontFamily: pageFont, fontSize: 11.5, fontWeight: 700, color: "#B9B1FF" }}>
            +3 min detour
          </Typography>
        </Row>
      </Box>
    </Box>
  );
};

// Card 3: SOS button with radar waves and a status line that walks through an alert
const SOS_STATES = ["Hold to send SOS", "Sharing live location…", "Help is on the way"];
const SosVisual = () => {
  const reduce = prefersReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % SOS_STATES.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <Box sx={{ mt: "auto", pt: "18px" }}>
      <Row spacing={2} sx={{ ...demoBox, p: "14px 16px", overflow: "visible" }}>
        <Box sx={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
          {[0, 0.8, 1.6].map((d) => (
            <Box
              key={d}
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(255,100,120,0.6)",
                animation: `${sosWave} 2.4s ease-out ${d}s infinite`,
              }}
            />
          ))}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(145deg, #FF6B81, #E15366)",
              color: "#fff",
              fontFamily: pageFont,
              fontWeight: 800,
              fontSize: 12,
              animation: `${sosPulse} 1.8s ease-out infinite`,
            }}
          >
            SOS
          </Box>
        </Box>
        <Box>
          <Box
            key={i}
            component="span"
            sx={{
              display: "block",
              fontFamily: pageFont,
              fontSize: 12.5,
              fontWeight: 600,
              color: "#fff",
              animation: `${statusIn} 400ms ${EASE} backwards`,
            }}
          >
            {SOS_STATES[i]}
          </Box>
          <Typography sx={{ fontFamily: pageFont, fontSize: 11.5, color: "rgba(255,255,255,0.55)", mt: "2px" }}>
            24/7 corridor assistance
          </Typography>
        </Box>
      </Row>
    </Box>
  );
};

const SafetySection = () => (
  <Box
    id="safety"
    sx={{
      position: "relative",
      overflow: "hidden",
      isolation: "isolate",
      scrollMarginTop: "80px",
      borderRadius: "28px",
      background: "linear-gradient(135deg, #06161C 0%, #0B2A3D 45%, #0A3B33 75%, #06161C 100%)",
      backgroundSize: "220% 220%",
      animation: `${gradientShift} 20s ease infinite`,
      p: { xs: 3, md: 6 },
      mt: { xs: 3, md: 4 },
    }}
  >
    {/* backdrop: dotted grid + two drifting aurora blobs (behind the content) */}
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, #000 30%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, #000 30%, transparent 100%)",
      }}
    />
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        top: -120,
        left: -80,
        zIndex: -1,
        width: 420,
        height: 420,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(51,214,166,0.28), transparent 65%)",
        animation: `${blobA} 15s ease-in-out infinite`,
      }}
    />
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        bottom: -140,
        right: -60,
        zIndex: -1,
        width: 460,
        height: 460,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,108,240,0.28), transparent 65%)",
        animation: `${blobB} 18s ease-in-out infinite`,
      }}
    />

    <Row justify="space-between" align="center" sx={{ gap: 4 }}>
      <Box sx={{ maxWidth: 620 }}>
        <Pill
          sx={{
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#fff",
            mb: "18px",
          }}
        >
          <IconCompass size={13} color="#8CF0C9" /> FriendRide Safety Architecture
        </Pill>
        <Typography
          component="h2"
          sx={{
            fontFamily: pageFont,
            fontWeight: 800,
            fontSize: { xs: 28, md: 42 },
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            color: "#fff",
          }}
        >
          Built Around{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(90deg, #33D6A6, #8CF0C9, #B9B1FF, #33D6A6)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `${shimmer} 6s linear infinite`,
            }}
          >
            Safer
          </Box>{" "}
          Commutes
        </Typography>
        <Typography
          sx={{ fontFamily: pageFont, fontSize: 15, color: "rgba(255,255,255,0.7)", mt: "12px", lineHeight: 1.6 }}
        >
          Safety isn't an afterthought; it's our core operating framework designed from day one.
        </Typography>
      </Box>
      <ShieldRadar />
    </Row>

    <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} sx={{ mt: 5, ...staggerRow }}>
      <SafetyCard
        accent="#33D6A6"
        icon={<IconIdCard size={20} color="#8CF0C9" />}
        title="Verified Profiles"
        desc="Know who you're travelling with. Every rider and passenger completes multi-tier identity checks before taking a seat."
        visual={<IdScanVisual />}
      />
      <SafetyCard
        accent="#9D90FF"
        icon={<IconTarget size={20} color="#B9B1FF" />}
        title="Route Visibility"
        desc="Understand the shared commute before connecting. Precise pickup points, transparent detour times, and zero mystery."
        visual={<RouteShareVisual />}
      />
      <SafetyCard
        accent="#FF6B81"
        icon={
          <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 12, color: "#FF8A99" }}>SOS</Typography>
        }
        title="Emergency Support"
        desc="Access safety tools when you need them. 24/7 dedicated corridor assistance, live route sharing, and instant SOS dispatch."
        visual={<SosVisual />}
      />
    </Stack>

    <Row
      justify="space-between"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        p: "16px 20px",
        mt: 3,
        flexWrap: "wrap",
        gap: 1.5,
        bgcolor: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        "& > *": { position: "relative", zIndex: 1 },
        // a light streak glides across the bar every few seconds
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "30%",
          zIndex: 0,
          pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          transform: "translateX(-130%) skewX(-20deg)",
          animation: `${sheen} 5s ease-in-out 1s infinite`,
        },
      }}
    >
      <Row spacing={1.5}>
        <Box
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(51,214,166,0.18)",
            animation: `${pulseDot} 2.4s ease-out infinite`,
          }}
        >
          <IconShield size={18} color="#8CF0C9" />
        </Box>
        <Typography sx={{ fontFamily: pageFont, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
          Comprehensive{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(90deg, #33D6A6, #8CF0C9)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ₹<CountOnView to={500000} duration={2200} />
          </Box>{" "}
          accidental cover included on all scheduled shared commutes.
        </Typography>
      </Row>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          px: "16px",
          py: "8px",
          borderRadius: "999px",
          border: "1px solid rgba(140,240,201,0.5)",
          color: "#8CF0C9",
          fontFamily: pageFont,
          fontSize: 13.5,
          fontWeight: 700,
          cursor: "pointer",
          transition: "background-color 240ms ease",
          "&:hover": { bgcolor: "rgba(51,214,166,0.16)" },
          "&:hover .fr-arrow-s": { transform: "translateX(6px)" },
        }}
      >
        Read Policy{" "}
        <Box
          component="span"
          className="fr-arrow-s"
          sx={{ display: "inline-block", transition: `transform 240ms ${EASE}` }}
        >
          &gt;
        </Box>
      </Box>
    </Row>
  </Box>
);

/* ---------------------------------------------------------------------- */
/*  Stats row                                                             */
/* ---------------------------------------------------------------------- */

const StatCard = (props) => (
  <RevealItem>
    <StatCardBody {...props} />
  </RevealItem>
);

const StatCardBody = ({ iconBg, icon, tag, tagColor, value, desc, visual }) => {
  // cursor-follow glow: the pointer position is written to CSS variables (no re-render)
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <Box
      className="hover-lift"
      onMouseMove={handleMove}
      sx={{
        position: "relative",
        overflow: "hidden",
        flex: 1,
        bgcolor: "#fff",
        borderRadius: "20px",
        border: "1px solid #ECEDF3",
        p: "24px",
        transition: CARD_TRANSITION,
        "& > *": { position: "relative", zIndex: 1 },
        // soft coloured glow that follows the mouse
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 300ms ease",
          background: `radial-gradient(280px circle at var(--sx, 50%) var(--sy, 0%), ${tagColor}26, transparent 70%)`,
        },
        // light streak that sweeps across once on hover
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "35%",
          zIndex: 2,
          pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          transform: "translateX(-160%) skewX(-20deg)",
        },
        "&:hover": { borderColor: tagColor },
        "&:hover::before": { opacity: 1 },
        "&:hover::after": { transform: "translateX(420%) skewX(-20deg)", transition: "transform 900ms ease" },
        "&:hover .fr-icon": { transform: "scale(1.15) rotate(-10deg)" },
        "&:hover .fr-value": { backgroundPosition: "0% 50%", transform: "translateX(4px)" },
      }}
    >
      <Row justify="space-between">
        <Box
          className="fr-icon"
          sx={{
            transition: `transform 300ms ${EASE}`,
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Pill sx={{ bgcolor: "#F2F3F8", color: tagColor, fontSize: 12, py: "5px" }}>{tag}</Pill>
      </Row>
      <Typography
        className="fr-value"
        sx={{
          fontFamily: pageFont,
          fontWeight: 800,
          fontSize: { xs: 36, md: 44 },
          lineHeight: 1.1,
          mt: "18px",
          width: "fit-content",
          // dark → accent colour gradient; slides to the accent on hover
          background: `linear-gradient(100deg, #12151A 20%, ${tagColor} 80%, ${tagColor} 100%)`,
          backgroundSize: "220% 100%",
          backgroundPosition: "100% 50%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: `background-position 600ms ${EASE}, transform 300ms ${EASE}`,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontFamily: pageFont, fontSize: 13.5, color: "#7A8090", mt: "6px" }}>
        {desc}
      </Typography>
      {visual}
    </Box>
  );
};

const StatsRow = () => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2.5}
    sx={{ mt: { xs: 6, md: 8 }, ...staggerRow }}
  >
    <StatCard
      iconBg="#FBEAD6"
      icon={<IconRupee size={16} />}
      tag="Cost Optimized"
      tagColor="#D98A2B"
      value={
        <>
          ₹<CountOnView to={4200} duration={1800} />
        </>
      }
      desc="avg. monthly fuel savings for daily commuters"
      visual={<BarsVisual color="#D98A2B" />}
    />
    <StatCard
      iconBg="#E4F6EE"
      icon={<IconLeaf size={16} />}
      tag="Cleaner Cities"
      tagColor="#0E9F76"
      value={
        <>
          <CountOnView to={45} duration={1600} />%
        </>
      }
      desc="reduction in individual city two-wheeler emissions"
      visual={<RingVisual color="#0E9F76" percent={45} />}
    />
    <StatCard
      iconBg="#EAE7FC"
      icon={<IconThumb size={16} />}
      tag="Verified Only"
      tagColor="#5B4CF0"
      value={
        <>
          <CountOnView to={98} duration={1800} />%
        </>
      }
      desc="rider safety and punctual trust rating score"
      visual={<PipsVisual color="#5B4CF0" percent={98} />}
    />
  </Stack>
);

/* ---------------------------------------------------------------------- */
/*  CTA banner                                                            */
/* ---------------------------------------------------------------------- */

const CTASection = () => (
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      isolation: "isolate",
      mt: { xs: 6, md: 8 },
      mb: { xs: 6, md: 8 },
      borderRadius: "24px",
      background: "linear-gradient(120deg, #0E7C5E 0%, #0B4F5C 35%, #0B2A3D 65%, #0E7C5E 100%)",
      backgroundSize: "250% 250%",
      animation: `${gradientShift} 16s ease infinite`,
      p: { xs: 5, md: 8 },
      textAlign: "center",
    }}
  >
    {/* drifting light orbs + a route line that keeps flowing along the bottom */}
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        top: -90,
        left: -60,
        zIndex: -1,
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(51,214,166,0.35), transparent 65%)",
        animation: `${blobA} 13s ease-in-out infinite`,
      }}
    />
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        bottom: -110,
        right: -50,
        zIndex: -1,
        width: 360,
        height: 360,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,108,240,0.30), transparent 65%)",
        animation: `${blobB} 16s ease-in-out infinite`,
      }}
    />
    <Box
      aria-hidden="true"
      component="svg"
      viewBox="0 0 800 120"
      preserveAspectRatio="none"
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "45%",
        zIndex: -1,
        opacity: 0.35,
      }}
    >
      <Box
        component="path"
        d="M0 90 C 140 20, 260 120, 400 60 S 660 10, 800 70"
        fill="none"
        stroke="#8CF0C9"
        strokeWidth="2"
        strokeDasharray="6 10"
        sx={{ animation: `${flowDash} 4s linear infinite` }}
      />
      <Box
        component="path"
        d="M0 105 C 160 55, 300 125, 440 85 S 680 40, 800 95"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeDasharray="3 12"
        sx={{ animation: `${flowDash} 6s linear infinite` }}
      />
    </Box>
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
      Join FriendRide and discover people travelling along your route today. Free to join, verified to ride.
    </Typography>

    <Row justify="center" spacing={1.5} sx={{ mt: "28px" }}>
      <Button
        component={RouterLink}
        to="/signin"
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "#fff",
          color: "#0B4F5C",
          textTransform: "none",
          fontFamily: pageFont,
          fontWeight: 700,
          fontSize: 14.5,
          borderRadius: "10px",
          px: "22px",
          py: "11px",
          gap: "8px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
          "&:hover": { bgcolor: "#F0F2F5" },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "40%",
            background: "linear-gradient(90deg, transparent, rgba(14,159,118,0.25), transparent)",
            transform: "translateX(-130%) skewX(-20deg)",
            animation: `${sheen} 3.8s ease-in-out 1s infinite`,
            pointerEvents: "none",
          },
          "&:hover .fr-arrow": { transform: "translateX(6px)" },
        }}
      >
        Get Started{" "}
        <Box
          component="span"
          className="fr-arrow"
          sx={{ display: "inline-flex", transition: `transform 240ms ${EASE}` }}
        >
          <IconArrowRight color="#0B4F5C" />
        </Box>
      </Button>
      <Button
        onClick={() => {
          const el = document.getElementById("safety");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
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

// Fades and slides a section in the first time it scrolls into view.
// (Shows immediately for people who prefer reduced motion.)
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce || !("IntersectionObserver" in window)) {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(28px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.22, 0.8, 0.24, 1) ${delay}ms`,
      }}
    >
      {children}
    </Box>
  );
}

export default function LandingPage() {
  return (
    <Box data-own-motion sx={{ bgcolor: "#F6F7FB", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={pageContainer}>
        <Reveal>
          <Hero />
        </Reveal>
        {/* these rows reveal their own cards one by one */}
        <FeatureRow />
        <ProcessSection />
        <Reveal>
          <SafetySection />
        </Reveal>
        <StatsRow />
        <Reveal>
          <CTASection />
        </Reveal>
      </Box>
      <Footer />
    </Box>
  );
}
