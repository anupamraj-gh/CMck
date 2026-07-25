import { useCartStore } from '@/store/cartStore'

/** Total quantity of a given product currently in the cart, summed across every
 * customization variant of it (there can be more than one cart line per product). */
export function useProductCartQuantity(productId: string): number {
  return useCartStore((s) =>
    s.items.filter((item) => item.productId === productId).reduce((sum, item) => sum + item.quantity, 0),
  )
}
