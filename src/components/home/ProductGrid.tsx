import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { products, getProductById } from '@/data/products'
import { formatCurrency } from '@/lib/utils'
import { CONTENT } from '@/config/content'

const productGridContent = CONTENT.productGrid
import { WashiTape, ScribbleUnderline, SparkleDoodle, NotebookHoles, HeartDoodle } from '@/components/decor/Doodles'
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
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      whileInView={{ scale: 1, rotate: rotate > 0 ? -8 : 8 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + (index % 3) * 0.08, type: 'spring', stiffness: 220, damping: 12 }}
      className="absolute -bottom-4 -right-3 h-16 w-16 rounded-full bg-coral text-paper flex flex-col items-center justify-center border-2 border-paper craft-shadow text-center leading-none"
    >
      <span className="text-[9px] font-bold uppercase tracking-wide opacity-80">from</span>
      <span className="text-sm font-extrabold">{formatCurrency(product.basePrice)}</span>
    </motion.div>
  )
}

function FeaturedCard({ product, index, rotate }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44, rotate: rotate - 6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: 0, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, y: -8, scale: 1.01 }}
      className="relative"
    >
      <Link to={`/product/${product.id}`} className="group block">
        <PaperStack>
        <div className="relative bg-paper bg-grain p-5 sm:p-6 sm:pl-14 craft-shadow-lg rounded-sm border border-ink/10 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:items-center">
          <NotebookHoles count={7} className="absolute left-4 sm:left-5 top-8 bottom-8 hidden sm:flex" />
          <WashiTape className="left-1/2 -top-3.5 -translate-x-1/2 z-10" color="var(--color-mint)" rotate={-4} width={90} />
          <span className="absolute -top-3 right-6 z-10 inline-block px-3.5 py-1.5 rounded-full bg-ink text-cream text-xs font-bold tracking-wide craft-shadow-sm rotate-3">
            Chef&apos;s Special
          </span>

          <div className="relative rounded-md border-2 border-dashed border-ink-faint/60 p-2 bg-lavender/40">
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
          </div>

          <div className="pt-5 lg:pt-0 flex flex-col">
            <h3 className="font-serif font-semibold text-ink leading-snug group-hover:text-coral-deep transition-colors mb-1.5 text-2xl sm:text-3xl">
              {product.name}
            </h3>
            <RatingRow rating={product.rating} reviewCount={product.reviewCount} size="lg" />
            <p className="text-ink-soft mb-4 text-base leading-relaxed">{product.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-ink group-hover:text-coral-deep transition-colors">
                View &amp; Customize
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <SparkleDoodle className="h-3.5 w-3.5 text-butter-deep opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
        </PaperStack>

        <PriceBadge product={product} rotate={rotate} index={index} />
      </Link>
    </motion.div>
  )
}

function RecipeCard({ product, index, rotate, bestseller = false, compact = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44, rotate: rotate - 6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, y: -8, scale: 1.02 }}
      className="relative h-full"
    >
      <Link to={`/product/${product.id}`} className="group block h-full">
        <div className="relative bg-paper bg-grain p-3 pb-4 craft-shadow-lg rounded-sm border border-ink/10 h-full flex flex-col overflow-hidden">
          {bestseller && (
            <div className="absolute -left-10 top-5 w-40 bg-coral text-paper text-[10px] font-bold uppercase tracking-wider text-center py-1 -rotate-45 z-10 craft-shadow-sm">
              Bestseller
            </div>
          )}
          <WashiTape
            className="left-1/2 -top-3.5 -translate-x-1/2 z-10"
            color={tapeColors[index % tapeColors.length]}
            rotate={index % 2 === 0 ? -4 : 4}
            width={76}
          />

          <div className="relative rounded-md border-2 border-dashed border-ink-faint/60 p-2 bg-lavender/40">
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
          </div>

          <span className="absolute top-2.5 left-2.5 z-10 h-7 w-7 rounded-full bg-ink text-cream text-xs font-bold flex items-center justify-center craft-shadow-sm">
            0{index + 1}
          </span>

          <div className="pt-4 px-1 flex flex-col flex-1">
            <h3 className={`font-serif font-semibold text-ink leading-snug group-hover:text-coral-deep transition-colors mb-1 ${compact ? 'text-base' : 'text-lg'}`}>
              {product.name}
            </h3>
            <RatingRow rating={product.rating} reviewCount={product.reviewCount} />
            {!compact && <p className="text-ink-soft mb-1 text-sm line-clamp-2">{product.shortDescription}</p>}
            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-ink group-hover:text-coral-deep transition-colors">
                View &amp; Customize
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <SparkleDoodle className="h-3.5 w-3.5 text-butter-deep opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        <PriceBadge product={product} rotate={rotate} index={index} />
      </Link>
    </motion.div>
  )
}

export function ProductGrid() {
  const [featured, ...rest] = products
  const chefsRecommendation = getProductById(productGridContent.chefsRecommendationId)

  return (
    <section id="menu" className="relative py-28 sm:py-36 scroll-mt-24 overflow-hidden">
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
          className="mb-16 max-w-xl"
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

        <div className="mb-16">
          <FeaturedCard product={featured} index={0} rotate={-1.5} />
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-14 pb-8 sm:pb-16">
          {rest.map((product, i) => {
            const globalIndex = i + 1
            const rotate = globalIndex % 2 === 0 ? -2.5 : 3
            const cfg = [
              { span: 'lg:col-span-3', mt: 'lg:mt-10' },
              { span: 'lg:col-span-5', mt: 'lg:mt-0' },
              { span: 'lg:col-span-2', mt: 'lg:mt-16' },
              { span: 'lg:col-span-2', mt: 'lg:mt-6' },
            ][i % 4]
            return (
              <div key={product.id} className={`${cfg.span} ${cfg.mt}`}>
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
            <div className="flex justify-center sm:justify-end lg:absolute lg:-bottom-6 lg:right-4">
              <Link to={`/product/${chefsRecommendation.id}`} className="block">
                <StickyNote color="butter" rotate={-3} className="w-60 sm:w-64">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                    Chef&apos;s Recommendation
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
