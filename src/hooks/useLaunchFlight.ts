import { useCallback } from 'react'
import { useFlyToTrayStore } from '@/store/flyToTrayStore'

/** Returns a function that launches a "card flying to the tray" animation from a given DOM element. */
export function useLaunchFlight() {
  const launch = useFlyToTrayStore((s) => s.launch)

  return useCallback(
    (source: HTMLElement | null, imageSrc: string) => {
      if (!source) return
      const rect = source.getBoundingClientRect()
      launch({
        imageSrc,
        fromRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      })
    },
    [launch],
  )
}
