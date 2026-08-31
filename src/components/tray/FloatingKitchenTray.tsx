import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useTraySheetStore } from '@/store/traySheetStore'
import { formatCurrency } from '@/lib/utils'
import { triggerHaptic } from '@/lib/haptics'
import { useFooterAvoidance } from '@/hooks/useFooterAvoidance'
import { useBumpOnIncrease } from '@/hooks/useBumpOnIncrease'
import { PaperSettleValue } from '@/components/craft/PaperSettleValue'
import { WashiTape, ChefHatDoodle } from '@/components/decor/Doodles'
import { DURATION, EASE } from '@/lib/motion'

// A quick settle-back bounce + paper wobble, replayed by remounting the element via `key`.
const bounceAnimate = {
  scale: [1, 1.14, 0.95, 1.03, 1],
  rotate: [-0.6, 2.4, -2.6, 0.4, -0.6],
}

export function FloatingKitchenTray() {
  const itemCount = useCartStore((s) => s.getItemCount())
  const subtotal = useCartStore((s) => s.getSubtotal())
  const openSheet = useTraySheetStore((s) => s.open)
  const liftPx = useFooterAvoidance()
  const location = useLocation()
  const bumpKey = useBumpOnIncrease(itemCount)

  const isEmpty = itemCount === 0
  const isCheckoutPage = location.pathname === '/checkout'

  // The checkout page already renders the full order summary and its own checkout CTA
  // in the same bottom-right corner (and, once the order is placed, its own confirmation
  // state) — showing the tray there too would visually collide with that CTA.
  if (isCheckoutPage) return null

  return (
    <div
      className="fixed inset-x-0 bottom-4 sm:bottom-8 z-40 flex justify-center px-4 sm:justify-end sm:px-0 sm:pr-8 pointer-events-none"
      style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
    >
      <div
        style={{ transform: `translateY(-${liftPx}px)` }}
        className="pointer-events-auto transition-transform duration-standard ease-movement max-w-full"
      >
        <motion.button
          key={bumpKey}
          type="button"
          onClick={() => {
            triggerHaptic()
            openSheet()
          }}
          aria-label={isEmpty ? 'Kitchen Tray, 0 items' : `Kitchen Tray, ${itemCount} item${itemCount === 1 ? '' : 's'}, ${formatCurrency(subtotal)}, view tray`}
          initial={{ scale: 1, rotate: -0.6 }}
          animate={bounceAnimate}
          transition={{ duration: DURATION.standard, ease: EASE.entrance }}
          whileHover={{ rotate: 0, y: -2 }}
          whileFocus={{ rotate: 0, y: -2 }}
          className="group relative flex items-center gap-3 rounded-2xl border-2 border-ink/10 bg-paper bg-grain craft-shadow-lg pl-3 pr-4 py-2.5 max-w-full"
        >
          <WashiTape className="left-5 -top-2.5 z-10" color="var(--color-butter)" rotate={-4} width={52} />

          <span
            data-kitchen-tray-target
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender/60 border-2 border-ink/10"
          >
            <ChefHatDoodle className="h-5 w-5 text-ink" />
          </span>

          <span className="flex flex-col items-start leading-tight min-w-0">
            <span className="font-hand text-lg text-ink leading-none">Kitchen Tray</span>
            <AnimatePresence mode="popLayout" initial={false}>
              {isEmpty ? (
                <motion.span
                  key="empty"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: DURATION.fast, ease: EASE.entrance }}
                  className="text-xs text-ink-soft truncate"
                >
                  0 items · Tap to start ordering
                </motion.span>
              ) : (
                <motion.span
                  key={itemCount}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: DURATION.fast, ease: EASE.entrance }}
                  className="text-xs font-bold text-ink-soft truncate"
                >
                  {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
                  <PaperSettleValue value={formatCurrency(subtotal)} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>

          {!isEmpty && (
            <span className="ml-1 shrink-0 hidden sm:inline-flex items-center gap-0.5 text-xs font-bold text-coral-deep">
              View Tray
              <ArrowRight className="h-3 w-3" />
            </span>
          )}

          <kbd className="ml-1 shrink-0 hidden lg:inline-block rounded-md border border-ink/15 bg-lavender/50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-ink-soft opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-fast ease-fade">
            ⇧K
          </kbd>

          {/* Visually-hidden live region: announces count/total changes to screen readers
              without duplicating what the visible AnimatePresence text already narrates. */}
          <span className="sr-only" aria-live="polite">
            {isEmpty ? 'Kitchen Tray empty' : `Kitchen Tray: ${itemCount} item${itemCount === 1 ? '' : 's'}, ${formatCurrency(subtotal)}`}
          </span>
        </motion.button>
      </div>
    </div>
  )
}
