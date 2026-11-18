import { useMemo, useState, useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star, Plus, Check } from 'lucide-react'
import { products, getProductById } from '@/data/products'
import { formatCurrency } from '@/lib/utils'
import { CONTENT } from '@/config/content'
import {
  useCartStore,
  buildDefaultSelections,
  selectionsToCustomizations,
  calculateUnitPrice,
  needsCustomization,
  findMatchingCartItem,
} from '@/store/cartStore'
import { useLaunchFlight } from '@/hooks/useLaunchFlight'
import { triggerHaptic } from '@/lib/haptics'
import { DURATION, EASE } from '@/lib/motion'
import { useBumpOnIncrease } from '@/hooks/useBumpOnIncrease'
import { useProductCartQuantity } from '@/hooks/useProductCartQuantity'
import { EDITORIAL_STRINGS, itemAddedAnnouncement } from '@/config/editorialStrings'

const productGridContent = CONTENT.productGrid
import { WashiTape, ScribbleUnderline, NotebookHoles, HeartDoodle } from '@/components/decor/Doodles'
import { PageTab } from '@/components/decor/PageTab'
import { StickyNote } from '@/components/craft/StickyNote'
import { PaperStack } from '@/components/craft/PaperStack'
import { PhotoPlaceholder } from '@/components/craft/PhotoPlaceholder'

const tapeColors = ['var(--color-blue)', 'var(--color-butter)', 'var(--color-mint)', 'var(--color-pink)']

interface CardProps {
  product: (typeof products)[number]
  index: number
  rotate: number
  featured?: boolean
  bestseller?: boolean
  compact?: boolean
}

