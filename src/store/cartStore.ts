import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CustomerInfo, CustomizationGroup, DeliveryInfo, SelectedCustomization } from '@/types'
import { SITE_CONFIG } from '@/config/content'
import { calculateLineTotal } from '@/lib/pricing'

interface CartState {
  items: CartItem[]
  customer: CustomerInfo
  delivery: DeliveryInfo
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateCustomizations: (id: string, customizations: SelectedCustomization[], unitPrice: number) => void
  clearCart: () => void
  setCustomer: (customer: CustomerInfo) => void
  setDelivery: (delivery: DeliveryInfo) => void
  getSubtotal: () => number
  getDeliveryCharge: () => number
  getGrandTotal: () => number
  getItemCount: () => number
}

const emptyCustomer: CustomerInfo = {
  fullName: '',
  mobileNumber: '',
  address: '',
  pinCode: '',
  googleLocation: '',
  googleLocationDrivingDistanceMeters: null,
}

const emptyDelivery: DeliveryInfo = {
  preferredDate: '',
  preferredTime: '',
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customer: emptyCustomer,
      delivery: emptyDelivery,

      addItem: (item) => {
        const id = `${item.productId}-${Date.now()}`
        const totalPrice = calculateLineTotal(item.unitPrice, item.quantity)
        set((state) => ({
          items: [...state.items, { ...item, id, totalPrice }],
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity, totalPrice: calculateLineTotal(item.unitPrice, quantity) }
              : item,
          ),
        }))
      },

      updateCustomizations: (id, customizations, unitPrice) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, customizations, unitPrice, totalPrice: calculateLineTotal(unitPrice, item.quantity) }
              : item,
          ),
        }))
      },

      clearCart: () => set({ items: [], customer: emptyCustomer, delivery: emptyDelivery }),

      setCustomer: (customer) => set({ customer }),

      setDelivery: (delivery) => set({ delivery }),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal()
        if (subtotal === 0) return 0
        if (subtotal >= SITE_CONFIG.freeDeliveryAbove) return 0
        return SITE_CONFIG.deliveryCharge
      },

      getGrandTotal: () => get().getSubtotal() + get().getDeliveryCharge(),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'craving-manager-cart',
      // Add newly introduced customer fields when restoring older saved carts.
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CartState> | undefined
        return {
          ...currentState,
          ...persisted,
          customer: { ...emptyCustomer, ...persisted?.customer },
          delivery: { ...emptyDelivery, ...persisted?.delivery },
        }
      },
    },
  ),
)

/** Re-exported from the pricing engine so existing `import { calculateUnitPrice } from
 * '@/store/cartStore'` call sites keep working unchanged — the implementation itself now lives
 * in `@/lib/pricing`, the single source every pricing calculation in the app reads from. */
export { calculateUnitPrice } from '@/lib/pricing'

/** Stable signature for a set of selected customizations — customizations are always built by
 * iterating a product's groups in a fixed order, so two matching configurations always produce
 * identical arrays in the same order. */
function customizationSignature(customizations: { groupId: string; optionId: string }[]): string {
  return customizations.map((c) => `${c.groupId}:${c.optionId}`).join('|')
}

/**
 * The single source of truth for "is this exact product configuration already in the cart" —
 * used by both the homepage quick-add controls and the product page's sticky CTA so a quantity
 * stepper always attaches to the one matching cart line instead of creating a duplicate.
 */
export function findMatchingCartItem(
  items: CartItem[],
  productId: string,
  customizations: SelectedCustomization[],
): CartItem | undefined {
  const signature = customizationSignature(customizations)
  return items.find(
    (item) => item.productId === productId && customizationSignature(item.customizations) === signature,
  )
}

/**
 * Whether a product's required fields can be safely auto-filled with defaults, or whether it
 * genuinely needs the full customizer. A required radio/select always has a sensible default
 * (its first option) — the only case with no safe default is a *required* checkbox group
 * (buildDefaultSelections leaves those empty, since "pick at least one" can't be guessed) or a
 * required group that somehow has no options at all.
 */
