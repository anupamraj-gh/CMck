# Editorial Voice Dictionary

**Status: reference document only.** This defines the *official terminology* for Craving
Manager's interface. Nothing here has been applied to the app yet — no interface text changes
as a result of this document existing. It exists so that when a future phase (or a future
contributor) *does* rewrite copy, or writes copy for a brand-new feature, there's one place that
says what the right word is, not five components each guessing independently.

This builds directly on the Phase 1 audit (`docs/editorial-voice-inventory.md`), which catalogued
every visible string in the app today. Where this document and that inventory disagree about
whether something is "already on-voice," this document wins — it's the newer, deliberate call.

---

## 1. Voice principles

Before the word list, the *why* — so a term nobody thought to write down yet can still be judged
correctly.

1. **We're a kitchen, not a storefront.** The product is framed as a handwritten recipe journal,
   not a shopping cart. Prefer words a person would actually say in a kitchen or write in a
   notebook over words a checkout SDK would generate. ("Kitchen Tray," not "Cart.")
2. **Warm, not cute.** The voice is a friendly host, not a mascot. It's fine for copy to smile
   ("One last look before we cook") — it should never wink, pun, or perform. If a phrase makes you
   wince on a second read, it's cute, not warm. Cut it.
3. **Specific beats generic.** "Pay Now via WhatsApp" beats "Submit Order" because it tells the
   customer exactly what's about to happen. Prefer copy that names the real mechanism or the real
   next step over copy that could belong to any ecommerce template.
4. **Clarity outranks voice.** See §6, Exceptions. A confused customer is a bigger failure than a
   generic word. Where a clever phrase would cost even a half-second of "wait, what does this
   mean?", use the plain word instead. This is why `Continue → Continue` is a real, valid entry in
   this dictionary and not a mistake.
5. **One concept, one name.** If "recommended," "chef's pick," and "staff favourite" all exist in
   the app at once for the same underlying idea, that's not variety, it's inconsistency. Every
   concept gets exactly one preferred term (§4); if two components currently disagree, that's a
   bug to fix, not two valid options.
6. **Second person, present tense, active voice.** "Send to Kitchen," not "Your Order Will Be
   Sent." Address the customer directly and describe what's happening now, not what a system is
   doing to them.

---

## 2. Capitalisation rules

Derived from the patterns already consistently used across the app — codifying them so they stay
consistent as new copy is added.

| Element | Rule | Example |
|---|---|---|
| **Buttons & CTAs** | Title Case | `Add to Kitchen Tray`, `Send to Kitchen`, `Keep Browsing` |
| **Page / section headings (`h1`/`h2`)** | Title Case | `Customize Your Order`, `From Our Kitchen Notebook` |
| **Handwritten step headings / kickers** (`font-hand` elements) | Sentence case, no trailing period on questions/statements used as headings | `Let's get to know you`, `make it yours`, `a signature item` |
| **Form field labels** | Title Case, required fields marked with a trailing `*` | `Full Name *`, `Mobile Number *` |
| **Badges & tags** (highlight chips, ribbons) | Title Case | `Fresh Ingredients`, `Chef's Special` |
| **Body copy, captions, validation messages** | Sentence case | `Please choose a delivery date` |
| **Brand name & proper nouns** (`Craving Manager`, `Kitchen Tray`) | Always Title Case, never abbreviated or lowercased for effect | `Kitchen Tray`, never `kitchen tray` or `KT` |

Rule of thumb: **if it's clickable or a heading, Title Case. If it's a sentence someone reads,
sentence case.** Kickers are the one deliberate exception — they're written to look like a
handwritten annotation, not a heading, so they stay lowercase even though they visually sit above
a heading.

---

## 3. The Dictionary

Every entry is a *concept*, not a literal string — apply the preferred term wherever that concept
appears, adapting grammar as needed (e.g. "Kitchen Tray" the noun vs. "Add to Kitchen Tray" the
verb phrase).

### Cart & ordering

