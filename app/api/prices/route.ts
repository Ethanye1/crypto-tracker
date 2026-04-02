import { NextResponse } from 'next/server'
import { fetchPrices } from '@/lib/prices'

export async function GET() {
  try {
    const prices = await fetchPrices()
    return NextResponse.json(prices, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    })
  } catch (error) {
    console.error('Price fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 502 })
  }
}
