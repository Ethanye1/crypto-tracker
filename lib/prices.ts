import type { PricesMap } from './types'

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,cardano&vs_currencies=usd&include_24hr_change=true'

const ID_MAP: Record<string, { symbol: keyof PricesMap; name: string }> = {
  bitcoin: { symbol: 'BTC', name: 'Bitcoin' },
  ethereum: { symbol: 'ETH', name: 'Ethereum' },
  solana: { symbol: 'SOL', name: 'Solana' },
  binancecoin: { symbol: 'BNB', name: 'BNB' },
  cardano: { symbol: 'ADA', name: 'Cardano' },
}

export async function fetchPrices(): Promise<PricesMap> {
  const res = await fetch(COINGECKO_URL, {
    next: { revalidate: 30 },
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status}`)
  }

  const data = await res.json()

  const prices = {} as PricesMap

  for (const [id, meta] of Object.entries(ID_MAP)) {
    const raw = data[id]
    prices[meta.symbol] = {
      symbol: meta.symbol,
      name: meta.name,
      price: raw?.usd ?? 0,
      change24h: raw?.usd_24h_change ?? 0,
    }
  }

  return prices
}
