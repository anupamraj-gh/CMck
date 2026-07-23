import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageTabProps {
  label: string
  className?: string
  rotate?: number
  tone?: 'paper' | 'ink'
}

export function PageTab({ label, className, rotate = -3, tone = 'paper' }: PageTabProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -8, rotate: rotate - 4 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 font-mono text-[11px] font-bold tracking-wide craft-shadow-sm',
        tone === 'paper'
          ? 'bg-paper border-ink/10 text-ink-soft'
          : 'bg-ink border-cream/15 text-cream/70',
        className,
      )}
    >
      {label}
    </motion.span>
  )
}
