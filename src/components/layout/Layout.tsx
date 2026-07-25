import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CONTENT } from '@/config/content'
import { FloatingKitchenTray } from '@/components/tray/FloatingKitchenTray'
import { FlyingCardsLayer } from '@/components/tray/FlyingCardsLayer'
import { KitchenTraySheet } from '@/components/tray/KitchenTraySheet'
import { useTraySheetStore } from '@/store/traySheetStore'

export function Layout() {
  const sections = CONTENT.sections
  const isSheetOpen = useTraySheetStore((s) => s.isOpen)

  return (
    <div className="min-h-screen flex flex-col">
      {/* `contents` keeps this wrapper out of the flex layout — it exists only to make
          everything behind the sheet inert (unfocusable, unclickable, hidden from AT)
          while the sheet is open, without disturbing Header/main/Footer's flex sizing. */}
      <div inert={isSheetOpen} className="contents">
        {sections.header && <Header />}
        <main className="flex-1 pt-24 sm:pt-28">
          <Outlet />
        </main>
        {sections.footer && <Footer />}
        <FloatingKitchenTray />
      </div>
      <FlyingCardsLayer />
      <KitchenTraySheet />
    </div>
  )
}