function RatingRow({ rating, reviewCount, size = 'sm' }: { rating: number; reviewCount: number; size?: 'sm' | 'lg' }) {
  return (
    <div className={`flex items-center gap-0.5 ${size === 'lg' ? 'mb-3' : 'mb-1.5'}`} aria-label={`${rating} star rating`}>
      {Array.from({ length: 5 }).map((_, s) => (
        <Star
          key={s}
          className={`${size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} ${s < Math.round(rating) ? 'fill-butter-deep text-butter-deep' : 'text-ink-faint/30'}`}
        />
      ))}
      <span className={`text-ink-soft ml-1 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>({rating}) · {reviewCount} reviews</span>
    </div>
  )
}

function PriceBadge({ product, rotate, index }: { product: (typeof products)[number]; rotate: number; index: number }) {
  const cartQuantity = useProductCartQuantity(product.id)
  const wiggleKey = useBumpOnIncrease(cartQuantity)

  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      whileInView={{ scale: 1, rotate: rotate > 0 ? -8 : 8 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + (index % 3) * 0.08, type: 'spring', stiffness: 220, damping: 12 }}
      className="absolute -bottom-4 -right-3 h-16 w-16 rounded-full bg-coral text-paper flex flex-col items-center justify-center border-2 border-paper craft-shadow text-center leading-none"
    >
      <motion.span
        key={wiggleKey}
        animate={{ rotate: [0, -8, 7, -4, 0] }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <span className="text-[9px] font-bold uppercase tracking-wide opacity-80">from</span>
        <span className="text-sm font-extrabold">{formatCurrency(product.basePrice)}</span>
      </motion.span>
    </motion.div>
  )
}

function QuickAddControl({
  product,
  compact = false,
  fullLabel = false,
}: {
  product: (typeof products)[number]
  compact?: boolean
  fullLabel?: boolean
}) {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const [justAdded, setJustAdded] = useState(false)
  // Whether the tray was empty right before this specific add — a one-time, meaningful moment
  // that deserves different wording than every later, routine add.
  const [wasFirstItem, setWasFirstItem] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const launchFlight = useLaunchFlight()
  const navigate = useNavigate()

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const defaultCustomizations = useMemo(() => {
    const selections = buildDefaultSelections(product.customizations)
    return selectionsToCustomizations(product.customizations, selections)
  }, [product])

  const requiresCustomizer = useMemo(() => needsCustomization(product.customizations), [product])
  const existing = findMatchingCartItem(items, product.id, defaultCustomizations)

  const stop = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleAdd = (e: MouseEvent) => {
    stop(e)
    triggerHaptic()
    if (existing) {
      updateQuantity(existing.id, existing.quantity + 1)
    } else if (requiresCustomizer) {
      // Some required choice here has no safe default (e.g. "pick at least one" checkbox
      // group) — never guess. Send them to the full customizer instead of instant-adding.
      navigate(`/product/${product.id}#customize`)
      return
    } else {
      setWasFirstItem(items.length === 0)
      const unitPrice = calculateUnitPrice(product.basePrice, defaultCustomizations)
      addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        basePrice: product.basePrice,
        quantity: 1,
        customizations: defaultCustomizations,
        unitPrice,
      })
      launchFlight(addButtonRef.current, product.image)
    }
    setJustAdded(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1200)
  }

  const handleIncrement = (e: MouseEvent) => {
    stop(e)
    triggerHaptic()
    if (existing) updateQuantity(existing.id, existing.quantity + 1)
  }

  const handleDecrement = (e: MouseEvent) => {
    stop(e)
    triggerHaptic()
    if (!existing) return
    if (existing.quantity <= 1) removeItem(existing.id)
    else updateQuantity(existing.id, existing.quantity - 1)
  }

  if (product.available === false) {
    return (
      <span
        aria-label={EDITORIAL_STRINGS.currentlyUnavailable}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-ink-faint/25 bg-lavender/40 font-bold text-ink-faint craft-shadow-sm shrink-0 cursor-not-allowed ${
          compact ? 'h-7 w-7 text-xs' : 'h-8 px-4 text-sm'
        }`}
      >
        {compact ? '×' : EDITORIAL_STRINGS.currentlyUnavailable}
      </span>
    )
  }

  if (existing && !justAdded) {
    return (
      <div
        onClick={stop}
        className={`inline-flex items-center rounded-full border-2 border-ink/15 bg-paper craft-shadow-sm shrink-0 ${compact ? 'h-7 gap-1 px-1' : 'h-8 gap-2.5 px-1.5'}`}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={handleDecrement}
          aria-label="Decrease quantity"
          className={`rounded-full flex items-center justify-center text-ink font-bold hover:bg-purple/30 transition-colors duration-fast ease-hover ${compact ? 'h-5 w-5 text-xs' : 'h-6 w-6 text-sm'}`}
        >
          −
        </motion.button>
        <span className={`relative inline-grid place-items-center overflow-hidden text-center font-bold text-ink ${compact ? 'w-3 text-xs' : 'w-4 text-sm'}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={existing.quantity}
              initial={{ opacity: 0, y: -8, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.7 }}
              transition={{ duration: DURATION.extraFast, ease: EASE.press }}
              className="col-start-1 row-start-1"
            >
              {existing.quantity}
            </motion.span>
          </AnimatePresence>
        </span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={handleIncrement}
          aria-label="Increase quantity"
          className={`rounded-full flex items-center justify-center text-ink font-bold hover:bg-purple/30 transition-colors duration-fast ease-hover ${compact ? 'h-5 w-5 text-xs' : 'h-6 w-6 text-sm'}`}
        >
          +
        </motion.button>
      </div>
    )
  }

  return (
    <motion.button
      ref={addButtonRef}
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={handleAdd}
      aria-label={compact ? EDITORIAL_STRINGS.addToKitchenTray : undefined}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-coral text-paper font-bold craft-shadow-sm hover:bg-coral-deep transition-colors duration-fast ease-hover overflow-hidden ${
        compact ? 'h-7 w-7 shrink-0' : 'h-8 px-4 text-sm'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {justAdded ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: DURATION.fast, ease: EASE.entrance }}
            className="inline-flex items-center gap-1.5"
          >
            <Check className={compact ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
            {!compact && (wasFirstItem ? "Your recipe is coming together." : EDITORIAL_STRINGS.itemAddedToKitchenTray)}
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: DURATION.fast, ease: EASE.entrance }}
            className="inline-flex items-center gap-1.5"
          >
            <Plus className={compact ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
            {!compact && (fullLabel ? EDITORIAL_STRINGS.addToKitchenTray : productGridContent.addLabel)}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {justAdded ? itemAddedAnnouncement(product.name) : ''}
      </span>
    </motion.button>
  )
}

