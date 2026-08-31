import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CustomizationGroupCard } from '@/components/product/CustomizationGroupCard'
import { CustomizationOptionsList } from '@/components/product/CustomizationOptionsList'
import { SparkleDoodle } from '@/components/decor/Doodles'
import { useProgressiveCustomization } from '@/hooks/useProgressiveCustomization'
import type { CustomizationGroup } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { DURATION, EASE } from '@/lib/motion'

interface CustomizationSectionProps {
  groups: CustomizationGroup[]
  selections: Record<string, string | string[]>
  onSelectionChange: (groupId: string, value: string | string[]) => void
  unitPrice: number
}

/** A short one-line recap of a group's current selection, shown whenever it's collapsed. */
function summarizeGroup(group: CustomizationGroup, selections: Record<string, string | string[]>): string {
  const selected = selections[group.id]
  if (group.type === 'checkbox') {
    const ids = (selected as string[]) ?? []
    if (ids.length === 0) return 'None selected'
    return group.options
      .filter((o) => ids.includes(o.id))
      .map((o) => o.label)
      .join(', ')
  }
  const option = group.options.find((o) => o.id === selected)
  return option?.label ?? 'Not selected yet'
}

export function CustomizationSection({
  groups,
  selections,
  onSelectionChange,
  unitPrice,
}: CustomizationSectionProps) {
  const disclosure = useProgressiveCustomization(groups, selections)
  const { markTouched } = disclosure

  // Stable across renders (as long as `onSelectionChange` itself is, which ProductPage guarantees
  // via its own useCallback) so the memoized CustomizationOptionsList below can actually bail out
  // for every group except the one the customer just changed.
  const handleSelectionChange = useCallback(
    (groupId: string, value: string | string[]) => {
      markTouched(groupId)
      onSelectionChange(groupId, value)
    },
    [markTouched, onSelectionChange],
  )

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.standard, ease: EASE.fade }}
          className="text-center mb-12"
        >
          <p className="font-hand text-2xl text-coral-deep mb-1">make it yours</p>
          <h2 className="font-serif text-4xl font-bold text-ink mb-2">Customize Your Order</h2>
          <p className="text-ink-soft">Every selection updates your price in real-time</p>
        </motion.div>

        <div className="space-y-7">
          {groups.map((group, i) => (
            <CustomizationGroupCard
              key={group.id}
              groupId={group.id}
              status={disclosure.getStatus(group)}
              title={group.label}
              isRequired={!!group.required}
              isExpanded={disclosure.isExpanded(group)}
              canToggle={disclosure.canToggle(group)}
              onToggle={disclosure.toggleGroup}
              summary={summarizeGroup(group, selections)}
              tone={i % 2 === 0 ? 'paper' : 'cream'}
              rotate={i % 2 === 0 ? -0.6 : 0.6}
              wobble={((i % 4) + 1) as 1 | 2 | 3 | 4}
            >
              <CustomizationOptionsList
                group={group}
                selectedValue={selections[group.id]}
                onChange={handleSelectionChange}
              />
            </CustomizationGroupCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.standard, ease: EASE.fade }}
          className="mt-10 p-6 rounded-3xl bg-ink text-cream text-center relative overflow-hidden"
        >
          <SparkleDoodle className="absolute top-3 right-4 h-5 w-5 text-butter animate-sparkle" />
          <AnimatePresence mode="wait" initial={false}>
            {disclosure.isConfigurationComplete && (
              <motion.p
                key="ready-to-cook"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.standard, ease: EASE.fade }}
                className="font-hand text-2xl text-mint mb-2"
              >
                Ready to Cook.
              </motion.p>
            )}
          </AnimatePresence>
          <p className="font-hand text-xl text-cream/70 mb-1">current unit price</p>
          <p className="font-serif text-4xl font-bold text-butter">{formatCurrency(unitPrice)}</p>

          {/* Visually-hidden live region: a persistent span so a screen reader announces the
              transition into "Ready to Cook." — a brand-new element appearing isn't reliably
              announced by every assistive tech, but a change within an already-present one is. */}
          <span className="sr-only" aria-live="polite">
            {disclosure.isConfigurationComplete ? 'Ready to Cook.' : ''}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
