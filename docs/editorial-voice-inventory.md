# Editorial Voice System — Phase 1: Microcopy Inventory

**Status: audit only.** Nothing in this document has been applied to the app. No visible text was
changed to produce this inventory — every entry below is quoted exactly as it exists in the
codebase today, for use as the baseline in later Editorial Voice System phases.

## How to read this document

Each entry is grouped by function, not by file, since the same kind of message (an error, a button)
appears in several places and should be judged for voice consistency as a set. For every entry:

- **Text** — the exact string today.
- **Where** — component file (and line, where a single line pins it precisely).
- **Voice** — a quick read on whether it already matches the site's established handcrafted/
  editorial voice, or reads as generic ecommerce boilerplate.

A running "Generic terminology" list closes out the document — the concrete shortlist a rewrite
phase should target first.

---

## 1. Buttons

| Text | Where | Voice |
|---|---|---|
| `Add to Cart` | `OrderActions.tsx:115` | Generic |
| `Add More Items` | `OrderActions.tsx:119` | Generic |
| `Checkout` | `OrderActions.tsx:122` | Generic |
| `Add to Kitchen Tray` (default state) | `StickyProductCTA.tsx:200` | On-voice |
| `Add to Kitchen Tray` (disabled, options incomplete) | `StickyProductCTA.tsx:144` | On-voice |
| `Currently Unavailable` (disabled button label) | `StickyProductCTA.tsx:128` | Generic/flat |
| `View Kitchen Tray` | `StickyProductCTA.tsx:181` | On-voice |
| `Next, delivery details` | `CheckoutPage.tsx:250` | On-voice |
| `Show me the order` | `CheckoutPage.tsx:280` | On-voice |
| `Let's wrap this up` | `CheckoutPage.tsx:310` | On-voice |
| `Pay Now via WhatsApp` | `WhatsAppCtaStep.tsx:31` | On-voice (functional + branded) |
| `Edit` (collapsed checkout step) | `CheckoutStepCard.tsx:94` | Generic (bare verb) |
| `edit` / `collapse` (handwritten toggle, customization groups) | `CustomizationGroupCard.tsx` | On-voice |
| `Edit` (Kitchen Tray line item) | `TrayItemRow.tsx:91` | Generic (bare verb) |
| `Save Changes` | `TrayEditView.tsx:168` | Generic |
| `Continue to Checkout` | `KitchenTraySheet.tsx:160` | Generic |
| `Continue Browsing` | `KitchenTraySheet.tsx:163` | Generic |
| `Browse Menu` | `KitchenTraySheet.tsx:127` (empty tray) | Mild-generic, close to on-voice |
| `Explore Menu` | `CheckoutPage.tsx:206` (empty cart) | Mild-generic, close to on-voice |
| `Back to Home` | `ProductPage.tsx` (product-not-found) | Generic |
| `Back to Menu` | `ProductPage.tsx:108` | Generic |
| `Customize` | `ProductGrid.tsx` (`productGridContent.customizeLabel`) | Generic |
| `Add` / `Add to Kitchen Tray` (grid quick-add) | `content.json` → `productGrid.addLabel` / `addFullLabel` | Mixed — one generic, one on-voice |
| `Added` (post-add confirmation label) | `content.json` → `productGrid.addedLabel` | Generic |
| `Sold Out` | `content.json` → `productGrid.soldOutLabel` | Generic |
| `Order Now` / `Explore Menu` (hero CTAs) | `content.json` → `hero.ctaPrimaryLabel` / `ctaSecondaryLabel` | Generic |

## 2. Empty states

| Text | Where | Voice |
|---|---|---|
| "Your cart is empty!" | `CheckoutPage.tsx:203` | Generic heading, but... |
| "Go browse our menu and pin some delicious items to your cart." | `CheckoutPage.tsx:204` | ...on-voice body copy ("pin") |
| "Your Kitchen Tray is waiting." | `KitchenTraySheet.tsx:124` | On-voice |
| "Add your favourite dishes to begin." | `KitchenTraySheet.tsx:125` | On-voice |
| "Hmm, that page fell off the notebook" | `ProductPage.tsx` (404/not-found) | On-voice |
| "We couldn't find that product." | `ProductPage.tsx` | Generic follow-up line under an on-voice headline |
| "Place Photo Here" | `PhotoPlaceholder.tsx:8` | On-voice (used when a product has no image) |

