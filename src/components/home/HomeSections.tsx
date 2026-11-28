import type { CSSProperties, ComponentType, SVGProps } from 'react'
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
import { fillTemplate, useContent } from '@/config/content'
import { DURATION, EASE } from '@/lib/motion'

const featureIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  leaf: Leaf,
  heart: Heart,
  award: Award,
  clock: Clock,
}

const doodleIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  whisk: WhiskDoodle,
  spoon: SpoonDoodle,
  stamp: HandmadeStamp,
}

export function AboutSection() {
  const content = useContent()
  const about = content.about

  return (
    <section id="about" className="relative py-10 sm:py-28 scroll-mt-24 overflow-visible">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24, rotate: -1 }}
            whileInView={{ opacity: 1, x: 0, rotate: -1 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.slow, ease: EASE.entrance }}
            className="relative ruled-paper ruled-paper-margin craft-shadow-lg rounded-sm p-8 sm:p-10 pl-16 sm:pl-20"
          >
            <NotebookHoles count={6} className="absolute left-4 sm:left-6 top-10 bottom-10" />
            <PageTab label={about.pageLabel} rotate={2} className="mb-4" />
            <p className="font-hand text-2xl text-coral-deep mb-1">{about.kicker}</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-5">
              {about.title}
            </h2>
            {about.paragraphs.map((paragraph, i) => (
              <p key={i} className={`text-ink-soft leading-loose ${i === 0 ? 'mb-4' : ''}`}>
                {fillTemplate(paragraph, { brandName: content.site.brandName })}
              </p>
            ))}
            <CoffeeStain className="absolute -bottom-6 -left-4 h-12 w-12 text-coral-deep/25 block sm:-bottom-8 sm:-left-6 sm:h-20 sm:w-20" />
            <StarDoodle className="absolute bottom-6 right-6 h-6 w-6 text-butter-deep animate-wiggle" />
            <RollingPinDoodle className="absolute top-6 right-6 h-3 w-8 text-ink-faint/50 -rotate-12 block sm:h-4 sm:w-10" />

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="hidden xl:flex absolute -left-28 top-1/3 items-start gap-1.5 w-32"
            >
              <ArrowDoodle className="h-8 w-14 -scale-x-100 text-ink-faint rotate-[100deg] shrink-0 -mt-2" />
              <span className="font-hand text-lg leading-tight text-ink-soft rotate-[-4deg]">
                {about.sideNote}
              </span>
            </motion.div>
          </motion.div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 pt-4 lg:pl-6">
            {about.features.map((feature, i) => {
              const Icon = featureIcons[feature.icon]
              const mobileShift =
                i === 0 ? 'max-sm:w-[92%] max-sm:mr-auto' :
                i === 1 ? 'max-sm:w-[92%] max-sm:ml-auto max-sm:-mt-4' :
                i === 2 ? 'max-sm:w-[92%] max-sm:mr-auto max-sm:-mt-4' :
                'max-sm:w-[92%] max-sm:ml-auto max-sm:-mt-4'
              return (
                <StickyNote
                  key={feature.title}
                  color={feature.color as 'mint' | 'pink' | 'butter' | 'blue'}
                  rotate={i % 2 === 0 ? -3 : 3}
                  className={`min-h-[180px] flex flex-col ${mobileShift} ${i === 1 ? 'sm:mt-8' : ''} ${i === 2 ? 'sm:-mt-4' : ''} ${i === 3 ? 'sm:mt-4' : ''}`}
                >
                  <Icon className="h-7 w-7 text-ink mb-3" strokeWidth={2} />
                  <h3 className="font-serif text-lg font-semibold text-ink mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-ink/70 leading-snug">{feature.description}</p>
                </StickyNote>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function WhyChooseUs() {
  const content = useContent()
  const whyChooseUs = content.whyChooseUs
  const stats = whyChooseUs.stats

  return (
    <section className="relative py-8 sm:py-24 bg-purple-deep/50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(58,49,69,0.08)_1px,transparent_0)] [background-size:20px_20px]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <PageTab label={whyChooseUs.pageLabel} rotate={-2} className="mb-5" />
          <p className="font-hand text-2xl text-ink/70 mb-1">{whyChooseUs.kicker}</p>
          <h2 className="font-serif text-4xl font-bold text-ink mb-10 sm:mb-20">
            {fillTemplate(whyChooseUs.titleTemplate, { brandName: content.site.brandName })}
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto pt-6">
          <div className="absolute left-6 right-6 top-6 border-t-2 border-dashed border-ink/20 block" aria-hidden />
          <span className="absolute left-4 top-4 h-2 w-2 rounded-full bg-ink/25 block" aria-hidden />
          <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-ink/25 block" aria-hidden />

          <div className="relative flex flex-wrap justify-center items-start gap-x-6 max-sm:gap-x-4 gap-y-8 max-sm:gap-y-0 sm:gap-x-10">
          {stats.map((item, i) => {
            const mobileHang =
              i === 0 ? 'max-sm:mt-0' :
              i === 1 ? 'max-sm:mt-20 max-sm:-ml-3' :
              i === 2 ? 'max-sm:-mt-6 max-sm:ml-2' :
              'max-sm:mt-28 max-sm:-ml-2'
            return (
            <div key={item.label} className={`relative flex flex-col items-center ${item.overlap} ${mobileHang}`}>
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
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  const testimonialsContent = useContent().testimonials
  const testimonials = testimonialsContent.items

  return (
    <section className="relative py-10 sm:py-32 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <PageTab label={testimonialsContent.pageLabel} rotate={2} className="mb-4" />
          <p className="font-hand text-2xl text-coral-deep mb-1">{testimonialsContent.kicker}</p>
          <h2 className="font-serif text-4xl font-bold text-ink">{testimonialsContent.title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 md:gap-y-16">
          {testimonials.map((t, i) => {
            const Doodle = doodleIcons[t.doodle]
            const mobileShift =
              i === 0 ? 'max-md:w-[92%] max-md:mr-auto' :
              i === 1 ? 'max-md:w-[92%] max-md:ml-auto max-md:-mt-4' :
              'max-md:w-[86%] max-md:mr-auto max-md:-mt-6'
            return (
              <PaperCard
                key={t.name}
                tone={t.tone as 'cream' | 'paper'}
                rotate={i % 2 === 0 ? -2 : 2}
                wobble={((i % 4) + 1) as 1 | 2 | 3 | 4}
                fold={t.imperfection === 'fold'}
                className={`ruled-paper p-7 pt-9 pl-9 relative overflow-hidden ${t.imperfection === 'torn' ? 'deckle-bottom' : ''} ${t.offset} ${mobileShift}`}
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

                {Doodle && <Doodle className="absolute bottom-5 right-5 h-10 w-6 text-ink-faint/40" />}

                <div className="flex items-center gap-1 mb-4 mt-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-butter-deep text-lg leading-none">★</span>
                  ))}
                </div>
                <p className={`font-hand text-2xl leading-snug mb-8 ${t.ink}`}>&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-bold text-ink-soft">— {t.name}</p>
                <p className="font-mono text-[10px] text-ink-faint mt-1">{t.date}</p>
              </PaperCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const faqContent = useContent().faq
  const faqs = faqContent.items
  const [faqHeadingLine1, faqHeadingLine2] = faqContent.heading.split('\n')

  return (
    <section id="faq" className="relative py-10 sm:py-28 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <PageTab label={faqContent.pageLabel} rotate={-2} className="mb-4" />
          <p className="font-hand text-2xl text-coral-deep mb-1">{faqContent.kicker}</p>
        </motion.div>

        <PaperStack>
        <div className="relative flex flex-col lg:flex-row craft-shadow-lg rounded-sm border border-ink/10 overflow-hidden lg:overflow-visible">
          <NotebookHoles count={9} className="absolute left-2 top-6 bottom-6 z-10 hidden lg:flex" />

          <div className="flex lg:hidden absolute -top-2.5 right-8 gap-1.5 z-10">
            {faqs.map((faq) => (
              <span
                key={faq.q}
                className={`block h-4 w-4 rounded-sm bg-${faq.tab} craft-shadow-sm rotate-3`}
                aria-hidden
              />
            ))}
          </div>

          <div className="relative bg-purple/60 ruled-paper lg:w-2/5 p-6 sm:p-10 pl-10 lg:pl-12 flex flex-col justify-between min-h-[150px] lg:min-h-[420px]">
            <h2 className="font-hand text-4xl sm:text-5xl text-ink leading-[1.05]">
              {faqHeadingLine1}
              <br />
              {faqHeadingLine2}
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
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer font-serif font-semibold text-ink hover:text-coral-deep transition-colors list-none">
                  <span className="flex items-center gap-3.5">
                    <span className="font-mono text-xs font-bold text-coral-deep bg-peach/50 rounded px-1.5 py-0.5">0{i + 1}</span>
                    {faq.q}
                  </span>
                  <span className="shrink-0 h-7 w-7 rounded-full border-2 border-ink/20 flex items-center justify-center text-ink transition-transform group-open:rotate-45 text-lg font-bold">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-6 sm:pb-5 text-sm text-ink-soft leading-relaxed pl-[3.75rem]">
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

        <div className="flex justify-center mt-6 sm:mt-14">
          <HeartDoodle className="h-6 w-6 text-pink-deep animate-wiggle" />
        </div>
      </div>
    </section>
  )
}
