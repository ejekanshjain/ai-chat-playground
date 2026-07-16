import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    APP_ENV: z.enum(['development', 'staging', 'production']),
    ANALYZE: z.string().optional(),
    DATABASE_URL: z.url(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_GITHUB_ID: z.string(),
    BETTER_AUTH_GITHUB_SECRET: z.string(),
    BETTER_AUTH_GOOGLE_ID: z.string(),
    BETTER_AUTH_GOOGLE_SECRET: z.string(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.string(),
    EMAIL_FROM: z.email()
  },

  client: {},

  runtimeEnv: {
    APP_ENV: process.env.APP_ENV,
    ANALYZE: process.env.ANALYZE,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_GITHUB_ID: process.env.BETTER_AUTH_GITHUB_ID,
    BETTER_AUTH_GITHUB_SECRET: process.env.BETTER_AUTH_GITHUB_SECRET,
    BETTER_AUTH_GOOGLE_ID: process.env.BETTER_AUTH_GOOGLE_ID,
    BETTER_AUTH_GOOGLE_SECRET: process.env.BETTER_AUTH_GOOGLE_SECRET,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM
  },

  emptyStringAsUndefined: true
})
