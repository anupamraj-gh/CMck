import { memo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleLocationPicker } from '@/components/checkout/GoogleLocationPicker'
import type { CustomerInfo } from '@/types'

export interface CustomerInformationStepProps {
  customer: CustomerInfo
  errors: Partial<Record<keyof CustomerInfo, string>>
  onChange: (field: keyof CustomerInfo, value: string) => void
  onLocationSelect: (location: string, drivingDistanceMeters: number) => void
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
  onLocationSelect,
  onBlur,
}: CustomerInformationStepProps) {
  const [isMapOpen, setIsMapOpen] = useState(false)

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
          inputMode="tel"
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

      <div className="sm:col-span-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={customer.address}
          onChange={(e) => onChange('address', e.target.value)}
          onBlur={() => onBlur('address')}
          placeholder="House/flat, street, area, landmark"
          className="mt-1.5"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? 'address-error' : undefined}
        />
        {errors.address && (
          <p id="address-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
            {errors.address}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="pinCode">PIN Code *</Label>
        <Input
          id="pinCode"
          value={customer.pinCode}
          onChange={(e) => onChange('pinCode', e.target.value)}
          onBlur={() => onBlur('pinCode')}
          placeholder="6-digit PIN code"
          inputMode="numeric"
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
        <Label htmlFor="googleLocation">Google Location *</Label>
        <button
          id="googleLocation"
          type="button"
          onClick={() => setIsMapOpen(true)}
          aria-invalid={!!errors.googleLocation}
          aria-describedby={errors.googleLocation ? 'googleLocation-error' : undefined}
          className="mt-1.5 flex h-12 w-full items-center gap-3 rounded-2xl border-2 border-ink/15 bg-paper px-4 text-left text-sm text-ink transition-colors hover:border-coral-deep focus-visible:outline-none focus-visible:border-coral-deep focus-visible:ring-4 focus-visible:ring-coral/20"
        >
          <MapPin className="h-4 w-4 shrink-0 text-coral-deep" />
          <span className="min-w-0 flex-1 truncate">
            {customer.googleLocation ? 'Location selected' : 'Choose your location on the map'}
          </span>
          <span className="shrink-0 font-bold text-coral-deep">{customer.googleLocation ? 'Change' : 'Choose'}</span>
        </button>
        {customer.googleLocation && (
          <a
            href={customer.googleLocation}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block max-w-full truncate text-xs text-ink-soft underline underline-offset-2 hover:text-coral-deep"
          >
            Open selected location in Google Maps
          </a>
        )}
        {errors.googleLocation && (
          <p id="googleLocation-error" role="alert" className="text-coral-deep text-xs font-bold mt-1">
            {errors.googleLocation}
          </p>
        )}
      </div>
      {isMapOpen && (
        <GoogleLocationPicker
          value={customer.googleLocation ?? ''}
          drivingDistanceMeters={customer.googleLocationDrivingDistanceMeters}
          onSelect={(location, drivingDistanceMeters) => {
            onLocationSelect(location, drivingDistanceMeters)
            setIsMapOpen(false)
          }}
          onClose={() => setIsMapOpen(false)}
        />
      )}
    </div>
  )
})
