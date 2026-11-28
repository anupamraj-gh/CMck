import type { Product } from '@/types'
import { CONTENT, subscribeToContent } from '@/config/content'

export let products: Product[] = CONTENT.products

subscribeToContent(() => {
  products = CONTENT.products
})

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
