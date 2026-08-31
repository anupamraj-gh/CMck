import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cartStore'
import { useTraySheetStore } from '@/store/traySheetStore'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { PaperSettleValue } from '@/components/craft/PaperSettleValue'
import { formatCurrency } from '@/lib/utils'
import { triggerHaptic } from '@/lib/haptics'
import { SITE_CONFIG } from '@/config/content'
import { EDITORIAL_STRINGS } from '@/config/editorialStrings'
import { EmptyTrayDoodle } from '@/components/decor/Doodles'
import { MOTION } from '@/lib/motion'
import { TrayItemRow } from './TrayItemRow'
import { TrayEditView } from './TrayEditView'

export function KitchenTraySheet() {
  const isOpen = useTraySheetStore((s) => s.isOpen)
  const editingItemId = useTraySheetStore((s) => s.editingItemId)
  const close = useTraySheetStore((s) => s.close)
  const closeEdit = useTraySheetStore((s) => s.closeEdit)

  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const deliveryCharge = useCartStore((s) => s.getDeliveryCharge())
  const grandTotal = useCartStore((s) => s.getGrandTotal())
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)

  useBodyScrollLock(isOpen)
  useFocusTrap(panelRef, isOpen)

  const editingItem = editingItemId ? items.find((i) => i.id === editingItemId) : undefined

  // If the item being edited was removed in the meantime, fall back to the list instead of
  // rendering a stale/blank edit view.
  useEffect(() => {
    if (editingItemId && !editingItem) closeEdit()
  }, [editingItemId, editingItem, closeEdit])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (editingItemId) closeEdit()
      else close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, editingItemId, close, closeEdit])

  // Desktop keyboard shortcut: Shift+K toggles the tray, from anywhere except form fields.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.shiftKey || e.key.toLowerCase() !== 'k') return
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return
      e.preventDefault()
      triggerHaptic()
      const state = useTraySheetStore.getState()
      if (state.isOpen) state.close()
      else state.open()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleCheckout = () => {
    close()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="tray-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION.fade}
            onClick={close}
            aria-hidden
            className="fixed inset-0 z-[65] bg-ink/40"
          />

          <motion.div
            key="tray-sheet"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Kitchen Tray"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:right-8 sm:bottom-8 z-[70] flex w-full max-h-[75vh] flex-col overflow-hidden rounded-t-3xl border-2 border-ink/10 bg-paper bg-grain craft-shadow-lg sm:w-[420px] sm:max-h-[70vh] sm:rounded-3xl"
          >
            <div className="flex justify-center pt-2.5 pb-1 shrink-0 sm:hidden" aria-hidden>
              <span className="h-1.5 w-10 rounded-full bg-ink/15" />
            </div>

            {editingItem ? (
              <TrayEditView key={editingItem.id} item={editingItem} />
            ) : (
              <>
                <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-ink-faint/15 shrink-0">
                  <h2 className="font-hand text-2xl text-ink leading-none">Kitchen Tray</h2>
                  <button
                    onClick={close}
                    aria-label="Close Kitchen Tray"
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-purple/30 text-ink transition-colors duration-fast ease-hover"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10 gap-3">
                    <EmptyTrayDoodle className="h-16 w-16 text-ink/40" />
                    <p className="font-hand text-2xl text-ink">{EDITORIAL_STRINGS.kitchenTrayWaiting}</p>
                    <p className="text-sm text-ink-soft max-w-xs">Add your favourite dishes to begin.</p>
                    <Button variant="coral" asChild>
                      <a href="/#menu" onClick={close}>Browse Menu</a>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-5">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {items.map((item) => (
                          <TrayItemRow key={item.id} item={item} />
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="shrink-0 border-t border-ink-faint/15 px-5 py-4 space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-soft">Subtotal</span>
                        <span className="font-mono"><PaperSettleValue value={formatCurrency(subtotal)} /></span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-soft">Delivery</span>
                        <span className="font-mono">
                          <PaperSettleValue value={deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)} />
                        </span>
                      </div>
                      {subtotal < SITE_CONFIG.freeDeliveryAbove && (
                        <p className="text-xs text-ink-soft">
                          Free delivery on orders above {formatCurrency(SITE_CONFIG.freeDeliveryAbove)}
                        </p>
                      )}
                      <Separator />
                      <div className="flex justify-between text-base font-bold">
                        <span>Estimated Total</span>
                        <span className="font-mono text-coral-deep"><PaperSettleValue value={formatCurrency(grandTotal)} /></span>
                      </div>
                      <Button variant="coral" size="lg" className="w-full mt-1" onClick={handleCheckout}>
                        {EDITORIAL_STRINGS.sendToKitchen}
                      </Button>
                      <Button variant="ghost" className="w-full" onClick={close}>
                        Keep Browsing
                      </Button>
                      {/* Visually-hidden live region: announces the updated total whenever an
                          item's quantity or customization changes, without duplicating the
                          visible totals above. */}
                      <span className="sr-only" aria-live="polite">
                        Estimated total {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
