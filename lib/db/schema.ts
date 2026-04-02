import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const assets = sqliteTable('assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  symbol: text('symbol').notNull(),
  name: text('name').notNull(),
  amount: real('amount').notNull(),
  costPrice: real('cost_price').notNull(),
  network: text('network').notNull().default(''),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const airdrops = sqliteTable('airdrops', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  protocol: text('protocol').notNull(),
  network: text('network').notNull().default(''),
  status: text('status', { enum: ['pending', 'claimed', 'expired'] }).notNull().default('pending'),
  estimatedValue: real('estimated_value').notNull().default(0),
  claimDate: text('claim_date'),
  deadline: text('deadline'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const defiPositions = sqliteTable('defi_positions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  protocol: text('protocol').notNull(),
  network: text('network').notNull().default(''),
  apy: real('apy').notNull().default(0),
  principal: real('principal').notNull(),
  earnings: real('earnings').notNull().default(0),
  startDate: text('start_date').notNull(),
  status: text('status', { enum: ['active', 'paused', 'ended'] }).notNull().default('active'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  description: text('description').notNull(),
  relatedId: integer('related_id'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
})
