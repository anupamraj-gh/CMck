import { memo } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
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
import type { CustomizationGroup } from '@/types'

export interface CustomizationOptionsListProps {
  group: CustomizationGroup
  /** Just this group's own slice of the page's selections — not the whole selections record — so
   * this component's props stay referentially/value-stable (and this memoized component correctly
   * skips re-rendering) whenever some other, unrelated group's selection changes. */
  selectedValue: string | string[] | undefined
  onChange: (groupId: string, value: string | string[]) => void
}

/**
 * One group's actual option controls (radio/checkbox/select) — same markup, same classes, same
 * behaviour as before, just extracted into its own memoized component. `CustomizationGroupCard`'s
 * own thin wrapper still re-renders on every keystroke (cheap — a couple of conditionals and a
 * PaperCard), but the option rows themselves (the part with any real per-row cost: borders, labels,
 * price text) now correctly bail out unless this specific group's own value actually changed.
 */
export const CustomizationOptionsList = memo(function CustomizationOptionsList({
  group,
  selectedValue,
  onChange,
}: CustomizationOptionsListProps) {
  if (group.type === 'radio') {
    return (
      <RadioGroup
        value={(selectedValue as string) ?? ''}
        onValueChange={(value) => onChange(group.id, value)}
        className="space-y-2.5"
      >
        {group.options.map((option) => {
          const isSelected = selectedValue === option.id
          return (
            <div
              key={option.id}
              className={cn(
                'flex items-center justify-between p-3.5 rounded-2xl border-2 transition-colors duration-fast ease-hover cursor-pointer',
                isSelected ? 'bg-mint/50 border-mint-deep' : 'border-transparent hover:bg-purple/25',
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
    )
  }

  if (group.type === 'checkbox') {
    const selected = (selectedValue as string[]) ?? []
    return (
      <div className="space-y-2.5">
        {group.options.map((option) => {
          const isChecked = selected.includes(option.id)
          return (
            <div
              key={option.id}
              className={cn(
                'flex items-center justify-between p-3.5 rounded-2xl border-2 transition-colors duration-fast ease-hover',
                isChecked ? 'bg-pink/40 border-pink-deep' : 'border-transparent hover:bg-purple/25',
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`${group.id}-${option.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    let updated: string[]
                    if (checked && option.id === 'none') {
                      updated = ['none']
                    } else if (checked) {
                      updated = [...selected.filter((id) => id !== 'none'), option.id]
                    } else {
                      updated = selected.filter((id) => id !== option.id)
                      if (updated.length === 0) updated = ['none']
                    }
                    onChange(group.id, updated)
                  }}
                />
                <Label htmlFor={`${group.id}-${option.id}`} className="cursor-pointer font-medium">
                  {option.label}
                </Label>
              </div>
              <span className="text-sm font-mono text-ink-soft">+{formatCurrency(option.priceModifier)}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Select value={(selectedValue as string) ?? ''} onValueChange={(value) => onChange(group.id, value)}>
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
  )
})
