import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, formatCurrency } from '@/lib/utils'
import { getProductById } from '@/data/products'
import { useCartStore, customizationsToSelections, areRequiredSelectionsComplete } from '@/store/cartStore'
import { useTraySheetStore } from '@/store/traySheetStore'
import { usePricing } from '@/hooks/usePricing'
import { DURATION, EASE } from '@/lib/motion'
import type { CartItem } from '@/types'

export function TrayEditView({ item }: { item: CartItem }) {
  const updateCustomizations = useCartStore((s) => s.updateCustomizations)
  const closeEdit = useTraySheetStore((s) => s.closeEdit)
  const product = getProductById(item.productId)

  // The parent keys this component by item.id, so a fresh instance (and this lazy initializer)
  // only runs when switching to a different item — not on every selection made while editing.
  const [selections, setSelections] = useState<Record<string, string | string[]>>(() =>
    product ? customizationsToSelections(product.customizations, item.customizations) : {},
  )
  // Only true once the customer actually changes something — an already-in-cart item's
  // selections are valid by definition, so showing an encouragement before any edit would just
  // be default state, not a reaction to anything they did.
  const [hasEdited, setHasEdited] = useState(false)

  const { customizations, unitPrice } = usePricing(
    product?.basePrice ?? 0,
    product?.customizations ?? [],
    selections,
    item.quantity,
  )

  if (!product) return null

  const isComplete = areRequiredSelectionsComplete(product.customizations, selections)

  const handleSelectionChange = (groupId: string, value: string | string[]) => {
    setSelections((prev) => ({ ...prev, [groupId]: value }))
    setHasEdited(true)
  }

  const handleSave = () => {
    updateCustomizations(item.id, customizations, unitPrice)
    closeEdit()
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 px-5 pt-3 pb-3 border-b border-ink-faint/15 shrink-0">
        <button
          onClick={closeEdit}
          aria-label="Back to tray"
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-purple/30 text-ink transition-colors duration-fast ease-hover shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="font-serif font-semibold text-ink truncate">{product.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {product.customizations.map((group) => (
          <div key={group.id}>
            <h3 className="font-serif text-sm font-semibold text-ink mb-2.5">
              {group.label}
              {group.required && <span className="text-coral-deep ml-1">*</span>}
            </h3>

            {group.type === 'radio' && (
              <RadioGroup
                value={(selections[group.id] as string) ?? ''}
                onValueChange={(value) => handleSelectionChange(group.id, value)}
                className="space-y-2"
              >
                {group.options.map((option) => {
                  const isSelected = selections[group.id] === option.id
                  return (
                    <div
                      key={option.id}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-xl border-2 transition-colors duration-fast ease-hover cursor-pointer',
                        isSelected ? 'bg-mint/50 border-mint-deep' : 'border-transparent hover:bg-purple/25',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <RadioGroupItem value={option.id} id={`edit-${group.id}-${option.id}`} />
                        <Label htmlFor={`edit-${group.id}-${option.id}`} className="cursor-pointer text-sm font-medium">
                          {option.label}
                        </Label>
                      </div>
                      {option.priceModifier !== 0 && (
                        <span className="text-xs font-mono text-ink-soft">
                          {option.priceModifier > 0 ? '+' : ''}
                          {formatCurrency(option.priceModifier)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </RadioGroup>
            )}

            {group.type === 'checkbox' && (
              <div className="space-y-2">
                {group.options.map((option) => {
                  const selected = (selections[group.id] as string[]) ?? []
                  const isChecked = selected.includes(option.id)
                  return (
                    <div
                      key={option.id}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-xl border-2 transition-colors duration-fast ease-hover',
                        isChecked ? 'bg-pink/40 border-pink-deep' : 'border-transparent hover:bg-purple/25',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Checkbox
                          id={`edit-${group.id}-${option.id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const current = (selections[group.id] as string[]) ?? []
                            const updated = checked
                              ? [...current, option.id]
                              : current.filter((id) => id !== option.id)
                            handleSelectionChange(group.id, updated)
                          }}
                        />
                        <Label htmlFor={`edit-${group.id}-${option.id}`} className="cursor-pointer text-sm font-medium">
                          {option.label}
                        </Label>
                      </div>
                      <span className="text-xs font-mono text-ink-soft">+{formatCurrency(option.priceModifier)}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {group.type === 'select' && (
              <Select
                value={(selections[group.id] as string) ?? ''}
                onValueChange={(value) => handleSelectionChange(group.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${group.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {group.options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-ink-faint/15 px-5 py-4">
        <AnimatePresence mode="wait" initial={false}>
          {hasEdited && isComplete && (
            <motion.p
              key="looks-delicious"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.standard, ease: EASE.fade }}
              className="font-hand text-lg text-mint-deep text-center mb-2"
            >
              Looks delicious.
            </motion.p>
          )}
        </AnimatePresence>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-ink-soft leading-none mb-1">Unit price</p>
            <p className="font-serif text-xl font-bold text-coral-deep leading-none">{formatCurrency(unitPrice)}</p>
          </div>
          <Button variant="coral" onClick={handleSave}>
            Save to Kitchen Tray
          </Button>
        </div>

        {/* Visually-hidden live region: a persistent span so a screen reader announces the
            transition into "Looks delicious." — a brand-new element appearing isn't reliably
            announced by every assistive tech, but a change within an already-present one is. */}
        <span className="sr-only" aria-live="polite">
          {hasEdited && isComplete ? 'Looks delicious.' : ''}
        </span>
      </div>
    </div>
  )
}
