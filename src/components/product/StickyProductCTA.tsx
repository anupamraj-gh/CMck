import type { CSSProperties, ReactNode, RefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { calculateLineTotal } from '@/lib/pricing'
import { EditorialValue } from '@/components/craft/EditorialValue'
import { useScrollVisibility } from '@/hooks/useScrollVisibility'
import { useCartStore, findMatchingCartItem } from '@/store/cartStore'
import { useTraySheetStore } from '@/store/traySheetStore'
import { triggerHaptic } from '@/lib/haptics'
import { EDITORIAL_STRINGS } from '@/config/editorialStrings'
import { DURATION, EASE } from '@/lib/motion'
import type { Product, SelectedCustomization } from '@/types'

export interface StickyProductCTAProps {
  product: Product
  /** Current customizer selections — the same `Record<string, string | string[]>` shape used by
   * Product Page, Kitchen Tray's edit view, and Checkout. Radio/select groups carry the selected
   * "variant"; checkbox groups carry the selected "add-ons". There is no separate variant/add-on
   * state — it's all one selections record, converted via `selectionsToCustomizations`. */
  selections: Record<string, string | string[]>
  /** The same selections, already converted via `selectionsToCustomizations` — used only to find
   * a matching cart line via `findMatchingCartItem`, never recomputed here. */
  customizations: SelectedCustomization[]
  quantity: number
  /** Unit price for the current selections, from `calculateUnitPrice` — never recomputed here. */
  unitPrice: number
  available: boolean
  /** From `areRequiredSelectionsComplete` — never recomputed here. */
  requiredOptionsComplete: boolean
  /** Sentinel marking the top boundary — the CTA appears once this element (the hero) fully exits the viewport. */
  showAfterRef: RefObject<Element | null>
  /** Sentinel marking the bottom boundary — the CTA hides again once this element (the purchase card) enters the viewport. */
  hideAtRef: RefObject<Element | null>
  /** Same handler Order Actions calls — no duplicated add-to-cart logic. */
  onAddToCart: () => void
}

// Visible size stays exactly as designed (24px) — the invisible ::before pseudo-element only
// expands the actual clickable/tappable region to the 44px minimum touch-target size, so nothing
// about the rendered look changes.
const stepperButtonClassName =
  'relative h-6 w-6 rounded-full flex items-center justify-center text-ink font-bold hover:bg-purple/30 transition-colors duration-fast ease-hover before:absolute before:-inset-2.5 before:content-[""]'

// Fade + slight lift, matching the site's established no-overshoot entrance easing (see
// PaperCard/RecipeCard/FeaturedCard) — a soft settle, not a spring. Same duration as PaperCard's
// own "lift" transition. Reduced-motion is already handled globally via <MotionConfig
// reducedMotion="user"> in App.tsx, so this needs no extra handling here.
const cardMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 14 },
  transition: { duration: DURATION.standard, ease: EASE.entrance },
}

/** A plain opacity crossfade for the live price — reuses the site's standard quick-swap duration
 * (see Header/FloatingKitchenTray/KitchenTraySheet), no movement, just a soft dissolve. */
function PriceDisplay({ value }: { value: number }) {
  return (
    <EditorialValue
      value={formatCurrency(value)}
      className="font-mono font-bold text-coral-deep text-lg leading-none"
    />
  )
}

/** Small tactile bounce on quantity change — the same pop-in signature already used for every
 * other quantity digit in the app (ProductGrid, OrderActions, TrayItemRow, CheckoutPage). */
function QuantityDisplay({ value }: { value: number }) {
  return (
    <span className="relative inline-grid w-4 place-items-center overflow-hidden text-center font-bold text-ink text-sm">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -8, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.7 }}
          transition={{ duration: DURATION.extraFast, ease: EASE.press }}
          className="col-start-1 row-start-1"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * A torn recipe strip tucked into the bottom of the notebook — not a modern app toolbar.
 * Visibility is driven entirely by `useScrollVisibility` (see Phase 2); every commerce value is
 * computed by the caller using the same shared cartStore helpers Product Page, Kitchen Tray, and
 * Checkout already use. The four interaction states below reuse that same shared pricing and
 * quantity logic (`findMatchingCartItem`, `updateQuantity`, `removeItem`, `item.totalPrice`) —
 * none of it is recomputed or duplicated here.
 */
