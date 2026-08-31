import { useRef, type CSSProperties, type Ref } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { calculateLineTotal } from '@/lib/pricing'
import { EditorialValue } from '@/components/craft/EditorialValue'
import { useLaunchFlight } from '@/hooks/useLaunchFlight'
import { triggerHaptic } from '@/lib/haptics'
import { EDITORIAL_STRINGS } from '@/config/editorialStrings'

interface OrderActionsProps {
  quantity: number
  unitPrice: number
  productImage: string
  onQuantityChange: (qty: number) => void
  onAddToCart: () => void
  /** A short, human-readable summary of the currently selected variant options (e.g. "Rich
   * Chocolate, 10 inch"), already formatted by the caller — Order Actions only displays it. */
  variantSummary?: string
  /** From `areRequiredSelectionsComplete` — the same signal the Sticky CTA gates on, so both
   * purchase entry points agree on whether this configuration can be added to the cart. */
  requiredOptionsComplete?: boolean
  available?: boolean
  ref?: Ref<HTMLElement>
}

export function OrderActions({
  quantity,
  unitPrice,
  productImage,
  onQuantityChange,
  onAddToCart,
  variantSummary,
  requiredOptionsComplete = true,
  available = true,
  ref,
}: OrderActionsProps) {
  const navigate = useNavigate()
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const launchFlight = useLaunchFlight()
  const totalPrice = calculateLineTotal(unitPrice, quantity)
  const canAddToCart = requiredOptionsComplete && available

  const handleAddClick = () => {
    if (!canAddToCart) return
    triggerHaptic()
    onAddToCart()
    launchFlight(addButtonRef.current, productImage)
  }

  return (
    <section ref={ref} className="pt-8 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="sticky bottom-4 z-30"
        >
          <div
            className="ticket-notch relative bg-paper craft-shadow-lg rounded-3xl p-6 sm:p-8 border-2 border-ink/10"
            style={{ '--notch-bg': 'var(--color-lavender)' } as CSSProperties}
          >
            <div className="flex items-center justify-between mb-5 pb-5 border-b-2 border-dashed border-ink-faint/30">
              <div className="min-w-0 pr-4">
                <span className="font-bold text-ink block">Quantity</span>
                <EditorialValue
                  value={`${variantSummary ? `${variantSummary} · ` : ''}${formatCurrency(unitPrice)} each`}
                  className="block text-xs text-ink-soft mt-1 truncate"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="relative inline-grid w-8 place-items-center overflow-hidden text-center">
                  <EditorialValue value={quantity} className="font-serif text-2xl font-bold" />
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => onQuantityChange(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 px-1">
              <span className="font-hand text-2xl text-ink-soft">total, please</span>
              <span className="font-mono text-3xl font-bold text-coral-deep">
                <EditorialValue value={formatCurrency(totalPrice)} />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                ref={addButtonRef}
                variant="coral"
                className="sm:col-span-1"
                onClick={handleAddClick}
                disabled={!canAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {EDITORIAL_STRINGS.addToKitchenTray}
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4" />
                {EDITORIAL_STRINGS.backToTheMenu}
              </Button>
              <Button variant="default" onClick={() => navigate('/checkout')}>
                {EDITORIAL_STRINGS.sendToKitchen}
              </Button>
            </div>

            {/* Visually-hidden live region: announces the updated total whenever the customer
                changes quantity, variant, or add-ons, without duplicating the visible price text. */}
            <span className="sr-only" aria-live="polite">
              {quantity} item{quantity === 1 ? '' : 's'} at {formatCurrency(unitPrice)} each, total {formatCurrency(totalPrice)}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
