import type { NextAuthConfig } from 'next-auth'

// Edge-compatible auth config (no Node.js APIs)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.pathname.startsWith('/login')
      if (!isLoggedIn && !isAuthPage) return false
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.name = token.name as string
      return session
    },
  },
  providers: [], // providers added in auth.ts (Node.js only)
  session: { strategy: 'jwt' },
}
