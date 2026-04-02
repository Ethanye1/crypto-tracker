'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import type { Airdrop } from '@/lib/types'

const schema = z.object({
  protocol: z.string().min(1, '请输入协议名称'),
  network: z.string(),
  status: z.enum(['pending', 'claimed', 'expired']),
  estimatedValue: z.number().min(0),
  claimDate: z.string().optional(),
  deadline: z.string().optional(),
  notes: z.string(),
})
type FormData = z.infer<typeof schema>

interface AirdropFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt'>) => Promise<void>
  initial?: Airdrop
}

export function AirdropForm({ open, onOpenChange, onSubmit, initial }: AirdropFormProps) {
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
          status: initial.status,
          estimatedValue: initial.estimatedValue,
          claimDate: initial.claimDate ?? '',
          deadline: initial.deadline ?? '',
          notes: initial.notes,
        }
      : { status: 'pending', estimatedValue: 0, network: '', notes: '' },
  })

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const submit = async (data: FormData) => {
    await onSubmit({
      protocol: data.protocol,
      network: data.network ?? '',
      status: data.status,
      estimatedValue: data.estimatedValue ?? 0,
      claimDate: data.claimDate || null,
      deadline: data.deadline || null,
      notes: data.notes ?? '',
    })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={initial ? '编辑空投' : '添加空投'}
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <Input label="协议名称" placeholder="如 Arbitrum, zkSync" error={errors.protocol?.message} {...register('protocol')} />
        <Input label="网络" placeholder="如 Ethereum, Arbitrum" {...register('network')} />
        <Select
          label="状态"
          options={[
            { value: 'pending', label: '待领取' },
            { value: 'claimed', label: '已领取' },
            { value: 'expired', label: '已过期' },
          ]}
          {...register('status')}
        />
        <Input label="预估价值 (USD)" type="number" step="0.01" placeholder="0.00" {...register('estimatedValue', { valueAsNumber: true })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="领取日期" type="date" {...register('claimDate')} />
          <Input label="截止日期" type="date" {...register('deadline')} />
        </div>
        <Textarea label="备注" placeholder="备注信息…" rows={2} {...register('notes')} />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>取消</Button>
          <Button type="submit" loading={isSubmitting}>{initial ? '保存' : '添加'}</Button>
        </div>
      </form>
    </Modal>
  )
}
