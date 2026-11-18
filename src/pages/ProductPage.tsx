import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { getProductById } from '@/data/products'
import { RecipeVideo } from '@/components/product/RecipeVideo'
import { ProductHero } from '@/components/product/ProductHero'
import { RecipeSection } from '@/components/product/RecipeSection'
import { CustomizationSection } from '@/components/product/CustomizationSection'
import { OrderActions } from '@/components/product/OrderActions'
import { StoryTransition } from '@/components/product/StoryTransition'
import { StickyProductCTA } from '@/components/product/StickyProductCTA'
import {
  useCartStore,
  buildDefaultSelections,
  areRequiredSelectionsComplete,
} from '@/store/cartStore'
import { usePricing } from '@/hooks/usePricing'
import { categorizeCustomizations } from '@/lib/pricing'
import { Button } from '@/components/ui/button'
import { EDITORIAL_STRINGS } from '@/config/editorialStrings'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const product = getProductById(id ?? '')

  const [selections, setSelections] = useState<Record<string, string | string[]>>({})
  const [quantity, setQuantity] = useState(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const heroRef = useRef<HTMLElement>(null)
  const purchaseCardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (product) {
      setSelections(buildDefaultSelections(product.customizations))
    }
  }, [product])

  const { customizations, unitPrice } = usePricing(
    product?.basePrice ?? 0,
    product?.customizations ?? [],
    selections,
    quantity,
  )

  const requiredOptionsComplete = useMemo(() => {
    if (!product) return false
    return areRequiredSelectionsComplete(product.customizations, selections)
  }, [product, selections])

  // A short, human-readable summary of the selected variant options (size, flavour, etc.) for
  // the Purchase Card — display formatting only; the variant/add-on categorization itself still
  // comes from the shared pricing engine.
  const variantSummary = useMemo(() => {
    if (!product) return ''
    return categorizeCustomizations(product.customizations, customizations)
      .variant.map((c) => c.optionLabel)
      .join(', ')
  }, [product, customizations])

  const handleSelectionChange = useCallback((groupId: string, value: string | string[]) => {
    setSelections((prev) => ({ ...prev, [groupId]: value }))
    setToastMessage(null)
  }, [])

  useEffect(() => {
    if (!window.location.hash) return

    const elementId = decodeURIComponent(window.location.hash.slice(1))
    let frame = 0
    let attempts = 0

    const scrollToCustomizer = () => {
      const target = document.getElementById(elementId)
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: Math.max(0, top - 96), left: 0, behavior: 'auto' })
        return
      }

      if (attempts < 60) {
        attempts += 1
        frame = window.requestAnimationFrame(scrollToCustomizer)
      }
    }

    frame = window.requestAnimationFrame(scrollToCustomizer)
    const timers = [100, 250, 500, 900].map((delay) =>
      window.setTimeout(scrollToCustomizer, delay),
    )

    return () => {
      window.cancelAnimationFrame(frame)
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [id])

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <span className="font-hand text-3xl text-ink">Hmm, that page fell off the notebook</span>
        <p className="text-ink-soft">We couldn&apos;t find that product.</p>
        <Button variant="coral" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  // The sticky CTA already confirms an add via its own price crossfade + stepper transition, so
  // it skips this toast rather than risk the two fixed-position confirmations overlapping.
  const handleAddToCart = (showConfirmationToast = true) => {
    // Read the store directly (not a reactive selector) — this is only ever needed at the exact
    // moment of adding, so subscribing ProductPage to `items` just to check its length here would
    // re-render this whole page every time cart contents change anywhere, including edits made to
    // an unrelated item from the Kitchen Tray sheet while this page sits underneath it.
    const isFirstItem = useCartStore.getState().items.length === 0
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      basePrice: product.basePrice,
      quantity,
      customizations,
      unitPrice,
    })
    if (showConfirmationToast) {
      setToastMessage(isFirstItem ? "Your recipe is coming together." : EDITORIAL_STRINGS.itemAddedToKitchenTray)
      setTimeout(() => setToastMessage(null), 3000)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          {EDITORIAL_STRINGS.backToTheMenu}
        </Button>
      </div>

      <RecipeVideo
        videoUrl={product.videoUrl}
        poster={product.videoPoster}
        productName={product.name}
      />
      <ProductHero ref={heroRef} product={product} />
      <CustomizationSection
        key={product.id}
        groups={product.customizations}
        selections={selections}
        onSelectionChange={handleSelectionChange}
        unitPrice={unitPrice}
      />
      <OrderActions
        ref={purchaseCardRef}
        quantity={quantity}
        unitPrice={unitPrice}
        productImage={product.image}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
        variantSummary={variantSummary}
        requiredOptionsComplete={requiredOptionsComplete}
        available={product.available ?? true}
      />
      <StoryTransition />
      <RecipeSection product={product} />

      <StickyProductCTA
        product={product}
        selections={selections}
        customizations={customizations}
        quantity={quantity}
        unitPrice={unitPrice}
        available={product.available ?? true}
        requiredOptionsComplete={requiredOptionsComplete}
        showAfterRef={heroRef}
        hideAtRef={purchaseCardRef}
        onAddToCart={() => handleAddToCart(false)}
      />

      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-cream craft-shadow-lg font-bold"
        >
          <CheckCircle className="h-5 w-5 text-butter" />
          {toastMessage}
        </motion.div>
      )}

      {/* Visually-hidden live region: this persistent span (rather than one that mounts only
          alongside the toast) is what actually gets the announcement to a screen reader — some
          assistive tech won't announce content that appears in a brand-new element, only content
          that *changes* within one already present. */}
      <span className="sr-only" aria-live="polite">
        {toastMessage ?? ''}
      </span>
    </>
  )
}
