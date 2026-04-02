'use client'

import { useState, useMemo } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, EmptyRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { AssetForm } from './asset-form'
import { useAssets, useCreateAsset, useUpdateAsset, useDeleteAsset } from '@/hooks/use-assets'
import { usePrices } from '@/hooks/use-prices'
import { formatUSD, formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Asset, AssetWithValue } from '@/lib/types'

export function AssetTable() {
  const { data: assets = [], isLoading } = useAssets()
  const { data: prices } = usePrices()
  const createAsset = useCreateAsset()
  const updateAsset = useUpdateAsset()
  const deleteAsset = useDeleteAsset()

  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<Asset | null>(null)

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

  const handleCreate = async (data: Omit<Asset, 'id' | 'userId' | 'createdAt'>) => {
    await createAsset.mutateAsync(data)
  }

  const handleUpdate = async (data: Omit<Asset, 'id' | 'userId' | 'createdAt'>) => {
    if (!editItem) return
    await updateAsset.mutateAsync({ id: editItem.id, ...data })
    setEditItem(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除这个资产记录？')) return
    await deleteAsset.mutateAsync(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">
          共 {assets.length} 种资产，总值{' '}
          <span className="text-primary font-mono font-semibold">{formatUSD(totalValue)}</span>
        </p>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          添加资产
        </Button>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <Thead>
            <Tr>
              <Th>代币</Th>
              <Th>数量</Th>
              <Th>成本价</Th>
              <Th>现价</Th>
              <Th>持仓价值</Th>
              <Th>盈亏</Th>
              <Th>涨跌幅</Th>
              <Th>网络</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <EmptyRow colSpan={9} message="加载中…" />
            ) : assetsWithValue.length === 0 ? (
              <EmptyRow colSpan={9} message="暂无资产，点击右上角添加" />
            ) : (
              assetsWithValue.map((a) => (
                <Tr key={a.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center text-xs font-bold text-text-secondary">
                        {a.symbol[0]}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{a.symbol}</div>
                        <div className="text-xs text-text-muted">{a.name}</div>
                      </div>
                    </div>
                  </Td>
                  <Td className="font-mono text-sm">{a.amount.toLocaleString()}</Td>
                  <Td className="font-mono text-sm text-text-secondary">{formatUSD(a.costPrice)}</Td>
                  <Td className="font-mono text-sm">{formatUSD(a.currentPrice)}</Td>
                  <Td className="font-mono text-sm font-semibold">{formatUSD(a.currentValue)}</Td>
                  <Td className={cn('font-mono text-sm', a.pnl >= 0 ? 'text-green' : 'text-red')}>
                    {a.pnl >= 0 ? '+' : ''}{formatUSD(a.pnl)}
                  </Td>
                  <Td className={cn('font-mono text-sm', a.pnlPercent >= 0 ? 'text-green' : 'text-red')}>
                    {formatPercent(a.pnlPercent)}
                  </Td>
                  <Td className="text-xs text-text-secondary">{a.network || '—'}</Td>
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

      <AssetForm open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} />
      {editItem && (
        <AssetForm
          open={!!editItem}
          onOpenChange={(o) => { if (!o) setEditItem(null) }}
          onSubmit={handleUpdate}
          initial={editItem}
        />
      )}
    </div>
  )
}
