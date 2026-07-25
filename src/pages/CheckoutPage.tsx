import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { PaperCard } from '@/components/craft/PaperCard'
import { PhotoPlaceholder } from '@/components/craft/PhotoPlaceholder'
import { StarDoodle, HeartDoodle, ScribbleUnderline } from '@/components/decor/Doodles'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency, generateOrderId } from '@/lib/utils'
import { downloadInvoice } from '@/lib/invoice'
import { redirectToWhatsApp } from '@/lib/whatsapp'
import { DELIVERY_TIME_SLOTS, SITE_CONFIG } from '@/config/content'
import type { CustomerInfo, Order } from '@/types'

export function CheckoutPage() {
  const {
    items,
    customer,
    delivery,
    removeItem,
    updateQuantity,
    setCustomer,
    setDelivery,
    getSubtotal,
    getDeliveryCharge,
    getGrandTotal,
    clearCart,
  } = useCartStore()

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo | 'preferredDate' | 'preferredTime', string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = getSubtotal()
  const deliveryCharge = getDeliveryCharge()
  const grandTotal = getGrandTotal()

  const minDate = new Date().toISOString().split('T')[0]

  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    if (!customer.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!customer.mobileNumber.trim() || !/^\d{10}$/.test(customer.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Valid 10-digit mobile number required'
    }
    if (!customer.houseFlat.trim()) newErrors.houseFlat = 'Required'
    if (!customer.street.trim()) newErrors.street = 'Required'
    if (!customer.area.trim()) newErrors.area = 'Required'
    if (!customer.city.trim()) newErrors.city = 'Required'
    if (!customer.state.trim()) newErrors.state = 'Required'
    if (!customer.pinCode.trim() || !/^\d{6}$/.test(customer.pinCode)) {
      newErrors.pinCode = 'Valid 6-digit PIN required'
    }
    if (!delivery.preferredDate) newErrors.preferredDate = 'Select delivery date'
    if (!delivery.preferredTime) newErrors.preferredTime = 'Select delivery time'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCustomerChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer({ ...customer, [field]: value })
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handlePayNow = async () => {
    if (items.length === 0) return
    if (!validate()) return

    setIsSubmitting(true)

    const order: Order = {
      orderId: generateOrderId(),
      orderDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customer,
      delivery,
      items,
      subtotal,
      deliveryCharge,
      grandTotal,
    }

    downloadInvoice(order)
    redirectToWhatsApp(order)
    clearCart()
    setIsSubmitting(false)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 180, damping: 12 }}
          className="relative bg-butter px-10 py-10 tape-shadow"
          style={{ clipPath: 'polygon(0% 2%, 98% 0%, 100% 96%, 3% 100%)' }}
        >
          <ShoppingBag className="h-14 w-14 text-ink/70 mx-auto mb-4" />
          <h2 className="font-hand text-3xl text-ink mb-2">Your cart is empty!</h2>
          <p className="text-ink/70 mb-6 max-w-xs">Go browse our menu and pin some delicious items to your cart.</p>
          <Button variant="coral" asChild>
            <Link to="/">Explore Menu</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center sm:text-left"
        >
          <p className="font-hand text-2xl text-coral-deep mb-1">almost there</p>
          <h1 className="font-serif text-4xl font-bold text-ink">Checkout</h1>
          <ScribbleUnderline className="h-3 w-28 text-mint-deep mt-2 mx-auto sm:mx-0" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <PaperCard tone="paper" rotate={-0.5} wobble={2} hoverLift={false} className="p-6 sm:p-8">
              <h2 className="font-serif text-xl font-semibold mb-6 text-ink">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={customer.fullName}
                    onChange={(e) => handleCustomerChange('fullName', e.target.value)}
                    placeholder="Your full name"
                    className="mt-1.5"
                  />
                  {errors.fullName && <p className="text-coral-deep text-xs font-bold mt-1">{errors.fullName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    value={customer.mobileNumber}
                    onChange={(e) => handleCustomerChange('mobileNumber', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="mt-1.5"
                  />
                  {errors.mobileNumber && <p className="text-coral-deep text-xs font-bold mt-1">{errors.mobileNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="houseFlat">House / Flat No. *</Label>
                  <Input
                    id="houseFlat"
                    value={customer.houseFlat}
                    onChange={(e) => handleCustomerChange('houseFlat', e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.houseFlat && <p className="text-coral-deep text-xs font-bold mt-1">{errors.houseFlat}</p>}
                </div>
                <div>
                  <Label htmlFor="street">Street *</Label>
                  <Input
                    id="street"
                    value={customer.street}
                    onChange={(e) => handleCustomerChange('street', e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.street && <p className="text-coral-deep text-xs font-bold mt-1">{errors.street}</p>}
                </div>
                <div>
                  <Label htmlFor="area">Area *</Label>
                  <Input
                    id="area"
                    value={customer.area}
                    onChange={(e) => handleCustomerChange('area', e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.area && <p className="text-coral-deep text-xs font-bold mt-1">{errors.area}</p>}
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={customer.city}
                    onChange={(e) => handleCustomerChange('city', e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.city && <p className="text-coral-deep text-xs font-bold mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={customer.state}
                    onChange={(e) => handleCustomerChange('state', e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.state && <p className="text-coral-deep text-xs font-bold mt-1">{errors.state}</p>}
                </div>
                <div>
                  <Label htmlFor="pinCode">PIN Code *</Label>
                  <Input
                    id="pinCode"
                    value={customer.pinCode}
                    onChange={(e) => handleCustomerChange('pinCode', e.target.value)}
                    className="mt-1.5"
                  />
                  {errors.pinCode && <p className="text-coral-deep text-xs font-bold mt-1">{errors.pinCode}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    value={customer.landmark}
                    onChange={(e) => handleCustomerChange('landmark', e.target.value)}
                    placeholder="Near..."
                    className="mt-1.5"
                  />
                </div>
              </div>
            </PaperCard>

            <PaperCard tone="cream" rotate={0.6} wobble={4} hoverLift={false} className="p-6 sm:p-8">
              <h2 className="font-serif text-xl font-semibold mb-6 text-ink">Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Delivery Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={minDate}
                    value={delivery.preferredDate}
                    onChange={(e) => {
                      setDelivery({ ...delivery, preferredDate: e.target.value })
                      setErrors((prev) => ({ ...prev, preferredDate: undefined }))
                    }}
                    className="mt-1.5"
                  />
                  {errors.preferredDate && <p className="text-coral-deep text-xs font-bold mt-1">{errors.preferredDate}</p>}
                </div>
                <div>
                  <Label>Preferred Delivery Time *</Label>
                  <Select
                    value={delivery.preferredTime}
                    onValueChange={(value) => {
                      setDelivery({ ...delivery, preferredTime: value })
                      setErrors((prev) => ({ ...prev, preferredTime: undefined }))
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {DELIVERY_TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferredTime && <p className="text-coral-deep text-xs font-bold mt-1">{errors.preferredTime}</p>}
                </div>
              </div>
            </PaperCard>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className="ticket-notch relative bg-paper craft-shadow-lg rounded-2xl p-6 sm:p-8 border-2 border-ink/10 sticky top-28"
              style={{ '--notch-bg': 'var(--color-lavender)' } as CSSProperties}
            >
              <StarDoodle className="absolute -top-3 -right-3 h-6 w-6 text-butter-deep animate-wiggle" />
              <h2 className="font-serif text-xl font-semibold mb-6 text-ink">Order Summary</h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
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
                          onClick={() => removeItem(item.id)}
                          className="text-ink-soft hover:text-coral-deep transition-colors shrink-0"
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
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 rounded-full border-2 border-ink/15 flex items-center justify-center text-xs hover:bg-purple/30"
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
                                transition={{ duration: 0.15 }}
                                className="col-start-1 row-start-1 text-sm font-bold"
                              >
                                {item.quantity}
                              </motion.span>
                            </AnimatePresence>
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 rounded-full border-2 border-ink/15 flex items-center justify-center text-xs hover:bg-purple/30"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-mono font-bold text-coral-deep">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Delivery</span>
                  <span className="font-mono">{deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}</span>
                </div>
                {subtotal < SITE_CONFIG.freeDeliveryAbove && (
                  <p className="text-xs text-ink-soft">
                    Free delivery on orders above {formatCurrency(SITE_CONFIG.freeDeliveryAbove)}
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="font-mono text-coral-deep">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <Button
                variant="coral"
                size="lg"
                className="w-full mt-6"
                onClick={handlePayNow}
                disabled={isSubmitting}
              >
                <MessageCircle className="h-5 w-5" />
                Pay Now via WhatsApp
              </Button>

              <p className="text-xs text-ink-soft text-center mt-4 inline-flex items-center justify-center gap-1 w-full">
                Generates a PDF invoice &amp; opens WhatsApp with your order details
                <HeartDoodle className="h-3.5 w-3.5 text-pink-deep shrink-0" />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
