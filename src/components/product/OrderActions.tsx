import { useRef, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useLaunchFlight } from '@/hooks/useLaunchFlight'
import { triggerHaptic } from '@/lib/haptics'

interface OrderActionsProps {
  quantity: number
  unitPrice: number
  productImage: string
  onQuantityChange: (qty: number) => void
  onAddToCart: () => void
}

export function OrderActions({
  quantity,
  unitPrice,
  productImage,
  onQuantityChange,
  onAddToCart,
}: OrderActionsProps) {
  const navigate = useNavigate()
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const launchFlight = useLaunchFlight()
  const totalPrice = unitPrice * quantity

  const handleAddClick = () => {
    triggerHaptic()
    onAddToCart()
    launchFlight(addButtonRef.current, productImage)
  }

  return (
    <section className="pt-8 pb-6 sm:pb-8">
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
              <span className="font-bold text-ink">Quantity</span>
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
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={quantity}
                      initial={{ opacity: 0, y: -10, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                      className="col-start-1 row-start-1 font-serif text-2xl font-bold"
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
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
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button ref={addButtonRef} variant="coral" className="sm:col-span-1" onClick={handleAddClick}>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4" />
                Add More Items
              </Button>
              <Button variant="default" onClick={() => navigate('/checkout')}>
                Checkout
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