export function StickyProductCTA({
  product,
  customizations,
  quantity,
  unitPrice,
  available,
  requiredOptionsComplete,
  showAfterRef,
  hideAtRef,
  onAddToCart,
}: StickyProductCTAProps) {
  const isVisible = useScrollVisibility({ showAfterRef, hideAtRef })
  // Selecting the matched item directly (rather than the whole `items` array) means this only
  // re-renders when THIS product's matching cart line actually changes — cartStore's mutations
  // leave every other item's object reference untouched, so unrelated cart activity elsewhere
  // (e.g. editing a different product in the Kitchen Tray) doesn't trigger a re-render here.
  const existing = useCartStore((s) => findMatchingCartItem(s.items, product.id, customizations))
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const openTraySheet = useTraySheetStore((s) => s.open)

  let content: ReactNode
  let liveAnnouncement: string
  if (!available) {
    // State 4: unavailable — takes priority over everything else, including an already-in-tray line.
    content = (
      <>
        <p className="text-xs font-bold text-ink-faint mt-1.5">{EDITORIAL_STRINGS.currentlyUnavailable}</p>
        <Button
          variant="coral"
          size="sm"
          className="w-full mt-3 relative before:absolute before:content-[''] before:-inset-y-1 before:inset-x-0"
          disabled
        >
          {EDITORIAL_STRINGS.currentlyUnavailable}
        </Button>
      </>
    )
    liveAnnouncement = `${product.name} is currently unavailable`
  } else if (!requiredOptionsComplete) {
    // State 1: required options not yet chosen — purchasing is disabled.
    content = (
      <>
        <p className="text-xs font-bold text-ink-soft mt-1.5">Choose Required Options</p>
        <Button
          variant="coral"
          size="sm"
          className="w-full mt-3 relative before:absolute before:content-[''] before:-inset-y-1 before:inset-x-0"
          disabled
        >
          {EDITORIAL_STRINGS.addToKitchenTray}
        </Button>
      </>
    )
    liveAnnouncement = 'Choose required options to see the price'
  } else if (existing) {
    // State 3: this exact configuration is already in the tray — swap the Add button for a
    // quantity stepper on that cart line, and surface a shortcut to the tray itself.
    const handleDecrement = () => {
      triggerHaptic()
      if (existing.quantity <= 1) removeItem(existing.id)
      else updateQuantity(existing.id, existing.quantity - 1)
    }
    const handleIncrement = () => {
      triggerHaptic()
      updateQuantity(existing.id, existing.quantity + 1)
    }

    content = (
      <>
        <p className="mt-1.5">
          <PriceDisplay value={existing.totalPrice} />
        </p>
        <div className="inline-flex items-center justify-between w-full rounded-full border-2 border-ink/15 bg-paper craft-shadow-sm h-9 px-1.5 mt-3">
          <button type="button" onClick={handleDecrement} aria-label="Decrease quantity" className={stepperButtonClassName}>
            −
          </button>
          <QuantityDisplay value={existing.quantity} />
          <button type="button" onClick={handleIncrement} aria-label="Increase quantity" className={stepperButtonClassName}>
            +
          </button>
        </div>
        <button
          type="button"
          onClick={openTraySheet}
          className="relative text-xs font-bold text-ink-soft hover:text-coral-deep transition-colors duration-fast ease-hover mt-2 before:absolute before:content-[''] before:-inset-y-3.5 before:inset-x-0"
        >
          View Kitchen Tray
        </button>
      </>
    )
    liveAnnouncement = `${existing.quantity} in Kitchen Tray, ${formatCurrency(existing.totalPrice)}`
  } else {
    // State 2: configuration complete, nothing in the tray yet — the default add state.
    const totalPrice = calculateLineTotal(unitPrice, quantity)
    content = (
      <>
        <p className="mt-1.5">
          <PriceDisplay value={totalPrice} />
        </p>
        <Button
          variant="coral"
          size="sm"
          className="w-full mt-3 relative before:absolute before:content-[''] before:-inset-y-1 before:inset-x-0"
          onClick={onAddToCart}
        >
          {EDITORIAL_STRINGS.addToKitchenTray}
        </Button>
      </>
    )
    liveAnnouncement = `${formatCurrency(totalPrice)}`
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          data-sticky-product-cta
          className="fixed inset-x-0 bottom-24 sm:bottom-8 z-30 flex justify-start px-4 sm:px-0 sm:pl-8 pointer-events-none"
        >
          <motion.div
            initial={cardMotion.initial}
            animate={cardMotion.animate}
            exit={cardMotion.exit}
            transition={cardMotion.transition}
            className="deckle-top relative w-52 pointer-events-auto bg-paper bg-grain craft-shadow-lg border-2 border-ink/10 rounded-2xl px-5 pt-4 pb-4 text-center"
            style={{ '--deckle-bg': 'var(--color-paper)' } as CSSProperties}
          >
            <p className="font-serif font-semibold text-ink text-sm leading-tight line-clamp-2">{product.name}</p>
            {content}
            {/* Visually-hidden live region: announces the updated price whenever the customer
                changes quantity, variant, or add-ons, without duplicating the visible text. */}
            <span className="sr-only" aria-live="polite">
              {liveAnnouncement}
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
