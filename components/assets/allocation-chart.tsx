'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardTitle } from '@/components/ui/card'
import { formatUSD } from '@/lib/utils'
import type { AssetWithValue } from '@/lib/types'

const COLORS = ['#00e5ff', '#f7931a', '#9945ff', '#f3ba2f', '#00d48a', '#ff4d6a', '#627eea', '#0033ad']

interface AllocationChartProps {
  assets: AssetWithValue[]
}

export function AllocationChart({ assets }: AllocationChartProps) {
  const totalValue = assets.reduce((s, a) => s + a.currentValue, 0)

  // Group by symbol
  const grouped = assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.symbol] = (acc[a.symbol] ?? 0) + a.currentValue
    return acc
  }, {})

  const data = Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <Card>
        <CardTitle>资产分配</CardTitle>
        <div className="text-center text-text-muted text-sm py-8">暂无资产数据</div>
      </Card>
    )
  }

  return (
    <Card>
      <CardTitle className="mb-4">资产分配</CardTitle>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={70}
              innerRadius={40}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '8px', fontSize: 12 }}
              formatter={(v) => [formatUSD(Number(v)), '市值']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 space-y-1.5">
        {data.slice(0, 6).map((item, i) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-text-secondary w-12 font-mono">{item.name}</span>
            <div className="flex-1 bg-border rounded-full h-1">
              <div
                className="h-1 rounded-full"
                style={{
                  width: `${((item.value / totalValue) * 100).toFixed(1)}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
            <span className="text-text-muted w-10 text-right">
              {((item.value / totalValue) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
