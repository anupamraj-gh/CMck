import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PaperStackProps {
  children: ReactNode
  className?: string
}

/** Wraps a paper element with 2 faint offset sheets behind it, suggesting real page thickness. */
export function PaperStack({ children, className }: PaperStackProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        aria-hidden
        className="block absolute inset-0 translate-x-1.5 translate-y-2 -rotate-1 bg-cream rounded-sm craft-shadow-sm -z-10 sm:translate-x-2.5 sm:translate-y-3"
      />
      <div
        aria-hidden
        className="block absolute inset-0 translate-x-0.5 translate-y-1 rotate-[0.6deg] bg-paper rounded-sm craft-shadow-sm -z-10 sm:translate-x-1 sm:translate-y-1.5"
      />
      {children}
    </div>
  )
}
