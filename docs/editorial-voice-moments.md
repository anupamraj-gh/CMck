# Editorial Voice — Dynamic Moments

An extension of the Editorial Voice Dictionary (`editorial-voice-dictionary.md`), specifically for
*moments*: points in a flow where the interface can offer a short, chef-like note of encouragement,
as distinct from routine status text. Two documents, two jobs — the dictionary says what a *concept*
is called; this one says *when a moment deserves its own voice at all*.

## The rubric

Before adding a new moment, all four must be true:

1. **It's a one-time or rare transition, not a routine repeat.** The customer's tenth quantity tap
   is not a moment. Their tray going from empty to not-empty is.
2. **It doesn't block or slow anything down.** These are asides, not gates — never a modal, never
   something the customer must dismiss before continuing. If it can't be a passive aside, it isn't
   in scope for this pattern.
3. **The workflow doesn't pause for it.** No message here ever waits for a click, adds a step, or
   sits between the customer and their next action.
4. **It fits in one short sentence.** If it needs two, it isn't subtle anymore.

If any of the four fails, the right answer is silence, not a shorter version of the message.

## Implemented

| Moment | Trigger | Message | Where |
|---|---|---|---|
| First item added | Kitchen Tray goes from empty → 1 item (checked at the moment of adding, before the write) | "Your recipe is coming together." | `ProductPage.tsx` toast, `ProductGrid.tsx` quick-add confirmation (full-label instances only — compact quick-adds show no label at all, first item or not) |
| Every later add | Any add after the first | "Added to your Kitchen Tray." | Same two locations — the routine, calmer confirmation from the previous phase, unchanged |
| Customization complete (first configuration) | Every required group on the Product Page becomes done | "Ready to Cook." | `CustomizationSection.tsx`, inside the price box |
| Customization complete (editing an existing item) | Customer changes something in an already-in-cart item's customizer, and the result is valid | "Looks delicious." | `TrayEditView.tsx`, above the Save button. Gated on *having edited something* — an untouched edit view is already valid by definition (it was in the cart already), so showing this before any change would be decoration, not encouragement. |
| Before WhatsApp submission | Reaching the final checkout step, everything already validated | "Ready to send this to the kitchen?" | Already implemented (checkout Step 4's own heading) — confirmed as a correct existing instance of this pattern, no change needed. |
| Checkout fully ready | Reaching the WhatsApp step (all prior steps valid by construction) | "Everything looks perfect." | `WhatsAppCtaStep.tsx`, above the Pay Now button (added in the previous phase, alongside this one) |

## Considered, not implemented

Moments that came up during this pass but didn't clear the rubric — recorded so a future
contributor doesn't have to re-litigate them:

- **Crossing the free-delivery threshold mid-cart.** Genuinely a nice moment, but implementing it
  well means tracking a "just crossed" transition in two separate components (`OrderSummaryStep`
  and `KitchenTraySheet` both show the same free-delivery line independently) without ever showing
  it on a *decrease* back below the threshold. Worth doing, but as its own deliberate pass — not a
  drive-by addition here.
- **Quantity increase/decrease.** Fails rule 1 outright — this is the single most repeated action
  in the app. A note on every tap would be exhausting, not warm.
- **Revisiting an already-fully-configured product page.** Not a transition at all — there's no
  "before" state the customer would notice changing.
- **Every optional add-on toggle.** Same failure as quantity — too frequent, too low-stakes.
- **A message on the very first visit to the site.** Interesting in principle, but it's a
  marketing/onboarding concern, not a workflow-state moment, and out of scope for this system.

## Guidance for future contributors

- Run any new candidate through the four-point rubric above before writing copy for it.
- Reuse the dictionary's tone principles (Principle 2, "warm not cute"; Principle 4, "clarity
  outranks voice") — a moment message is still subject to both.
- Prefer a plain, complete sentence over a fragment: "Ready to Cook." reads as a chef's own
  aside; "Ready!" reads as a system toast with a costume on.
- If the moment can't be detected without adding real state-tracking complexity (see the
  free-delivery example above), that's a signal to slow down and design it properly rather than
  bolt it onto an unrelated change.
- A message that fires but isn't gated on an actual "did this just become true" transition (rather
  than "is this true right now") will fire on every re-render once the condition holds, and
  desensitize the customer to it immediately. Every implemented example above is gated on a
  transition, not a static condition — keep that discipline.
