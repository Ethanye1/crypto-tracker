import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { currentPassword, newPassword, username } = body

  const user = await db.select().from(users).where(eq(users.id, userId)).get()
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 })

  if (currentPassword && newPassword) {
    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return NextResponse.json({ error: '当前密码不正确' }, { status: 400 })
    if (newPassword.length < 6) return NextResponse.json({ error: '新密码至少 6 位' }, { status: 400 })

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await db.update(users).set({ passwordHash }).where(eq(users.id, userId))
  }

  if (username && username !== user.username) {
    if (username.length < 2 || username.length > 20)
      return NextResponse.json({ error: '用户名长度 2-20 位' }, { status: 400 })
    await db.update(users).set({ username }).where(eq(users.id, userId))
  }

  return NextResponse.json({ success: true })
}
