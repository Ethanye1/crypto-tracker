import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { assets, activities } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateId } from '@/lib/utils'

async function getUserId(req: NextRequest): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(assets).where(eq(assets.userId, userId))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { symbol, name, amount, costPrice, network = '' } = body

  if (!symbol || !name || amount == null || costPrice == null) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const [row] = await db
    .insert(assets)
    .values({ userId, symbol: symbol.toUpperCase(), name, amount: Number(amount), costPrice: Number(costPrice), network })
    .returning()

  await db.insert(activities).values({
    userId,
    type: 'asset_add',
    description: `添加资产 ${symbol.toUpperCase()} × ${amount}`,
    relatedId: row.id,
  })

  return NextResponse.json(row, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, symbol, name, amount, costPrice, network } = body

  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 })

  const [row] = await db
    .update(assets)
    .set({ symbol: symbol?.toUpperCase(), name, amount: Number(amount), costPrice: Number(costPrice), network })
    .where(and(eq(assets.id, id), eq(assets.userId, userId)))
    .returning()

  return NextResponse.json(row)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get('id'))
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 })

  await db.delete(assets).where(and(eq(assets.id, id), eq(assets.userId, userId)))

  await db.insert(activities).values({
    userId,
    type: 'asset_remove',
    description: `删除资产 ID ${id}`,
    relatedId: id,
  })

  return NextResponse.json({ success: true })
}
