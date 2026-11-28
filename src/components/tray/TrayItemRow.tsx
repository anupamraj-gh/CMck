import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { PhotoPlaceholder } from '@/components/craft/PhotoPlaceholder'
import { EditorialValue } from '@/components/craft/EditorialValue'
import { useCartStore } from '@/store/cartStore'
import { useTraySheetStore } from '@/store/traySheetStore'
import { getProductById } from '@/data/products'
import { formatCurrency } from '@/lib/utils'
import { triggerHaptic } from '@/lib/haptics'
import { DURATION, EASE } from '@/lib/motion'
import type { CartItem } from '@/types'

export const TrayItemRow = memo(function TrayItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const editItem = useTraySheetStore((s) => s.editItem)
  const canEdit = Boolean(getProductById(item.productId))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: DURATION.fast, ease: EASE.movement }}
      className="flex gap-3 py-4 border-b border-ink-faint/15 last:border-0"
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
            onClick={() => {
              triggerHaptic()
              removeItem(item.id)
            }}
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
        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic()
                  updateQuantity(item.id, item.quantity - 1)
                }}
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
                onClick={() => {
                  triggerHaptic()
                  updateQuantity(item.id, item.quantity + 1)
                }}
                className="h-6 w-6 rounded-full border-2 border-ink/15 flex items-center justify-center text-xs hover:bg-purple/30 transition-colors duration-fast ease-hover"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            {canEdit && (
              <button
                onClick={() => editItem(item.id)}
                className="text-xs font-bold text-ink-soft hover:text-coral-deep transition-colors duration-fast ease-hover underline underline-offset-2 decoration-ink-faint/40"
              >
                Edit
              </button>
            )}
          </div>
          <span className="text-sm font-mono font-bold text-coral-deep shrink-0">
            <EditorialValue value={formatCurrency(item.totalPrice)} />
          </span>
        </div>
      </div>
    </motion.div>
  )
})
