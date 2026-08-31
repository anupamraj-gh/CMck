# Editorial Motion System — Phase 1: Motion Inventory

**Status: audit only.** Nothing in this document changes any animation. Every entry below
describes behavior exactly as it exists in the codebase today, for use as the baseline in later
Editorial Motion System phases. Companion to `docs/editorial-voice-inventory.md` (the equivalent
Phase 1 audit for the Editorial Voice System) — same posture, same rigor, motion instead of words.

## How to read this document

Three animation *systems* coexist in this codebase, and telling them apart matters for later
phases:

1. **Framer Motion** (`motion.*` components) — entrances, status transitions, price/quantity
   crossfades, springs. The large majority of what follows.
2. **Plain Tailwind CSS transitions** (`transition-colors`, `transition-all`, `duration-300`) —
   buttons, form inputs, checkboxes, radio buttons. Browser/Tailwind default easing, not the site's
   own curve.
3. **CSS `@keyframes`** declared in `index.css`'s `@theme` block (`animate-wiggle`, `animate-float`,
   `animate-float-slow`, `animate-sparkle`, plus two unused ones — see Inconsistencies) — decorative,
   infinitely-looping doodle motion.

For each entry: **Duration**, **Easing**, **Trigger** (what starts it), **Purpose** (why it exists).
"—" means the value isn't explicitly set and falls back to a library default (noted where relevant).

---

## 1. Page loads / route transitions

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| `App.tsx` — `AnimatePresence mode="wait"` wraps all routes | — (governed by whatever the entering/exiting page defines) | — | Route change (`location.pathname`) | Intended to let one page finish exiting before the next enters |
| `ProductPage.tsx` root `motion.div` | 0.3s | — (default) | Mount/unmount via the route AnimatePresence | Opacity-only fade in/out |
| `HomePage.tsx` | *none* | — | — | Plain fragment, no motion wrapper at all |
| `CheckoutPage.tsx` | *none* (main content) | — | — | Plain `<div>`, no motion wrapper — only its empty-cart sub-state animates (see §11) |

**Finding:** only `ProductPage` actually participates in the route-level `AnimatePresence` — `HomePage` and `CheckoutPage` are plain elements with no `initial`/`animate`/`exit`, so `mode="wait"` has nothing to defer for them. In practice this means navigating *to* or *from* Home/Checkout never fades at all, while navigating to/from a Product page does. The global `AnimatePresence` is set up as if every route fades, but only one of three actually does.

## 2. Hero appearance (`HeroSection.tsx`)

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Main headline block | 0.7s | `[0.22, 1, 0.36, 1]` | Mount | Primary entrance |
| Chef's-note badge | inherits parent (0.7s) | inherits | Mount (part of same block) | — |
| "Today's Special" sticky note | 0.5s, delay 0.6s | — (default) | Mount | Secondary, staggered entrance |
| "Chef's Pick" circular badge | spring, stiffness 180, damping 14, delay 0.5s | spring | Mount | Playful pop-in |
| "Lovingly Made" circular badge | spring, stiffness 180, damping 14, delay 0.7s | spring | Mount | Playful pop-in, staggered after Chef's Pick |
| Page-tab ("Page 01") | 0.4s | — | `whileInView`, once | Corner-tab reveal (shared `PageTab` component, used everywhere) |

## 3. Product cards (`ProductGrid.tsx`)

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Featured card | 0.55s | `[0.22, 1, 0.36, 1]` | `whileInView`, once, margin `-60px` | Card settles up from below with a slight rotation correction |
| Featured card hover | — (framer default spring) | — | `whileHover` (`rotate:0, y:-8, scale:1.01`) | Lift on hover |
| Recipe card (grid) | 0.55s, staggered `delay: (index % 3) * 0.08` | `[0.22, 1, 0.36, 1]` | `whileInView`, once, margin `-60px` | Same settle, staggered across the grid |
| Recipe card hover | — (framer default spring) | — | `whileHover` (`rotate:0, y:-8, scale:1.02`) | Lift on hover — note: **1.02**, vs Featured card's **1.01** |
| "Squish" bump on quantity increase | 0.22s | `'easeOut'` | `key` remount via `useBumpOnIncrease` | Card visually compresses (scale 1→0.98→1) when its cart quantity goes up |
| Price badge pop-in | spring, stiffness 220, damping 12, staggered `delay: 0.3 + (index % 3) * 0.08` | spring | `whileInView`, once | Corner price tag settling in |
| Price badge wiggle on quantity bump | 0.25s | `'easeOut'` | `key` remount via `useBumpOnIncrease` | Small rotation shimmy `[0, -8, 7, -4, 0]` |
| Quick-add ± quantity digit swap | 0.15s | — | Quantity change | `AnimatePresence popLayout`, scale+y pop |
| Quick-add button ↔ stepper swap (Add/Added label crossfade) | 0.2s | — | `justAdded` state change | `AnimatePresence mode="wait"`, y ±8 opacity fade |
| Quick-add button tap | — (framer default) | — | `whileTap` (`scale:0.85`/`0.94`) | Tactile press feedback |

