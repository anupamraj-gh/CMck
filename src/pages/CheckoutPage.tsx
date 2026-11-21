import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScribbleUnderline } from '@/components/decor/Doodles'
import { CheckoutStepCard, type CheckoutStepStatus } from '@/components/checkout/CheckoutStepCard'
import { CustomerInformationStep } from '@/components/checkout/CustomerInformationStep'
import { DeliveryDetailsStep } from '@/components/checkout/DeliveryDetailsStep'
import { OrderSummaryStep } from '@/components/checkout/OrderSummaryStep'
import { WhatsAppCtaStep } from '@/components/checkout/WhatsAppCtaStep'
import { useCheckoutFlow, type CheckoutStepId } from '@/hooks/useCheckoutFlow'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency, generateOrderId } from '@/lib/utils'
import { downloadInvoice } from '@/lib/invoice'
import { redirectToWhatsApp } from '@/lib/whatsapp'
import { isWithinDeliveryArea } from '@/lib/deliveryArea'
import { EDITORIAL_STRINGS } from '@/config/editorialStrings'
import type { CustomerInfo, DeliveryInfo, Order } from '@/types'

/**
 * Pure, single-source field validators for each step — reused by both `validate()` (the real gate
 * before placing an order) and `isStepValid()` (the read-only check that drives each step's
 * Continue button and the per-field blur handlers), so the rules only ever live in one place.
 */
function getCustomerFieldErrors(customer: CustomerInfo): Partial<Record<keyof CustomerInfo, string>> {
  const errors: Partial<Record<keyof CustomerInfo, string>> = {}
  if (!customer.fullName.trim()) errors.fullName = 'Please enter your full name'
  if (!customer.mobileNumber.trim() || !/^\d{10}$/.test(customer.mobileNumber.replace(/\s/g, ''))) {
    errors.mobileNumber = 'Enter a valid 10-digit mobile number'
  }
  if (!customer.address.trim()) errors.address = 'Please enter your delivery address'
  if (!customer.pinCode.trim() || !/^\d{6}$/.test(customer.pinCode)) {
    errors.pinCode = 'Enter a valid 6-digit PIN'
  }
  if (!customer.googleLocation?.trim()) {
    errors.googleLocation = 'Please choose your location on the map'
  } else if (!isWithinDeliveryArea(customer.googleLocation, customer.googleLocationDrivingDistanceMeters)) {
    errors.googleLocation = 'Delivery is available only within 15 km by road from Udupi Garden, BTM 1st Stage. Please reselect your location.'
  }
  return errors
}

