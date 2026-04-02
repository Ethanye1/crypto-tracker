'use client'

import { usePrices } from '@/hooks/use-prices'
import { formatUSD, formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

const SYMBOLS = ['BTC', 'ETH', 'SOL', 'BNB', 'ADA'] as const

export function PriceTicker() {
  const { data: prices } = usePrices()

  if (!prices) {
    return (
      <div className="flex items-center gap-2 text-text-muted text-xs">
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-primary inline-block" />
        加载价格…
      </div>
    )
  }

  const items = SYMBOLS.map((s) => prices[s])

  return (
    <div className="overflow-hidden max-w-full">
      <div className="ticker-track">
        {[...items, ...items].map((p, i) => (
          <div key={i} className="flex items-center gap-2 px-5 shrink-0">
            <span className="font-mono text-xs font-bold text-text-primary">{p.symbol}</span>
            <span className="font-mono text-xs text-text-secondary">{formatUSD(p.price)}</span>
            <span
              className={cn(
                'text-xs font-mono',
                p.change24h >= 0 ? 'text-green' : 'text-red'
              )}
            >
              {formatPercent(p.change24h)}
            </span>
            <span className="text-border">|</span>
          </div>
        ))}
      </div>
    </div>
  )
}
