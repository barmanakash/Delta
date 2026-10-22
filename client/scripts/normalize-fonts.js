#!/usr/bin/env node
/**
 * normalize-fonts.js
 *
 * One-off codemod that brings the font sizes of the older pages in line with the
 * Lift Taker pages (which are the reference and are NOT touched).
 *
 * The rule is deliberately small, so nothing else in the layout is disturbed:
 *
 *   - Text that is smaller than MIN_TEXT (12px) is raised to 12px.
 *   - Uppercase "caps" labels (textTransform: "uppercase") are raised to MIN_CAPS (11.5px)
 *     at the least, which is what the Lift Taker pages use for their small caps labels.
 *   - Everything 12px and above is left exactly as it is, including headings.
 *   - Icon sizes (<SomethingIcon style={{ fontSize: 14 }} />) are never changed.
 *
 * It only edits the numbers; formatting, comments and line endings stay as they are.
 * It is safe to run twice: the second run changes nothing.
 *
 * Usage (from the client/ folder):
 *   node scripts/normalize-fonts.js --dry     # show what would change, write nothing
 *   node scripts/normalize-fonts.js           # apply
 *
 * To undo: git checkout -- src
 */

const fs = require("fs");
const path = require("path");

let parser;
try {
  parser = require("@babel/parser");
} catch {
  console.error("Could not load @babel/parser. Run:  npm install --save-dev @babel/parser");
  process.exit(1);
}

/* ------------------------------ settings ------------------------------ */

const MIN_TEXT = 12; // smallest regular text
const MIN_CAPS = 11.5; // smallest UPPERCASE label

// The Lift Taker experience: the reference, left untouched.
const SKIP_FILES = new Set([
  "lifttakerhome.js",
  "lifttakerlayout.js",
  "findlift.js",
  "compatibleriders.js",
  "profilemenu.js",
  "createcommute.js",
  "routemap.js",
  // not UI pages
  "index.js",
  "App.js",
  "App.test.js",
  "setupTests.js",
  "reportWebVitals.js",
]);

