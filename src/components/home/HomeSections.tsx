import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Heart, Award, Clock } from 'lucide-react'
import { PaperCard } from '@/components/craft/PaperCard'
import { StickyNote } from '@/components/craft/StickyNote'
import { WaxSeal } from '@/components/craft/WaxSeal'
import { HangingTag } from '@/components/craft/HangingTag'
import { PaperStack } from '@/components/craft/PaperStack'
import {
  NotebookHoles,
  StarDoodle,
  HeartDoodle,
  WashiTape,
  ArrowDoodle,
  CoffeeStain,
  RollingPinDoodle,
  ChefHatDoodle,
  WhiskDoodle,
  SpoonDoodle,
  HandmadeStamp,
} from '@/components/decor/Doodles'
import { PageTab } from '@/components/decor/PageTab'
import { SITE_CONFIG } from '@/config/site'

const features = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Only the finest organic and locally-sourced ingredients make it into any dish.',
    color: 'mint' as const,
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each item is handcrafted in small batches to keep quality and taste premium.',
    color: 'pink' as const,
  },
  {
    icon: Award,
    title: 'Transparent Process',
    description: 'Watch our recipe videos and see exactly how your food comes together.',
    color: 'butter' as const,
  },
  {
    icon: Clock,
    title: 'Fresh Delivery',
    description: 'Made to order and delivered right at your preferred date and time slot.',
    color: 'blue' as const,
  },
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28 scroll-mt-24 overflow-visible">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24, rotate: -1 }}
            whileInView={{ opacity: 1, x: 0, rotate: -1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative ruled-paper ruled-paper-margin craft-shadow-lg rounded-sm p-8 sm:p-10 pl-16 sm:pl-20"
          >
            <NotebookHoles count={6} className="absolute left-4 sm:left-6 top-10 bottom-10" />
            <PageTab label="THE STORY · Pg. 03" rotate={2} className="mb-4" />
            <p className="font-hand text-2xl text-coral-deep mb-1">a page from our journal</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-5">
              Where Passion Meets Plate
            </h2>
            <p className="text-ink-soft leading-loose mb-4">
              {SITE_CONFIG.brandName} was born from a simple belief: food should be an experience,
              not just a transaction. We invite you to watch how each dish comes to life, understand
              every ingredient, and personalize your order exactly the way you love it.
            </p>
            <p className="text-ink-soft leading-loose">
              From our artisan cakes to protein-packed bars, every item on our curated menu is a
              little handwritten note of quality, transparency, and the joy of great food.
            </p>
            <CoffeeStain className="absolute -bottom-8 -left-6 h-20 w-20 text-coral-deep/25 hidden sm:block" />
            <StarDoodle className="absolute bottom-6 right-6 h-6 w-6 text-butter-deep animate-wiggle" />
            <RollingPinDoodle className="absolute top-6 right-6 h-4 w-10 text-ink-faint/50 -rotate-12 hidden sm:block" />

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="hidden xl:flex absolute -left-28 top-1/3 items-start gap-1.5 w-32"
            >
              <ArrowDoodle className="h-8 w-14 -scale-x-100 text-ink-faint rotate-[100deg] shrink-0 -mt-2" />
              <span className="font-hand text-lg leading-tight text-ink-soft rotate-[-4deg]">
                small batches, every time
              </span>
            </motion.div>
          </motion.div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-5 pt-4 lg:pl-6">
            {features.map((feature, i) => (
              <StickyNote
                key={feature.title}
                color={feature.color}
                rotate={i % 2 === 0 ? -3 : 3}
                className={`min-h-[180px] flex flex-col ${i === 1 ? 'sm:mt-8' : ''} ${i === 2 ? 'sm:-mt-4' : ''} ${i === 3 ? 'sm:mt-4' : ''}`}
              >
                <feature.icon className="h-7 w-7 text-ink mb-3" strokeWidth={2} />
                <h3 className="font-serif text-lg font-semibold text-ink mb-1.5">{feature.title}</h3>
                <p className="text-sm text-ink/70 leading-snug">{feature.description}</p>
              </StickyNote>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function WhyChooseUs() {
  const stats = [
    {
      type: 'tag' as const,
      stat: '500+',
      label: 'Happy Customers',
      color: 'var(--color-coral)',
      size: 'h-36 w-32 sm:h-40 sm:w-36',
      stringLen: 18,
      overlap: '',
    },
    {
      type: 'seal' as const,
      stat: '5',
      label: 'Star Rated Kitchen',
      color: 'var(--color-mint-deep)',
      size: 'h-36 w-36 sm:h-40 sm:w-40',
      stringLen: 0,
      overlap: 'sm:-ml-4',
    },
    {
      type: 'tag' as const,
      stat: '100%',
      label: 'Hygienic Kitchen',
      color: 'var(--color-butter)',
      size: 'h-36 w-32 sm:h-40 sm:w-36',
      stringLen: 38,
      overlap: '',
    },
    {
      type: 'seal' as const,
      stat: null,
      label: 'Quality Chef Approved',
      color: 'var(--color-purple-deep)',
      size: 'h-32 w-32 sm:h-36 sm:w-36',
      stringLen: 0,
      overlap: 'sm:-ml-3',
    },
  ]

  return (
    <section className="relative py-16 sm:py-24 bg-purple-deep/50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(58,49,69,0.08)_1px,transparent_0)] [background-size:20px_20px]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <PageTab label="THE PROOF · Pg. 04" rotate={-2} className="mb-5" />
          <p className="font-hand text-2xl text-ink/70 mb-1">pinned up around the kitchen</p>
          <h2 className="font-serif text-4xl font-bold text-ink mb-16 sm:mb-20">The {SITE_CONFIG.brandName} Difference</h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto pt-6">
          <div className="absolute left-6 right-6 top-6 border-t-2 border-dashed border-ink/20 hidden sm:block" aria-hidden />
          <span className="absolute left-4 top-4 h-2 w-2 rounded-full bg-ink/25 hidden sm:block" aria-hidden />
          <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-ink/25 hidden sm:block" aria-hidden />

          <div className="relative flex flex-wrap justify-center items-start gap-x-6 gap-y-8 sm:gap-x-10">
          {stats.map((item, i) => (
            <div key={item.label} className={`relative flex flex-col items-center ${item.overlap}`}>
              {item.type === 'tag' ? (
                <>
                  <svg width="2" height={item.stringLen} className="text-ink/25 mb-0.5" aria-hidden>
                    <line x1="1" y1="0" x2="1" y2={item.stringLen} stroke="currentColor" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
                  </svg>
                  <span className="h-2.5 w-2.5 rounded-full bg-lavender ring-2 ring-inset ring-ink/25 -mb-1.5 z-10" aria-hidden />
                </>
              ) : (
                <WashiTape className="top-1 z-10" color="var(--color-paper)" rotate={i % 2 === 0 ? -5 : 5} width={56} />
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -6 : 6 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 180, damping: 12 }}
                whileHover={{ rotate: 0, scale: 1.08 }}
                className={item.size}
              >
                {item.type === 'tag' ? (
                  <HangingTag color={item.color} holeColor="var(--color-lavender)" className="h-full w-full">
                    <span className="font-serif text-3xl sm:text-4xl font-extrabold leading-none text-ink">{item.stat}</span>
                    <span className="text-[11px] sm:text-xs font-bold mt-2 text-ink leading-tight">{item.label}</span>
                  </HangingTag>
                ) : (
                  <WaxSeal color={item.color} className="h-full w-full">
                    {item.stat ? (
                      <>
                        <span className="font-serif text-3xl sm:text-4xl font-extrabold leading-none text-ink block">{item.stat}</span>
                        <span className="text-[10px] sm:text-xs font-bold text-ink leading-tight block px-3">{item.label}</span>
                      </>
                    ) : (
                      <>
                        <StarDoodle className="h-5 w-5 text-ink mx-auto mb-1" />
                        <span className="text-[10px] sm:text-xs font-bold text-ink leading-tight block px-4">{item.label}</span>
                      </>
                    )}
                  </WaxSeal>
                )}
              </motion.div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      date: '12 May 2024',
      text: 'Dear Craving Manager, the best food we’ve had! Every dish feels like it’s made with so much love and care.',
      rating: 5,
      tape: 'var(--color-pink)',
      doodle: 'whisk' as const,
      offset: '',
      tone: 'cream' as const,
      imperfection: 'fold' as const,
      ink: 'text-ink',
    },
    {
      name: 'Rohit Mehta',
      date: '20 May 2024',
      text: 'Craving Manager has become our go-to for every office craving. Always fresh, always on time!',
      rating: 5,
      tape: 'var(--color-mint)',
      doodle: 'spoon' as const,
      offset: 'md:-translate-y-6',
      tone: 'paper' as const,
      imperfection: 'stain' as const,
      ink: 'text-ink/80',
    },
    {
      name: 'Ananya Patel',
      date: '28 May 2024',
      text: 'The gourmet burgers arrived hot and fresh. The attention to detail is next level!',
      rating: 5,
      tape: null,
      doodle: 'stamp' as const,
      offset: 'md:translate-y-4',
      tone: 'cream' as const,
      imperfection: 'torn' as const,
      ink: 'text-ink/90',
    },
  ]

  return (
    <section className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <PageTab label="THE NOTES · Pg. 05" rotate={2} className="mb-4" />
          <p className="font-hand text-2xl text-coral-deep mb-1">letters from happy tables</p>
          <h2 className="font-serif text-4xl font-bold text-ink">What Our Customers Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {testimonials.map((t, i) => (
            <PaperCard
              key={t.name}
              tone={t.tone}
              rotate={i % 2 === 0 ? -2 : 2}
              wobble={((i % 4) + 1) as 1 | 2 | 3 | 4}
              fold={t.imperfection === 'fold'}
              className={`ruled-paper p-7 pt-9 pl-9 relative overflow-hidden ${t.imperfection === 'torn' ? 'deckle-bottom' : ''} ${t.offset}`}
              style={t.imperfection === 'torn' ? ({ '--deckle-bg': 'var(--color-lavender)' } as CSSProperties) : undefined}
            >
              <NotebookHoles count={4} className="absolute left-2.5 top-8 bottom-8" />
              {t.imperfection === 'stain' && (
                <CoffeeStain className="absolute -bottom-4 -right-6 h-20 w-20 text-ink-faint/25 pointer-events-none" />
              )}

              {t.tape ? (
                <WashiTape
                  className="left-8 -top-3"
                  color={t.tape}
                  rotate={i % 2 === 0 ? -6 : 6}
                  width={72}
                />
              ) : (
                <span className="absolute bottom-4 left-8 h-9 w-9 rounded-full border-2 border-dashed border-ink-faint/50 flex items-center justify-center text-ink-faint">
                  <span className="font-mono text-[8px] font-bold">CM</span>
                </span>
              )}

              <HeartDoodle className="absolute top-5 right-5 h-5 w-5 text-coral-deep/70" />

              {t.doodle === 'whisk' && <WhiskDoodle className="absolute bottom-5 right-5 h-10 w-6 text-ink-faint/40" />}
              {t.doodle === 'spoon' && <SpoonDoodle className="absolute bottom-5 right-5 h-9 w-5 text-ink-faint/40" />}
              {t.doodle === 'stamp' && <HandmadeStamp className="absolute bottom-4 right-4 h-12 w-12 text-ink-faint/40" />}

              <div className="flex items-center gap-1 mb-4 mt-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-butter-deep text-lg leading-none">★</span>
                ))}
              </div>
              <p className={`font-hand text-2xl leading-snug mb-8 ${t.ink}`}>&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm font-bold text-ink-soft">— {t.name}</p>
              <p className="font-mono text-[10px] text-ink-faint mt-1">{t.date}</p>
            </PaperCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const faqs = [
    {
      q: 'How does WhatsApp checkout work?',
      a: 'After filling your delivery details and clicking Pay Now, we generate an invoice and open WhatsApp with your complete order summary. Simply tap Send to place your order.',
      tab: 'mint' as const,
    },
    {
      q: 'Can I customize my order?',
      a: 'Absolutely! Each product page has detailed customization options — flavors, toppings, sizes, and more. Prices update in real-time as you select.',
      tab: 'pink' as const,
    },
    {
      q: 'What are the delivery charges?',
      a: 'A flat delivery fee applies on orders below ₹999. Orders above ₹999 enjoy free delivery.',
      tab: 'butter' as const,
    },
    {
      q: 'How fresh is the food?',
      a: 'Everything is made to order. We prepare your items fresh and deliver them at your preferred date and time slot.',
      tab: 'blue' as const,
    },
  ]

  return (
    <section id="faq" className="relative py-20 sm:py-28 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <PageTab label="THE INDEX · Pg. 06" rotate={-2} className="mb-4" />
          <p className="font-hand text-2xl text-coral-deep mb-1">quick answers, before you order</p>
        </motion.div>

        <PaperStack>
        <div className="relative flex flex-col lg:flex-row craft-shadow-lg rounded-sm border border-ink/10 overflow-hidden lg:overflow-visible">
          <NotebookHoles count={9} className="absolute left-2 top-6 bottom-6 z-10 hidden lg:flex" />

          <div className="relative bg-purple/60 ruled-paper lg:w-2/5 p-8 sm:p-10 pl-10 lg:pl-12 flex flex-col justify-between min-h-[220px] lg:min-h-[420px]">
            <h2 className="font-hand text-4xl sm:text-5xl text-ink leading-[1.05]">
              Before You Place
              <br />
              Your Craving
            </h2>
            <div className="flex items-end gap-5 mt-8">
              <SpoonDoodle className="h-14 w-8 text-ink-soft/60" />
              <WhiskDoodle className="h-16 w-9 text-ink-soft/60" />
              <ChefHatDoodle className="h-12 w-12 text-ink-soft/60" />
            </div>
          </div>

          <div className="relative bg-paper bg-grain flex-1 p-2 sm:p-3">
            {faqs.map((faq, i) => (
              <motion.details
                key={faq.q}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group border-b border-ink-faint/15 last:border-0"
              >
                <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer font-serif font-semibold text-ink hover:text-coral-deep transition-colors list-none">
                  <span className="flex items-center gap-3.5">
                    <span className="font-mono text-xs font-bold text-coral-deep bg-peach/50 rounded px-1.5 py-0.5">0{i + 1}</span>
                    {faq.q}
                  </span>
                  <span className="shrink-0 h-7 w-7 rounded-full border-2 border-ink/20 flex items-center justify-center text-ink transition-transform group-open:rotate-45 text-lg font-bold">
                    +
                  </span>
                </summary>
                <div className="px-4 sm:px-5 pb-5 text-sm text-ink-soft leading-relaxed pl-[3.75rem]">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>

          <div className="hidden lg:flex flex-col gap-3 absolute -right-6 top-10">
            {faqs.map((faq) => (
              <span
                key={faq.q}
                className={`block h-9 w-6 rounded-r-md bg-${faq.tab} craft-shadow-sm`}
                aria-hidden
              />
            ))}
          </div>
        </div>
        </PaperStack>

        <div className="flex justify-center mt-14">
          <HeartDoodle className="h-6 w-6 text-pink-deep animate-wiggle" />
        </div>
      </div>
    </section>
  )
}
