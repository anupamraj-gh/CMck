/**
 * Editorial Motion System — the shared vocabulary every animated interaction in the app should
 * eventually draw from, instead of each component inventing its own duration/easing numbers (see
 * docs/motion-inventory.md for the audit that found this happening in well over a dozen places,
 * and docs/motion-system.md for the full rationale behind the specific values below).
 *
 * This module is the Framer Motion–facing half of the system. The identical values are also
 * expressed as CSS custom properties in src/index.css's `@theme` block (`--transition-duration-*`,
 * the namespace Tailwind's own `duration-*` utility actually resolves against, plus `--ease-*` for
 * `ease-*`), which is how the site's own plain-CSS transitions (buttons, inputs, checkboxes) and
 * Tailwind utility classes (`duration-standard`, `ease-entrance`, ...) consume the same tokens. The
 * two can't literally share one source at runtime — Framer Motion reads plain JS values, Tailwind
 * reads CSS custom properties at build time — so they're kept in sync by hand. If a value changes
 * here, change it there too.
 *
 * Phase 2 of the Editorial Motion System: this file is complete and fully usable, but no component
 * has been migrated to import from it yet — that migration is a deliberate, separate later phase.
 * Nothing about how any component currently animates changes as a result of this file existing.
 */

/** Duration tiers, in seconds — Framer Motion's native unit for `transition.duration`. */
export const DURATION = {
  /** 150ms — instant tactile feedback: a quantity digit changing, a button press. */
  extraFast: 0.15,
  /** 200ms — quick state swaps: crossfades, small toggles, a value updating in place. */
  fast: 0.2,
  /** 300ms — the default. Most hover lifts, most expand/collapse interactions. */
  standard: 0.3,
  /** 550ms — a large, one-time reveal: a card settling into view, a page-level entrance. */
  slow: 0.55,
} as const

/**
 * Easing curves, as cubic-bezier control points. Four underlying shapes, named for the eight
 * situations they're meant to be reached for — a few names deliberately share a curve (expand ↔
 * entrance; collapse ↔ exit; hover ↔ press; fade ↔ movement) because they're the same physical
 * gesture wearing a different hat, not because the list needed padding to reach eight.
 */
export const EASE = {
  /** Gentle deceleration, no overshoot — the site's original signature curve (see PaperCard's own
   * scroll-reveal). Arriving content should feel like it's settling, not snapping into place. */
  entrance: [0.22, 1, 0.36, 1],
  /** The mirror of `entrance` — a gentle acceleration away. Departing content shouldn't linger. */
  exit: [0.64, 0, 0.78, 0],
  /** Quick and even — for the small, continuous, reversible gestures a cursor or a thumb makes. */
  hover: [0.35, 0, 0.65, 1],
  press: [0.35, 0, 0.65, 1],
  /** Unfolding open — literally `entrance` again: expanding content is an arrival too. */
  expand: [0.22, 1, 0.36, 1],
  /** Folding closed — literally `exit` again: collapsing content is a departure too. */
  collapse: [0.64, 0, 0.78, 0],
  /** Smooth at both ends — for a plain opacity change with no direction to justify asymmetry. */
  fade: [0.45, 0, 0.55, 1],
  /** Smooth at both ends — for a plain position/translation change with no arrival or departure. */
  movement: [0.45, 0, 0.55, 1],
} as const

export type DurationToken = keyof typeof DURATION
export type EaseToken = keyof typeof EASE

/**
 * Ready-to-spread Framer Motion `transition` objects, pairing the duration tier and easing curve
 * that fit each named purpose — so a component reaches for `MOTION.entrance` rather than
 * reassembling `{ duration: DURATION.slow, ease: EASE.entrance }` by hand every time.
 *
 * Usage (once a component is migrated — not done as part of this phase):
 *   <motion.div transition={MOTION.entrance} .../>
 */
export const MOTION = {
  entrance: { duration: DURATION.slow, ease: EASE.entrance },
  exit: { duration: DURATION.fast, ease: EASE.exit },
  hover: { duration: DURATION.fast, ease: EASE.hover },
  press: { duration: DURATION.extraFast, ease: EASE.press },
  expand: { duration: DURATION.standard, ease: EASE.expand },
  collapse: { duration: DURATION.standard, ease: EASE.collapse },
  fade: { duration: DURATION.fast, ease: EASE.fade },
  movement: { duration: DURATION.standard, ease: EASE.movement },
} as const satisfies Record<string, { duration: number; ease: readonly [number, number, number, number] }>