/* ------------------------------ helpers ------------------------------- */

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const srcArgIdx = args.indexOf("--src");
const SRC_DIR =
  srcArgIdx >= 0 ? path.resolve(args[srcArgIdx + 1]) : path.resolve(__dirname, "..", "src");

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      out.push(...listFiles(full));
    } else if (/\.(js|jsx)$/.test(entry.name) && !SKIP_FILES.has(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const keyName = (k) =>
  k.type === "Identifier" ? k.name : k.type === "StringLiteral" ? k.value : null;

// The px number held by a literal node, or null
function pxValue(node) {
  if (node.type === "NumericLiteral") return node.value;
  if (node.type === "StringLiteral") {
    const m = /^(\d+(?:\.\d+)?)px$/.exec(node.value);
    if (m) return parseFloat(m[1]);
  }
  return null;
}

// Every literal a fontSize value can resolve to:
//   12 | "12px" | { xs: 12, md: 14 } | cond ? 12 : 14
function literalLeaves(expr, out = []) {
  if (!expr) return out;
  switch (expr.type) {
    case "NumericLiteral":
    case "StringLiteral":
      if (pxValue(expr) !== null) out.push(expr);
      break;
    case "ObjectExpression":
      expr.properties.forEach((p) => p.value && literalLeaves(p.value, out));
      break;
    case "ConditionalExpression":
      literalLeaves(expr.consequent, out);
      literalLeaves(expr.alternate, out);
      break;
    case "LogicalExpression":
      literalLeaves(expr.left, out);
      literalLeaves(expr.right, out);
      break;
    default:
  }
  return out;
}

const fmt = (n) => String(Number.isInteger(n) ? n : n);

function targetSize(current, isCaps) {
  const floor = isCaps ? MIN_CAPS : MIN_TEXT;
  return current < floor ? floor : current;
}

/* ------------------------------- per file ----------------------------- */

function processFile(file) {
  const code = fs.readFileSync(file, "utf8");
  const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx"] });

  // Names of icon components (never resized)
  const iconNames = new Set();
  for (const node of ast.program.body) {
    if (node.type === "ImportDeclaration" && /^@mui\/icons-material/.test(node.source.value)) {
      node.specifiers.forEach((s) => iconNames.add(s.local.name));
    }
  }
  const isIconName = (n) => iconNames.has(n) || /Icon$/.test(n);

  const edits = []; // { start, end, text, from, to }

  const walk = (node, ancestors) => {
    if (!node || typeof node.type !== "string") return;

    if (node.type === "ObjectProperty" && keyName(node.key) === "fontSize") {
      // Is this style/sx on an icon component?
      let onIcon = false;
      for (let i = ancestors.length - 1; i >= 0; i--) {
        const a = ancestors[i];
        if (a.type === "JSXAttribute") {
          const opening = ancestors[i - 1];
          const nm = opening && opening.name;
          const tag =
            nm && nm.type === "JSXIdentifier"
              ? nm.name
              : nm && nm.type === "JSXMemberExpression"
              ? nm.property.name
              : "";
          onIcon = isIconName(tag);
          break;
        }
      }

      if (!onIcon) {
        // Uppercase label? Look at the sibling properties of the same style object
        const parentObj = ancestors[ancestors.length - 1];
        const isCaps =
          parentObj &&
          parentObj.type === "ObjectExpression" &&
          parentObj.properties.some(
            (p) =>
              p.type === "ObjectProperty" &&
              keyName(p.key) === "textTransform" &&
              p.value.type === "StringLiteral" &&
              p.value.value === "uppercase"
          );

        for (const leaf of literalLeaves(node.value)) {
          const current = pxValue(leaf);
          const next = targetSize(current, isCaps);
          if (next !== current) {
            const raw = code.slice(leaf.start, leaf.end);
            const text =
              leaf.type === "NumericLiteral" ? fmt(next) : `${raw[0]}${fmt(next)}px${raw[0]}`;
            edits.push({ start: leaf.start, end: leaf.end, text, from: current, to: next });
          }
        }
      }
    }

    for (const key of Object.keys(node)) {
      if (key === "loc" || key === "leadingComments" || key === "trailingComments") continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach((c) => walk(c, [...ancestors, node]));
      else if (child && typeof child.type === "string") walk(child, [...ancestors, node]);
    }
  };
  walk(ast.program, []);

  if (!edits.length) return { changed: 0, summary: {} };

  const summary = {};
  edits.forEach((e) => {
    const k = `${e.from}->${e.to}`;
    summary[k] = (summary[k] || 0) + 1;
  });

  if (!DRY) {
    let out = code;
    edits
      .sort((a, b) => b.start - a.start)
      .forEach((e) => {
        out = out.slice(0, e.start) + e.text + out.slice(e.end);
      });
    // never write something that no longer parses
    parser.parse(out, { sourceType: "module", plugins: ["jsx"] });
    fs.writeFileSync(file, out);
  }
  return { changed: edits.length, summary };
}

/* -------------------------------- main -------------------------------- */

const files = listFiles(SRC_DIR);
let total = 0;
console.log(`${DRY ? "DRY RUN - " : ""}Normalizing font sizes in ${SRC_DIR}`);
console.log(`Rule: text >= ${MIN_TEXT}px (uppercase labels >= ${MIN_CAPS}px). Larger sizes and icons are untouched.\n`);

for (const f of files) {
  try {
    const { changed, summary } = processFile(f);
    total += changed;
    if (changed) {
      const detail = Object.entries(summary)
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
        .map(([k, v]) => `${k} x${v}`)
        .join(", ");
      console.log(`  ${path.relative(SRC_DIR, f)}: ${changed} changed  (${detail})`);
    }
  } catch (e) {
    console.error(`  ${path.relative(SRC_DIR, f)}: SKIPPED - ${e.message}`);
  }
}
console.log(`\n${DRY ? "Would change" : "Changed"} ${total} font sizes.`);