function getDeliveryFieldErrors(delivery: DeliveryInfo): Partial<Record<keyof DeliveryInfo, string>> {
  const errors: Partial<Record<keyof DeliveryInfo, string>> = {}
  if (!delivery.preferredDate) errors.preferredDate = 'Please choose a delivery date'
  if (!delivery.preferredTime) errors.preferredTime = 'Please choose a delivery time'
  return errors
}

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

  // Kept as two separate state slices (rather than one shared object) so that typing in a
  // Customer Information field never changes the `deliveryErrors` reference, and vice versa —
  // each step's error state can update independently without forcing the other step's memoized
  // content component to re-render.
  const [customerErrors, setCustomerErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({})
  const [deliveryErrors, setDeliveryErrors] = useState<Partial<Record<keyof DeliveryInfo, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Distinguishes "order just placed" from "cart was never filled" — both end up rendering the
  // same empty-cart branch below (clearCart() empties `items` either way), but they should not
  // read as the same moment to the customer.
  const [orderPlaced, setOrderPlaced] = useState(false)

  const subtotal = getSubtotal()
  const deliveryCharge = getDeliveryCharge()
  const grandTotal = getGrandTotal()

  const minDate = new Date().toISOString().split('T')[0]

  const validate = useCallback((): boolean => {
    const newCustomerErrors = getCustomerFieldErrors(customer)
    const newDeliveryErrors = getDeliveryFieldErrors(delivery)
    setCustomerErrors(newCustomerErrors)
    setDeliveryErrors(newDeliveryErrors)
    return Object.keys(newCustomerErrors).length === 0 && Object.keys(newDeliveryErrors).length === 0
  }, [customer, delivery])

  // Read-only per-step checks for the CheckoutFlow controller — reuses the same field validators
  // as `validate()` above but never sets error state. `validate()` remains the one real gate
  // `handlePayNow` calls before actually placing the order.
  const isStepValid = useCallback(
    (step: CheckoutStepId): boolean => {
      switch (step) {
        case 'customer':
          return Object.keys(getCustomerFieldErrors(customer)).length === 0
        case 'delivery':
          return Object.keys(getDeliveryFieldErrors(delivery)).length === 0
        case 'summary':
          return items.length > 0
        case 'whatsapp':
          return isStepValid('customer') && isStepValid('delivery') && isStepValid('summary')
      }
    },
    [customer, delivery, items],
  )

  // Validates only the one field that was just left, so a customer seeing a step for the first
  // time isn't shown every error at once — messages surface calmly, one at a time, as they tab
  // through the form. Each handler only ever touches its own step's own error slice.
  const handleCustomerBlur = useCallback(
    (field: keyof CustomerInfo) => {
      setCustomerErrors((prev) => ({ ...prev, [field]: getCustomerFieldErrors(customer)[field] }))
    },
    [customer],
  )

  const handleDeliveryBlur = useCallback(
    (field: keyof DeliveryInfo) => {
      setDeliveryErrors((prev) => ({ ...prev, [field]: getDeliveryFieldErrors(delivery)[field] }))
    },
    [delivery],
  )

  const checkoutFlow = useCheckoutFlow({ isStepValid })

  // A step is "active" whenever it's the current one — even if already marked complete, so
  // editing a previous step re-expands its full form without losing any of its data (the data
  // itself lives in cartStore, untouched by step navigation). Anything before the current step
  // collapses into its compact summary card; anything after is a muted, not-yet-reached preview.
  const stepStatus = (step: CheckoutStepId): CheckoutStepStatus => {
    if (step === checkoutFlow.currentStep) return 'active'
    if (checkoutFlow.isStepComplete(step)) return 'completed'
    return 'upcoming'
  }

  const { goToStep } = checkoutFlow
  const handleEditCustomer = useCallback(() => goToStep('customer'), [goToStep])
  const handleEditDelivery = useCallback(() => goToStep('delivery'), [goToStep])
  const handleEditSummary = useCallback(() => goToStep('summary'), [goToStep])
  const handleEditWhatsapp = useCallback(() => goToStep('whatsapp'), [goToStep])

  const handleCustomerChange = useCallback(
    (field: keyof CustomerInfo, value: string) => {
      setCustomer({ ...customer, [field]: value })
      setCustomerErrors((prev) => ({ ...prev, [field]: undefined }))
    },
    [customer, setCustomer],
  )

  const handleLocationSelect = useCallback(
    (googleLocation: string, googleLocationDrivingDistanceMeters: number) => {
      setCustomer({ ...customer, googleLocation, googleLocationDrivingDistanceMeters })
      setCustomerErrors((prev) => ({ ...prev, googleLocation: undefined }))
    },
    [customer, setCustomer],
  )

  const handleDateChange = useCallback(
    (value: string) => {
      setDelivery({ ...delivery, preferredDate: value })
      setDeliveryErrors((prev) => ({ ...prev, preferredDate: undefined }))
    },
    [delivery, setDelivery],
  )

  const handleTimeChange = useCallback(
    (value: string) => {
      setDelivery({ ...delivery, preferredTime: value })
      setDeliveryErrors((prev) => ({ ...prev, preferredTime: undefined }))
    },
    [delivery, setDelivery],
  )

  const handlePayNow = useCallback(async () => {
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
    setOrderPlaced(true)
    clearCart()
    setIsSubmitting(false)
  }, [items, validate, customer, delivery, subtotal, deliveryCharge, grandTotal, clearCart])

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
          {orderPlaced ? (
            <>
              {/* The stamp ring is otherwise unused decoration reserved for exactly this kind of
                  moment — the one genuine "order confirmed" stamp in the whole flow, not a
                  treatment every completed checkout step also gets. */}
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-mint-deep text-mint-deep flex items-center justify-center stamp-ring">
                <CheckCircle className="h-8 w-8 text-paper" />
              </div>
              <h2 className="font-hand text-3xl text-ink mb-2">Sent to the kitchen.</h2>
              <p className="text-ink/70 mb-6 max-w-xs">
                Your invoice downloaded and your order is waiting in WhatsApp — confirm there to finish up.
              </p>
            </>
          ) : (
            <>
              <ShoppingBag className="h-14 w-14 text-ink/70 mx-auto mb-4" />
              <h2 className="font-hand text-3xl text-ink mb-2">{EDITORIAL_STRINGS.kitchenTrayWaiting}</h2>
              <p className="text-ink/70 mb-6 max-w-xs">Go browse our menu and pin some delicious items to your Kitchen Tray.</p>
            </>
          )}
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
          <h1 className="font-serif text-4xl font-bold text-ink">{EDITORIAL_STRINGS.sendToKitchen}</h1>
          <ScribbleUnderline className="h-3 w-28 text-mint-deep mt-2 mx-auto sm:mx-0" />
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-8">
          <CheckoutStepCard
            stepNumber={1}
            heading="Let's get to know you"
            stepLabel="Customer Information"
            status={stepStatus('customer')}
            tone="paper"
            rotate={-0.5}
            wobble={2}
            summary={`${customer.fullName} · ${customer.mobileNumber}`}
            onEdit={handleEditCustomer}
          >
            <CustomerInformationStep
              customer={customer}
              errors={customerErrors}
              onChange={handleCustomerChange}
              onLocationSelect={handleLocationSelect}
              onBlur={handleCustomerBlur}
            />
            <Button
              variant="coral"
              className="mt-6"
              onClick={checkoutFlow.goNext}
              disabled={!isStepValid('customer')}
            >
              Next, delivery details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CheckoutStepCard>

          <CheckoutStepCard
            stepNumber={2}
            heading="Where should today's recipe be delivered?"
            stepLabel="Delivery Details"
            status={stepStatus('delivery')}
            tone="cream"
            rotate={0.6}
            wobble={4}
            summary={`${delivery.preferredDate} · ${delivery.preferredTime}`}
            onEdit={handleEditDelivery}
          >
            <DeliveryDetailsStep
              delivery={delivery}
              minDate={minDate}
              errors={deliveryErrors}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              onBlur={handleDeliveryBlur}
            />
            <Button
              variant="coral"
              className="mt-6"
              onClick={checkoutFlow.goNext}
              disabled={!isStepValid('delivery')}
            >
              Show me the order
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CheckoutStepCard>

          <CheckoutStepCard
            stepNumber={3}
            heading="One last look before we cook"
            stepLabel="Today's Kitchen Tray"
            status={stepStatus('summary')}
            tone="lavender"
            rotate={-0.4}
            wobble={1}
            summary={`${items.length} item${items.length === 1 ? '' : 's'} · ${formatCurrency(grandTotal)}`}
            onEdit={handleEditSummary}
          >
            <OrderSummaryStep
              items={items}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              grandTotal={grandTotal}
              onRemoveItem={removeItem}
              onQuantityChange={updateQuantity}
            />
            <Button
              variant="coral"
              className="mt-6"
              onClick={checkoutFlow.goNext}
              disabled={!isStepValid('summary')}
            >
              Let's wrap this up
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CheckoutStepCard>

          <CheckoutStepCard
            stepNumber={4}
            heading="Ready to send this to the kitchen?"
            stepLabel="WhatsApp Confirmation"
            status={stepStatus('whatsapp')}
            tone="purple"
            rotate={0.5}
            wobble={3}
            onEdit={handleEditWhatsapp}
          >
            <WhatsAppCtaStep grandTotal={grandTotal} isSubmitting={isSubmitting} onPayNow={handlePayNow} />
          </CheckoutStepCard>
        </div>
      </div>
    </div>
  )
}
