'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  username: z.string().min(2, '用户名至少 2 位'),
  password: z.string().min(6, '密码至少 6 位'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [serverError, setServerError] = useState('')
  const [checkingUsers, setCheckingUsers] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    fetch('/api/register')
      .then((r) => r.json())
      .then((d) => {
        setIsRegisterMode(!d.hasUsers)
        setCheckingUsers(false)
      })
  }, [])

  const onSubmit = async (data: FormData) => {
    setServerError('')
    if (isRegisterMode) {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error)
        return
      }
    }

    const result = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError('用户名或密码错误')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (checkingUsers) {
    return (
      <div className="flex items-center gap-2 text-text-muted">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>加载中…</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#00e5ff" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">CryptoTracker</span>
        </div>
        <p className="text-text-muted text-sm">
          {isRegisterMode ? '首次使用，创建您的账户' : '登录您的账户'}
        </p>
      </div>

      {/* Card */}
      <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-[0_0_40px_rgba(0,229,255,0.06)]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="username"
            label="用户名"
            placeholder="输入用户名"
            autoComplete="username"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            id="password"
            label="密码"
            type="password"
            placeholder="输入密码（至少 6 位）"
            autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
            error={errors.password?.message}
            {...register('password')}
          />

          {serverError && (
            <p className="text-sm text-red bg-red/10 border border-red/20 rounded-lg px-3 py-2">
              {serverError}
            </p>
          )}

          <Button type="submit" loading={isSubmitting} size="lg" className="w-full mt-2">
            {isRegisterMode ? '创建账户并登录' : '登录'}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-text-muted mt-6">
        个人加密投资日志 · 数据存储在本地
      </p>
    </div>
  )
}
