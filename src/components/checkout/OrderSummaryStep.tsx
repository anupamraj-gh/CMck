import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { PhotoPlaceholder } from '@/components/craft/PhotoPlaceholder'
import { EditorialValue } from '@/components/craft/EditorialValue'
import { PaperSettleValue } from '@/components/craft/PaperSettleValue'
import { StarDoodle } from '@/components/decor/Doodles'
import { formatCurrency } from '@/lib/utils'
import { SITE_CONFIG } from '@/config/content'
import { DURATION, EASE } from '@/lib/motion'
import type { CartItem } from '@/types'

export interface OrderSummaryStepProps {
  items: CartItem[]
  subtotal: number
  deliveryCharge: number
  grandTotal: number
  onRemoveItem: (id: string) => void
  onQuantityChange: (id: string, quantity: number) => void
}

/**
 * The "Order Summary" checkout section's content (item list + subtotal/delivery/grand total) —
 * same markup, same classes, same behaviour as before. The card wrapper and heading are owned by
 * CheckoutStepCard, so this renders only the content itself. Memoized so typing in Customer
 * Information or Delivery Details (sibling, unrelated steps) doesn't force this line-item list to
 * re-render too.
 */
export const OrderSummaryStep = memo(function OrderSummaryStep({
  items,
  subtotal,
  deliveryCharge,
  grandTotal,
  onRemoveItem,
  onQuantityChange,
}: OrderSummaryStepProps) {
  return (
    <>
      <StarDoodle className="absolute -top-3 -right-3 h-6 w-6 text-butter-deep animate-wiggle" />

      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout" initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: DURATION.fast, ease: EASE.movement }}
            className="flex gap-4"
          >
            {item.productImage ? (
              <img
                src={item.productImage}
                alt={item.productName}
                className="h-16 w-16 rounded-xl object-cover shrink-0 border-2 border-ink/10"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl shrink-0 border-2 border-ink/10 overflow-hidden">
                <PhotoPlaceholder compact />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-ink truncate">{item.productName}</h3>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-ink-soft hover:text-coral-deep transition-colors duration-fast ease-hover shrink-0"
                  aria-label={`Remove ${item.productName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {item.customizations.length > 0 && (
                <p className="text-xs text-ink-soft mt-0.5 line-clamp-2">
                  {item.customizations.map((c) => c.optionLabel).join(', ')}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    className="h-6 w-6 rounded-full border-2 border-ink/15 flex items-center justify-center text-xs hover:bg-purple/30 transition-colors duration-fast ease-hover"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="relative inline-grid w-4 place-items-center overflow-hidden text-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={item.quantity}
                        initial={{ opacity: 0, y: -8, scale: 0.7 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.7 }}
                        transition={{ duration: DURATION.extraFast, ease: EASE.press }}
                        className="col-start-1 row-start-1 text-sm font-bold"
                      >
                        {item.quantity}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    className="h-6 w-6 rounded-full border-2 border-ink/15 flex items-center justify-center text-xs hover:bg-purple/30 transition-colors duration-fast ease-hover"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-mono font-bold text-coral-deep">
                  <EditorialValue value={formatCurrency(item.totalPrice)} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      <Separator className="my-6" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-soft">Subtotal</span>
          <span className="font-mono"><PaperSettleValue value={formatCurrency(subtotal)} /></span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft">Delivery</span>
          <span className="font-mono">
            <PaperSettleValue value={deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)} />
          </span>
        </div>
        {subtotal < SITE_CONFIG.freeDeliveryAbove && (
          <p className="text-xs text-ink-soft">
            Free delivery on orders above {formatCurrency(SITE_CONFIG.freeDeliveryAbove)}
          </p>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Grand Total</span>
          <span className="font-mono text-coral-deep"><PaperSettleValue value={formatCurrency(grandTotal)} /></span>
        </div>
      </div>
    </>
  )
})
