export type AssetStatus = 'active' | 'inactive'
export type AirdropStatus = 'pending' | 'claimed' | 'expired'
export type DefiStatus = 'active' | 'paused' | 'ended'

export interface Asset {
  id: number
  userId: string
  symbol: string
  name: string
  amount: number
  costPrice: number
  network: string
  createdAt: string
}

export interface AssetWithValue extends Asset {
  currentPrice: number
  currentValue: number
  pnl: number
  pnlPercent: number
}

export interface Airdrop {
  id: number
  userId: string
  protocol: string
  network: string
  status: AirdropStatus
  estimatedValue: number
  claimDate: string | null
  deadline: string | null
  notes: string
  createdAt: string
}

export interface DefiPosition {
  id: number
  userId: string
  protocol: string
  network: string
  apy: number
  principal: number
  earnings: number
  startDate: string
  status: DefiStatus
  createdAt: string
}

export interface Activity {
  id: number
  userId: string
  type: string
  description: string
  relatedId: number | null
  createdAt: string
}

export interface PriceData {
  symbol: string
  name: string
  price: number
  change24h: number
}

export interface PricesMap {
  BTC: PriceData
  ETH: PriceData
  SOL: PriceData
  BNB: PriceData
  ADA: PriceData
}

export interface DashboardStats {
  totalAssetValue: number
  totalCost: number
  totalPnl: number
  totalPnlPercent: number
  assetUtilization: number
  defiValue: number
  airdropValue: number
  dailyReturn: number
  weeklyReturn: number
  monthlyReturn: number
}
