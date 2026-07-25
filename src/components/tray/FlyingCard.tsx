import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Flight } from '@/store/flyToTrayStore'
import { ChefHatDoodle } from '@/components/decor/Doodles'

const TARGET_SELECTOR = '[data-kitchen-tray-target]'

interface FlyingCardProps {
  flight: Flight
  // The raw store action, not a wrapping closure — keeps this prop referentially stable
  // across re-renders so memo() below actually prevents unrelated flights re-rendering.
  onComplete: (id: string) => void
}

export const FlyingCard = memo(function FlyingCard({ flight, onComplete }: FlyingCardProps) {
  const [target, setTarget] = useState<DOMRect | null>(null)

  useEffect(() => {
    const el = document.querySelector(TARGET_SELECTOR)
    if (el) {
      setTarget(el.getBoundingClientRect())
    } else {
      // No tray mounted (shouldn't normally happen) — skip the flight rather than animate nowhere.
      onComplete(flight.id)
    }
    // Runs once per mounted flight — deliberately not re-seeding the target mid-flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!target) return null

  const { fromRect } = flight
  const fromCenterX = fromRect.left + fromRect.width / 2
  const fromCenterY = fromRect.top + fromRect.height / 2
  const toCenterX = target.left + target.width / 2
  const toCenterY = target.top + target.height / 2
  const landingScale = Math.max(0.18, Math.min(0.4, target.width / fromRect.width))

  return (
    <motion.div
      aria-hidden
      initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
      animate={{
        x: toCenterX - fromCenterX,
        y: toCenterY - fromCenterY,
        scale: landingScale,
        opacity: 0,
        rotate: -14,
      }}
      transition={{ duration: 0.6, ease: [0.32, 0, 0.67, 0] }}
      onAnimationComplete={() => onComplete(flight.id)}
      style={{
        position: 'fixed',
        top: fromRect.top,
        left: fromRect.left,
        width: fromRect.width,
        height: fromRect.height,
      }}
      className="z-[60] pointer-events-none overflow-hidden rounded-lg border-2 border-paper craft-shadow-lg bg-lavender-deep"
    >
      {flight.imageSrc ? (
        <img src={flight.imageSrc} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-lavender-deep">
          <ChefHatDoodle className="h-1/2 w-1/2 text-ink/40" />
        </div>
      )}
    </motion.div>
  )
})