| Avoid | Preferred | Notes |
|---|---|---|
| Cart | **Kitchen Tray** | Already the app's own invented term almost everywhere. `OrderActions.tsx`'s `Add to Cart` button is the one remaining holdout — flagged in the Phase 1 inventory. |
| Add to Cart | **Add to Kitchen Tray** | |
| View Cart | **View Kitchen Tray** | Already correct in `StickyProductCTA`. |
| Cart is empty | **Your Kitchen Tray is waiting.** | Already correct in `KitchenTraySheet`; extend the same phrasing to `CheckoutPage`'s empty-cart state, which currently says "Your cart is empty!" |
| Quantity | **Quantity** | Keep as-is — a quantity stepper's label benefits from being unambiguous, not reinvented. |
| Order Summary | **Today's Kitchen Tray** | Applies to any generic "order summary" heading or accessible name — e.g. the internal `stepLabel` used for Checkout Step 3, or a future invoice/email heading. Does not replace the step's own handwritten heading ("One last look before we cook"), which already outperforms this. |

### Checkout & fulfillment

| Avoid | Preferred | Notes |
|---|---|---|
| Checkout | **Send to Kitchen** | Applies to the *action* — nav links, buttons, page framing. The route itself (`/checkout`) is a technical URL, not visible microcopy, and doesn't need to change. |
| Continue to Checkout | **Send to Kitchen** | Tray sheet's CTA into the checkout flow. |
| Continue Browsing | **Keep Browsing** | Dismisses the tray sheet, stays on the current page. |
| Add More Items | **Back to the Menu** | Matches the existing "Back to Menu" button already used elsewhere on the product page — one phrase for "go find something else," not two. |
| Save Changes | **Save to Kitchen Tray** | `TrayEditView`'s save button, after editing an item's customization. |
| Submit Order / Place Order | **Send to Kitchen** | If a non-WhatsApp order-submission path is ever added. The existing WhatsApp-specific button (`Pay Now via WhatsApp`) is already correct and doesn't need this — it's more specific than the generic term, which is preferred (see Principle 3). |

### Merchandising & recommendations

| Avoid | Preferred | Notes |
|---|---|---|
| Recommended | **Chef Recommends** | For any future generic "recommended item(s)" badge or section. |
| Chef's Recommendation | **Chef Recommends** | Existing copy in `ProductGrid.tsx` — harmonize to the dictionary form so the app has one phrasing, not two ("Chef's Special" is a *different* concept, see below, and stays). |
| Bestseller | **Kitchen Favourite** | `ProductGrid.tsx`'s bestseller ribbon — "bestseller" is sales-dashboard language; this keeps the chef/kitchen framing instead of a data-driven one. |
| Frequently Bought Together | **Perfect Pairings** | Not built yet — for the first feature that pairs products together. |
| Popular / Trending | **A Kitchen Favourite** | Same family as Bestseller — one term, reused, rather than three synonyms for "other people like this." |
| Chef's Special | **Chef's Special** *(keep)* | Distinct concept: the single, specific hero-featured product, not a generic recommendation badge. Don't conflate with "Chef Recommends" above. |

### Confirmations & status

| Avoid | Preferred | Notes |
|---|---|---|
| Added Successfully / Added to Cart! | **Added to Your Kitchen Tray** | Covers `ProductPage`'s toast ("Added to cart!") and `productGrid.addedLabel` ("Added"). |
| Order Confirmed | **Sent to the Kitchen** | For any future post-submit confirmation state. |
| Success! | **(describe what happened, not that it succeeded)** | Never use a bare "Success"/"Done" — say what happened: "Added to Your Kitchen Tray," not "Success!" |

### Loading & progress states

| Avoid | Preferred | Notes |
|---|---|---|
| Loading... | **Preparing Your Recipe...** | No loading state exists anywhere in the app today (confirmed in the Phase 1 audit — all data is local, nothing is fetched asynchronously), so there is nothing to apply this to yet. Documented here so the first async feature that needs one doesn't invent its own wording. |

### Availability & stock

