'use client'

import { useSession } from 'next-auth/react'
import { PriceTicker } from './price-ticker'

export function TopBar() {
  const { data: session } = useSession()

  return (
    <header className="h-14 border-b border-border bg-bg-card flex items-center justify-between px-4 shrink-0">
      {/* Price Ticker */}
      <div className="flex-1 overflow-hidden">
        <PriceTicker />
      </div>

      {/* User */}
      <div className="flex items-center gap-3 ml-4 shrink-0">
        <span className="text-xs text-text-muted hidden sm:block">
          {session?.user?.name}
        </span>
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
          {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
      </div>
    </header>
  )
}
