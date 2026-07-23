import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PaperCard } from '@/components/craft/PaperCard'
import { SparkleDoodle } from '@/components/decor/Doodles'
import type { CustomizationGroup } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CustomizationSectionProps {
  groups: CustomizationGroup[]
  selections: Record<string, string | string[]>
  onSelectionChange: (groupId: string, value: string | string[]) => void
  unitPrice: number
}

export function CustomizationSection({
  groups,
  selections,
  onSelectionChange,
  unitPrice,
}: CustomizationSectionProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-hand text-2xl text-coral-deep mb-1">make it yours</p>
          <h2 className="font-serif text-4xl font-bold text-ink mb-2">Customize Your Order</h2>
          <p className="text-ink-soft">Every selection updates your price in real-time</p>
        </motion.div>

        <div className="space-y-7">
          {groups.map((group, i) => (
            <PaperCard
              key={group.id}
              tone={i % 2 === 0 ? 'paper' : 'cream'}
              rotate={i % 2 === 0 ? -0.6 : 0.6}
              wobble={((i % 4) + 1) as 1 | 2 | 3 | 4}
              hoverLift={false}
              className="p-6 sm:p-8"
            >
              <h3 className="font-serif text-lg font-semibold text-ink mb-4">
                {group.label}
                {group.required && <span className="text-coral-deep ml-1">*</span>}
              </h3>

              {group.type === 'radio' && (
                <RadioGroup
                  value={(selections[group.id] as string) ?? ''}
                  onValueChange={(value) => onSelectionChange(group.id, value)}
                  className="space-y-2.5"
                >
                  {group.options.map((option) => {
                    const isSelected = selections[group.id] === option.id
                    return (
                      <div
                        key={option.id}
                        className={cn(
                          'flex items-center justify-between p-3.5 rounded-2xl border-2 transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-mint/50 border-mint-deep'
                            : 'border-transparent hover:bg-purple/25',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={option.id} id={`${group.id}-${option.id}`} />
                          <Label htmlFor={`${group.id}-${option.id}`} className="cursor-pointer font-medium">
                            {option.label}
                          </Label>
                        </div>
                        {option.priceModifier !== 0 && (
                          <span className="text-sm font-mono text-ink-soft">
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
                <div className="space-y-2.5">
                  {group.options.map((option) => {
                    const selected = (selections[group.id] as string[]) ?? []
                    const isChecked = selected.includes(option.id)
                    return (
                      <div
                        key={option.id}
                        className={cn(
                          'flex items-center justify-between p-3.5 rounded-2xl border-2 transition-colors',
                          isChecked
                            ? 'bg-pink/40 border-pink-deep'
                            : 'border-transparent hover:bg-purple/25',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`${group.id}-${option.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const current = (selections[group.id] as string[]) ?? []
                              const updated = checked
                                ? [...current, option.id]
                                : current.filter((id) => id !== option.id)
                              onSelectionChange(group.id, updated)
                            }}
                          />
                          <Label htmlFor={`${group.id}-${option.id}`} className="cursor-pointer font-medium">
                            {option.label}
                          </Label>
                        </div>
                        <span className="text-sm font-mono text-ink-soft">
                          +{formatCurrency(option.priceModifier)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {group.type === 'select' && (
                <Select
                  value={(selections[group.id] as string) ?? ''}
                  onValueChange={(value) => onSelectionChange(group.id, value)}
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
            </PaperCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true }}
          className="mt-10 p-6 rounded-3xl bg-ink text-cream text-center relative overflow-hidden"
        >
          <SparkleDoodle className="absolute top-3 right-4 h-5 w-5 text-butter animate-sparkle" />
          <p className="font-hand text-xl text-cream/70 mb-1">current unit price</p>
          <p className="font-serif text-4xl font-bold text-butter">{formatCurrency(unitPrice)}</p>
        </motion.div>
      </div>
    </section>
  )
}
