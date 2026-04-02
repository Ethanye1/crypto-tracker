import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { airdrops, activities } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(airdrops).where(eq(airdrops.userId, userId))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { protocol, network = '', status = 'pending', estimatedValue = 0, claimDate, deadline, notes = '' } = body

  if (!protocol) return NextResponse.json({ error: '缺少协议名称' }, { status: 400 })

  const [row] = await db
    .insert(airdrops)
    .values({
      userId,
      protocol,
      network,
      status,
      estimatedValue: Number(estimatedValue),
      claimDate: claimDate || null,
      deadline: deadline || null,
      notes,
    })
    .returning()

  await db.insert(activities).values({
    userId,
    type: 'airdrop_add',
    description: `记录空投 ${protocol}`,
    relatedId: row.id,
  })

  return NextResponse.json(row, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, protocol, network, status, estimatedValue, claimDate, deadline, notes } = body
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 })

  const [row] = await db
    .update(airdrops)
    .set({
      protocol,
      network,
      status,
      estimatedValue: estimatedValue != null ? Number(estimatedValue) : undefined,
      claimDate: claimDate || null,
      deadline: deadline || null,
      notes,
    })
    .where(and(eq(airdrops.id, id), eq(airdrops.userId, userId)))
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

  await db.delete(airdrops).where(and(eq(airdrops.id, id), eq(airdrops.userId, userId)))
  return NextResponse.json({ success: true })
}
