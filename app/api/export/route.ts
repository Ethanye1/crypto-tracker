import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { assets, airdrops, defiPositions, activities } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import * as XLSX from 'xlsx'

export async function GET(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [assetRows, airdropRows, defiRows, activityRows] = await Promise.all([
    db.select().from(assets).where(eq(assets.userId, userId)),
    db.select().from(airdrops).where(eq(airdrops.userId, userId)),
    db.select().from(defiPositions).where(eq(defiPositions.userId, userId)),
    db.select().from(activities).where(eq(activities.userId, userId)),
  ])

  const wb = XLSX.utils.book_new()

  // Assets sheet
  const assetData = assetRows.map((a) => ({
    代币: a.symbol,
    名称: a.name,
    数量: a.amount,
    成本价_USD: a.costPrice,
    网络: a.network,
    添加时间: a.createdAt,
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(assetData), '资产')

  // Airdrops sheet
  const airdropData = airdropRows.map((a) => ({
    协议: a.protocol,
    网络: a.network,
    状态: a.status,
    预估价值_USD: a.estimatedValue,
    领取日期: a.claimDate ?? '',
    截止日期: a.deadline ?? '',
    备注: a.notes,
    记录时间: a.createdAt,
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(airdropData), '链上空投')

  // DeFi sheet
  const defiData = defiRows.map((d) => ({
    协议: d.protocol,
    网络: d.network,
    APY: `${d.apy}%`,
    本金_USD: d.principal,
    收益_USD: d.earnings,
    开始时间: d.startDate,
    状态: d.status,
    创建时间: d.createdAt,
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(defiData), '理财')

  // Activities sheet
  const activityData = activityRows.map((a) => ({
    类型: a.type,
    描述: a.description,
    时间: a.createdAt,
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activityData), '活动记录')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="crypto-tracker-${date}.xlsx"`,
    },
  })
}
