import { useEffect, useState, type RefObject } from 'react'

interface UseScrollVisibilityOptions {
  /** Becomes visible once this element fully exits the viewport (e.g. a hero section). */
  showAfterRef: RefObject<Element | null>
  /** Hides again once this element enters the viewport (e.g. a purchase card / footer CTA). */
  hideAtRef: RefObject<Element | null>
}

/**
 * Generic scroll-position visibility engine for sticky elements, built entirely on
 * IntersectionObserver — no scroll listeners, no scrollY math, no fixed pixel thresholds.
 * Knows nothing about what "hero" or "purchase card" mean; any future sticky component can
 * reuse this by pointing it at its own pair of boundary elements.
 */
export function useScrollVisibility({ showAfterRef, hideAtRef }: UseScrollVisibilityOptions): boolean {
  const [showAfterExited, setShowAfterExited] = useState(false)
  const [hideAtEntered, setHideAtEntered] = useState(false)

  useEffect(() => {
    const node = showAfterRef.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => setShowAfterExited(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [showAfterRef])

  useEffect(() => {
    const node = hideAtRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // "Entered" means either currently overlapping the viewport, or already scrolled fully
        // past it (above) — e.g. into the footer. Only the element being entirely below the
        // viewport (not yet reached) counts as "not entered". Deriving this from the current
        // geometry on every callback (rather than latching on a previously-seen intersection)
        // keeps it correct even if a fast scroll jumps straight past the element in one frame,
        // skipping the "entering" transition entirely.
        setHideAtEntered(entry.isIntersecting || entry.boundingClientRect.top < 0)
      },
      { threshold: 0 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hideAtRef])

  return showAfterExited && !hideAtEntered
}
