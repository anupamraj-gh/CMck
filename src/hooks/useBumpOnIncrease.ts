import { useEffect, useRef, useState } from 'react'

/**
 * Returns a key that increments every time `value` goes up (never on decrease/removal).
 * Intended to be passed as a React `key` to remount a small motion element and replay a
 * "reacted to this" animation — e.g. a bounce, wiggle, or compress pulse.
 */
export function useBumpOnIncrease(value: number): number {
  const [bumpKey, setBumpKey] = useState(0)
  const prevRef = useRef(value)

  useEffect(() => {
    if (value > prevRef.current) {
      setBumpKey((k) => k + 1)
    }
    prevRef.current = value
  }, [value])

  return bumpKey
}
