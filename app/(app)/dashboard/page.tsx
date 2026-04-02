'use client'

import { useMemo } from 'react'
import { useAssets } from '@/hooks/use-assets'
import { useAirdrops } from '@/hooks/use-airdrops'
import { useDefi } from '@/hooks/use-defi'
import { usePrices } from '@/hooks/use-prices'
import { StatCard } from '@/components/dashboard/stat-card'
import { AssetUtilization } from '@/components/dashboard/asset-utilization'
import { ReturnsChart } from '@/components/dashboard/returns-chart'
import { ActivityList } from '@/components/dashboard/activity-list'
import { PriceCards } from '@/components/dashboard/price-cards'
import { ExportButton } from '@/components/export/export-button'
import { formatUSD, formatPercent } from '@/lib/utils'

const PRICE_SYMBOL_MAP: Record<string, string> = {
  BTC: 'BTC', ETH: 'ETH', SOL: 'SOL', BNB: 'BNB', ADA: 'ADA',
}

export default function DashboardPage() {
  const { data: assets = [] } = useAssets()
  const { data: airdrops = [] } = useAirdrops()
  const { data: defiPositions = [] } = useDefi()
  const { data: prices } = usePrices()

  const stats = useMemo(() => {
    let totalValue = 0
    let totalCost = 0

    for (const a of assets) {
      const sym = a.symbol.toUpperCase() as keyof typeof prices
      const price = prices?.[sym as 'BTC' | 'ETH' | 'SOL' | 'BNB' | 'ADA']?.price ?? a.costPrice
      totalValue += price * a.amount
      totalCost += a.costPrice * a.amount
    }

    const totalPnl = totalValue - totalCost
    const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

    const airdropValue = airdrops
      .filter((a) => a.status === 'pending')
      .reduce((s, a) => s + a.estimatedValue, 0)

    const defiValue = defiPositions
      .filter((d) => d.status === 'active')
      .reduce((s, d) => s + d.principal + d.earnings, 0)

    const defiEarnings = defiPositions
      .filter((d) => d.status === 'active')
      .reduce((s, d) => s + d.earnings, 0)

    return { totalValue, totalCost, totalPnl, totalPnlPct, airdropValue, defiValue, defiEarnings }
  }, [assets, airdrops, defiPositions, prices])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">投资看板</h1>
          <p className="text-sm text-text-muted mt-0.5">实时追踪您的加密资产</p>
        </div>
        <ExportButton />
      </div>

      {/* Price Cards */}
      <PriceCards />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总资产"
          value={formatUSD(stats.totalValue, true)}
          sub={`成本 ${formatUSD(stats.totalCost, true)}`}
          subPositive={null}
          accent="primary"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <StatCard
          title="总盈亏"
          value={formatUSD(stats.totalPnl, true)}
          sub={formatPercent(stats.totalPnlPct)}
          subPositive={stats.totalPnl >= 0}
          accent={stats.totalPnl >= 0 ? 'green' : 'red'}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
            </svg>
          }
        />
        <StatCard
          title="理财收益"
          value={formatUSD(stats.defiEarnings, true)}
          sub={`本金 ${formatUSD(stats.defiValue - stats.defiEarnings, true)}`}
          subPositive={null}
          accent="accent"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
        <StatCard
          title="待领空投"
          value={formatUSD(stats.airdropValue, true)}
          sub={`${airdrops.filter((a) => a.status === 'pending').length} 个待领取`}
          subPositive={null}
          accent="primary"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22V12M12 12L8 16M12 12L16 16" />
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ReturnsChart totalValue={stats.totalValue} />
        </div>
        <AssetUtilization
          totalValue={stats.totalValue}
          defiValue={stats.defiValue}
          airdropValue={stats.airdropValue}
        />
      </div>

      {/* Activity */}
      <ActivityList />
    </div>
  )
}
