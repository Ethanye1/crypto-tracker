import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

// 本地开发：TURSO_DATABASE_URL=file:./data/crypto.db（无需 token）
// 生产环境：TURSO_DATABASE_URL=libsql://xxx.turso.io + TURSO_AUTH_TOKEN=xxx
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:./data/crypto.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
export type DB = typeof db
