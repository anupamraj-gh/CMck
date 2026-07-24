import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CONTENT } from '@/config/content'

export function Layout() {
  const sections = CONTENT.sections

  return (
    <div className="min-h-screen flex flex-col">
      {sections.header && <Header />}
      <main className="flex-1 pt-24 sm:pt-28">
        <Outlet />
      </main>
      {sections.footer && <Footer />}
    </div>
  )
}
