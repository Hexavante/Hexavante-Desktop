import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

export function Avatar({ src, alt = '', size = 'md', className }: AvatarProps) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-white/10 text-slate-500',
          sizeClasses[size],
          className,
        )}
      >
        <User className={size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover', sizeClasses[size], className)}
    />
  )
}
