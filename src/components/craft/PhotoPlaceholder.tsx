import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PhotoPlaceholder({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn('h-full w-full flex flex-col items-center justify-center gap-2 text-ink-faint bg-grain', className)}>
      <ImageIcon className={compact ? 'h-4 w-4' : 'h-7 w-7'} strokeWidth={1.5} />
      {!compact && <span className="font-hand text-base leading-none">Place Photo Here</span>}
    </div>
  )
}
