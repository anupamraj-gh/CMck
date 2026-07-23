import { HeroSection } from '@/components/home/HeroSection'
import { ProductGrid } from '@/components/home/ProductGrid'
import {
  AboutSection,
  WhyChooseUs,
  Testimonials,
  FAQSection,
} from '@/components/home/HomeSections'
import { SectionDivider } from '@/components/decor/SectionDivider'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionDivider icon="star" color="text-butter-deep" />
      <ProductGrid />
      <SectionDivider icon="heart" color="text-pink-deep" />
      <AboutSection />
      <SectionDivider icon="sparkle" color="text-coral-deep" />
      <WhyChooseUs />
      <SectionDivider icon="flower" color="text-mint-deep" />
      <Testimonials />
      <SectionDivider icon="star" color="text-blue-deep" />
      <FAQSection />
    </>
  )
}
