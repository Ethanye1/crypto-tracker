'use client'

import { useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, EmptyRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DefiForm } from './defi-form'
import { useDefi, useCreateDefi, useUpdateDefi, useDeleteDefi } from '@/hooks/use-defi'
import { formatUSD, formatDate } from '@/lib/utils'
import type { DefiPosition } from '@/lib/types'

const STATUS_BADGE: Record<string, Parameters<typeof Badge>[0]['variant']> = {
  active: 'success',
  paused: 'warning',
  ended: 'muted',
}
const STATUS_LABEL: Record<string, string> = {
  active: '进行中',
  paused: '已暂停',
  ended: '已结束',
}

export function DefiTable() {
  const { data: positions = [], isLoading } = useDefi()
  const createDefi = useCreateDefi()
  const updateDefi = useUpdateDefi()
  const deleteDefi = useDeleteDefi()

  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<DefiPosition | null>(null)

  const handleCreate = async (data: Omit<DefiPosition, 'id' | 'userId' | 'createdAt'>) => {
    await createDefi.mutateAsync(data)
  }

  const handleUpdate = async (data: Omit<DefiPosition, 'id' | 'userId' | 'createdAt'>) => {
    if (!editItem) return
    await updateDefi.mutateAsync({ id: editItem.id, ...data })
    setEditItem(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除这条理财记录？')) return
    await deleteDefi.mutateAsync(id)
  }

  // Compute estimated daily earnings
  const dailyEarnings = (principal: number, apy: number) =>
    (principal * apy) / 100 / 365

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">共 {positions.length} 条仓位</p>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          添加理财
        </Button>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <Thead>
            <Tr>
              <Th>协议</Th>
              <Th>网络</Th>
              <Th>APY</Th>
              <Th>本金</Th>
              <Th>已收益</Th>
              <Th>日收益估算</Th>
              <Th>开始时间</Th>
              <Th>状态</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <EmptyRow colSpan={9} message="加载中…" />
            ) : positions.length === 0 ? (
              <EmptyRow colSpan={9} message="暂无理财记录，点击右上角添加" />
            ) : (
              positions.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-medium">{p.protocol}</Td>
                  <Td className="text-text-secondary text-xs">{p.network || '—'}</Td>
                  <Td className="font-mono text-accent">{p.apy}%</Td>
                  <Td className="font-mono">{formatUSD(p.principal)}</Td>
                  <Td className="font-mono text-green">+{formatUSD(p.earnings)}</Td>
                  <Td className="font-mono text-xs text-text-secondary">
                    ~{formatUSD(dailyEarnings(p.principal, p.apy))}/天
                  </Td>
                  <Td className="text-xs text-text-secondary">{formatDate(p.startDate)}</Td>
                  <Td>
                    <Badge variant={STATUS_BADGE[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setEditItem(p)}>编辑</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>删除</Button>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>

      <DefiForm open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} />
      {editItem && (
        <DefiForm
          open={!!editItem}
          onOpenChange={(o) => { if (!o) setEditItem(null) }}
          onSubmit={handleUpdate}
          initial={editItem}
        />
      )}
    </div>
  )
}
