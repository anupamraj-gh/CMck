import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { WashiTape } from '@/components/decor/Doodles'
import { useCartStore } from '@/store/cartStore'
import { useTraySheetStore } from '@/store/traySheetStore'
import { formatCurrency } from '@/lib/utils'
import { useContent } from '@/config/content'

export function LaunchOfferPage() {
  const [selectedBundleId, setSelectedBundleId] = useState('')
  const addItem = useCartStore((state) => state.addItem)
  const openTray = useTraySheetStore((state) => state.open)
  const { launchOffer } = useContent()
  const { bundles: launchBundles } = launchOffer
  const selectedBundle = launchBundles.find((bundle) => bundle.id === selectedBundleId)

  const handleAddToTray = () => {
    if (!selectedBundle) return

    addItem({
      productId: `launch-offer-${selectedBundle.id}`,
      productName: selectedBundle.name,
      productImage: selectedBundle.image,
      basePrice: selectedBundle.price,
      quantity: 1,
      customizations: [{
        groupId: 'bundle-contents',
        groupLabel: launchOffer.bundleContentsLabel,
        optionId: selectedBundle.id,
        optionLabel: selectedBundle.contents.join(', '),
        priceModifier: 0,
      }],
      unitPrice: selectedBundle.price,
    })
    openTray()
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          {launchOffer.backToMenuLabel}
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl"
        >
          <div className="mb-8 text-center">
            <p className="mb-2 font-hand text-2xl text-coral-deep">{launchOffer.introKicker}</p>
            <h1 className="font-serif text-3xl font-bold text-ink sm:text-5xl">
              {launchOffer.title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft">
              {launchOffer.description}
            </p>
          </div>

          <p className="mb-5 rounded-lg border border-butter-deep/30 bg-butter/30 px-4 py-3 text-center text-sm text-ink">
            {launchOffer.samplePriceNotice}
          </p>

          <RadioGroup
            value={selectedBundleId}
            onValueChange={setSelectedBundleId}
            aria-label={launchOffer.selectionAriaLabel}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
          >
            {launchBundles.map((bundle, index) => {
              const isSelected = selectedBundleId === bundle.id
              const inputId = `launch-${bundle.id}`

              return (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 24, rotate: index % 2 === 0 ? -1 : 1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  whileHover={{ rotate: 0, y: -5 }}
                  className="group relative h-full"
                >
                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-sm border-2 bg-grain p-3 pb-4 craft-shadow-lg transition-colors ${
                      isSelected ? 'border-coral ring-2 ring-coral/20' : 'border-ink/10 bg-paper'
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? 'color-mix(in srgb, var(--color-coral) 18%, var(--color-paper))'
                        : undefined,
                    }}
                  >
                    <WashiTape
                      className="left-1/2 -top-3.5 -translate-x-1/2 z-10"
                      color={['var(--color-blue)', 'var(--color-butter)', 'var(--color-mint)'][index % 3]}
                      rotate={index % 2 === 0 ? -4 : 4}
                      width={76}
                    />
                    <RadioGroupItem
                      id={inputId}
                      value={bundle.id}
                      aria-label={`${launchOffer.selectBundleLabel} ${bundle.name}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={inputId}
                      className="flex h-full cursor-pointer flex-col rounded-sm outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-coral-deep peer-focus-visible:ring-offset-2"
                    >
                      <div className="relative mb-4 rounded-md border-2 border-dashed border-ink-faint/60 bg-lavender/40 p-2">
                        <div className="relative aspect-[4/3] overflow-hidden rounded bg-lavender-deep">
                          <img
                            src={bundle.image}
                            alt={bundle.imageAlt}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col px-1">
                        <h2 className="mb-2 font-serif text-xl font-bold leading-snug text-ink">
                          {bundle.name}
                        </h2>
                        <ul className="mb-5 space-y-1 text-sm leading-relaxed text-ink-soft">
                          {bundle.contents.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-ink/15 pt-3">
                          <span className="text-xs text-ink-soft">{launchOffer.samplePriceLabel}</span>
                          <span className="font-mono text-xl font-bold text-coral-deep">
                            {formatCurrency(bundle.price)}
                          </span>
                        </div>
                      </div>
                    </Label>
                  </div>
                </motion.div>
              )
            })}
          </RadioGroup>

          <div className="flex flex-col items-center gap-4" style={{ marginTop: '5%' }}>
            <Button
              variant="coral"
              size="lg"
              className="min-w-72 rounded-full px-10 py-3"
              disabled={!selectedBundle}
              onClick={handleAddToTray}
            >
              <ShoppingBag className="h-4 w-4" />
              {launchOffer.addToTrayLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs text-ink-soft">
              {launchOffer.trayReviewNote}
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
