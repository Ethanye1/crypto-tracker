'use client'

import { useActivities } from '@/hooks/use-activities'
import { Card, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { isExpired, daysAgo, formatDateTime } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  asset_add: '添加资产',
  asset_remove: '删除资产',
  airdrop_add: '记录空投',
  airdrop_claim: '领取空投',
  defi_start: '开始理财',
  defi_end: '结束理财',
  manual: '手动记录',
}

export function ActivityList() {
  const { data: activities = [], isLoading } = useActivities()

  return (
    <Card>
      <CardTitle className="mb-4">活动记录</CardTitle>
      {isLoading ? (
        <div className="text-center text-text-muted text-sm py-6">加载中…</div>
      ) : activities.length === 0 ? (
        <div className="text-center text-text-muted text-sm py-6">暂无活动记录</div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {activities.map((act) => {
            const expired = isExpired(act.createdAt, 7)
            const days = daysAgo(act.createdAt)
            return (
              <div
                key={act.id}
                className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-text-primary">
                      {TYPE_LABELS[act.type] ?? act.type}
                    </span>
                    {expired && (
                      <Badge variant="muted">已过期</Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 truncate">{act.description}</p>
                </div>
                <div className="text-xs text-text-muted shrink-0 text-right">
                  <div>{days === 0 ? '今天' : `${days}天前`}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