## 3. Loading states

**None found.** The app has no asynchronous data fetching — all product/content data is local
(`content.json`, `src/data/products`), so there are no spinners, skeletons, or "Loading…" strings
anywhere in the codebase (confirmed via full-text search). Worth flagging explicitly: if a future
phase introduces any async behavior (e.g. a real backend), this is a voice gap with zero existing
precedent to extend — it'll need to be originated, not edited.

## 4. Checkout labels

| Text | Where | Voice |
|---|---|---|
| "almost there" (kicker) | `CheckoutPage.tsx:221` | On-voice |
| "Checkout" (page heading) | `CheckoutPage.tsx:222` | Generic (functional, expected as a proper noun though) |
| "Let's get to know you" (Step 1 heading) | `CheckoutPage.tsx:229` | On-voice |
| "Where should today's recipe be delivered?" (Step 2 heading) | `CheckoutPage.tsx:257` | On-voice |
| "One last look before we cook" (Step 3 heading) | `CheckoutPage.tsx:287` | On-voice |
| "Ready to send this to the kitchen?" (Step 4 heading) | `CheckoutPage.tsx:317` | On-voice |
| `Full Name *` | `CustomerInformationStep.tsx:33` | Generic form label |
| `Mobile Number *` | `CustomerInformationStep.tsx:51` | Generic form label |
| `House / Flat No. *` | `CustomerInformationStep.tsx:69` | Generic form label |
| `Street *` / `Area *` / `City *` / `State *` / `PIN Code *` | `CustomerInformationStep.tsx` | Generic form labels |
| `Landmark (Optional)` | `CustomerInformationStep.tsx:171` | Generic form label |
| `Preferred Delivery Date *` / `Preferred Delivery Time *` | `DeliveryDetailsStep.tsx` | Generic form labels |
| `Subtotal` / `Delivery` / `Grand Total` | `OrderSummaryStep.tsx` | Generic (standard receipt terms) |
| "Free delivery on orders above ₹999" | `OrderSummaryStep.tsx:126` | Generic (functional) |
| "Generates a PDF invoice & opens WhatsApp with your order details" | `WhatsAppCtaStep.tsx:35` | Generic/functional caption |

## 5. Product actions

