import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Mail, Camera } from 'lucide-react'
import { SITE_CONFIG, CONTENT } from '@/config/content'

const footer = CONTENT.footer
import {
  StarDoodle,
  HeartDoodle,
  ScribbleUnderline,
  WashiTape,
  StitchDivider,
  WhiskDoodle,
} from '@/components/decor/Doodles'
import { PageTab } from '@/components/decor/PageTab'
import logo from '@/assets/logo-tophat.png'

export function Footer() {
  return (
    <footer
      className="relative mt-8 deckle-top page-fold overflow-hidden bg-ink text-cream pt-7 sm:pt-16 pb-8 sm:pb-10"
      style={{ '--deckle-bg': 'var(--color-ink)' } as CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
        aria-hidden
      />

      <WashiTape className="left-8 top-0 z-10" color="var(--color-butter)" rotate={-8} width={80} />

      <StarDoodle className="absolute top-16 left-[8%] h-6 w-6 text-butter/70 animate-float-slow" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-center mb-3 sm:mb-8">
          <PageTab label={footer.pageLabel} rotate={-2} tone="paper" />
        </div>

        <div className="text-center mb-8 sm:mb-14">
          <WhiskDoodle className="h-9 w-5 text-cream/30 mx-auto mb-3 rotate-12" />
          <p className="font-hand text-3xl sm:text-4xl text-butter mb-3 leading-snug max-w-xl mx-auto">
            {footer.thankYouLines[0]}
            <br />
            {footer.thankYouLines[1]}
          </p>
          <p className="text-cream/55 text-sm max-w-md mx-auto mb-3">
            {SITE_CONFIG.tagline} — every dish tells a story, every ingredient matters.
          </p>
          <p className="font-hand text-xl text-cream/60 mb-4">— Team {SITE_CONFIG.brandName}</p>
          <p className="font-hand text-4xl sm:text-5xl italic text-cream -rotate-2 inline-block">
            {SITE_CONFIG.brandName}
          </p>
          <ScribbleUnderline className="h-3 w-48 sm:w-56 text-coral mx-auto -mt-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 pb-6 sm:pb-10">
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <img src={logo} alt={SITE_CONFIG.brandName} className="h-6 w-6 sm:h-7 sm:w-7 object-contain" />
              <span className="font-hand text-2xl sm:text-3xl text-cream">{SITE_CONFIG.brandName}</span>
            </div>
            <ScribbleUnderline className="h-2.5 w-24 text-coral mt-1 mx-auto sm:mx-0" />
            <p className="text-cream/55 text-sm leading-relaxed mt-3">
              {footer.aboutBlurb}
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-serif font-semibold text-sm uppercase tracking-wider text-cream/80 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/60">
              {footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-butter transition-colors">{link.label}</a>
                </li>
              ))}
              <li><a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:text-butter transition-colors">Contact</a></li>
              <li><Link to="/checkout" className="hover:text-butter transition-colors">Checkout</Link></li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-serif font-semibold text-sm uppercase tracking-wider text-cream/80 mb-4">
              Follow Us
            </h4>
            <div className="flex gap-3 justify-center sm:justify-start mb-5">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="h-10 w-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/80 hover:bg-butter hover:text-ink transition-colors"
              >
                <MessageCircle className="h-[18px] w-[18px]" />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.supportEmail}`}
                aria-label="Email"
                className="h-10 w-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/80 hover:bg-butter hover:text-ink transition-colors"
              >
                <Mail className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="h-10 w-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/80 hover:bg-butter hover:text-ink transition-colors"
              >
                <Camera className="h-[18px] w-[18px]" />
              </a>
            </div>

            <div
              className="relative inline-block bg-purple/90 text-ink font-hand text-base px-4 py-3 max-sm:-rotate-6 max-sm:ml-8 sm:rotate-[-3deg] tape-shadow max-w-[11rem]"
              style={{ clipPath: 'polygon(2% 8%, 40% 0%, 78% 4%, 100% 14%, 96% 88%, 60% 100%, 15% 94%, 0% 80%)' }}
            >
              {footer.socialNote} <HeartDoodle className="h-3.5 w-3.5 text-coral-deep inline shrink-0" />
            </div>
          </div>
        </div>

        <StitchDivider className="h-4 w-full text-cream/15 mb-4 sm:mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} {SITE_CONFIG.brandName}. All rights reserved.
          </p>
          <p className="text-xs text-cream/40 flex items-center gap-1.5">
            {footer.bottomNote} <HeartDoodle className="h-3.5 w-3.5 text-pink" />
          </p>
        </div>
      </div>
    </footer>
  )
}
