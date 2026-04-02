'use client'

import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Period = 'daily' | 'weekly' | 'monthly'

// Generate synthetic historical PnL data based on current total value
function generateData(period: Period, totalValue: number) {
  const now = Date.now()
  const count = period === 'daily' ? 24 : period === 'weekly' ? 7 : 12
  const msStep = period === 'daily' ? 3_600_000 : period === 'weekly' ? 86_400_000 : 30 * 86_400_000
  const volatility = totalValue * (period === 'daily' ? 0.005 : period === 'weekly' ? 0.02 : 0.05)

  let value = totalValue * 0.9
  return Array.from({ length: count }, (_, i) => {
    const ts = now - (count - i - 1) * msStep
    value += (Math.random() - 0.45) * volatility
    const d = new Date(ts)
    const label =
      period === 'daily'
        ? `${d.getHours()}:00`
        : period === 'weekly'
        ? ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
        : `${d.getMonth() + 1}月`
    return { label, value: Math.max(0, value) }
  })
}

interface ReturnsChartProps {
  totalValue: number
}

export function ReturnsChart({ totalValue }: ReturnsChartProps) {
  const [period, setPeriod] = useState<Period>('weekly')
  const data = generateData(period, totalValue)

  const TABS: { key: Period; label: string }[] = [
    { key: 'daily', label: '日' },
    { key: 'weekly', label: '周' },
    { key: 'monthly', label: '月' },
  ]

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>资产走势</CardTitle>
        <div className="flex gap-1 bg-bg-base rounded-lg p-0.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setPeriod(t.key)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                period === t.key
                  ? 'bg-primary text-bg-base'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 10, fill: '#475569' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={40}
            />
            <Tooltip
              contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '8px', fontSize: 12 }}
              formatter={(v) => [`$${Number(v).toFixed(2)}`, '资产']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00e5ff"
              strokeWidth={2}
              fill="url(#colorVal)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
