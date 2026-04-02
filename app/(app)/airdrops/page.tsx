'use client'

import { useAirdrops } from '@/hooks/use-airdrops'
import { AirdropTable } from '@/components/airdrops/airdrop-table'
import { formatUSD } from '@/lib/utils'

export default function AirdropsPage() {
  const { data: airdrops = [] } = useAirdrops()

  const pendingValue = airdrops
    .filter((a) => a.status === 'pending')
    .reduce((s, a) => s + a.estimatedValue, 0)

  const claimedValue = airdrops
    .filter((a) => a.status === 'claimed')
    .reduce((s, a) => s + a.estimatedValue, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">链上空投</h1>
        <p className="text-sm text-text-muted mt-0.5">追踪链上空投机会与领取状态</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '待领取总值', value: formatUSD(pendingValue), color: 'text-primary' },
          { label: '已领取总值', value: formatUSD(claimedValue), color: 'text-green' },
          { label: '总记录数', value: `${airdrops.length}`, color: 'text-text-primary' },
        ].map((item) => (
          <div key={item.label} className="bg-bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-text-muted mb-1">{item.label}</p>
            <p className={`text-xl font-bold font-mono ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <AirdropTable />
    </div>
  )
}
