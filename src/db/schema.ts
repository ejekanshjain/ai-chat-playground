import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { commonFieldDefs } from './common'

export const usersTable = pgTable('users', {
  id: commonFieldDefs.id('user'),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: commonFieldDefs.date('ban_expires'),
  ...commonFieldDefs.dates
})

export const sessionsTable = pgTable('sessions', {
  id: commonFieldDefs.id('session'),
  expiresAt: commonFieldDefs.date('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
  ...commonFieldDefs.dates
})

export const accountsTable = pgTable('accounts', {
  id: commonFieldDefs.id('account'),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: commonFieldDefs.date('access_token_expires_at'),
  refreshTokenExpiresAt: commonFieldDefs.date('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  ...commonFieldDefs.dates
})

export const verificationsTable = pgTable('verifications', {
  id: commonFieldDefs.id('verification'),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: commonFieldDefs.date('expires_at').notNull(),
  ...commonFieldDefs.dates
})
