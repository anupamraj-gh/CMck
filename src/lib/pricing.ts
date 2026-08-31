import type { CustomizationGroup, SelectedCustomization } from '@/types'
import { formatCurrency } from '@/lib/utils'

/**
 * The single pricing engine for the whole app. Every place that used to compute a unit price or
 * a line total (Product Page, the homepage quick-add cards, Kitchen Tray's edit view, the
 * Purchase Card, the Sticky CTA, cartStore's own add/update actions) now reads from these
 * functions instead of inlining the arithmetic — there is exactly one implementation of each
 * calculation, and every consumer shares it.
 *
 * This module intentionally does NOT own cart-level aggregation (subtotal/delivery/grand total
 * across multiple line items) — that's a cart concern, still owned by cartStore, which itself
 * sums the per-line `lineTotal` this engine produces. This module owns per-line pricing only:
 * base price, variant/add-on adjustments, quantity, unit price, line total, and currency
 * formatting.
 */

export interface PriceBreakdown {
  basePrice: number
  /** Sum of price modifiers from non-checkbox groups (radio/select) — a mutually-exclusive
   * choice like size or flavor, e.g. upgrading to a larger cake. */
  variantAdjustment: number
  /** Sum of price modifiers from checkbox groups — optional extras like toppings or add-ins. */
  addonAdjustment: number
  quantity: number
  unitPrice: number
  lineTotal: number
}

/**
 * Categorizes selected customizations into "variant" (radio/select — a mutually-exclusive choice
 * like size or flavor) vs "add-on" (checkbox — optional extras) buckets, by looking up each
 * selection's originating group type. A selection whose group can't be found (e.g. the product's
 * customizations changed after the selection was made) is conservatively treated as an add-on
 * rather than dropped. This is the one categorization both the price split below and any
 * "selected variant" summary display should read from.
 */
export function categorizeCustomizations(
  groups: CustomizationGroup[],
  customizations: SelectedCustomization[],
): { variant: SelectedCustomization[]; addon: SelectedCustomization[] } {
  const typeByGroupId = new Map(groups.map((group) => [group.id, group.type]))
  const variant: SelectedCustomization[] = []
  const addon: SelectedCustomization[] = []

  for (const customization of customizations) {
    if (typeByGroupId.get(customization.groupId) === 'checkbox') {
      addon.push(customization)
    } else {
      variant.push(customization)
    }
  }

  return { variant, addon }
}

/** Splits a set of selected customizations into "variant" vs "add-on" price adjustments. */
export function splitAdjustments(
  groups: CustomizationGroup[],
  customizations: SelectedCustomization[],
): { variantAdjustment: number; addonAdjustment: number } {
  const { variant, addon } = categorizeCustomizations(groups, customizations)
  const sum = (list: SelectedCustomization[]) => list.reduce((total, c) => total + c.priceModifier, 0)
  return { variantAdjustment: sum(variant), addonAdjustment: sum(addon) }
}

/**
 * The single place unit price is calculated from a base price and selected customizations.
 * Never negative — a stack of negative modifiers (e.g. "no cheese") can't make an item free.
 */
export function calculateUnitPrice(basePrice: number, customizations: SelectedCustomization[]): number {
  const modifierSum = customizations.reduce((sum, c) => sum + c.priceModifier, 0)
  return Math.max(basePrice + modifierSum, 0)
}

/** The single place a line total (unit price × quantity) is calculated. */
export function calculateLineTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity
}

/**
 * The full per-line pricing breakdown for a product configuration — base price, variant
 * adjustment, add-on adjustment, quantity, unit price, and line total, all derived from the same
 * calculations above. This is the one-stop read for any consumer that needs more than just the
 * final unit price (e.g. a future itemized order summary).
 */
export function getPriceBreakdown(
  basePrice: number,
  groups: CustomizationGroup[],
  customizations: SelectedCustomization[],
  quantity: number,
): PriceBreakdown {
  const { variantAdjustment, addonAdjustment } = splitAdjustments(groups, customizations)
  const unitPrice = calculateUnitPrice(basePrice, customizations)
  const lineTotal = calculateLineTotal(unitPrice, quantity)

  return { basePrice, variantAdjustment, addonAdjustment, quantity, unitPrice, lineTotal }
}

/** Re-exposed here so every pricing concern — including currency formatting — is reachable from
 * one module, without duplicating the implementation (still owned by `@/lib/utils`). */
export { formatCurrency }
