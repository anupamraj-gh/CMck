import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { CONTENT } from '@/config/content'
import { FloatingKitchenTray } from '@/components/tray/FloatingKitchenTray'
import { FlyingCardsLayer } from '@/components/tray/FlyingCardsLayer'
import { KitchenTraySheet } from '@/components/tray/KitchenTraySheet'
import { useTraySheetStore } from '@/store/traySheetStore'
import { DURATION, EASE } from '@/lib/motion'

/**
 * The page-turn: a small vertical settle + fade, keyed by pathname so it plays once per
 * navigation — no horizontal movement, no slide, no app-style push. The outgoing page lifts
 * slightly and fades (the same "lifts up and away" direction CustomizationGroupCard/
 * CheckoutStepCard already use for their own status changes); the incoming page rises the same
 * small distance and settles to rest, like turning to a fresh page in a notebook rather than
 * swiping between app screens. Kept to the Fast tier (not the Slow tier used for PaperCard's
 * one-time scroll reveal) — a page transition happens on every click, so it needs to read as
 * quick, not staged. Header/Footer/the Kitchen Tray live outside this AnimatePresence entirely,
 * so they persist across navigation instead of remounting with the page.
 */
export function Layout() {
  const sections = CONTENT.sections
  const isSheetOpen = useTraySheetStore((s) => s.isOpen)
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <div className="min-h-screen flex flex-col">
      {/* `contents` keeps this wrapper out of the flex layout — it exists only to make
          everything behind the sheet inert (unfocusable, unclickable, hidden from AT)
          while the sheet is open, without disturbing Header/main/Footer's flex sizing. */}
      <div inert={isSheetOpen} className="contents">
        {sections.header && <Header />}
        <main className="flex-1 pt-24 sm:pt-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.fast, ease: EASE.entrance }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
        {sections.footer && <Footer />}
        <FloatingKitchenTray />
      </div>
      <FlyingCardsLayer />
      <KitchenTraySheet />
    </div>
  )
}
