import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CM-${timestamp}-${random}`
}

/**
 * Prefixes a root-relative path (e.g. "/", "/#menu") with Vite's `base` (see vite.config.ts —
 * "/CMck/" on GitHub Pages, "/" in dev). Needed for plain `<a href>` tags built from hardcoded
 * config paths, which — unlike react-router's `<Link>` (basename-aware) or index.html's own
 * asset references (rewritten by Vite at build time) — aren't automatically base-aware.
 */
export function withBase(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
