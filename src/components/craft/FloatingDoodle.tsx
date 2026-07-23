import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ComponentType, SVGProps } from 'react'

interface FloatingDoodleProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  className?: string
  color?: string
  size?: number
  rotate?: number
  delay?: number
  duration?: number
}

export function FloatingDoodle({
  icon: Icon,
  className,
  color = 'var(--color-coral-deep)',
  size = 32,
  rotate = 0,
  delay = 0,
  duration = 6,
}: FloatingDoodleProps) {
  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none absolute select-none', className)}
      style={{ color, width: size, height: size, rotate }}
      animate={{ y: [0, -10, 0], rotate: [rotate - 4, rotate + 4, rotate - 4] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Icon className="h-full w-full" />
    </motion.div>
  )
}
