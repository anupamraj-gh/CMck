import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HangingTagProps {
  className?: string
  color: string
  holeColor?: string
  children: ReactNode
}

export function HangingTag({ className, color, holeColor = 'var(--color-lavender)', children }: HangingTagProps) {
  return (
    <div
      className={cn('relative flex flex-col items-center justify-center text-center px-5 pt-8 pb-6 border-2 border-ink/10', className)}
      style={{
        background: color,
        clipPath: 'polygon(0% 0%, 78% 0%, 100% 22%, 100% 100%, 0% 100%)',
        boxShadow: '0 16px 32px -14px rgba(58,49,69,0.3)',
      }}
    >
      <span
        aria-hidden
        className="absolute top-3 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full ring-2 ring-inset ring-ink/25"
        style={{ background: holeColor }}
      />
      {children}
    </div>
  )
}
