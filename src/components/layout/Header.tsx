import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DURATION, EASE } from '@/lib/motion'
import { ScribbleUnderline } from '@/components/decor/Doodles'
import { useCartStore } from '@/store/cartStore'
import { SITE_CONFIG, CONTENT } from '@/config/content'
import logo from '@/assets/logo-tophat.png'

export function Header() {
  const itemCount = useCartStore((s) => s.getItemCount())
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = CONTENT.nav.links

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-3 sm:top-4 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-full border-2 border-ink/10 bg-paper/80 craft-shadow backdrop-blur-lg">
        <div className="flex h-14 sm:h-16 items-center justify-between pl-4 pr-2 sm:pl-6 sm:pr-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt={SITE_CONFIG.brandName} className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0" />
            <span className="font-hand text-2xl sm:text-3xl font-bold text-ink leading-none">
              {SITE_CONFIG.brandName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="group relative px-3.5 py-2 rounded-full text-sm font-bold text-ink-soft hover:text-ink hover:bg-purple/40 transition-colors"
              >
                {link.label}
                <ScribbleUnderline className="absolute left-3.5 right-3.5 -bottom-0.5 h-1.5 text-coral-deep opacity-0 group-hover:opacity-70 transition-opacity" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link to="/checkout">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">
                  {itemCount > 0 ? `Kitchen Tray, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Kitchen Tray'}
                </span>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    aria-hidden
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: -8 }}
                    className="absolute -top-1.5 -right-1.5 h-[22px] w-[22px] min-w-[22px] px-1 rounded-full bg-coral text-[11px] font-bold text-paper flex items-center justify-center tape-shadow"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: DURATION.fast, ease: EASE.entrance }}
            className="md:hidden mx-3 mt-2 rounded-3xl border-2 border-ink/10 bg-paper craft-shadow-lg overflow-hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-3.5 text-sm font-bold text-ink-soft hover:text-ink hover:bg-purple/30 border-b border-ink-faint/15 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