| Avoid | Preferred | Notes |
|---|---|---|
| Out of Stock | **Currently Unavailable** | Already correct and consistent across `ProductGrid` and `StickyProductCTA` — no change needed. Keep using this exact phrase for any new "can't be ordered right now" state. |
| Sold Out | **Currently Unavailable** | `productGrid.soldOutLabel` currently says "Sold Out" — harmonize to the one term the rest of the app already uses. |
| In Stock | **(say nothing — availability is the default, assumed state)** | Only ever surface the *unavailable* state; a present, orderable product needs no badge at all. |

### Actions & navigation

| Avoid | Preferred | Notes |
|---|---|---|
| Edit *(bare word, Title Case button)* | **edit** *(lowercase, handwritten)* | `CustomizationGroupCard.tsx` already solved this with a small lowercase `font-hand` "edit"/"collapse" link. Extend that exact treatment to `CheckoutStepCard`'s "Edit" button and `TrayItemRow`'s "Edit" link — same word, same treatment, one visual language for "reopen something I already filled in." |
| Continue | **Continue** *(keep, when it's genuinely the clearest word)* | See Principle 4. A multi-step flow's "next step" button should say what the *next step is* when there's room (`Next, delivery details`) — but where space or context makes that awkward, plain "Continue" is correct and preferred over a forced, unclear alternative. |
| Submit | **(name the actual action)** | "Submit" never names what happens. Say `Send to Kitchen`, `Save to Kitchen Tray`, etc. — whatever the button actually does. |
| Buy Now | **(not used — no single-item express-buy flow exists)** | If one is ever built, prefer a phrase naming the real acceleration, e.g. `Skip to Kitchen Tray`, over generic "Buy Now." |

---

## 4. Avoided wording — quick-scan list

Words and phrases that should not appear in new copy without a specific, deliberate reason (and a
matching entry added to §3 above):

`Cart` · `Checkout` (as a visible label, not the URL) · `Add to Cart` · `Buy Now` · `Submit` ·
`Place Order` · `Order Confirmed` · `Success!` / `Done!` (bare) · `Out of Stock` · `Sold Out` ·
`In Stock` · `Bestseller` · `Popular` · `Trending` · `Recommended` (bare) · `Frequently Bought
Together` · generic `Edit` (Title Case, no handwritten treatment).

---

## 5. Exceptions — where plain, generic language is *correct*

Not everything should be rewritten into voice. Three zones are deliberately left plain, and future
contributors should resist the urge to "fix" them:

1. **Form field labels and placeholders.** `Full Name *`, `Mobile Number *`, `10-digit mobile
   number` — these need to be scanned and understood in under a second while someone is mid-task.
   A clever label here costs more than it adds. Keep them plain and functional.
2. **Validation and error messages.** Calm and clear beats characterful. `Please enter your full
   name` is correct; a cute rewrite of a validation message is not — someone reading it is already
   slightly stuck. (This matches the guidance already established for the checkout's own
   validation copy.)
3. **Financial figures and receipt-style rows.** `Subtotal`, `Grand Total`, `Unit price`,
   `Estimated Total` — these benefit from being instantly recognizable as a price breakdown.
   Leave them as standard receipt terminology; don't rename a subtotal into something twee.

If in doubt: ask whether the customer is *reading for pleasure* (a heading, an empty state, a
confirmation) or *reading to complete a task under mild time pressure* (a form, an error, a price).
Voice belongs to the former. Clarity owns the latter.

---

## 6. Guidance for future contributors

Before writing new interface copy:

1. **Check §3 first.** If the concept you're naming already has an entry, use that exact term —
   don't invent a synonym, even a good one.
2. **If it's genuinely new, ask which zone it's in.** Is this a heading/empty-state/confirmation
   (voice applies — see Principle 1–3) or a form/validation/price (plain language — see §5)?
3. **Write it as something a person would actually say**, not as a label a system generated. If
   you can't picture saying the phrase out loud to a customer standing in the kitchen, rewrite it.
4. **Run it past Principle 4.** If your on-voice phrase requires a beat of decoding, the plain
   version is the right answer. A missed joke costs nothing; a missed instruction costs a support
   ticket.
5. **Add it to this document.** A new concept isn't finished until it has an entry in §3 (and, if
   it introduces a new no-go word, in §4) — so the next contributor doesn't have to rediscover the
   decision you just made.
