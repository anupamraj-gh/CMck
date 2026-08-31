# Editorial Motion System

A shared vocabulary of durations and easing curves for every animated interaction in the app,
replacing the ad-hoc, invented-per-component values found by the [Motion Inventory](./motion-inventory.md)
audit. This document defines the tokens and the reasoning behind them. The tokens are now consumed
across the app's reusable components — see "Adoption status" below for exactly what was migrated
and what was deliberately left alone.

## Where the tokens live

The same values are expressed in two places, because the app has two kinds of animation consumer:

| File | Consumers | Form |
|---|---|---|
| `src/index.css` (`@theme` block) | Plain CSS transitions (`<Button>`, checkboxes, radio groups) and Tailwind utility classes | CSS custom properties: `--transition-duration-*` (the namespace Tailwind's `duration-*` utility actually resolves against), `--ease-*` |
| `src/lib/motion.ts` | Framer Motion components (`motion.*`, `AnimatePresence`) | Plain TS: seconds for duration, cubic-bezier arrays for easing |

Framer Motion animations are driven from JavaScript and can't read CSS custom properties at
runtime, so there is no way to share one literal source between the two. **The files are kept
numerically in sync by hand.** If a value changes, change it in both places.

## Principle: calm and handcrafted

Two things this system deliberately avoids:

- **Platform defaults.** No Material Design curves, no iOS spring defaults, no browser-default
  `ease`/`ease-in-out`. The `snappy` shape (`cubic-bezier(0.35, 0, 0.65, 1)`) was checked against
  Material's documented standard (`0.4, 0, 0.2, 1`) and accelerate (`0.4, 0, 1, 1`) curves and does
  not match either — it was chosen for feel, not borrowed.
- **Invented-per-component numbers.** Every value below is grounded in something the Phase 1 audit
  already found working in the app, not picked fresh. A system that doesn't reuse proven values
  isn't really a system.

"Calm" means no bounce, no overshoot, no elastic snap-back on these core tokens — the existing
`pop`/`drop` keyframes (built for playful decorative moments like the sparkle icon) are untouched
and stay outside this system on purpose. "Handcrafted" means asymmetric entrance/exit pairing
rather than one curve reused for everything, so arrivals and departures read differently, the way
they would if someone were placing and lifting a physical object rather than a UI toggling opacity.

## Duration tiers

| Token | Value | Grounded in (Phase 1 audit) | Reach for it when |
|---|---|---|---|
| **Extra Fast** | 150ms | `StickyProductCTA` quantity-stepper digit swap | Something tiny and continuous is happening — a digit ticking, a button's press-down |
| **Fast** | 200ms | `KitchenTraySheet` item row fade / `Header` badge crossfade | A small piece of UI is swapping state — a toast appearing, a badge updating, a value crossfading |
| **Standard** | 300ms | The most common duration already in use across cards, hovers, and `CustomizationGroupCard` expand/collapse | The default. Most hover lifts, most expand/collapse, most everyday transitions |
| **Slow** | 550ms | `PaperCard` scroll-reveal entrance | A large, one-time reveal — content settling onto the page, not something a user will trigger repeatedly |

Four tiers, not five or six: the audit found the existing app already clustering around
essentially these four speeds once the accidental one-offs were set aside. Naming them formalizes
what was already true more often than not, rather than adding a fifth "in-between" tier no
interaction in the app actually calls for.

## Easing curves

Four underlying cubic-bezier shapes, mapped across eight semantic names. A few names deliberately
point at the same shape — that's intentional, not padding: expanding content and arriving content
are the same gesture in different contexts, so they share a curve.

| Shape | Curve | Semantic names | Reasoning |
|---|---|---|---|
| Gentle deceleration, no overshoot | `cubic-bezier(0.22, 1, 0.36, 1)` | **Entrance**, **Expand** | The site's existing signature curve (already used for `PaperCard` reveals and the `drop` keyframe). Arriving/unfolding content should feel like it's settling into place, never snapping. |
| Gentle acceleration away | `cubic-bezier(0.64, 0, 0.78, 0)` | **Exit**, **Collapse** | The deliberate mirror of the entrance curve. Departing/folding content shouldn't linger the way arriving content is allowed to. |
| Quick and even | `cubic-bezier(0.35, 0, 0.65, 1)` | **Hover**, **Press** | Small, continuous, reversible gestures — a cursor entering/leaving, a thumb pressing down — read best as brisk and symmetric, not eased like a one-shot reveal. Confirmed distinct from Material's standard/accelerate curves. |
| Smooth at both ends | `cubic-bezier(0.45, 0, 0.55, 1)` | **Fade**, **Movement** | For changes with no inherent direction — a plain opacity crossfade, a plain position shift — where an asymmetric entrance/exit curve would imply an arrival or departure that isn't happening. |

## Usage

CSS / Tailwind:

```html
<button class="transition-colors duration-standard ease-hover">...</button>
```

Framer Motion:

```tsx
import { MOTION } from '@/lib/motion'

<motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={MOTION.entrance}
/>
```

`MOTION.*` bundles the paired duration + easing for each of the eight names, so components don't
need to reassemble `{ duration: DURATION.slow, ease: EASE.entrance }` by hand. `DURATION` and `EASE`
stay separately exported for the cases below where a component deliberately mixes a non-default
pairing (e.g. a quantity digit swap uses `DURATION.extraFast` with `EASE.press`, not a bundled
`MOTION.*` entry).

## Adoption status

The tokens are now wired into every reusable component reviewed for this pass — Kitchen Tray,
Sticky CTA, Buttons, Cards, Customization Groups, Checkout Steps, Quantity Controls, and Price
Updates. No component's motion *values* changed in a way that would read as a different animation
style: this pass retimed existing interactions onto the closest shared tier/curve pair (occasionally
shifting a duration a few tens of milliseconds, e.g. `CustomizationGroupCard`'s expand/collapse from
450ms to the Standard 300ms tier), it did not invent new movement, remove existing movement, or add
animation to anything that was static before.

Deliberately left unmigrated:

- **Spring-driven motion** (`KitchenTraySheet`'s slide-up panel, the various `whileTap` scale
  presses across `ProductGrid`) — Framer Motion springs are configured by `stiffness`/`damping`, not
  `duration`/`ease`, so they sit outside this duration-and-curve system entirely.
  `bounceAnimate`-style keyframe bounces (e.g. `FloatingKitchenTray`'s cart-bump) do use `duration`/
  `ease` and were retimed, but their bounce *keyframes* themselves are untouched.
- **`WhatsAppCtaStep`'s "Everything looks perfect." message** — flagged by the Motion Inventory as
  inconsistent with its sibling encouragement moments (which fade in), but it has no animation to
  retime today; adding one would be new motion, not a token migration, so it was left as-is.
- **The product image hover-zoom** (`transition-transform duration-700 group-hover:scale-110`) — a
  distinct decorative effect from the card's own paper-lift hover, not one of the eight named
  treatments, and not touched.
- **The decorative `--animate-float`, `--animate-wiggle`, `--animate-pop`, `--animate-drop`, and
  `--animate-sparkle` keyframes** — illustration-style animation (floating stickers, the sparkle
  icon) outside the scope of this interaction-motion system.
- **`FlyingCard`'s fly-to-tray animation** — a bespoke, one-off physics path for a single flying
  image, not a reusable component treatment.
