import raw from './content.json'
import { useSyncExternalStore } from 'react'
import type { Product } from '@/types'

type ContentConfig = Omit<typeof raw, 'products'> & { products: Product[] }

export let CONTENT: ContentConfig = raw as ContentConfig
export let SITE_CONFIG = CONTENT.site
export let DELIVERY_TIME_SLOTS = CONTENT.deliveryTimeSlots

const contentListeners = new Set<() => void>()
let currentContentJson = JSON.stringify(CONTENT)
let remoteContentRequest: Promise<void> | null = null

export function subscribeToContent(listener: () => void) {
  contentListeners.add(listener)
  return () => {
    contentListeners.delete(listener)
  }
}

export function useContent(): ContentConfig {
  return useSyncExternalStore(subscribeToContent, () => CONTENT, () => CONTENT)
}

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
    'launchOffer',
    'products',
  ]

  return (
    sections.every((section) => section in value) &&
    isRecord(value.site) &&
    Array.isArray(value.deliveryTimeSlots) &&
    value.deliveryTimeSlots.every((slot) => typeof slot === 'string') &&
    isRecord(value.sections) &&
    isRecord(value.productGrid) &&
    typeof value.productGrid.launchOfferHeadline === 'string' &&
    typeof value.productGrid.launchOfferDescription === 'string' &&
    Array.isArray(value.productGrid.launchOfferImages) &&
    value.productGrid.launchOfferImages.every((image) => typeof image === 'string') &&
    typeof value.productGrid.launchOfferImageAlt === 'string' &&
    isLaunchOffer(value.launchOffer) &&
    Array.isArray(value.products) &&
    value.products.every(isProduct)
  )
}

function isLaunchOffer(value: unknown): boolean {
  if (!isRecord(value) || !Array.isArray(value.bundles)) return false

  const textFields = [
    'backToMenuLabel',
    'introKicker',
    'title',
    'description',
    'samplePriceNotice',
    'selectionAriaLabel',
    'selectBundleLabel',
    'samplePriceLabel',
    'bundleContentsLabel',
    'addToTrayLabel',
    'trayReviewNote',
  ]

  return (
    textFields.every((field) => typeof value[field] === 'string') &&
    value.bundles.every((bundle) =>
      isRecord(bundle) &&
      typeof bundle.id === 'string' &&
      typeof bundle.name === 'string' &&
      typeof bundle.price === 'number' &&
      typeof bundle.image === 'string' &&
      typeof bundle.imageAlt === 'string' &&
      Array.isArray(bundle.contents) &&
      bundle.contents.every((item) => typeof item === 'string')
    )
  )
}

function setContent(content: ContentConfig) {
  const contentJson = JSON.stringify(content)
  if (contentJson === currentContentJson) return

  CONTENT = content
  SITE_CONFIG = content.site
  DELIVERY_TIME_SLOTS = content.deliveryTimeSlots
  currentContentJson = contentJson
  contentListeners.forEach((listener) => listener())
}

function loadJsonp(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const callbackName = `__cravingManagerContent_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const script = document.createElement('script')
    const endpoint = new URL(url)
    let settled = false
    const timeout = window.setTimeout(() => {
      settled = true
      reject(new Error('Timed out loading Google Sheets content'))
    }, 30_000)

    function cleanup() {
      window.clearTimeout(timeout)
      script.remove()
      Reflect.deleteProperty(window, callbackName)
    }

    Object.assign(window, {
      [callbackName]: (data: unknown) => {
        if (settled) return
        settled = true
        cleanup()
        resolve(data)
      },
    })
    endpoint.searchParams.set('callback', callbackName)
    endpoint.searchParams.set('_', String(Date.now()))
    script.src = endpoint.toString()
    script.async = true
    script.onload = () => {
      if (settled) cleanup()
      else {
        settled = true
        cleanup()
        reject(new Error('Google Sheets did not invoke its JSONP callback'))
      }
    }
    script.onerror = () => {
      if (settled) {
        cleanup()
        return
      }
      settled = true
      cleanup()
      reject(new Error('Unable to load Google Sheets content'))
    }
    document.head.appendChild(script)
  })
}

export function loadRemoteContent(): Promise<void> {
  const endpoint = import.meta.env.VITE_CONTENT_URL
  if (!endpoint) return Promise.resolve()
  if (remoteContentRequest) return remoteContentRequest

  remoteContentRequest = loadJsonp(endpoint)
    .then((content) => {
      if (!isContentConfig(content)) {
        throw new Error('Google Sheets returned invalid content')
      }
      setContent(content)
    })
    .catch((error: unknown) => {
      console.warn('Keeping the last valid content because remote content could not be loaded.', error)
    })
    .finally(() => {
      remoteContentRequest = null
    })

  return remoteContentRequest
}

export function fillTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '')
}
