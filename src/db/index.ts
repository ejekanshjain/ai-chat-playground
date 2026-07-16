import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '~/env'
import * as schema from './schema'

// In development, Next.js hot-reloading can re-evaluate modules frequently.
// Keep a single postgres-js client on `globalThis` to avoid opening multiple
// database connections during local development.
const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>
}

// Prefer the cached client (dev) and fall back to creating a new one.
// `max: 1` limits the pool size, and `prepare: false` disables prepared
// statements for compatibility with environments where prepared statements
// can be problematic.
const client =
  globalForDb.client ??
  postgres(env.DATABASE_URL, {
    max: 1,
    prepare: false
  })

// Only cache the client outside production to avoid unexpected cross-request
// state retention in long-lived production processes.
if (env.APP_ENV !== 'production') globalForDb.client = client

/**
 * Drizzle ORM database client for PostgreSQL.
 *
 * Backed by a postgres-js client configured via `env.DATABASE_URL`, and wired
 * up with schema + relations so you get typed query helpers.
 *
 * Use this instance throughout the app for all database operations.
 *
 * @example
 * const users = await db.query.usersTable.findMany()
 * const newUser = await db.insert(usersTable).values({ email: 'user@example.com' })
 *
 * @example
 * await db.transaction(async (tx) => {
 *   await tx.insert(usersTable).values({ email: 'user@example.com' })
 * })
 */
export const db = drizzle(client, {
  schema: { ...schema }
})

/** The transaction client type passed into `db.transaction(async (tx) => ...)`. */
export type DbTx = Parameters<Parameters<(typeof db)['transaction']>[0]>[0]
