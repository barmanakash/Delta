import { useEffect } from "react";

/**
 * Hover motion for cards, on every page, without touching the pages.
 *
 * The motion system in index.css lifts anything with the "hover-lift" class.
 * Most cards were built before that class existed, so this hook finds the
 * ones that look like cards and gives them the class:
 *
 *   - rounded corners, a box-shadow and a solid/gradient background
 *   - card-sized (not a tiny badge, not a full-page container)
 *   - nothing inside that you type into, no map, not a dialog/menu/header
 *   - only the innermost card of a group, so a list row lifts, not the whole list
 *
 * To keep a card still, add  data-no-lift  to it.
 * Nothing happens for people who prefer reduced motion.
 */

const LIMITS = { minW: 200, maxW: 1000, minH: 72, maxH: 600, minRadius: 10 };

const TEXT_ENTRY =
  'input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]), textarea, select';
const NEVER_INSIDE =
  '[role="dialog"], [role="listbox"], [role="menu"], [role="tooltip"], ' +
  ".MuiPopover-root, .MuiModal-root, .MuiSnackbar-root, header, nav";
const CLEAR = /^(transparent|rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/;

function looksLikeCard(el) {
  if (el.hasAttribute("data-no-lift") || el.style.transform) return false;

  const cs = window.getComputedStyle(el);
  if (cs.boxShadow === "none") return false;
  if (cs.position && cs.position !== "static" && cs.position !== "relative") return false;
  if (parseFloat(cs.borderTopLeftRadius) < LIMITS.minRadius) return false;
  if (CLEAR.test(cs.backgroundColor) && cs.backgroundImage === "none") return false;

  const { width, height } = el.getBoundingClientRect();
  if (width < LIMITS.minW || width > LIMITS.maxW) return false;
  if (height < LIMITS.minH || height > LIMITS.maxH) return false;

  if (el.closest(NEVER_INSIDE)) return false;
  if (el.querySelector(`${TEXT_ENTRY}, .leaflet-container`)) return false;
  return true;
}

function markCards(root) {
  const candidates = [];
  root.querySelectorAll("div, section, article, li").forEach((el) => {
    if (el.classList.contains("hover-lift")) return; // opted in by hand already
    // Respect hand-marked cards: don't also lift anything inside or around them
    if (el.closest(".hover-lift") || el.querySelector(".hover-lift")) return;
    if (looksLikeCard(el)) candidates.push(el);
  });

  // innermost only
  candidates.forEach((el) => {
    if (!candidates.some((other) => other !== el && el.contains(other))) {
      el.classList.add("hover-lift");
    }
  });
}

export function useCardHover(routeKey) {
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    const root = document.querySelector(".page-fade");
    if (!root) return undefined;

    let timer;
    const run = () => {
      if (!document.hidden) markCards(root);
    };
    const schedule = (delay) => {
      clearTimeout(timer);
      timer = setTimeout(run, delay);
    };

    schedule(500); // after the page has laid out
    const later = setTimeout(run, 1400); // after entrance animations and first data load

    // pages that load data / re-render lists: look again once things settle
    const observer = new MutationObserver(() => schedule(400));
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(later);
      observer.disconnect();
    };
  }, [routeKey]);
}
