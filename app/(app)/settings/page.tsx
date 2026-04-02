'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ExportButton } from '@/components/export/export-button'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '请输入当前密码'),
  newPassword: z.string().min(6, '新密码至少 6 位'),
  confirmPassword: z.string().min(1, '请确认新密码'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
})
type PasswordForm = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { data: session } = useSession()
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError, setPwError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPwSuccess('')
    setPwError('')
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    })
    const json = await res.json()
    if (!res.ok) {
      setPwError(json.error)
      return
    }
    setPwSuccess('密码已更新')
    reset()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">设置</h1>
        <p className="text-sm text-text-muted mt-0.5">管理账户与应用偏好</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardTitle className="mb-4">账户信息</CardTitle>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-xl font-bold">
            {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{session?.user?.name}</p>
            <p className="text-sm text-text-muted">本地账户 · 数据存储在本机</p>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <CardTitle className="mb-4">修改密码</CardTitle>
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
          <Input
            label="当前密码"
            type="password"
            placeholder="输入当前密码"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <Input
            label="新密码"
            type="password"
            placeholder="至少 6 位"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label="确认新密码"
            type="password"
            placeholder="再次输入新密码"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {pwError && (
            <p className="text-sm text-red bg-red/10 border border-red/20 rounded-lg px-3 py-2">{pwError}</p>
          )}
          {pwSuccess && (
            <p className="text-sm text-green bg-green/10 border border-green/20 rounded-lg px-3 py-2">{pwSuccess}</p>
          )}
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>更新密码</Button>
          </div>
        </form>
      </Card>

      {/* Data Export */}
      <Card>
        <CardTitle className="mb-4">数据导出</CardTitle>
        <p className="text-sm text-text-secondary mb-4">
          将所有数据（资产、空投、理财、活动记录）导出为 Excel 文件。
        </p>
        <ExportButton />
      </Card>

      {/* About */}
      <Card>
        <CardTitle className="mb-4">关于</CardTitle>
        <div className="text-sm text-text-secondary space-y-1">
          <p>CryptoTracker — 个人加密投资日志</p>
          <p className="text-text-muted">数据存储在本地 SQLite 数据库，不上传任何云端服务。</p>
          <p className="text-text-muted">价格数据来源：CoinGecko 公开 API，每 30 秒刷新。</p>
        </div>
      </Card>
    </div>
  )
}
