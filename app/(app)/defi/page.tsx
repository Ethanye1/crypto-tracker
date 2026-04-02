'use client'

import { useDefi } from '@/hooks/use-defi'
import { DefiTable } from '@/components/defi/defi-table'
import { formatUSD } from '@/lib/utils'

export default function DefiPage() {
  const { data: positions = [] } = useDefi()

  const active = positions.filter((p) => p.status === 'active')
  const totalPrincipal = active.reduce((s, p) => s + p.principal, 0)
  const totalEarnings = active.reduce((s, p) => s + p.earnings, 0)
  const avgApy =
    active.length > 0
      ? active.reduce((s, p) => s + p.apy, 0) / active.length
      : 0

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">理财</h1>
        <p className="text-sm text-text-muted mt-0.5">管理您的 DeFi 收益仓位</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '活跃本金', value: formatUSD(totalPrincipal), color: 'text-primary' },
          { label: '累计收益', value: formatUSD(totalEarnings), color: 'text-green' },
          { label: '平均 APY', value: `${avgApy.toFixed(2)}%`, color: 'text-accent' },
        ].map((item) => (
          <div key={item.label} className="bg-bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-text-muted mb-1">{item.label}</p>
            <p className={`text-xl font-bold font-mono ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <DefiTable />
    </div>
  )
}
