import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { defiPositions, activities } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(defiPositions).where(eq(defiPositions.userId, userId))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { protocol, network = '', apy = 0, principal, earnings = 0, startDate, status = 'active' } = body

  if (!protocol || principal == null || !startDate) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const [row] = await db
    .insert(defiPositions)
    .values({
      userId,
      protocol,
      network,
      apy: Number(apy),
      principal: Number(principal),
      earnings: Number(earnings),
      startDate,
      status,
    })
    .returning()

  await db.insert(activities).values({
    userId,
    type: 'defi_start',
    description: `开始理财 ${protocol} APY ${apy}%`,
    relatedId: row.id,
  })

  return NextResponse.json(row, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, protocol, network, apy, principal, earnings, startDate, status } = body
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 })

  const [row] = await db
    .update(defiPositions)
    .set({
      protocol,
      network,
      apy: apy != null ? Number(apy) : undefined,
      principal: principal != null ? Number(principal) : undefined,
      earnings: earnings != null ? Number(earnings) : undefined,
      startDate,
      status,
    })
    .where(and(eq(defiPositions.id, id), eq(defiPositions.userId, userId)))
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

  await db.delete(defiPositions).where(and(eq(defiPositions.id, id), eq(defiPositions.userId, userId)))
  return NextResponse.json({ success: true })
}
