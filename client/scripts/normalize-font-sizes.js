#!/usr/bin/env node
/* eslint-disable */
/**
 * Brings the text sizes on the older screens in line with the lift taker
 * screens (the reference), so the whole app reads at one consistent scale.
 *
 * Run it from the `client` folder:
 *
 *   node scripts/normalize-font-sizes.js --dry-run   preview only, changes nothing
 *   node scripts/normalize-font-sizes.js             apply (originals are backed up first)
 *   node scripts/normalize-font-sizes.js --restore   put the originals back
 *
 * What it does
 *   - "scale" screens (the rider screens, designed at a smaller scale):
 *     every text size x 1.15 (half-pixel steps below 16px, whole numbers above),
 *     never below 10.5px.
 *     That ratio maps them onto the sizes the lift taker screens already use
 *     (9 -> 10.5, 10 -> 11.5, 11 -> 12.5, 12 -> 14, 13 -> 15, 14 -> 16 ...).
 *   - "floor" screens (sign-in style screens already at the right scale):
 *     only the tiny text is raised, anything under 10.5px becomes 11px.
 *   - Icon sizes (<SomeIcon style={{ fontSize: 17 }} />) are never touched.
 *   - Each changed file starts with a marker comment, and files that have it
 *     are skipped, so running the script twice can't scale anything twice.
 */

const fs = require("fs");
const path = require("path");

const SRC = process.env.FONT_SRC || path.join(__dirname, "..", "src");
const BACKUP = process.env.FONT_BACKUP || path.join(__dirname, "..", ".font-size-backup");
const MARKER = "/* font-sizes: normalized to the lift taker scale */";

const SCALE_FILES = [
  "home/home.js",
  "liftrequest/liftrequest.js",
  "viewRequest/viewrequest.js",
  "confimrequest/confirmrequest.js",
  "matchRequest/MatchConfirm.js",
  "Trips/trips.js",
  "verifypassanger/VerifyPassenger.js",
];

const FLOOR_FILES = [
  "login/login.js",
  "gender/gender.js",
  "roleandmode/roleandmode.js",
  "identity/identity.js",
  "profilemenu/profilemenu.js",
  "LandingPage.jsx",
];

const MIN_SIZE = 10.5;
// The sizes the lift taker screens use for headings. Large text snaps to these
// so every screen shares one set of heading sizes.
const HEADING_SIZES = [20, 22, 24, 25, 26, 28, 30, 32, 34, 40, 46];

// Small text moves in half-pixel steps, like the lift taker screens (11.5, 12.5,
// 13.5 ...); from 16px up they use whole numbers (17, 18, 19 ...); from 20px up
// they snap to the heading sizes above (a tie goes to the smaller size).
const snap = (v) => {
  if (v < 16) return Math.round(v * 2) / 2;
  if (v < 20) return Math.round(v);
  return HEADING_SIZES.reduce((best, s) => (Math.abs(s - v) < Math.abs(best - v) ? s : best));
};
const scaleUp = (v) => Math.max(MIN_SIZE, snap(v * 1.15));
const floorUp = (v) => (v < MIN_SIZE ? 11 : v);

// `fontSize: 12`  `fontSize: "12px"`  `fontSize: '12px'`
const SIZE_RE = /(fontSize\s*:\s*)(["']?)(\d+(?:\.\d+)?)(px)?(["']?)/g;
// `fontSize: cond ? 16 : 22`
const TERNARY_RE = /(fontSize\s*:\s*[^,}\n]*?\?\s*)(\d+(?:\.\d+)?)(\s*:\s*)(\d+(?:\.\d+)?)/g;

/** True when this fontSize sits on an <XxxIcon ... /> element (icon size, not text). */
function isOnIcon(text, pos) {
  const start = text.lastIndexOf("<", pos);
  if (start === -1 || pos - start > 400) return false;
  const seg = text.slice(start, pos);
  const m = /^<([A-Za-z][\w.]*)/.exec(seg);
  if (!m) return false;
  let depth = 0;
  for (let i = 0; i < seg.length; i++) {
    const ch = seg[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === ">" && depth <= 0 && seg[i - 1] !== "=") return false; // tag already closed
  }
  return /Icon$/.test(m[1]);
}

const fmt = (n) => String(Number(n.toFixed(2)));

function transform(src, convert) {
  const changes = new Map(); // "9 -> 10.5" -> count
  let icons = 0;
  const note = (from, to) => {
    const key = `${fmt(from)} -> ${fmt(to)}`;
    changes.set(key, (changes.get(key) || 0) + 1);
  };

  let out = src.replace(SIZE_RE, (match, pre, q1, num, px, q2, offset) => {
    if (isOnIcon(src, offset)) {
      icons++;
      return match;
    }
    const from = parseFloat(num);
    const to = convert(from);
    if (to === from) return match;
    note(from, to);
    return `${pre}${q1}${fmt(to)}${px || ""}${q2}`;
  });

  out = out.replace(TERNARY_RE, (match, pre, a, mid, b) => {
    const [na, nb] = [convert(parseFloat(a)), convert(parseFloat(b))];
    if (na !== parseFloat(a)) note(parseFloat(a), na);
    if (nb !== parseFloat(b)) note(parseFloat(b), nb);
    return `${pre}${fmt(na)}${mid}${fmt(nb)}`;
  });

  return { out, changes, icons };
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry-run");
  const restore = args.includes("--restore");

  const plan = [
    ...SCALE_FILES.map((f) => ({ f, mode: "scale", convert: scaleUp })),
    ...FLOOR_FILES.map((f) => ({ f, mode: "floor", convert: floorUp })),
  ];

  if (restore) {
    let n = 0;
    for (const { f } of plan) {
      const saved = path.join(BACKUP, f);
      if (!fs.existsSync(saved)) continue;
      fs.copyFileSync(saved, path.join(SRC, f));
      console.log(`restored  ${f}`);
      n++;
    }
    console.log(n ? `\nRestored ${n} file(s) from ${BACKUP}` : "\nNothing to restore (no backup found).");
    return;
  }

  let total = 0;
  for (const { f, mode, convert } of plan) {
    const file = path.join(SRC, f);
    if (!fs.existsSync(file)) {
      console.log(`missing   ${f}  (skipped)`);
      continue;
    }
    const src = fs.readFileSync(file, "utf8");
    if (src.startsWith(MARKER)) {
      console.log(`done      ${f}  (already normalized, skipped)`);
      continue;
    }

    const { out, changes, icons } = transform(src, convert);
    const count = [...changes.values()].reduce((a, b) => a + b, 0);
    total += count;

    const detail = [...changes.entries()]
      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
      .map(([k, v]) => `${k} (x${v})`)
      .join(", ");
    console.log(`${dry ? "would fix" : "fixed    "} ${f}  [${mode}]  ${count} sizes, ${icons} icon sizes left alone`);
    if (dry && detail) console.log(`            ${detail}`);

    if (!dry && count) {
      const saved = path.join(BACKUP, f);
      if (!fs.existsSync(saved)) {
        fs.mkdirSync(path.dirname(saved), { recursive: true });
        fs.writeFileSync(saved, src);
      }
      fs.writeFileSync(file, `${MARKER}\n${out}`);
    }
  }

  console.log(
    dry
      ? `\nDry run: ${total} sizes would change. Nothing was written.`
      : `\nDone: ${total} sizes updated. Originals are in ${BACKUP}\nUndo any time with: node scripts/normalize-font-sizes.js --restore`
  );
}

main();
