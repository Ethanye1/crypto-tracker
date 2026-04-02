import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import type { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

export async function proxy(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (auth as any)(req)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
}
