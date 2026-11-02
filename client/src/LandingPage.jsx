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

const FeatureCard = ({ iconBg, icon, title, desc }) => (
  <Box
    className="hover-lift"
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
const Count = ({ to, decimals = 0, duration = 1600, delay = 0 }) => {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(to);
      return undefined;
    }
    let raf;
    let start;
    const timer = setTimeout(() => {
      const tick = (now) => {
        if (start === undefined) start = now;
        const p = Math.min((now - start) / duration, 1);
        setValue(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, delay]);

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
    className="hover-lift"
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
  <Box id="how-it-works" sx={{ py: { xs: 7, md: 10 }, textAlign: "center", scrollMarginTop: "72px" }}>
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
        desc="Tell FriendRide where you're starting and where you're going. Choose your regular morning or evening schedule."
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
              92% match
            </Pill>
          </Row>
          <Row justify="space-between" sx={{ mt: "8px" }}>
            <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
              Honda H'ness CB350
            </Typography>
            <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
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
                <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
                  OTP &amp; Helmet Verified
                </Typography>
              </Box>
            </Row>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontFamily: pageFont, fontSize: 13, fontWeight: 800, color: "#151A21" }}>
                ₹45
              </Typography>
              <Typography sx={{ fontFamily: pageFont, fontSize: 12, color: "#8A9099" }}>
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
    className="hover-lift"
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
      <IconCompass size={13} color="#8CF0C9" /> FriendRide Safety Architecture
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
          <Typography sx={{ fontFamily: pageFont, fontWeight: 800, fontSize: 12, color: "#E15366" }}>
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
    className="hover-lift"
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
      <Pill sx={{ bgcolor: "#F2F3F8", color: tagColor, fontSize: 12, py: "5px" }}>{tag}</Pill>
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
      Join FriendRide and discover people travelling along your route today. Free to join, verified to ride.
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
        <Reveal>
          <FeatureRow />
        </Reveal>
        <Reveal>
          <ProcessSection />
        </Reveal>
        <Reveal>
          <SafetySection />
        </Reveal>
        <Reveal>
          <StatsRow />
        </Reveal>
        <Reveal>
          <CTASection />
        </Reveal>
      </Box>
      <Footer />
    </Box>
  );
}
