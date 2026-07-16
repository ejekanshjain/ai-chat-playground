import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { boolean, timestamp, varchar } from 'drizzle-orm/pg-core'

export const commonFieldDefs = {
  id: (prefix: string) =>
    varchar('id')
      .primaryKey()
      .$defaultFn(() => prefix + '_' + createId()),
  date: (name: string) =>
    timestamp(name, {
      mode: 'date',
      withTimezone: true
    }),
  dates: {
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .$onUpdate(() => sql`NOW()`)
      .defaultNow()
  },
  isActive: boolean('is_active').notNull().default(true)
}
