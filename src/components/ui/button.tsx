import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

const variantClasses = {
  default: 'hx-btn-primary',
  outline: 'hx-btn-secondary',
  ghost: 'hx-btn-ghost',
  danger: 'hx-btn-danger bg-red-600 text-white shadow-lg shadow-red-950/25 hover:bg-red-700 hover:-translate-y-0.5',
  accent: 'hx-btn-primary bg-gradient-to-r from-[#2563eb] to-[#14b8a6] hover:from-[#1d4ed8] hover:to-teal-600'
}

const sizeClasses = {
  default: 'min-h-10',
  sm: 'min-h-9 px-3 py-1.5 text-xs',
  lg: 'min-h-11 px-5 py-2.5 text-base',
  icon: 'min-h-10 min-w-10 p-0'
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses
  size?: keyof typeof sizeClasses
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const classes = cn('hx-btn', variantClasses[variant], sizeClasses[size], className)
    if (asChild) {
      return <Slot className={classes} ref={ref} {...props} />
    }
    return <button className={classes} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button }
