import { useEffect, useState } from 'react'

const THRESHOLDS = Array.from({ length: 51 }, (_, i) => i / 50)
const GAP = 12
// A tall footer shouldn't chase the tray all the way to the top of the screen —
// cap how far it ever has to rise so it stays clear of the fixed header instead.
const MAX_LIFT = 420

/** Returns how many px a fixed bottom element should rise to clear the page <footer> as it scrolls into view. */
export function useFooterAvoidance(): number {
  const [overlap, setOverlap] = useState(0)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setOverlap(0)
          return
        }
        const raw = Math.max(0, window.innerHeight - entry.boundingClientRect.top + GAP)
        setOverlap(Math.min(raw, MAX_LIFT))
      },
      { threshold: THRESHOLDS },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return overlap
}
