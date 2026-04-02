import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { DefiPosition } from '@/lib/types'

async function fetchDefi(): Promise<DefiPosition[]> {
  const res = await fetch('/api/defi')
  if (!res.ok) throw new Error('Failed to fetch defi')
  return res.json()
}

export function useDefi() {
  return useQuery({ queryKey: ['defi'], queryFn: fetchDefi })
}

export function useCreateDefi() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<DefiPosition, 'id' | 'userId' | 'createdAt'>) => {
      const res = await fetch('/api/defi', {
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
      qc.invalidateQueries({ queryKey: ['defi'] })
      qc.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export function useUpdateDefi() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<DefiPosition> & { id: number }) => {
      const res = await fetch('/api/defi', {
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['defi'] }),
  })
}

export function useDeleteDefi() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/defi?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['defi'] }),
  })
}
