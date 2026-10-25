import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Container, Typography, Link, Stack } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

// Same palette as the landing page: white surface on the #F6F7FB page, slate
// text, hairline borders and the green brand colours used by its buttons/logo.
const BG = "#FFFFFF";
const TEXT = "#0B6B4F"; // wordmark: the deep green of the "Get Started" buttons
const LINK = "#3C4250";
const MUTED = "#6A7182";
const LINE = "#E6E8EF";
const ACCENT = "#0E9F76"; // logo tile, same as the navbar logo
const HOVER = "#0B6B4F";

const columns = [
  {
    title: "Product",
    links: ["How It Works", "Fare Estimator", "Route Coverage"],
  },
  {
    title: "Safety",
    links: ["Verification Model", "Helmet & Ride Standards", "24/7 SOS Protocol"],
  },
  {
    title: "About",
    links: ["Company Story", "Careers", "Press & News"],
  },
  {
    title: "Legal & Help",
    links: ["Help Center", "Privacy Policy", "Terms of Service"],
  },
];

const bottomLinks = ["Privacy", "Terms", "Security"];

function FooterLink({ children, size = 14, color = LINK }) {
  return (
    <Link
      href="#"
      underline="none"
      sx={{
        fontSize: size,
        lineHeight: 1.45,
        color,
        width: "fit-content",
        transition: "color 160ms ease",
        "&:hover": { color: HOVER },
      }}
    >
      {children}
    </Link>
  );
}

/* ---------------------------------------------------------------------- */
/*  Big wordmark: the letters rise in one by one                          */
/* ---------------------------------------------------------------------- */

const WORD = "FriendRide";
const WORD_FONT = "Inter, Arial, sans-serif";
const WORD_SIZE = 205; // font size in the 1000 x 172 drawing
const WORD_BASELINE = 162;
const WORD_WIDTH = 1000; // the word is stretched to exactly this width

const LETTER_STAGGER_MS = 110; // gap between one letter starting and the next
const LETTER_MS = 750;
const LETTER_RISE = 70; // how far below its place each letter starts
const SHOW_AT = 0.35; // share of the word that must be on screen to start

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Draws "FriendRide" across the full width. Whenever it scrolls into view the
 * letters appear one after another, rising from the bottom edge, and it plays
 * again each time you scroll away and back. The page's
 * own sections reveal the same way (once, on scroll), and with "reduce motion"
 * switched on in the OS the word simply shows, no animation.
 *
 * Each letter is its own <text> so it can move on its own; their positions are
 * measured from the real rendered word, so spacing and kerning match what a
 * single stretched <text> would give. Where measuring isn't possible the
 * original single-piece word is shown instead.
 */
function Wordmark() {
  const svgRef = useRef(null);
  const probeRef = useRef(null);
  const [letters, setLetters] = useState(null); // [{ ch, x }] already stretched to fit
  const [stretch, setStretch] = useState(1);
  const [shown, setShown] = useState(false);
  const reduce = prefersReducedMotion();

  // Measure where each letter of the word sits
  useLayoutEffect(() => {
    let cancelled = false;

    const measure = () => {
      const probe = probeRef.current;
      if (!probe || typeof probe.getComputedTextLength !== "function") return;
      const natural = probe.getComputedTextLength();
      if (!natural) return;

      const sx = WORD_WIDTH / natural; // the same squeeze/stretch textLength applied
      const placed = [...WORD].map((ch, i) => ({
        ch,
        x: probe.getStartPositionOfChar(i).x * sx,
      }));
      if (!cancelled) {
        setStretch(sx);
        setLetters(placed);
      }
    };

    try {
      measure();
      // the font may arrive after first paint: measure again once it has
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    } catch {
      // no measuring support: the plain word below is used
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Play the animation every time the word scrolls into view. Once it has
  // fully left the screen it is put back to hidden (instantly, while nobody
  // can see it), so scrolling away and coming back plays it again.
  useEffect(() => {
    const el = svgRef.current;
    if (!el || reduce || !("IntersectionObserver" in window)) {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]; // the latest state
        if (entry.isIntersecting && entry.intersectionRatio >= SHOW_AT) setShown(true);
        else if (!entry.isIntersecting) setShown(false);
      },
      { threshold: [0, SHOW_AT] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  const textProps = {
    y: WORD_BASELINE,
    fill: TEXT,
    fontFamily: WORD_FONT,
    fontWeight: "600",
    fontSize: WORD_SIZE,
  };

  return (
    <Box
      component="svg"
      ref={svgRef}
      viewBox="0 0 1000 172"
      role="img"
      aria-label="FriendRide"
      sx={{
        display: "block",
        width: "100%",
        height: "auto",
        mt: { xs: 7, md: 10 },
        mb: { xs: 4, md: 6 },
      }}
    >
      {/* Invisible copy of the word, only used to measure the letters */}
      <text ref={probeRef} x="0" visibility="hidden" aria-hidden="true" {...textProps}>
        {WORD}
      </text>

      {letters ? (
        letters.map(({ ch, x }, i) => (
          <g key={i} transform={`translate(${x} 0) scale(${stretch} 1)`}>
            <text
              x="0"
              {...textProps}
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : `translateY(${LETTER_RISE}px)`,
                // No transition when hiding, so the reset is instant and
                // happens while the word is off-screen
                transition:
                  reduce || !shown
                    ? "none"
                    : `opacity ${LETTER_MS}ms ease ${i * LETTER_STAGGER_MS}ms, ` +
                      `transform ${LETTER_MS}ms cubic-bezier(0.22, 0.8, 0.24, 1) ${i * LETTER_STAGGER_MS}ms`,
              }}
            >
              {ch}
            </text>
          </g>
        ))
      ) : (
        <text x="0" {...textProps} textLength={WORD_WIDTH} lengthAdjust="spacingAndGlyphs">
          {WORD}
        </text>
      )}
    </Box>
  );
}

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: BG,
        borderTop: `1px solid ${LINE}`,
        color: LINK,
        fontFamily: "inherit",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1560px", // same width + gutters as the landing page content
          mx: "auto",
          px: { xs: 3, sm: 4, md: 5, lg: 6 },
          pt: { xs: 6, md: 8 },
          pb: { xs: 3, md: 4 },
        }}
      >
        {/* Top: brand on the left, link columns on the right */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "minmax(240px, 1.5fr) repeat(4, minmax(0, 1fr))",
            },
            columnGap: { xs: 3, md: 4 },
            rowGap: 5,
          }}
        >
          {/* Brand */}
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                backgroundColor: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SecurityIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />
            </Box>

            <Typography
              sx={{
                mt: 2.5,
                maxWidth: 300,
                fontSize: 14,
                lineHeight: 1.65,
                color: MUTED,
              }}
            >
              Urban two-wheeler lift-sharing built on route matching and
              verified safety.
            </Typography>
          </Box>

          {/* Link columns */}
          {columns.map((col) => (
            <Box key={col.title}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: MUTED,
                  mb: 2,
                }}
              >
                {col.title}
              </Typography>

              <Stack spacing={1.25}>
                {col.links.map((label) => (
                  <FooterLink key={label}>{label}</FooterLink>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        {/* Big wordmark: the letters rise in one by one when it scrolls into view */}
        <Wordmark />

        {/* Bottom: thin divider, copyright, small links */}
        <Box
          sx={{
            borderTop: `1px solid ${LINE}`,
            pt: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: 12, color: MUTED }}>
            © 2025 FriendRide Technologies Inc. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            {bottomLinks.map((label) => (
              <FooterLink key={label} size={12} color={MUTED}>
                {label}
              </FooterLink>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
