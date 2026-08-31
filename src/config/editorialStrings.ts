/**
 * Editorial Voice System — shared microcopy reused across two or more components. Extracted here
 * so each phrase has exactly one source of truth: before this existed, "Send to Kitchen" and
 * "Currently Unavailable" were each hardcoded independently in multiple files, and "Back to Menu"
 * vs. "Back to the Menu" had already drifted into two different wordings for the same action on
 * the same page. See docs/editorial-voice-dictionary.md for the tone/terminology decisions behind
 * these strings — this file exists only to give them one place to live, not to redefine them.
 *
 * Deliberately does not include every piece of editorial copy in the app — a string that only
 * ever appears in one component (e.g. "Ready to Cook.", "Looks delicious.") stays inline there;
 * moving it here would add a layer of indirection with no duplication to prevent.
 */
export const EDITORIAL_STRINGS = {
  addToKitchenTray: 'Add to Kitchen Tray',
  sendToKitchen: 'Send to Kitchen',
  backToTheMenu: 'Back to the Menu',
  kitchenTrayWaiting: "Your Kitchen Tray is waiting for today's recipe.",
  itemAddedToKitchenTray: 'Added to your Kitchen Tray.',
  currentlyUnavailable: 'Currently Unavailable',
} as const

/** The screen-reader announcement for a successful add — composed here (not duplicated as its
 * own template literal at the call site) so it always stays in sync with `itemAddedToKitchenTray`
 * above, just recast as the lowercase, mid-sentence form a "{name} ..." announcement needs. */
export function itemAddedAnnouncement(productName: string): string {
  return `${productName} added to your Kitchen Tray.`
}
