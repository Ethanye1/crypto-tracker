'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import type { Asset } from '@/lib/types'

const COMMON_SYMBOLS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'BNB', name: 'BNB' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'USDC', name: 'USD Coin' },
]

const schema = z.object({
  symbol: z.string().min(1, '请输入代币符号'),
  name: z.string().min(1, '请输入代币名称'),
  amount: z.number().positive('数量必须大于 0'),
  costPrice: z.number().min(0, '成本价不能为负'),
  network: z.string(),
})
type FormData = z.infer<typeof schema>

interface AssetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Asset, 'id' | 'userId' | 'createdAt'>) => Promise<void>
  initial?: Asset
}

export function AssetForm({ open, onOpenChange, onSubmit, initial }: AssetFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          symbol: initial.symbol,
          name: initial.name,
          amount: initial.amount,
          costPrice: initial.costPrice,
          network: initial.network,
        }
      : { symbol: '', name: '', amount: 0, costPrice: 0, network: '' },
  })

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const submit = async (data: FormData) => {
    await onSubmit({ ...data, network: data.network ?? '' })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={initial ? '编辑资产' : '添加资产'}
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        {/* Quick select */}
        {!initial && (
          <div>
            <p className="text-xs text-text-secondary mb-2">快速选择</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMBOLS.map((c) => (
                <button
                  key={c.symbol}
                  type="button"
                  onClick={() => {
                    setValue('symbol', c.symbol)
                    setValue('name', c.name)
                  }}
                  className="px-2.5 py-1 rounded-md text-xs border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  {c.symbol}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input label="代币符号" placeholder="BTC" error={errors.symbol?.message} {...register('symbol')} />
          <Input label="代币名称" placeholder="Bitcoin" error={errors.name?.message} {...register('name')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="持有数量" type="number" step="any" placeholder="0.0" error={errors.amount?.message} {...register('amount', { valueAsNumber: true })} />
          <Input label="成本价 (USD)" type="number" step="any" placeholder="0.00" error={errors.costPrice?.message} {...register('costPrice', { valueAsNumber: true })} />
        </div>
        <Input label="网络/来源" placeholder="如 Binance, Ethereum" {...register('network')} />

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>取消</Button>
          <Button type="submit" loading={isSubmitting}>{initial ? '保存' : '添加'}</Button>
        </div>
      </form>
    </Modal>
  )
}
