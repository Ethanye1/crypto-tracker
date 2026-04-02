'use client'

import { usePrices } from '@/hooks/use-prices'
import { formatUSD, formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

const COIN_ICONS: Record<string, string> = {
  BTC: '#f7931a',
  ETH: '#627eea',
  SOL: '#9945ff',
  BNB: '#f3ba2f',
  ADA: '#0033ad',
}

export function PriceCards() {
  const { data: prices, isLoading } = usePrices()

  if (isLoading || !prices) {
    return (
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-bg-card border border-border h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {(['BTC', 'ETH', 'SOL', 'BNB', 'ADA'] as const).map((sym) => {
        const p = prices[sym]
        const positive = p.change24h >= 0
        return (
          <div
            key={sym}
            className="rounded-xl bg-bg-card border border-border p-3 glow-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: COIN_ICONS[sym] + '33', border: `1px solid ${COIN_ICONS[sym]}55` }}
              >
                <span style={{ color: COIN_ICONS[sym] }} className="text-[10px]">{sym[0]}</span>
              </div>
              <span className="text-xs font-bold text-text-secondary">{sym}</span>
            </div>
            <div className="font-mono text-sm font-bold text-text-primary">{formatUSD(p.price)}</div>
            <div className={cn('text-xs font-mono mt-0.5', positive ? 'text-green' : 'text-red')}>
              {formatPercent(p.change24h)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