## 4. Kitchen Tray

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Floating pill "bounce" | 0.32s | `'easeOut'` | Every mount via `key={bumpKey}` (item count increases) | Scale/rotate keyframe bounce (`[1,1.14,0.95,1.03,1]`) announcing a change |
| Floating pill hover/focus | — (framer default) | — | `whileHover`/`whileFocus` (`rotate:0, y:-2`) | Lift on interaction |
| Floating pill count/subtotal text swap | 0.2s | — | Item count or subtotal change | `AnimatePresence popLayout`, y ∓6 opacity fade |
| Sheet backdrop | 0.2s | — | Sheet open/close | Plain opacity fade |
| Sheet panel slide-up | spring, stiffness 300, damping 30 | spring | Sheet open/close | `y: '100%' → 0` |
| Tray item quantity digit swap | 0.15s | — | Quantity change | Same pop pattern as §3 |
| Tray item price crossfade (`EditorialValue`) | 0.2s | — | Price change | Pure opacity crossfade |
| Subtotal/Delivery/Grand Total (`PaperSettleValue`) | 0.2s | `[0.22, 1, 0.36, 1]` | Value change | Opacity + ±3px y-drift "paper settle" |
| Flying card (add-to-cart → tray) | 0.6s | `[0.32, 0, 0.67, 0]` | "Add" action, launched via `useLaunchFlight` | Thrown-object arc from source to tray icon — the **one** deliberately different easing curve in the app (an accelerating/ease-in feel, not the site's usual settle) |
| `TrayEditView` "Looks delicious." | 0.3s | — (no ease set) | Editing an item's customization to a valid state | New-message fade+y(-4) |

## 5. Sticky CTA (`StickyProductCTA.tsx`)

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Card mount/unmount | 0.3s | `[0.22, 1, 0.36, 1]` | Scroll position crossing show/hide thresholds (`useScrollVisibility`) | Fade + 14px y settle |
| Price crossfade (`EditorialValue`) | 0.2s | — | Price/state change | Same as tray |
| Quantity stepper digit swap | 0.15s | — | Quantity change | Same pop pattern as §3/§4 |

## 6. Buttons

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| All `<Button>` variants (hover bg/lift/shadow, active press) | 300ms (Tailwind `duration-300`) | browser default (`ease`) | `:hover`/`:active` (plain CSS, not Framer) | Color shift, `-translate-y-0.5` lift, shadow swap, `active:scale-[0.97]` press |
| Checkout step "Continue" buttons | inherits `<Button>` | inherits | — | No motion beyond the base button |
| Kitchen-Tray "Edit"/"collapse" text links (`CustomizationGroupCard`) | — | — | Click | No transition at all — instant toggle (the crossfade lives on the *card content*, not the link itself) |

**Finding:** every `<Button>` interaction (hover, press) runs on plain CSS transitions at 300ms
with the browser's default easing — a completely separate system, timing, and curve from the
Framer Motion animations used everywhere else, including the custom `[0.22, 1, 0.36, 1]` curve that
otherwise reads as the site's signature easing.

## 7. Quantity controls

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Digit swap (Order Actions, Sticky CTA, Tray item row, Order Summary, ProductGrid quick-add) | 0.15s (identical in all five places) | — | Quantity change | `AnimatePresence popLayout`, scale 0.7→1, y ∓8, opacity fade — **the one micro-animation that is fully consistent everywhere it appears** |
| −/+ stepper button tap | — (framer default, where wrapped in `motion.button`) or none (plain `<button>` in Order Summary/Tray Item Row) | — | Click | Two of five instances aren't `motion` elements at all, so they get no tap feedback the other three get |

## 8. Pricing updates

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| `EditorialValue` (per-line prices, captions) | 0.2s | — (pure opacity, no y-drift, so no ease to speak of) | Any tracked value change | Crossfade, "quietly updated by hand" |
| `PaperSettleValue` (aggregate totals: subtotal/delivery/grand total, everywhere) | 0.2s | `[0.22, 1, 0.36, 1]` | Any tracked value change | Opacity + ±3px y "paper settle" |
| "Ready to Cook." live price-box message | 0.3s | — (no ease set) | All required customization groups become complete | Fade + y(-4) entrance |

**Finding:** `EditorialValue` and `PaperSettleValue` are the two canonical "live pricing" motions
and both correctly use 0.2s — but `PaperSettleValue` carries the signature ease curve while
`EditorialValue` (opacity-only, so there's technically nothing for an ease curve to shape) doesn't
specify one at all. Not a bug, but worth naming: only one of the app's two "official" pricing
motions actually names the easing.

## 9. Checkout progression

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Step card status transition (locked/collapsed/expanded) | 0.45s | `[0.22, 1, 0.36, 1]` | Status change (auto-advance, manual Edit, manual collapse) | Fade + y(10/-6) + slight rotate-to-flat settle — "page turning into place" |
| Empty-cart illustration | spring, stiffness 180, damping 12 | spring | Mount (cart is empty) | Playful pop/settle |
| "Everything looks perfect." (Step 4) | *no explicit motion at all* | — | — | Plain static text — not animated in, unlike the sibling "Ready to Cook."/"Looks delicious." messages which do fade in |

## 10. Configuration groups (`CustomizationGroupCard.tsx`)

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Group status transition (locked/collapsed/expanded) | 0.45s | `[0.22, 1, 0.36, 1]` | Auto-advance, manual edit/collapse | Identical recipe to Checkout's step cards (intentionally shared pattern) |
| Radio/checkbox row background (selected state) | — (Tailwind `transition-colors`, default ~150ms) | Tailwind default | Selection change | Plain CSS, not Framer |

## 11. Hover states

| Element | Duration | Easing | Scale/offset |
|---|---|---|---|
| `PaperCard` (recipe steps, testimonials, etc.) | 0.3s | — (default) | `rotate:0, y:-6, scale:1.015` |
| Featured product card | — (default spring) | spring | `y:-8, scale:1.01` |
| Recipe/grid product card | — (default spring) | spring | `y:-8, scale:1.02` |
| `StickyNote` | 0.25s | — (default) | `scale:1.04` |
| `Polaroid` | 0.3s | — (default) | `y:-6, scale:1.03` |
| Testimonial/stat hang (`HomeSections`) | — (default spring) | spring | `scale:1.08` |
| `<Button>` (all variants) | 300ms | browser default | `-translate-y-0.5` (CSS, not Framer) |
| Floating Kitchen Tray pill | — (default spring) | spring | `y:-2` (no scale) |

**Finding:** at least **six different hover-lift scale values** (1.01, 1.015, 1.02, 1.03, 1.04,
1.08) are in use across visually-similar "paper card lifts on hover" moments, with three different
duration sources (explicit 0.25s, explicit 0.3s, and framer's implicit default spring) and no
shared preset behind any of them.

## 12. Loading states

**None found.** As established in the Editorial Voice System's Phase 1 audit, the app has no
asynchronous data fetching, so there is no spinner, skeleton, or loading transition anywhere to
inventory. Flagged again here since a future phase may introduce one with no existing motion
precedent to extend.

## 13. Empty states

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Empty Kitchen Tray sheet illustration | — (plain, no motion wrapper) | — | — | Static |
| Empty checkout page illustration | spring, stiffness 180, damping 12 | spring | Mount (cart is empty) | Playful pop/settle — same spring config as the checkout page's own empty state entry in §9 (this is the same element) |

## 14. Modal / overlay transitions

| Element | Duration | Easing | Trigger | Purpose |
|---|---|---|---|---|
| Kitchen Tray sheet (backdrop + panel) | 0.2s (backdrop) / spring 300-30 (panel) | — / spring | Open/close | See §4 |
| Mobile nav dropdown (`Header.tsx`) | 0.2s | — | Hamburger toggle | Fade + y(-12) + scale(0.97) |
| Radix `Select` dropdown (customizer, delivery time) | **none** | — | Open/close | No enter/exit animation at all — Radix's default instant mount/unmount, unlike every other overlay in the app |
| Native `<details>`/`<summary>` FAQ accordion | CSS `transition-transform` (default, ~150ms) on the `+` → `×` rotation only | Tailwind default | `<details open>` toggle | The `+`/rotate icon transitions; the content reveal itself is the browser's native, un-animated `<details>` open (instant) |

---

## Inconsistencies found

Ranked by how much they'd matter to a customer vs. how much they matter to future maintainers:

1. **Three different animation systems, no shared vocabulary between them.** Framer Motion
   (custom easing, explicit durations), Tailwind CSS transitions (buttons, inputs, checkboxes —
   300ms/default-ease or default ~150ms), and CSS `@keyframes` (doodles) each have their own timing
   and easing conventions. A button's hover and a card's hover feel like they belong to different
   products because they technically do.
2. **The signature ease curve `[0.22, 1, 0.36, 1]` is inconsistently applied even within Framer
   Motion.** It's used for "settle" entrances (`PaperCard`, checkout/customization status
   transitions, `PaperSettleValue`) but is *absent* from most hover states, most `whileInView`
   entrances outside product cards (Hero content, About/Recipe/Story sections, Header nav), and the
   three newest "moment" messages (`Ready to Cook.`, `Looks delicious.`, and the un-animated
   `Everything looks perfect.`).
3. **No shared spring preset.** At least eight distinct `{stiffness, damping}` pairs are in active
   use for conceptually similar "pop/settle" moments: 180/14, 180/12, 200/13, 200/14, 220/12,
   220/14, 260/18, and 300/30. Some of this variation is deliberate (a sheet sliding up is a
   different physical event than a badge popping in) — but there's no small, named set of presets
   to choose from; every component invented its own numbers.
4. **Hover-lift scale is inconsistent across visually identical card types**: 1.01–1.08 across six
   different components doing the same "paper lifts toward you" gesture.
5. **Route-level `AnimatePresence` only actually animates one of three pages** (`ProductPage`) —
   `HomePage` and `CheckoutPage` have no `motion` wrapper, so `mode="wait"` is set up as if the
   whole app fades between routes, but two-thirds of it doesn't.
6. **Radix `Select` has zero open/close motion**, while every other overlay in the app (Kitchen
   Tray sheet, mobile nav) animates in and out.
7. **`animate-pop` and `animate-drop`** are declared in `index.css`'s `@theme` block — complete
   with their own overshoot vs. non-overshoot easing curves — **but are never referenced by any
   component.** Dead motion definitions, one of which (`pop`) is the only intentionally
   *overshooting* easing curve declared anywhere in the codebase, unused.
8. **The flying-card animation's easing `[0.32, 0, 0.67, 0]`** is the one Framer Motion animation
   in the entire app that doesn't use the signature curve — apparently deliberate (a thrown object
   arcs differently than settling paper), but it's a silent exception with no comment explaining
   the choice, easy to mistake for a stray inconsistency rather than an intentional one.
9. **Newer "moment" messages lag the established pattern.** `TrayEditView`'s "Looks delicious." and
   `CustomizationSection`'s "Ready to Cook." fade in at 0.3s with no easing specified; the
   checkout's own "Everything looks perfect." doesn't animate in at all — while the *card-level*
   transitions they live inside (`CustomizationGroupCard`, `CheckoutStepCard`) both correctly use
   the full 0.45s + signature-ease recipe. The message text and its container are visibly not on
   the same animation system.
10. **Quantity-digit pop is the one fully consistent pattern in the app** — identical 0.15s
    scale/y/opacity recipe in all five places it appears (Order Actions, Sticky CTA, Tray Item
    Row, Order Summary, ProductGrid). Worth preserving as the reference example of "do it once,
    reuse everywhere" when later phases consolidate the rest.

## What's already strong (do not regress)

- `MotionConfig reducedMotion="user"` is set once, globally, in `App.tsx` — every Framer Motion
  animation in the app automatically strips transform-based motion under
  `prefers-reduced-motion`, with zero per-component handling required. This is the single biggest
  motion-system strength in the codebase and should be the model for how any future shared preset
  is delivered (one place, inherited everywhere).
- The "paper settling into place" family (`PaperCard`'s scroll-reveal, `PaperSettleValue`,
  checkout/customization status transitions) is a genuinely coherent, recognizable signature
  *where it's used* — the issue is consistency of application, not the design of the motion itself.
- Quantity-digit pop (§7) is fully consistent across all five instances — the existence proof that
  shared motion patterns are achievable in this codebase, not just aspirational.
