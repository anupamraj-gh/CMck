import type { Product } from '@/types'
import { CONTENT } from '@/config/content'

export const products: Product[] = CONTENT.products

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
