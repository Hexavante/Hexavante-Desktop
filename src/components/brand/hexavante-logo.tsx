import { cn } from '@/lib/utils'
import logoUrl from '@/assets/brand/hexavante-logo.png'

type Props = {
  showWordmark?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  wordmarkClassName?: string
  imageClassName?: string
}

const SIZES = {
  sm: { image: 32, text: 'text-sm' },
  md: { image: 40, text: 'text-base' },
  lg: { image: 48, text: 'text-lg' },
  xl: { image: 56, text: 'text-xl' },
} as const

export function HexavanteLogo({
  showWordmark = true,
  size = 'sm',
  className,
  wordmarkClassName,
  imageClassName,
}: Props) {
  const dimensions = SIZES[size]

  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <img
        src={logoUrl}
        alt="Hexavante"
        width={dimensions.image}
        height={dimensions.image}
        className={cn(
          'hx-header-logo-glow shrink-0 object-contain',
          imageClassName,
        )}
        draggable={false}
      />
      {showWordmark ? (
        <span
          className={cn(
            'font-extrabold tracking-tight',
            dimensions.text,
            wordmarkClassName,
          )}
        >
          HEXAVANTE
        </span>
      ) : null}
    </span>
  )
}