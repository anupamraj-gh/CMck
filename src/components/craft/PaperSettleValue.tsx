import { motion, AnimatePresence } from 'framer-motion'
import { DURATION, EASE } from '@/lib/motion'

/**
 * A slight "paper settling into place" transition for cart-level aggregate totals (subtotal,
 * grand total) — a soft fade with a couple of pixels of downward drift, no scale, no bounce, no
 * counting-up tween. The correct final value renders immediately; only its entrance is eased, so
 * the number is never technically wrong mid-animation the way a rolling counter would be.
 */
export function PaperSettleValue({ value, className = '' }: { value: string | number; className?: string }) {
  return (
    <span className="relative inline-grid place-items-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 3 }}
          transition={{ duration: DURATION.fast, ease: EASE.entrance }}
          className={`col-start-1 row-start-1 ${className}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
