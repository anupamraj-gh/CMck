import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperCard } from '@/components/craft/PaperCard'
import { DURATION, EASE } from '@/lib/motion'
import type { GroupDisclosureStatus } from '@/hooks/useProgressiveCustomization'

export interface CustomizationGroupCardProps {
  groupId: string
  status: GroupDisclosureStatus
  title: string
  isRequired: boolean
  isExpanded: boolean
  canToggle: boolean
  /** Stable across renders (from `useProgressiveCustomization` directly) — takes the groupId
   * itself rather than being a zero-arg callback, so the parent never has to recreate a
   * per-instance closure just to bind it, which would defeat memoization on re-renders. */
  onToggle: (groupId: string) => void
  /** A short one-line recap of the current selection, shown whenever the group is collapsed. */
  summary?: ReactNode
  tone?: 'paper' | 'cream' | 'lavender' | 'purple'
  rotate?: number
  wobble?: 1 | 2 | 3 | 4
  children: ReactNode
}

/**
 * The shared shell for one customization group's progressive-disclosure states — no accordion
 * library and no chevron/toggle iconography, just the site's existing paper language. A collapsed
 * group reuses PaperCard's own `fold` treatment (the same folded-corner utility already used
 * elsewhere for a page with something tucked into it) so it reads as a folded-over recipe note
 * rather than a UI control. The "edit"/"collapse" affordance is a small handwritten (font-hand)
 * word, matching the site's existing handwritten-annotation vocabulary, instead of an icon. The
 * option controls themselves (radio/checkbox/select) are passed in as `children`, unchanged.
 *
 * Switching between locked/collapsed/expanded crossfades through the same "paper settling into
 * place" recipe used for the guided checkout's step cards — the exact easing PaperCard already
 * uses for its own scroll-reveal, plus a touch of rotate that settles to flat, like a folded note
 * being opened back out. No accordion-style height snap, no material ripple, no elastic overshoot:
 * only the swapped card's own content fades and drifts a few pixels. MotionConfig's
 * reducedMotion="user" (set once in App) strips the y/rotate movement under prefers-reduced-motion,
 * leaving a plain fade.
 */
export function CustomizationGroupCard({
  groupId,
  status,
  title,
  isRequired,
  isExpanded,
  canToggle,
  onToggle,
  summary,
  tone = 'paper',
  rotate = 0,
  wobble = 3,
  children,
}: CustomizationGroupCardProps) {
  const variant = status === 'locked' ? 'locked' : isExpanded ? 'expanded' : 'collapsed'
  const panelId = `customization-panel-${groupId}`

  const headingRef = useRef<HTMLHeadingElement>(null)
  const prevVariantRef = useRef(variant)
  // Set synchronously by the toggle button's own click, so the focus effect below can tell "this
  // card's own toggle was just clicked" apart from "some other group's auto-advance changed my
  // variant as a side effect" — the two need different focus behaviour (see effect comment).
  const justToggledRef = useRef(false)

  const handleToggleClick = () => {
    justToggledRef.current = true
    onToggle(groupId)
  }

  // Move focus to this group's own heading whenever it becomes reachable/expanded — without this,
  // completing a group unmounts the radio/checkbox the customer just activated (the group collapses
  // and the next one expands), and keyboard/screen-reader focus is silently dropped to <body>. Only
  // reacts to *this* card's own transition to 'expanded' (auto-advance or reopening) unconditionally;
  // a transition to 'collapsed' only grabs focus if the customer's own "collapse" click caused it
  // (`justToggledRef`), not when it's merely a side effect of some other group advancing — so during
  // auto-advance, exactly one card (the newly expanded one) claims focus, never a race between two.
  useEffect(() => {
    const prevVariant = prevVariantRef.current
    prevVariantRef.current = variant
    const justToggled = justToggledRef.current
    justToggledRef.current = false

    if (variant === prevVariant) return
    if (variant === 'expanded' || (variant === 'collapsed' && justToggled)) {
      headingRef.current?.focus()
    }
  }, [variant])

  let content: ReactNode

  if (status === 'locked') {
    content = (
      <PaperCard tone={tone} rotate={rotate} wobble={wobble} hoverLift={false} className="p-6 sm:p-8 opacity-50">
        <h3 className="font-serif text-lg font-semibold text-ink-faint">
          {title}
          {isRequired && <span className="ml-1">*</span>}
        </h3>
      </PaperCard>
    )
  } else if (!isExpanded) {
    // Collapsed 'completed' (required, reopenable) or 'optional' (untouched or manually closed)
    // group — folded over like a recipe note, with a title, a one-line summary, and a small
    // handwritten "edit" to unfold it again.
    content = (
      <PaperCard
        tone={tone}
        rotate={rotate}
        wobble={wobble}
        hoverLift={false}
        fold
        className="p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 ref={headingRef} tabIndex={-1} className="font-serif text-base font-semibold text-ink truncate">
              {title}
              {isRequired && <span className="text-coral-deep ml-1">*</span>}
            </h3>
            {summary && <p className="text-sm text-ink-soft truncate mt-0.5">{summary}</p>}
          </div>
          {canToggle && (
            <button
              type="button"
              onClick={handleToggleClick}
              aria-expanded={false}
              aria-controls={panelId}
              className="font-hand text-lg leading-none text-coral-deep underline decoration-dashed decoration-1 underline-offset-4 shrink-0"
            >
              edit
            </button>
          )}
        </div>
      </PaperCard>
    )
  } else {
    content = (
      <PaperCard tone={tone} rotate={rotate} wobble={wobble} hoverLift={false} className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 ref={headingRef} tabIndex={-1} className="font-serif text-lg font-semibold text-ink">
            {title}
            {isRequired && <span className="text-coral-deep ml-1">*</span>}
          </h3>
          {canToggle && (
            <button
              type="button"
              onClick={handleToggleClick}
              aria-expanded={true}
              aria-controls={panelId}
              className="font-hand text-lg leading-none text-ink-soft underline decoration-dashed decoration-1 underline-offset-4 shrink-0"
            >
              collapse
            </button>
          )}
        </div>
        <div id={panelId}>{children}</div>
      </PaperCard>
    )
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={variant}
        initial={{ opacity: 0, y: 10, rotate: rotate - 1.2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: DURATION.standard, ease: variant === 'collapsed' ? EASE.collapse : EASE.expand }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  )
}
