import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Airdrop } from '@/lib/types'

async function fetchAirdrops(): Promise<Airdrop[]> {
  const res = await fetch('/api/airdrops')
  if (!res.ok) throw new Error('Failed to fetch airdrops')
  return res.json()
}

export function useAirdrops() {
  return useQuery({ queryKey: ['airdrops'], queryFn: fetchAirdrops })
}

export function useCreateAirdrop() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt'>) => {
      const res = await fetch('/api/airdrops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['airdrops'] })
      qc.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export function useUpdateAirdrop() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Airdrop> & { id: number }) => {
      const res = await fetch('/api/airdrops', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['airdrops'] }),
  })
}

export function useDeleteAirdrop() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/airdrops?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['airdrops'] }),
  })
}
