import raw from './content.json'
import type { Product } from '@/types'

declare global {
  interface Window {
    __cravingManagerContentCallback?: (data: unknown) => void
  }
}

type ContentConfig = typeof raw & { products: Product[] }

export let CONTENT: ContentConfig = raw as ContentConfig
export let SITE_CONFIG = CONTENT.site
export let DELIVERY_TIME_SLOTS = CONTENT.deliveryTimeSlots

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.basePrice === 'number' &&
    Array.isArray(value.customizations)
  )
}

function isContentConfig(value: unknown): value is ContentConfig {
  if (!isRecord(value)) return false

  const sections = [
    'site',
    'deliveryTimeSlots',
    'sections',
    'nav',
    'hero',
    'productGrid',
    'about',
    'whyChooseUs',
    'testimonials',
    'faq',
    'footer',
    'products',
  ]

  return (
    sections.every((section) => section in value) &&
    isRecord(value.site) &&
    Array.isArray(value.deliveryTimeSlots) &&
    value.deliveryTimeSlots.every((slot) => typeof slot === 'string') &&
    isRecord(value.sections) &&
    Array.isArray(value.products) &&
    value.products.every(isProduct)
  )
}

function setContent(content: ContentConfig) {
  CONTENT = content
  SITE_CONFIG = content.site
  DELIVERY_TIME_SLOTS = content.deliveryTimeSlots
}

function loadJsonp(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const callbackName = '__cravingManagerContentCallback'
    const script = document.createElement('script')
    const endpoint = new URL(url)
    const timeout = window.setTimeout(() => {
      cleanup()
      reject(new Error('Timed out loading Google Sheets content'))
    }, 8000)

    function cleanup() {
      window.clearTimeout(timeout)
      window.__cravingManagerContentCallback = undefined
      script.remove()
    }

    window.__cravingManagerContentCallback = (data) => {
      cleanup()
      resolve(data)
    }
    endpoint.searchParams.set('callback', callbackName)
    endpoint.searchParams.set('_', String(Date.now()))
    script.src = endpoint.toString()
    script.async = true
    script.onerror = () => {
      cleanup()
      reject(new Error('Unable to load Google Sheets content'))
    }
    document.head.appendChild(script)
  })
}

export async function loadRemoteContent() {
  const endpoint = import.meta.env.VITE_CONTENT_URL
  if (!endpoint) return

  try {
    const content = await loadJsonp(endpoint)
    if (!isContentConfig(content)) {
      throw new Error('Google Sheets returned invalid content')
    }
    setContent(content)
  } catch (error) {
    console.warn('Using bundled content.json because remote content could not be loaded.', error)
  }
}

export function fillTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '')
}