function FeaturedCard({ product, index, rotate }: CardProps) {
  const cartQuantity = useProductCartQuantity(product.id)
  const compressKey = useBumpOnIncrease(cartQuantity)

  return (
    <motion.div
      initial={{ opacity: 0, y: 44, rotate: rotate - 6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: DURATION.slow, ease: EASE.entrance }}
      whileHover={{ rotate: 0, y: -8, scale: 1.01, transition: { duration: DURATION.fast, ease: EASE.hover } }}
      className="relative group"
    >
      <PaperStack>
      <motion.div
        key={compressKey}
        animate={{ scale: [1, 0.98, 1] }}
        transition={{ duration: DURATION.fast, ease: EASE.entrance }}
        className="relative bg-paper bg-grain p-5 sm:p-6 sm:pl-14 craft-shadow-lg rounded-sm border border-ink/10 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:items-center">
        <NotebookHoles count={7} className="absolute left-4 sm:left-5 top-8 bottom-8 hidden sm:flex" />
        <WashiTape className="left-1/2 -top-3.5 -translate-x-1/2 z-10" color="var(--color-mint)" rotate={-4} width={90} />
        <span className="absolute -top-3 right-6 z-10 inline-block px-3.5 py-1.5 rounded-full bg-ink text-cream text-xs font-bold tracking-wide craft-shadow-sm rotate-3">
          Chef&apos;s Special
        </span>

        <Link to={`/product/${product.id}#customize`} className="block relative rounded-md border-2 border-dashed border-ink-faint/60 p-2 bg-lavender/40">
          <div className="relative overflow-hidden rounded bg-lavender-deep aspect-[4/3]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <PhotoPlaceholder />
            )}
          </div>
        </Link>

        <div className="pt-5 lg:pt-0 flex flex-col">
          <Link to={`/product/${product.id}#customize`} className="block">
            <h3 className="font-serif font-semibold text-ink leading-snug group-hover:text-coral-deep transition-colors duration-fast ease-hover mb-1.5 text-2xl sm:text-3xl">
              {product.name}
            </h3>
          </Link>
          <RatingRow rating={product.rating} reviewCount={product.reviewCount} size="lg" />
          <p className="text-ink-soft mb-4 text-base leading-relaxed">{product.description}</p>
          <div className="flex items-center justify-between mt-auto gap-3 pr-14 sm:pr-0">
            <QuickAddControl product={product} fullLabel />
            <Link
              to={`/product/${product.id}#customize`}
              className="text-sm font-bold text-ink-soft hover:text-coral-deep transition-colors duration-fast ease-hover inline-flex items-center gap-1 shrink-0"
            >
              {productGridContent.customizeLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
      </PaperStack>

      <PriceBadge product={product} rotate={rotate} index={index} />
    </motion.div>
  )
}

