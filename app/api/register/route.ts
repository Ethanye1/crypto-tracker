import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { generateId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 })
    }
    if (username.length < 2 || username.length > 20) {
      return NextResponse.json({ error: '用户名长度为 2-20 位' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少 6 位' }, { status: 400 })
    }

    // Only allow registration if no users exist
    const existing = await db.select().from(users).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ error: '已存在用户，请直接登录' }, { status: 403 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const id = generateId()

    await db.insert(users).values({ id, username, passwordHash })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: '注册失败' }, { status: 500 })
  }
}

// Check if any users exist
export async function GET() {
  const existing = await db.select({ id: users.id }).from(users).limit(1)
  return NextResponse.json({ hasUsers: existing.length > 0 })
}
