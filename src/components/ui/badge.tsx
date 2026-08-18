import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = {
  default: 'border-transparent bg-[#2563eb] text-white shadow',
  secondary: 'border-transparent bg-[#111827] text-slate-300',
  destructive: 'border-transparent bg-red-600 text-white shadow',
  outline: 'text-slate-300 border border-[rgba(148,163,184,0.18)]',
  accent: 'border-[hsl(187,85%,53%,0.28)] bg-[hsl(187,85%,53%,0.12)] text-[hsl(187,85%,53%,0.92)]',
  violet: 'border-[hsl(262,83%,58%,0.28)] bg-[hsl(262,83%,58%,0.12)] text-[hsl(262,83%,58%,0.92)]',
  emerald: 'border-[hsl(160,84%,39%,0.28)] bg-[hsl(160,84%,39%,0.12)] text-[hsl(160,84%,39%,0.92)]',
  blue: 'border-[hsl(221,83%,53%,0.28)] bg-[hsl(221,83%,53%,0.12)] text-[hsl(221,83%,53%,0.92)]',
  teal: 'border-[hsl(174,84%,39%,0.28)] bg-[hsl(174,84%,39%,0.12)] text-[hsl(174,84%,39%,0.92)]',
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
