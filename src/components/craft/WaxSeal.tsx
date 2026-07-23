import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WaxSealProps {
  className?: string
  color: string
  children: ReactNode
}

export function WaxSeal({ className, color, children }: WaxSealProps) {
  return (
    <div
      className={cn('relative rounded-full flex flex-col items-center justify-center text-center', className)}
      style={{
        background: color,
        boxShadow:
          '0 0 0 3px var(--color-paper), inset 0 3px 6px rgba(255,255,255,0.35), inset 0 -6px 10px rgba(58,49,69,0.18), 0 18px 36px -14px rgba(58,49,69,0.35)',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-1.5 rounded-full opacity-40"
        style={{
          backgroundImage:
            'repeating-conic-gradient(rgba(58,49,69,0.12) 0deg 4deg, transparent 4deg 9deg)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
