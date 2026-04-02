'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import type { DefiPosition } from '@/lib/types'

const schema = z.object({
  protocol: z.string().min(1, '请输入协议名称'),
  network: z.string(),
  apy: z.number().min(0),
  principal: z.number().min(0, '本金不能为负'),
  earnings: z.number(),
  startDate: z.string().min(1, '请选择开始日期'),
  status: z.enum(['active', 'paused', 'ended']),
})
type FormData = z.infer<typeof schema>

interface DefiFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<DefiPosition, 'id' | 'userId' | 'createdAt'>) => Promise<void>
  initial?: DefiPosition
}

export function DefiForm({ open, onOpenChange, onSubmit, initial }: DefiFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          protocol: initial.protocol,
          network: initial.network,
          apy: initial.apy,
          principal: initial.principal,
          earnings: initial.earnings,
          startDate: initial.startDate,
          status: initial.status,
        }
      : {
          status: 'active' as const,
          apy: 0,
          earnings: 0,
          network: '',
          principal: 0,
          startDate: new Date().toISOString().slice(0, 10),
        },
  })

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const submit = async (data: FormData) => {
    await onSubmit(data)
    handleClose()
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={initial ? '编辑理财仓位' : '添加理财仓位'}
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <Input label="协议名称" placeholder="如 AAVE, Compound, Lido" error={errors.protocol?.message} {...register('protocol')} />
        <Input label="网络" placeholder="如 Ethereum, BSC" {...register('network')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="APY (%)" type="number" step="0.01" placeholder="5.00" error={errors.apy?.message} {...register('apy', { valueAsNumber: true })} />
          <Input label="本金 (USD)" type="number" step="0.01" placeholder="1000.00" error={errors.principal?.message} {...register('principal', { valueAsNumber: true })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="已累计收益 (USD)" type="number" step="0.01" placeholder="0.00" {...register('earnings', { valueAsNumber: true })} />
          <Input label="开始日期" type="date" error={errors.startDate?.message} {...register('startDate')} />
        </div>
        <Select
          label="状态"
          options={[
            { value: 'active', label: '进行中' },
            { value: 'paused', label: '已暂停' },
            { value: 'ended', label: '已结束' },
          ]}
          {...register('status')}
        />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>取消</Button>
          <Button type="submit" loading={isSubmitting}>{initial ? '保存' : '添加'}</Button>
        </div>
      </form>
    </Modal>
  )
}
