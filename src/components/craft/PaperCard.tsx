import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DURATION, EASE, MOTION } from '@/lib/motion'

interface PaperCardProps extends HTMLMotionProps<'div'> {
  rotate?: number
  wobble?: 1 | 2 | 3 | 4
  tone?: 'paper' | 'cream' | 'lavender' | 'purple'
  hoverLift?: boolean
  fold?: boolean
}

const toneClasses: Record<NonNullable<PaperCardProps['tone']>, string> = {
  paper: 'bg-paper',
  cream: 'bg-cream',
  lavender: 'bg-lavender',
  purple: 'bg-purple/60',
}

export function PaperCard({
  className,
  rotate = 0,
  wobble = 3,
  tone = 'paper',
  hoverLift = true,
  fold = false,
  children,
  ...props
}: PaperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotate - 2 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={MOTION.entrance}
      whileHover={
        hoverLift ? { rotate: 0, y: -6, scale: 1.015, transition: { duration: DURATION.fast, ease: EASE.hover } } : undefined
      }
      className={cn(
        'craft-shadow relative bg-grain wobble-' + wobble,
        fold && 'page-fold',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
