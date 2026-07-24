import raw from './content.json'
import type { Product } from '@/types'

export const CONTENT = raw as typeof raw & { products: Product[] }

export const SITE_CONFIG = CONTENT.site
export const DELIVERY_TIME_SLOTS = CONTENT.deliveryTimeSlots

export function fillTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '')
}
