import { memo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useContent } from '@/config/content'
import type { DeliveryInfo } from '@/types'

export interface DeliveryDetailsStepProps {
  delivery: DeliveryInfo
  minDate: string
  errors: Partial<Record<keyof DeliveryInfo, string>>
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  /** Fired when a field loses focus, so this step's own fields can validate one at a time. */
  onBlur: (field: keyof DeliveryInfo) => void
}

/**
 * The "Delivery Details" checkout section's fields — same markup, same classes, same field
 * behaviour as before. The card wrapper and heading are now owned by CheckoutStepCard. Memoized so
 * typing in Customer Information (a sibling, unrelated slice of checkout state) doesn't force
 * this step to re-render too.
 */
export const DeliveryDetailsStep = memo(function DeliveryDetailsStep({
  delivery,
  minDate,
  errors,
  onDateChange,
  onTimeChange,
  onBlur,
}: DeliveryDetailsStepProps) {
  const deliveryTimeSlots = useContent().deliveryTimeSlots

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Preferred Delivery Date *</Label>
          <Input
            id="date"
            type="date"
            min={minDate}
            value={delivery.preferredDate}
            onChange={(e) => onDateChange(e.target.value)}
            onBlur={() => onBlur('preferredDate')}
            className="mt-1.5"
            aria-invalid={!!errors.preferredDate}
            aria-describedby={errors.preferredDate ? 'date-error' : undefined}
          />
          {errors.preferredDate && (
            <p id="date-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.preferredDate}
            </p>
          )}
        </div>
        <div>
          <Label id="time-label">Preferred Delivery Time *</Label>
          <Select value={delivery.preferredTime} onValueChange={onTimeChange}>
            <SelectTrigger
              className="mt-1.5"
              onBlur={() => onBlur('preferredTime')}
              aria-labelledby="time-label"
              aria-invalid={!!errors.preferredTime}
              aria-describedby={errors.preferredTime ? 'time-error' : undefined}
            >
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              {deliveryTimeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredTime && (
            <p id="time-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.preferredTime}
            </p>
          )}
        </div>
      </div>
  )
})
