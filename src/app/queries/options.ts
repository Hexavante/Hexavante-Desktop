import type { UseQueryOptions } from '@tanstack/react-query'

export const staleTimes = {
  INSTANT: 0,
  FAST: 15 * 1000,
  NORMAL: 30 * 1000,
  SLOW: 60 * 1000,
  LAZY: 5 * 60 * 1000,
  INFINITY: Infinity
} as const

export function createQueryOptions<T>(
  options: UseQueryOptions<T>
): UseQueryOptions<T> {
  return options
}
