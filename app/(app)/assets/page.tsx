'use client'

import { useMemo } from 'react'
import { useAssets } from '@/hooks/use-assets'
import { usePrices } from '@/hooks/use-prices'
import { AssetTable } from '@/components/assets/asset-table'
import { AllocationChart } from '@/components/assets/allocation-chart'
import { formatUSD, formatPercent } from '@/lib/utils'
import type { AssetWithValue } from '@/lib/types'

export default function AssetsPage() {
  const { data: assets = [] } = useAssets()
  const { data: prices } = usePrices()

  const assetsWithValue = useMemo<AssetWithValue[]>(() => {
    return assets.map((a) => {
      const sym = a.symbol.toUpperCase() as 'BTC' | 'ETH' | 'SOL' | 'BNB' | 'ADA'
      const currentPrice = prices?.[sym]?.price ?? a.costPrice
      const currentValue = currentPrice * a.amount
      const costValue = a.costPrice * a.amount
      const pnl = currentValue - costValue
      const pnlPercent = costValue > 0 ? (pnl / costValue) * 100 : 0
      return { ...a, currentPrice, currentValue, pnl, pnlPercent }
    })
  }, [assets, prices])

  const totalValue = assetsWithValue.reduce((s, a) => s + a.currentValue, 0)
  const totalCost = assetsWithValue.reduce((s, a) => s + a.costPrice * a.amount, 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">资产</h1>
        <p className="text-sm text-text-muted mt-0.5">管理您的加密货币持仓</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '总持仓价值', value: formatUSD(totalValue), color: 'text-primary' },
          { label: '总投入成本', value: formatUSD(totalCost), color: 'text-text-primary' },
          {
            label: '总盈亏',
            value: `${totalPnl >= 0 ? '+' : ''}${formatUSD(totalPnl)} (${formatPercent(totalPnlPct)})`,
            color: totalPnl >= 0 ? 'text-green' : 'text-red',
          },
        ].map((item) => (
          <div key={item.label} className="bg-bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-text-muted mb-1">{item.label}</p>
            <p className={`text-xl font-bold font-mono ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AssetTable />
        </div>
        <AllocationChart assets={assetsWithValue} />
      </div>
    </div>
  )
}
