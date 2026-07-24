import { HeroSection } from '@/components/home/HeroSection'
import { ProductGrid } from '@/components/home/ProductGrid'
import {
  AboutSection,
  WhyChooseUs,
  Testimonials,
  FAQSection,
} from '@/components/home/HomeSections'
import { SectionDivider } from '@/components/decor/SectionDivider'
import { CONTENT } from '@/config/content'

export function HomePage() {
  const sections = CONTENT.sections

  return (
    <>
      {sections.hero && <HeroSection />}
      {sections.productGrid && (
        <>
          <SectionDivider icon="star" color="text-butter-deep" />
          <ProductGrid />
        </>
      )}
      {sections.about && (
        <>
          <SectionDivider icon="heart" color="text-pink-deep" />
          <AboutSection />
        </>
      )}
      {sections.whyChooseUs && (
        <>
          <SectionDivider icon="sparkle" color="text-coral-deep" />
          <WhyChooseUs />
        </>
      )}
      {sections.testimonials && (
        <>
          <SectionDivider icon="flower" color="text-mint-deep" />
          <Testimonials />
        </>
      )}
      {sections.faq && (
        <>
          <SectionDivider icon="star" color="text-blue-deep" />
          <FAQSection />
        </>
      )}
    </>
  )
}
