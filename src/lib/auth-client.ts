'use client'

import {
  adminClient,
  inferAdditionalFields,
  lastLoginMethodClient,
  magicLinkClient
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from './auth'

export const { signIn, signOut, useSession, getLastUsedLoginMethod } =
  createAuthClient({
    plugins: [
      inferAdditionalFields<typeof auth>(),
      magicLinkClient(),
      adminClient(),
      lastLoginMethodClient()
    ]
  })