export function needsCustomization(
  groups: { id: string; label: string; type: string; required?: boolean; options: { id: string; label: string; priceModifier: number }[] }[],
): boolean {
  return groups.some((group) => {
    if (!group.required) return false
    if (group.type === 'checkbox') return true
    return group.options.length === 0
  })
}

/**
 * Whether a single customization group currently has a valid selection — a required radio/select
 * group needs its value set to one of its own option ids, a required checkbox group needs at
 * least one option chosen, and any optional group is trivially satisfied regardless of what (if
 * anything) is selected. This is the one place that rule lives; both `areRequiredSelectionsComplete`
 * (whole-product gating) and the per-group configuration model read from it.
 */
export function isGroupSelectionComplete(
  group: { id: string; type: string; required?: boolean; options: { id: string }[] },
  selections: Record<string, string | string[]>,
): boolean {
  if (!group.required) return true
  const selected = selections[group.id]
  if (group.type === 'checkbox') return Array.isArray(selected) && selected.length > 0
  return typeof selected === 'string' && group.options.some((o) => o.id === selected)
}

/**
 * Whether every required customization group currently has a valid selection. Used to gate any
 * add-to-cart entry point (like the sticky product CTA) that must not submit an incomplete order.
 */
export function areRequiredSelectionsComplete(
  groups: { id: string; type: string; required?: boolean; options: { id: string }[] }[],
  selections: Record<string, string | string[]>,
): boolean {
  return groups.every((group) => isGroupSelectionComplete(group, selections))
}

export function buildDefaultSelections(
  groups: { id: string; label: string; type: string; required?: boolean; options: { id: string; label: string; priceModifier: number }[] }[],
): Record<string, string | string[]> {
  const selections: Record<string, string | string[]> = {}
  for (const group of groups) {
    if (group.type === 'checkbox') {
      const noneOption = group.options.find((option) => option.id === 'none')
      selections[group.id] = noneOption ? [noneOption.id] : []
    } else if (group.options.length > 0) {
      selections[group.id] = group.options[0].id
    }
  }
  return selections
}

export function selectionsToCustomizations(
  groups: { id: string; label: string; type: string; options: { id: string; label: string; priceModifier: number }[] }[],
  selections: Record<string, string | string[]>,
): SelectedCustomization[] {
  const result: SelectedCustomization[] = []

  for (const group of groups) {
    const selected = selections[group.id]
    if (!selected) continue

    if (group.type === 'checkbox' && Array.isArray(selected)) {
      for (const optionId of selected) {
        const option = group.options.find((o) => o.id === optionId)
        if (option) {
          result.push({
            groupId: group.id,
            groupLabel: group.label,
            optionId: option.id,
            optionLabel: option.label,
            priceModifier: option.priceModifier,
          })
        }
      }
    } else if (typeof selected === 'string') {
      const option = group.options.find((o) => o.id === selected)
      if (option) {
        result.push({
          groupId: group.id,
          groupLabel: group.label,
          optionId: option.id,
          optionLabel: option.label,
          priceModifier: option.priceModifier,
        })
      }
    }
  }

  return result
}

/** Inverse of `selectionsToCustomizations` — rebuilds a selections record from a cart item's
 * stored customizations, so an existing item's picks can pre-populate the edit form. */
export function customizationsToSelections(
  groups: CustomizationGroup[],
  customizations: SelectedCustomization[],
): Record<string, string | string[]> {
  const selections: Record<string, string | string[]> = {}
  for (const group of groups) {
    const matches = customizations.filter((c) => c.groupId === group.id)
    if (group.type === 'checkbox') {
      selections[group.id] = matches.map((m) => m.optionId)
    } else if (matches.length > 0) {
      selections[group.id] = matches[0].optionId
    }
  }
  return selections
}
