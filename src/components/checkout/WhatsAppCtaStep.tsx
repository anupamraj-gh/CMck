import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeartDoodle } from '@/components/decor/Doodles'
import { formatCurrency } from '@/lib/utils'
import { MOTION } from '@/lib/motion'

export interface WhatsAppCtaStepProps {
  grandTotal: number
  isSubmitting: boolean
  submissionError: string | null
  onPayNow: () => void
}

/**
 * The "WhatsApp Confirmation" checkout section's content — same markup, same classes, same
 * behaviour as before. The card wrapper and heading are owned by CheckoutStepCard. Memoized so this
 * step skips re-rendering on renders where none of its own props changed — note `onPayNow` still
 * gets a new reference whenever order-relevant state (customer/delivery/items/totals) changes,
 * since the handler's closure needs to reflect the latest order when actually invoked.
 */
export const WhatsAppCtaStep = memo(function WhatsAppCtaStep({
  grandTotal,
  isSubmitting,
  submissionError,
  onPayNow,
}: WhatsAppCtaStepProps) {
  return (
    <>
      <p className="font-hand text-xl text-mint-deep text-center">Everything looks perfect.</p>

      <Button
        variant="coral"
        size="lg"
        className="w-full mt-4"
        onClick={onPayNow}
        disabled={isSubmitting}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isSubmitting ? (
            <motion.span
              key="sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.fade}
              className="inline-flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Preparing invoice…
            </motion.span>
          ) : (
            <motion.span
              key="pay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.fade}
              className="inline-flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Share order &amp; invoice
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {submissionError && (
        <p role="alert" className="mt-3 text-center text-sm text-coral-deep">
          {submissionError}
        </p>
      )}

      <p className="text-xs text-ink-soft text-center mt-4 inline-flex items-center justify-center gap-1 w-full">
        Share the PDF and order details to WhatsApp. If file sharing is unavailable, download the invoice and attach it manually.
        <HeartDoodle className="h-3.5 w-3.5 text-pink-deep shrink-0" />
      </p>

      {/* Visually-hidden live region: announces the updated total whenever an item's quantity
          changes, without duplicating the visible totals above. */}
      <span className="sr-only" aria-live="polite">
        Grand total {formatCurrency(grandTotal)}
      </span>
    </>
  )
})
