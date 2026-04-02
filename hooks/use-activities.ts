import { useQuery } from '@tanstack/react-query'
import type { Activity } from '@/lib/types'

async function fetchActivities(): Promise<Activity[]> {
  const res = await fetch('/api/activities')
  if (!res.ok) throw new Error('Failed to fetch activities')
  return res.json()
}

export function useActivities() {
  return useQuery({ queryKey: ['activities'], queryFn: fetchActivities })
}