function RecipeCard({ product, index, rotate, bestseller = false, compact = false }: CardProps) {
  const cartQuantity = useProductCartQuantity(product.id)
  const compressKey = useBumpOnIncrease(cartQuantity)

  return (
    <motion.div
      initial={{ opacity: 0, y: 44, rotate: rotate - 6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: DURATION.slow, delay: (index % 3) * 0.08, ease: EASE.entrance }}
      whileHover={{ rotate: 0, y: -8, scale: 1.02, transition: { duration: DURATION.fast, ease: EASE.hover } }}
      className="relative h-full group"
    >
      <motion.div
        key={compressKey}
        animate={{ scale: [1, 0.98, 1] }}
        transition={{ duration: DURATION.fast, ease: EASE.entrance }}
        className="relative bg-paper bg-grain p-3 pb-4 craft-shadow-lg rounded-sm border border-ink/10 h-full flex flex-col overflow-hidden"
      >
        {bestseller && (
          <div className="absolute -left-14 top-7 w-60 bg-coral text-paper text-[10px] font-bold uppercase tracking-wider text-center py-1 -rotate-45 z-10 craft-shadow-sm">
            Kitchen Favourite
          </div>
        )}
        <WashiTape
          className="left-1/2 -top-3.5 -translate-x-1/2 z-10"
          color={tapeColors[index % tapeColors.length]}
          rotate={index % 2 === 0 ? -4 : 4}
          width={76}
        />

        <Link to={`/product/${product.id}#customize`} className="block relative rounded-md border-2 border-dashed border-ink-faint/60 p-2 bg-lavender/40">
          <div className={`relative overflow-hidden rounded bg-lavender-deep ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <PhotoPlaceholder />
            )}
          </div>
        </Link>

        <span className="absolute top-2.5 left-2.5 z-10 h-7 w-7 rounded-full bg-ink text-cream text-xs font-bold flex items-center justify-center craft-shadow-sm">
          0{index + 1}
        </span>

        <div className="pt-4 px-1 flex flex-col flex-1">
          <Link to={`/product/${product.id}#customize`} className="block">
            <h3 className={`font-serif font-semibold text-ink leading-snug group-hover:text-coral-deep transition-colors duration-fast ease-hover mb-1 ${compact ? 'text-base' : 'text-lg'}`}>
              {product.name}
            </h3>
          </Link>
          <RatingRow rating={product.rating} reviewCount={product.reviewCount} />
          {!compact && <p className="text-ink-soft mb-1 text-sm line-clamp-2">{product.shortDescription}</p>}
          <div className={`flex items-center justify-between mt-auto pt-3 gap-2 ${compact ? 'pr-9' : 'pr-14 sm:pr-0'}`}>
            <QuickAddControl product={product} compact={compact} />
            <Link
              to={`/product/${product.id}#customize`}
              aria-label={compact ? productGridContent.customizeLabel : undefined}
              className="text-xs font-bold text-ink-soft hover:text-coral-deep transition-colors duration-fast ease-hover inline-flex items-center gap-1 shrink-0"
            >
              {compact ? <ArrowRight className="h-3 w-3" /> : productGridContent.customizeLabel}
            </Link>
          </div>
        </div>
      </motion.div>

      <PriceBadge product={product} rotate={rotate} index={index} />
    </motion.div>
  )
}

export function ProductGrid() {
  const [featured, ...rest] = products
  const chefsRecommendation = getProductById(productGridContent.chefsRecommendationId)

  return (
    <section id="menu" className="relative py-12 sm:py-36 scroll-mt-24 overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 right-0 font-serif font-bold text-[9rem] sm:text-[13rem] leading-none text-ink/[0.035] select-none hidden md:block"
      >
        05
      </span>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 lg:mb-16 max-w-xl"
        >
          <PageTab label={productGridContent.pageLabel} rotate={-2} className="mb-4" />
          <p className="font-hand text-2xl text-coral-deep mb-1">{productGridContent.kicker}</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-3">
            {productGridContent.title}
          </h2>
          <ScribbleUnderline className="h-3 w-40 text-butter-deep mb-4" />
          <p className="text-ink-soft">
            {productGridContent.description}
          </p>
        </motion.div>

        <div className="mb-10 lg:mb-16">
          <FeaturedCard product={featured} index={0} rotate={-1.5} />
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-14 max-sm:gap-y-6 pb-0 sm:pb-16">
          {rest.map((product, i) => {
            const globalIndex = i + 1
            const rotate = globalIndex % 2 === 0 ? -2.5 : 3
            const cfg = [
              { span: 'lg:col-span-3', mt: 'lg:mt-10', mobile: 'max-sm:w-[88%] max-sm:mr-auto' },
              { span: 'lg:col-span-5', mt: 'lg:mt-0', mobile: 'max-sm:w-[94%] max-sm:ml-auto max-sm:-mt-2' },
              { span: 'lg:col-span-2', mt: 'lg:mt-16', mobile: 'max-sm:w-[76%] max-sm:mr-auto max-sm:-mt-4' },
              { span: 'lg:col-span-2', mt: 'lg:mt-6', mobile: 'max-sm:w-[82%] max-sm:ml-auto max-sm:-mt-6' },
            ][i % 4]
            return (
              <div key={product.id} className={`${cfg.span} ${cfg.mt} ${cfg.mobile}`}>
                <RecipeCard
                  product={product}
                  index={globalIndex}
                  rotate={rotate}
                  bestseller={product.id === 'gourmet-burger'}
                  compact={cfg.span === 'lg:col-span-2'}
                />
              </div>
            )
          })}

          {chefsRecommendation && (
            <div className="flex justify-end max-sm:-mt-8 lg:absolute lg:-bottom-6 lg:right-4">
              <Link to={`/product/${chefsRecommendation.id}#customize`} className="block">
                <StickyNote color="butter" rotate={-3} className="w-60 sm:w-64">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                    Chef Recommends
                  </p>
                  <p className="font-hand text-xl leading-snug text-ink mb-1">
                    Try our {chefsRecommendation.name}
                  </p>
                  <p className="text-sm text-ink/70 flex items-center gap-1.5">
                    — {productGridContent.chefsRecommendationNote} <HeartDoodle className="h-3.5 w-3.5 text-coral-deep shrink-0" />
                  </p>
                </StickyNote>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
