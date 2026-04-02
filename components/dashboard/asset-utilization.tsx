'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardTitle } from '@/components/ui/card'
import { formatUSD } from '@/lib/utils'

interface AssetUtilizationProps {
  totalValue: number
  defiValue: number
  airdropValue: number
}

export function AssetUtilization({ totalValue, defiValue, airdropValue }: AssetUtilizationProps) {
  const idleValue = Math.max(0, totalValue - defiValue - airdropValue)
  const utilizationPct = totalValue > 0
    ? (((defiValue + airdropValue) / totalValue) * 100).toFixed(1)
    : '0.0'

  const data = [
    { name: '理财', value: defiValue, color: '#00e5ff' },
    { name: '空投', value: airdropValue, color: '#f7931a' },
    { name: '闲置', value: idleValue, color: '#1e1e2e' },
  ].filter((d) => d.value > 0)

  return (
    <Card>
      <CardTitle className="mb-4">资产利用率</CardTitle>
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={52}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '8px', fontSize: 12 }}
                formatter={(v) => formatUSD(Number(v))}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold font-mono text-primary">{utilizationPct}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          {[
            { label: '理财', value: defiValue, color: 'bg-primary' },
            { label: '空投', value: airdropValue, color: 'bg-accent' },
            { label: '闲置', value: idleValue, color: 'bg-border' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-text-secondary w-8">{item.label}</span>
              <span className="font-mono text-text-primary">{formatUSD(item.value, true)}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
