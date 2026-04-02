'use client'

import { useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, EmptyRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AirdropForm } from './airdrop-form'
import { useAirdrops, useCreateAirdrop, useUpdateAirdrop, useDeleteAirdrop } from '@/hooks/use-airdrops'
import { formatUSD, formatDate } from '@/lib/utils'
import type { Airdrop } from '@/lib/types'

const STATUS_BADGE: Record<string, Parameters<typeof Badge>[0]['variant']> = {
  pending: 'info',
  claimed: 'success',
  expired: 'muted',
}
const STATUS_LABEL: Record<string, string> = {
  pending: '待领取',
  claimed: '已领取',
  expired: '已过期',
}

export function AirdropTable() {
  const { data: airdrops = [], isLoading } = useAirdrops()
  const createAirdrop = useCreateAirdrop()
  const updateAirdrop = useUpdateAirdrop()
  const deleteAirdrop = useDeleteAirdrop()

  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<Airdrop | null>(null)

  const handleCreate = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt'>) => {
    await createAirdrop.mutateAsync(data)
  }

  const handleUpdate = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt'>) => {
    if (!editItem) return
    await updateAirdrop.mutateAsync({ id: editItem.id, ...data })
    setEditItem(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除这条空投记录？')) return
    await deleteAirdrop.mutateAsync(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-text-muted">共 {airdrops.length} 条记录</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          添加空投
        </Button>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <Thead>
            <Tr>
              <Th>协议</Th>
              <Th>网络</Th>
              <Th>状态</Th>
              <Th>预估价值</Th>
              <Th>截止日期</Th>
              <Th>领取日期</Th>
              <Th>备注</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <EmptyRow colSpan={8} message="加载中…" />
            ) : airdrops.length === 0 ? (
              <EmptyRow colSpan={8} message="暂无空投记录，点击右上角添加" />
            ) : (
              airdrops.map((a) => (
                <Tr key={a.id}>
                  <Td className="font-medium">{a.protocol}</Td>
                  <Td className="text-text-secondary text-xs">{a.network || '—'}</Td>
                  <Td>
                    <Badge variant={STATUS_BADGE[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                  </Td>
                  <Td className="font-mono">{formatUSD(a.estimatedValue)}</Td>
                  <Td className="text-xs text-text-secondary">{a.deadline ? formatDate(a.deadline) : '—'}</Td>
                  <Td className="text-xs text-text-secondary">{a.claimDate ? formatDate(a.claimDate) : '—'}</Td>
                  <Td className="text-xs text-text-muted max-w-32 truncate">{a.notes || '—'}</Td>
                  <Td>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setEditItem(a)}>编辑</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>删除</Button>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>

      <AirdropForm open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} />
      {editItem && (
        <AirdropForm
          open={!!editItem}
          onOpenChange={(o) => { if (!o) setEditItem(null) }}
          onSubmit={handleUpdate}
          initial={editItem}
        />
      )}
    </div>
  )
}
