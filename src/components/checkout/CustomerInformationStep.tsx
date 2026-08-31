import { memo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CustomerInfo } from '@/types'

export interface CustomerInformationStepProps {
  customer: CustomerInfo
  errors: Partial<Record<keyof CustomerInfo, string>>
  onChange: (field: keyof CustomerInfo, value: string) => void
  /** Fired when a field loses focus, so this step's own fields can validate one at a time as the
   * customer tabs through them, rather than showing every error the moment the step appears. */
  onBlur: (field: keyof CustomerInfo) => void
}

/**
 * The "Customer Information" checkout section's fields — same markup, same classes, same
 * field-by-field behaviour as before. The card wrapper and heading are now owned by
 * CheckoutStepCard (shared across all four steps), so this renders only the fields themselves.
 * Each field wires aria-invalid/aria-describedby to its own error message (given a role="alert" so
 * screen readers announce it the moment it appears), so validation isn't a purely visual affair.
 * Memoized so typing in the Delivery Details step (a sibling, unrelated slice of checkout state)
 * doesn't force this field-heavy step to re-render too.
 */
export const CustomerInformationStep = memo(function CustomerInformationStep({
  customer,
  errors,
  onChange,
  onBlur,
}: CustomerInformationStepProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={customer.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            onBlur={() => onBlur('fullName')}
            placeholder="Your full name"
            className="mt-1.5"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.fullName}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            value={customer.mobileNumber}
            onChange={(e) => onChange('mobileNumber', e.target.value)}
            onBlur={() => onBlur('mobileNumber')}
            placeholder="10-digit mobile number"
            className="mt-1.5"
            aria-invalid={!!errors.mobileNumber}
            aria-describedby={errors.mobileNumber ? 'mobile-error' : undefined}
          />
          {errors.mobileNumber && (
            <p id="mobile-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.mobileNumber}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="houseFlat">House / Flat No. *</Label>
          <Input
            id="houseFlat"
            value={customer.houseFlat}
            onChange={(e) => onChange('houseFlat', e.target.value)}
            onBlur={() => onBlur('houseFlat')}
            className="mt-1.5"
            aria-invalid={!!errors.houseFlat}
            aria-describedby={errors.houseFlat ? 'houseFlat-error' : undefined}
          />
          {errors.houseFlat && (
            <p id="houseFlat-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.houseFlat}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="street">Street *</Label>
          <Input
            id="street"
            value={customer.street}
            onChange={(e) => onChange('street', e.target.value)}
            onBlur={() => onBlur('street')}
            className="mt-1.5"
            aria-invalid={!!errors.street}
            aria-describedby={errors.street ? 'street-error' : undefined}
          />
          {errors.street && (
            <p id="street-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.street}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="area">Area *</Label>
          <Input
            id="area"
            value={customer.area}
            onChange={(e) => onChange('area', e.target.value)}
            onBlur={() => onBlur('area')}
            className="mt-1.5"
            aria-invalid={!!errors.area}
            aria-describedby={errors.area ? 'area-error' : undefined}
          />
          {errors.area && (
            <p id="area-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.area}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={customer.city}
            onChange={(e) => onChange('city', e.target.value)}
            onBlur={() => onBlur('city')}
            className="mt-1.5"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && (
            <p id="city-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.city}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={customer.state}
            onChange={(e) => onChange('state', e.target.value)}
            onBlur={() => onBlur('state')}
            className="mt-1.5"
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? 'state-error' : undefined}
          />
          {errors.state && (
            <p id="state-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.state}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="pinCode">PIN Code *</Label>
          <Input
            id="pinCode"
            value={customer.pinCode}
            onChange={(e) => onChange('pinCode', e.target.value)}
            onBlur={() => onBlur('pinCode')}
            className="mt-1.5"
            aria-invalid={!!errors.pinCode}
            aria-describedby={errors.pinCode ? 'pinCode-error' : undefined}
          />
          {errors.pinCode && (
            <p id="pinCode-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
              {errors.pinCode}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="landmark">Landmark (Optional)</Label>
          <Input
            id="landmark"
            value={customer.landmark}
            onChange={(e) => onChange('landmark', e.target.value)}
            placeholder="Near..."
            className="mt-1.5"
          />
        </div>
      </div>
  )
})
