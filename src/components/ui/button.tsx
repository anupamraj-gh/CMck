import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lavender disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.97]',
  {
    variants: {
      variant: {
        default:
          'bg-ink text-paper hover:bg-ink/90 craft-shadow hover:-translate-y-0.5 hover:craft-shadow-lg',
        coral:
          'bg-coral text-paper hover:bg-coral-deep craft-shadow hover:-translate-y-0.5 hover:craft-shadow-lg',
        butter:
          'bg-butter text-ink hover:bg-butter-deep craft-shadow hover:-translate-y-0.5 hover:craft-shadow-lg',
        outline:
          'border-2 border-ink/70 bg-transparent hover:bg-paper text-ink hover:-translate-y-0.5',
        ghost: 'hover:bg-purple/40 text-ink',
        secondary: 'bg-purple/70 text-ink hover:bg-purple craft-shadow',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
