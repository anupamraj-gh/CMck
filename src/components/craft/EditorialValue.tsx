import { motion, AnimatePresence } from 'framer-motion'
import { MOTION } from '@/lib/motion'

/**
 * A subtle, non-directional crossfade for a value that updates live — no vertical movement, no
 * flashing colour, just a soft dissolve between the old and new value. Used anywhere a price,
 * quantity, or summary line needs to feel like a handwritten note being quietly updated by hand,
 * rather than an app-style number ticker.
 */
export function EditorialValue({ value, className = '' }: { value: string | number; className?: string }) {
  return (
    <span className="relative grid w-full min-w-0 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={MOTION.fade}
          className={`col-start-1 row-start-1 ${className}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
