import { useQuery } from '@tanstack/react-query'
import type { PricesMap } from '@/lib/types'

async function fetchPrices(): Promise<PricesMap> {
  const res = await fetch('/api/prices')
  if (!res.ok) throw new Error('Failed to fetch prices')
  return res.json()
}

export function usePrices() {
  return useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    refetchInterval: 30_000,
    staleTime: 25_000,
  })
}
