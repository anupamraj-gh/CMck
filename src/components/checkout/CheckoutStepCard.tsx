import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Pencil } from 'lucide-react'
import { PaperCard } from '@/components/craft/PaperCard'
import { Button } from '@/components/ui/button'
import { DURATION, EASE } from '@/lib/motion'

export type CheckoutStepStatus = 'active' | 'completed' | 'upcoming'

export interface CheckoutStepCardProps {
  stepNumber: number
  /** The handwritten, editorial heading for this step, e.g. "Let's get to know you". */
  heading: string
  /** Plain-language step name used only for the collapsed card's Edit button accessible name. */
  stepLabel: string
  status: CheckoutStepStatus
  tone?: 'paper' | 'cream' | 'lavender' | 'purple'
  rotate?: number
  wobble?: 1 | 2 | 3 | 4
  /** A short one-line recap shown on the collapsed card once this step is completed. */
  summary?: ReactNode
  onEdit?: () => void
  children?: ReactNode
}

/**
 * The shared shell for a step in the guided checkout flow — no accordion library, just a plain
 * conditional render on top of the site's existing PaperCard, so every step (active, collapsed,
 * or not-yet-reached) still reads as the same handcrafted scrapbook card. The pinned step-number
 * badge reuses the exact numbered-circle treatment already used for Preparation Steps in the
 * recipe section, tying "guided checkout" back to the same recipe-journal visual language. Each
 * step opens with a handwritten (font-hand) heading rather than a generic "Step N" label, so the
 * whole flow reads like consecutive journal entries rather than a form wizard.
 *
 * Status changes (upcoming → active, active → completed, completed → active for editing) crossfade
 * through the site's established "paper settling into place" recipe — the same easing PaperCard
 * uses for its own scroll-reveal, plus a touch of rotate that settles to flat, like a page being
 * turned down onto the notebook. No sliding, no layout-shift choreography: only the swapped card's
 * own content fades and drifts a few pixels; MotionConfig's reducedMotion="user" (set once in App)
 * automatically strips the y/rotate movement under prefers-reduced-motion, leaving a plain fade.
 */
export function CheckoutStepCard({
  stepNumber,
  heading,
  stepLabel,
  status,
  tone = 'paper',
  rotate = 0,
  wobble = 3,
  summary,
  onEdit,
  children,
}: CheckoutStepCardProps) {
  const activeHeadingRef = useRef<HTMLHeadingElement>(null)
  const prevStatusRef = useRef(status)

  // Move focus to the newly active step's own heading whenever a step *transitions* to active as
  // a result of Continue/Edit — without this, focus is left on a button that Continue/Edit just
  // unmounted, and keyboard/screen-reader users are silently dropped back to the top of the page.
  // Compares against the previous status (rather than a "first render" flag) so this stays correct
  // under React StrictMode's dev-only double-invocation of effects, which would otherwise consume
  // a one-shot "first render" flag on a phantom extra invocation and steal focus on page load.
  useEffect(() => {
    const prevStatus = prevStatusRef.current
    prevStatusRef.current = status
    if (status === 'active' && prevStatus !== 'active') {
      activeHeadingRef.current?.focus()
    }
  }, [status])

  let content: ReactNode

  if (status === 'upcoming') {
    content = (
      <PaperCard tone={tone} rotate={rotate} wobble={wobble} hoverLift={false} className="p-6 sm:p-8 opacity-50">
        <div className="absolute -top-4 -left-4 h-11 w-11 rounded-full bg-lavender border-2 border-paper text-ink-faint font-serif font-bold flex items-center justify-center text-lg craft-shadow">
          {stepNumber}
        </div>
        <h2 className="font-hand text-2xl sm:text-3xl text-ink-faint leading-snug">{heading}</h2>
      </PaperCard>
    )
  } else if (status === 'completed') {
    content = (
      <PaperCard tone={tone} rotate={rotate} wobble={wobble} hoverLift={false} className="p-5 sm:p-6">
        <div className="absolute -top-4 -left-4 h-11 w-11 rounded-full bg-mint-deep border-2 border-paper text-paper flex items-center justify-center craft-shadow">
          <Check className="h-5 w-5" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-hand text-xl sm:text-2xl text-ink leading-snug truncate">{heading}</h2>
            {summary && <p className="text-sm text-ink-soft truncate mt-0.5">{summary}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit} className="shrink-0" aria-label={`Edit ${stepLabel}`}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>
      </PaperCard>
    )
  } else {
    content = (
      <PaperCard tone={tone} rotate={rotate} wobble={wobble} hoverLift={false} className="p-6 sm:p-8">
        <div className="absolute -top-4 -left-4 h-11 w-11 rounded-full bg-butter border-2 border-paper text-ink font-serif font-bold flex items-center justify-center text-lg craft-shadow">
          {stepNumber}
        </div>
        <h2 ref={activeHeadingRef} tabIndex={-1} className="font-hand text-2xl sm:text-3xl text-ink leading-snug mb-6">
          {heading}
        </h2>
        {children}
      </PaperCard>
    )
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10, rotate: rotate - 1.2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: DURATION.standard, ease: status === 'completed' ? EASE.collapse : EASE.expand }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  )
}