| Text | Where | Voice |
|---|---|---|
| "total, please" | `OrderActions.tsx:100` | On-voice |
| "Quantity" | `OrderActions.tsx:67` | Generic label |
| `current unit price` | `CustomizationSection.tsx:187` | On-voice-adjacent (lowercase, hand-labeled) |
| "make it yours" (kicker) | `CustomizationSection.tsx` | On-voice |
| "Customize Your Order" (heading) | `CustomizationSection.tsx` | Generic heading |
| "Every selection updates your price in real-time" | `CustomizationSection.tsx` | Generic/functional |
| `Chef's Special` (featured product ribbon) | `ProductGrid.tsx:277` | On-voice |
| `Bestseller` (badge) | `ProductGrid.tsx:343` | Generic |
| `Chef's Recommendation` | `ProductGrid.tsx:459` | On-voice |
| "Try our {product name}" | `ProductGrid.tsx:462` | On-voice |
| "a signature item" (kicker) | `ProductHero.tsx:50` | On-voice |
| "the full recipe, documented" (kicker) | `RecipeSection.tsx:21` | On-voice |
| "From Our Kitchen Notebook" (heading) | `RecipeSection.tsx:22` | On-voice |
| "Ingredients Used" / "Cooking Instructions" / "Preparation Steps" | `RecipeSection.tsx` | Generic section labels (plain, functional) |
| "a note from the chef" | `RecipeSection.tsx:100` | On-voice |
| "watch the recipe" | `RecipeVideo.tsx:77` | On-voice |
| "How We Make {product name}" | `RecipeVideo.tsx:79` | On-voice |
| "Here's how we make it" | `StoryTransition.tsx:21` | On-voice |
| Group titles: `Base Flavor`, `Frosting`, `Toppings`, `Size`, `Sweetness Level`, `Protein Type`, `Add-ins`, `Patty Type`, `Cheese`, `Sauces` | `content.json` (per-product `customizations[].label`) | Generic/functional (plain noun labels — deliberately, since they're option-picker headers) |
| `Not selected yet` / `None selected` (collapsed group summaries) | `CustomizationSection.tsx` (`summarizeGroup`) | Generic |

## 6. Kitchen Tray

| Text | Where | Voice |
|---|---|---|
| "Kitchen Tray" (name used throughout) | multiple | On-voice (the site's own name for "cart") |
| "0 items · Tap to start ordering" | `FloatingKitchenTray.tsx:80` | Generic/functional |
| "{n} item(s) · {price}" | `FloatingKitchenTray.tsx:91` | Generic/functional |
| "View Tray" | `FloatingKitchenTray.tsx:100` | Generic |
| `Kitchen Tray` (sheet heading) | `KitchenTraySheet.tsx:111` | On-voice |
| "Your Kitchen Tray is waiting." | `KitchenTraySheet.tsx:124` | On-voice |
| "Unit price" | `TrayEditView.tsx:164` | Generic label |
| "Estimated Total" | `KitchenTraySheet.tsx:156` | Generic |

## 7. Validation messages

| Text | Where | Voice |
|---|---|---|
| "Please enter your full name" | `CheckoutPage.tsx:26` | On-voice-ish (calm, "please") |
| "Enter a valid 10-digit mobile number" | `CheckoutPage.tsx:28` | Generic/functional |
| "Please fill this in" (houseFlat/street/area/city/state) | `CheckoutPage.tsx:30-34` | On-voice-ish, but generic/repeated across 5 different fields with zero field-specific context |
| "Enter a valid 6-digit PIN" | `CheckoutPage.tsx:36` | Generic/functional |
| "Please choose a delivery date" | `CheckoutPage.tsx:43` | On-voice-ish |
| "Please choose a delivery time" | `CheckoutPage.tsx:44` | On-voice-ish |

## 8. Error messages

No distinct "error" messages beyond the validation set above and the two not-found states already
listed under Empty States ("Hmm, that page fell off the notebook" / "We couldn't find that
product."). There is no generic/global error boundary or toast-style error surface anywhere in the
app.

## 9. Success messages

| Text | Where | Voice |
|---|---|---|
| "Added to cart!" (toast) | `ProductPage.tsx` | Generic |
| "Added" (grid quick-add confirmation) | `content.json` → `productGrid.addedLabel` | Generic |
| sr-only: "{product} added to tray" | `ProductGrid.tsx:249` | On-voice ("tray") but screen-reader-only, never seen |

## 10. Form hints

| Text | Where | Voice |
|---|---|---|
| `Your full name` (placeholder) | `CustomerInformationStep.tsx:39` | Generic |
| `10-digit mobile number` (placeholder) | `CustomerInformationStep.tsx:57` | Generic |
| `Near...` (landmark placeholder) | `CustomerInformationStep.tsx:176` | Generic |
| `Select time slot` (placeholder) | `DeliveryDetailsStep.tsx:69` | Generic |
| `Select {group label}` (customizer select placeholder) | `CustomizationOptionsList.tsx` | Generic |

## 11. Section headings

| Text | Where | Voice |
|---|---|---|
| "Customize Your Order" | `CustomizationSection.tsx` | Generic |
| "From Our Kitchen Notebook" | `RecipeSection.tsx` | On-voice |
| "Where Passion Meets Plate" | `content.json` → `about.title` | On-voice |
| "The {brandName} Difference" | `content.json` → `whyChooseUs.titleTemplate` | On-voice (template) |
| "What Our Customers Say" | `content.json` → `testimonials.title` | Generic |
| "Before You Place\nYour Craving" (FAQ) | `content.json` → `faq.heading` | On-voice |
| "The Curated Menu" | `content.json` → `productGrid.title` | On-voice |
| Kickers throughout ("make it yours", "a signature item", "the full recipe, documented", "a page from our journal", "pinned up around the kitchen", "letters from happy tables", "quick answers, before you order", "our signature collection") | various, mostly `content.json` | On-voice, consistently strong |

## 12. Navigation

| Text | Where | Voice |
|---|---|---|
| `Home`, `Menu`, `About`, `FAQ` (header nav links) | `content.json` → `nav.links` | Generic (expected — nav labels are conventionally plain) |
| `Our Menu`, `About Us`, `FAQ`, `Contact`, `Checkout` (footer quick links) | `Footer.tsx` / `content.json` | Generic |
| `Cart` (sr-only header cart label) | `Header.tsx:45` | Generic |
| "Toggle menu" (mobile nav aria-label) | `Header.tsx:65` | Generic |

## 13. CTA labels

(Distinct from "Buttons" above where the CTA is a headline invitation rather than a form action.)

| Text | Where | Voice |
|---|---|---|
| "Order Now" | `content.json` → `hero.ctaPrimaryLabel` | Generic |
| "Explore Menu" | `content.json` → `hero.ctaSecondaryLabel` | Generic |
| "made for food lovers" (hero footnote) | `content.json` → `hero.footnote` | On-voice |

---

## Generic ecommerce terminology — shortlist for rewrite phases

Ranked by how much it stands out against the site's otherwise strong editorial voice:

1. **`Add to Cart`** (`OrderActions.tsx`) — the one true holdout. Every *other* add-to-cart-shaped
   action in the app already says "Add to Kitchen Tray" — this is the single inconsistency where
   the site's own invented vocabulary ("Kitchen Tray") doesn't reach.
2. **`Checkout`, `Add More Items`** (`OrderActions.tsx`) — plain functional labels sitting directly
   beside the on-voice checkout step headings ("Let's get to know you", etc.).
3. **Generic form field labels** (`Full Name *`, `Mobile Number *`, `PIN Code *`, etc.) — expected
   to stay mostly functional, but currently zero personality, in a checkout that otherwise reads
   like consecutive journal entries.
4. **"Please fill this in"** reused verbatim across 5 different fields (houseFlat/street/area/
   city/state) — one message doing the job of five, with no field-specific warmth.
5. **`Edit`** (bare word, `CheckoutStepCard.tsx` + `TrayItemRow.tsx`) — inconsistent with
   `CustomizationGroupCard.tsx`'s own lowercase handwritten `edit`/`collapse`, which already solved
   this exact problem elsewhere in the app.
6. **`Save Changes`, `Continue to Checkout`, `Continue Browsing`** (`TrayEditView.tsx`,
   `KitchenTraySheet.tsx`) — standard SaaS/ecommerce phrasing inside a component (`KitchenTraySheet`)
   that otherwise opens with "Your Kitchen Tray is waiting."
7. **`Bestseller`** (`ProductGrid.tsx`) — a flat badge word next to `Chef's Special` and
   `Chef's Recommendation`, which both already carry the voice.
8. **"Added to cart!"** (`ProductPage.tsx` toast) and **`Added`** (`productGrid.addedLabel`) —
   generic confirmation language for an app that calls its cart a "Kitchen Tray" everywhere else.
9. **`Currently Unavailable`** (`StickyProductCTA.tsx`) — flat, repeated twice (caption + disabled
   button) with no attempt at in-voice phrasing.
10. **`Subtotal` / `Grand Total` / `Estimated Total` / `Unit price`** — conventional receipt
    terminology, consistent across Checkout and Kitchen Tray, but never touched by the editorial
    voice pass that reached almost everything else on the page.

## What's already strong (do not regress)

The site's existing editorial voice is not starting from zero — a majority of headings, kickers,
empty states, and the entire guided-checkout heading sequence are already deliberately
handwritten/recipe-journal in tone ("Let's get to know you", "One last look before we cook", "Your
Kitchen Tray is waiting.", "Hmm, that page fell off the notebook"). Future rewrite phases should
extend that same voice into the generic list above, not invent a new one.
