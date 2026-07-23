import { motion } from 'framer-motion'
import { StitchDivider, StarDoodle, HeartDoodle, SparkleDoodle, FlowerDoodle } from '@/components/decor/Doodles'
import type { ComponentType, SVGProps } from 'react'

const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  star: StarDoodle,
  heart: HeartDoodle,
  sparkle: SparkleDoodle,
  flower: FlowerDoodle,
}

interface SectionDividerProps {
  icon?: keyof typeof icons
  color?: string
}

export function SectionDivider({ icon = 'star', color = 'text-ink-faint/50' }: SectionDividerProps) {
  const Icon = icons[icon]

  return (
    <div className="relative flex items-center justify-center py-2" aria-hidden>
      <StitchDivider className="h-4 w-full max-w-xl text-ink-faint/35" />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className={`absolute bg-lavender px-3 ${color}`}
      >
        <Icon className="h-5 w-5" />
      </motion.div>
    </div>
  )
}
