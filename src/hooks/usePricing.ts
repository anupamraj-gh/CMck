import { useMemo } from 'react'
import type { CustomizationGroup, SelectedCustomization } from '@/types'
import { getPriceBreakdown, type PriceBreakdown } from '@/lib/pricing'
import { selectionsToCustomizations } from '@/store/cartStore'

export interface PricingResult extends PriceBreakdown {
  customizations: SelectedCustomization[]
}

/**
 * The single reactive entry point into the pricing engine. Product Page and Kitchen Tray's edit
 * view both call this instead of deriving unit price / line total themselves.
 *
 * Recalculation is automatic and immediate: this is a plain memoized derivation of its inputs
 * (basePrice, groups, selections, quantity), so whenever the customer changes size, flavour, a
 * required option, an optional add-on, or the quantity, React re-renders with the new value and
 * this hook's dependency array picks it up on that same render — no debounce, no manual refresh,
 * no polling. All arithmetic still lives in `@/lib/pricing`'s pure functions; this hook performs
 * no calculation of its own, only reactive wiring, so the pricing logic itself stays deterministic
 * and trivially unit-testable in isolation from React.
 */
export function usePricing(
  basePrice: number,
  groups: CustomizationGroup[],
  selections: Record<string, string | string[]>,
  quantity: number,
): PricingResult {
  const customizations = useMemo(
    () => selectionsToCustomizations(groups, selections),
    [groups, selections],
  )

  return useMemo(
    () => ({ ...getPriceBreakdown(basePrice, groups, customizations, quantity), customizations }),
    [basePrice, groups, customizations, quantity],
  )
}
