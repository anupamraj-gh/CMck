import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Polaroid } from '@/components/craft/Polaroid'
import { PaperStack } from '@/components/craft/PaperStack'
import {
  WashiTape,
  StarDoodle,
  HeartDoodle,
  SparkleDoodle,
  WhiskDoodle,
  CheckboxDoodle,
} from '@/components/decor/Doodles'
import { FloatingDoodle } from '@/components/craft/FloatingDoodle'
import { PageTab } from '@/components/decor/PageTab'
import { SITE_CONFIG, CONTENT } from '@/config/content'
import { products } from '@/data/products'

const hero = CONTENT.hero
const [headlineLine1, headlineHighlight] = hero.headline.split('\n')

export function HeroSection() {
  const heroProduct = products[0]

  return (
    <section className="relative overflow-hidden bg-lavender bg-vignette pb-8 pt-4 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(58,49,69,0.06)_1px,transparent_0)] [background-size:18px_18px]" />

      <FloatingDoodle icon={StarDoodle} className="left-[6%] top-28 text-butter-deep" size={28} duration={5} />
      <FloatingDoodle icon={WhiskDoodle} className="right-[4%] bottom-40 text-ink-faint hidden lg:block" size={34} delay={0.3} duration={5.5} rotate={-8} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto lg:mx-0">
          <PaperStack>
          <div className="relative bg-paper bg-grain page-fold craft-shadow-lg rounded-sm p-6 sm:p-10 lg:pr-64 lg:rotate-[-1deg] pb-8">
            <div
              aria-hidden
              className="hidden lg:block pointer-events-none absolute right-48 top-3 bottom-3 w-10 bg-gradient-to-l from-ink/10 to-transparent"
            />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center lg:text-left relative"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-butter/60 border-2 border-ink/10 craft-shadow-sm -rotate-2 mb-5 lg:mb-6">
                <span className="font-hand text-sm text-ink">{hero.badgeText}</span>
              </div>

              <h1 className="font-hand text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[0.98] mb-4">
                {headlineLine1}
                <br />
                <span className="relative inline-block text-coral-deep">
                  {headlineHighlight}
                  <SparkleDoodle className="absolute -top-3 -right-8 h-6 w-6 text-butter-deep animate-sparkle hidden sm:block" />
                </span>
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-coral-deep mb-5 lg:mb-8">
                {SITE_CONFIG.tagline}
              </p>

              <motion.div
                initial={{ opacity: 0, rotate: 8, y: 10 }}
                animate={{ opacity: 1, rotate: 3, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="inline-flex flex-col gap-1.5 bg-butter/70 border border-ink/10 rounded-md px-4 py-3 tape-shadow mb-5 mx-auto lg:mb-8 lg:mx-0"
              >
                {hero.todaysSpecial.map((item) => (
                  <span key={item} className="flex items-center gap-2 font-hand text-base leading-none text-ink">
                    <CheckboxDoodle className="h-4 w-4 text-mint-deep shrink-0" />
                    {item}
                  </span>
                ))}
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-5 lg:mb-8">
                <Button variant="coral" size="lg" className="rotate-[-1deg]" asChild>
                  <a href="#menu">{hero.ctaPrimaryLabel}</a>
                </Button>
                <Button variant="outline" size="lg" className="rotate-[1deg]" asChild>
                  <a href="#menu">{hero.ctaSecondaryLabel}</a>
                </Button>
              </div>

              <p className="font-hand text-lg text-ink-soft flex items-center gap-1 justify-center lg:justify-start">
                <span className="text-ink-faint">·</span> {hero.footnote} <HeartDoodle className="h-3.5 w-3.5 text-coral-deep" />
              </p>
            </motion.div>

            <div className="absolute -bottom-4 right-6 lg:right-10">
              <PageTab label={hero.pageLabel} rotate={3} tone="paper" />
            </div>
          </div>
          </PaperStack>

          <div className="relative flex justify-center -mt-20 lg:mt-0 lg:block lg:absolute lg:top-8 lg:right-2 xl:right-6 lg:w-72">
            <div className="relative w-[72%] max-w-[19rem] sm:w-72 lg:w-full ml-[12%] lg:ml-0">
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,253,248,0.65),transparent_70%)]" />

              <WashiTape className="left-1/2 -top-3 -translate-x-1/2 z-10" color="var(--color-pink)" rotate={-3} width={100} />

              <Polaroid
                src={heroProduct.heroImage}
                alt={heroProduct.name}
                caption={heroProduct.name}
                rotate={-4}
                className="w-full"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 8 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 180, damping: 14 }}
                className="absolute top-6 -right-4 sm:-right-6 h-16 w-16 rounded-full bg-mint border-2 border-paper craft-shadow flex flex-col items-center justify-center text-center"
              >
                <span className="font-hand text-sm leading-none text-ink">{hero.pickBadgeLine1}</span>
                <span className="font-hand text-sm leading-none text-ink">{hero.pickBadgeLine2}</span>
              </motion.div>

              <svg
                aria-hidden
                className="absolute -bottom-1 -left-6 h-6 w-6 text-ink/25"
                viewBox="0 0 24 24"
              >
                <path d="M12 0v18" stroke="currentColor" strokeWidth="1.6" strokeDasharray="1 3" strokeLinecap="round" />
              </svg>
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 8 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 180, damping: 14 }}
                className="absolute -bottom-9 -left-8 h-20 w-20 rounded-full bg-butter border-2 border-ink/10 craft-shadow flex flex-col items-center justify-center text-center"
              >
                <span className="font-hand text-base leading-none text-ink">{hero.madeBadgeLine1}</span>
                <span className="font-hand text-base leading-none text-ink">{hero.madeBadgeLine2}</span>
              </motion.div>

              <div
                aria-hidden
                className="block absolute -bottom-3 -right-6 h-11 w-20 bg-peach/80 -rotate-6 tape-shadow deckle-bottom -z-10 sm:-right-10 sm:h-14 sm:w-24"
                style={{ '--deckle-bg': 'var(--color-lavender)' } as CSSProperties}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
