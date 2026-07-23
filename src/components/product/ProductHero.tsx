import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Polaroid } from '@/components/craft/Polaroid'
import { StarDoodle, ScribbleUnderline } from '@/components/decor/Doodles'

interface ProductHeroProps {
  product: Product
}

const chipColors = ['bg-mint', 'bg-pink', 'bg-butter', 'bg-blue', 'bg-peach']

export function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="py-14 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-72 sm:w-96">
              <Polaroid
                src={product.heroImage}
                alt={product.name}
                caption={`${product.name} ✦`}
                rotate={-2.5}
                aspect="aspect-square"
                className="w-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 10 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 13 }}
                className="absolute -top-5 -right-5 h-20 w-20 rounded-full bg-coral text-paper border-2 border-paper craft-shadow flex flex-col items-center justify-center text-center leading-none"
              >
                <span className="text-[9px] font-bold uppercase opacity-80">from</span>
                <span className="text-base font-extrabold">{formatCurrency(product.basePrice)}</span>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-hand text-2xl text-coral-deep mb-1">a signature item</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-4 leading-tight">
              {product.name}
            </h1>
            <ScribbleUnderline className="h-3 w-32 text-mint-deep mb-5" />
            <p className="text-ink-soft leading-relaxed mb-6">{product.description}</p>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper border-2 border-ink/10 font-bold">
                <Clock className="h-4 w-4" />
                {product.prepTime}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-paper border-2 border-ink/10 font-bold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarDoodle
                    key={i}
                    className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? 'text-butter-deep' : 'text-ink-faint/40'}`}
                  />
                ))}
                <span className="ml-1">
                  {product.rating} ({product.reviewCount})
                </span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.highlights.map((highlight, i) => (
                <span
                  key={highlight}
                  className={`px-4 py-2 rounded-full text-sm font-bold text-ink border-2 border-ink/10 rotate-hover hover:-translate-y-0.5 ${chipColors[i % chipColors.length]}`}
                >
                  {highlight}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
