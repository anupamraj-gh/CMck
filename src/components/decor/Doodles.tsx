import type { SVGProps } from 'react'

type DoodleProps = SVGProps<SVGSVGElement>

export function StarDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M20 3c1 6.5 3 12 6.5 15.5S35 23 37 24c-2 1-9 2.5-10.5 4S22 35 20 37c-1-6-3-11-6.5-14.5S3 19 3 18c2-.5 9-2.5 10.5-4.5S19 5 20 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HeartDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M20 33S4 22.4 4 12.6C4 6.8 8.3 3 13 3c3.4 0 5.9 2 7 4.6C21.1 5 23.6 3 27 3c4.7 0 9 3.8 9 9.6C36 22.4 20 33 20 33Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SparkleDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15 1c.8 6 2 9.5 4 11.5S26.2 15 31 16c-4.8 1-9 2.7-11 5S16 29.5 15 31c-.9-5.7-2-9.5-4-11.5S3.8 17 0 16c4.8-1.1 9-2.7 11-5S14.1 6.7 15 1Z" />
    </svg>
  )
}

export function ArrowDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4 8c18 2 55-6 74 14 6 6.5-2 16-14 12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M52 21c4 3 9 8 12 14M78 24c-2 4.5-5 9-14 10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ScribbleUnderline(props: DoodleProps) {
  return (
    <svg viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" {...props}>
      <path
        d="M2 12c20-9 40-9 58-2 20 8 40 8 60-1 20-8 42-8 78 3"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PaperClip(props: DoodleProps) {
  return (
    <svg viewBox="0 0 30 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 14v28a7 7 0 0 0 14 0V10a4.5 4.5 0 0 0-9 0v26a2 2 0 0 0 4 0V16"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChefHatDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11 36V22.5M29 36V22.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M9.5 33.5h21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M30.5 15c2.8 0 5-2.3 5-5.2 0-2.7-2-5-4.6-5.2-.8-2.7-3.4-4.6-6.4-4.6-2 0-3.8.9-5 2.3C18.5 1.3 17 1 15.4 1c-3.4 0-6.2 2.4-6.7 5.6C6 7.2 4 9.6 4 12.4 4 15.5 6.5 18 9.6 18h20.9c2.5 0 4.5-2 4.5-4.5S32 9 30.5 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M9 18v4.5h22V18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function RollingPinDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="16" y="6" width="28" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 8v8M22 8v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <path d="M4 12h12M44 12h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="4" cy="12" r="2.4" fill="currentColor" />
      <circle cx="56" cy="12" r="2.4" fill="currentColor" />
    </svg>
  )
}

export function CheckboxDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1.5" y="1.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 10.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HandmadeStamp(props: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4" />
      <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M50 62s-16-9.5-16-20.5c0-5.4 4.3-9.5 9.4-9.5 3 0 5.6 1.5 6.6 3.9 1-2.4 3.6-3.9 6.6-3.9 5.1 0 9.4 4.1 9.4 9.5C66 52.5 50 62 50 62Z"
        fill="currentColor"
      />
      <path
        d="M30 30c4-4 8-4 12 0M58 30c4-4 8-4 12 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function FlowerDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <circle cx="20" cy="12" r="6" />
        <circle cx="29" cy="20" r="6" />
        <circle cx="20" cy="28" r="6" />
        <circle cx="11" cy="20" r="6" />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
      </g>
    </svg>
  )
}

export function WashiTape({
  className = '',
  color = 'var(--color-butter)',
  rotate = -4,
  width = 90,
}: {
  className?: string
  color?: string
  rotate?: number
  width?: number
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block h-7 tape-shadow ${className}`}
      style={{
        width,
        background: color,
        opacity: 0.85,
        transform: `rotate(${rotate}deg)`,
        clipPath:
          'polygon(0% 15%, 4% 0%, 8% 20%, 14% 2%, 20% 18%, 26% 0%, 32% 15%, 38% 2%, 44% 18%, 50% 0%, 56% 16%, 62% 2%, 68% 18%, 74% 0%, 80% 15%, 86% 2%, 92% 18%, 96% 0%, 100% 15%, 100% 85%, 96% 100%, 90% 82%, 84% 100%, 78% 84%, 72% 100%, 66% 82%, 60% 100%, 54% 84%, 48% 100%, 42% 82%, 36% 100%, 30% 84%, 24% 100%, 18% 82%, 12% 100%, 6% 84%, 0% 100%)',
      }}
    />
  )
}

export function WhiskDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 30 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15 34v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="10.5" y="30" width="9" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 30c-5-6-5-16 0-26M15 30c0-10 0-20 0-28M18 30c5-6 5-16 0-26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M12 4c1-1.5 2-1.5 3 0M15 2c1-1.5 2-1.5 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function SpoonDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 24 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="12" cy="10" rx="8" ry="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 19v34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function CoffeeStain(props: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" opacity="0.55" />
      <circle cx="50" cy="50" r="37" stroke="currentColor" strokeWidth="1.6" opacity="0.4" />
    </svg>
  )
}

export function StitchDivider({
  className = '',
  color = 'var(--color-ink-faint)',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      className={className}
      style={{ color }}
      aria-hidden
    >
      <path
        d="M0 12c20-10 40-10 60 0s40 10 60 0 40-10 60 0 40 10 60 0 40-10 60 0 40 10 60 0 40-10 60 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NotebookHoles({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`flex flex-col justify-between ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-3.5 w-3.5 rounded-full bg-lavender ring-2 ring-inset ring-ink-faint/30 shadow-[inset_0_1px_2px_rgba(58,49,69,0.25)]"
        />
      ))}
    </div>
  )
}
