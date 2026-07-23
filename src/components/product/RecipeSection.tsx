import { motion } from 'framer-motion'
import { ListOrdered, Flame, UtensilsCrossed } from 'lucide-react'
import type { Product } from '@/types'
import { PaperCard } from '@/components/craft/PaperCard'
import { NotebookHoles, ScribbleUnderline, PaperClip } from '@/components/decor/Doodles'

interface RecipeSectionProps {
  product: Product
}

export function RecipeSection({ product }: RecipeSectionProps) {
  return (
    <section className="relative py-16 sm:py-24 bg-purple/25">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-hand text-2xl text-coral-deep mb-1">the full recipe, documented</p>
          <h2 className="font-serif text-4xl font-bold text-ink">From Our Kitchen Notebook</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true }}
            className="relative ruled-paper ruled-paper-margin craft-shadow-lg rounded-sm p-8 pl-16 sm:pl-20"
          >
            <NotebookHoles count={5} className="absolute left-4 sm:left-6 top-10 bottom-10" />
            <h3 className="font-serif text-xl font-semibold mb-5 text-ink">Ingredients Used</h3>
            <ul className="space-y-3.5">
              {product.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-3 text-ink-soft">
                  <span className="h-4 w-4 rounded-sm border-2 border-coral-deep shrink-0" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative bg-cream craft-shadow-lg rounded-sm p-8"
          >
            <PaperClip className="absolute -top-5 right-8 h-12 w-6 text-ink-soft rotate-12" />
            <div className="flex items-center gap-3 mb-5">
              <Flame className="h-6 w-6 text-coral-deep" />
              <h3 className="font-serif text-xl font-semibold text-ink">Cooking Instructions</h3>
            </div>
            <ul className="space-y-3.5">
              {product.cookingInstructions.map((instruction) => (
                <li key={instruction} className="flex items-start gap-3 text-ink-soft text-sm leading-relaxed">
                  <span className="text-coral-deep mt-0.5 font-bold">→</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <ListOrdered className="h-6 w-6 text-coral-deep" />
            <h3 className="font-serif text-2xl font-semibold text-ink">Preparation Steps</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
            {product.preparationSteps.map((step, i) => (
              <PaperCard
                key={step.step}
                tone={i % 2 === 0 ? 'paper' : 'cream'}
                rotate={i % 2 === 0 ? -1.5 : 1.5}
                wobble={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className="p-6 pt-8"
              >
                <div className="absolute -top-4 -left-4 h-11 w-11 rounded-full bg-butter border-2 border-paper text-ink font-serif font-bold flex items-center justify-center text-lg craft-shadow">
                  {step.step}
                </div>
                <h4 className="font-serif text-lg font-semibold text-ink mb-2">{step.title}</h4>
                <p className="text-sm text-ink-soft leading-relaxed">{step.description}</p>
              </PaperCard>
            ))}
          </div>
        </div>

        {product.servingSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto p-8 rounded-2xl bg-ink text-cream text-center relative"
          >
            <UtensilsCrossed className="h-8 w-8 text-butter mx-auto mb-4" />
            <p className="font-hand text-2xl text-butter mb-2">a note from the chef</p>
            <ScribbleUnderline className="h-2.5 w-24 text-coral mx-auto mb-4" />
            <p className="text-cream/75 leading-relaxed">{product.servingSuggestions}</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
