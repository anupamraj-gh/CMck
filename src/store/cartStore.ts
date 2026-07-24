import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CustomerInfo, DeliveryInfo, SelectedCustomization } from '@/types'
import { SITE_CONFIG } from '@/config/content'

interface CartState {
  items: CartItem[]
  customer: CustomerInfo
  delivery: DeliveryInfo
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
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
  houseFlat: '',
  street: '',
  area: '',
  city: '',
  state: '',
  pinCode: '',
  landmark: '',
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
        const totalPrice = item.unitPrice * item.quantity
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
              ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
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
    },
  ),
)

export function calculateUnitPrice(
  basePrice: number,
  customizations: SelectedCustomization[],
): number {
  const modifierSum = customizations.reduce((sum, c) => sum + c.priceModifier, 0)
  return Math.max(basePrice + modifierSum, 0)
}

export function buildDefaultSelections(
  groups: { id: string; label: string; type: string; required?: boolean; options: { id: string; label: string; priceModifier: number }[] }[],
): Record<string, string | string[]> {
  const selections: Record<string, string | string[]> = {}
  for (const group of groups) {
    if (group.type === 'checkbox') {
      selections[group.id] = []
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
