import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DURATION, EASE } from '@/lib/motion'

interface StickyNoteProps extends HTMLMotionProps<'div'> {
  color?: 'butter' | 'pink' | 'mint' | 'blue' | 'peach'
  rotate?: number
}

const colorClasses: Record<NonNullable<StickyNoteProps['color']>, string> = {
  butter: 'bg-butter',
  pink: 'bg-pink',
  mint: 'bg-mint',
  blue: 'bg-blue',
  peach: 'bg-peach',
}

export function StickyNote({
  color = 'butter',
  rotate = -3,
  className,
  children,
  ...props
}: StickyNoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: rotate - 10 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      whileHover={{ rotate: 0, scale: 1.04, transition: { duration: DURATION.fast, ease: EASE.hover } }}
      className={cn(
        'relative tape-shadow px-5 py-5',
        colorClasses[color],
        className,
      )}
      style={{
        clipPath:
          'polygon(0% 2%, 98% 0%, 100% 96%, 3% 100%)',
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
