import { useFlyToTrayStore } from '@/store/flyToTrayStore'
import { FlyingCard } from './FlyingCard'

/**
 * Renders in-flight "card flying to the tray" animations.
 * Must be mounted as a sibling of the tray (not inside its transformed wrapper) —
 * a transformed ancestor becomes the containing block for `position: fixed`
 * descendants, which would break the viewport-relative flight math.
 */
export function FlyingCardsLayer() {
  const flights = useFlyToTrayStore((s) => s.flights)
  const complete = useFlyToTrayStore((s) => s.complete)

  if (flights.length === 0) return null

  return (
    <>
      {flights.map((flight) => (
        <FlyingCard key={flight.id} flight={flight} onComplete={complete} />
      ))}
    </>
  )
}
