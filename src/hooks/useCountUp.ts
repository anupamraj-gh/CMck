import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

/** Smoothly tweens a displayed number from its previous value to `value` whenever it changes
 * (e.g. a price ticking upward as an item is added), instead of snapping instantly. */
export function useCountUp(value: number, duration = 0.25): number {
  const [display, setDisplay] = useState(value)
  const prevValueRef = useRef(value)

  useEffect(() => {
    const from = prevValueRef.current
    prevValueRef.current = value
    if (from === value) return

    const controls = animate(from, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest),
    })
    return () => controls.stop()
  }, [value, duration])

  return Math.round(display)
}
