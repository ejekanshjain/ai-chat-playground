import { createSafeActionClient } from 'next-safe-action'
import { getAuthSession } from './auth'
import { recordWideEvent } from './otel'

export const actionClient = createSafeActionClient().use(
  async ({ next, ctx }) => {
    const authSession = await getAuthSession()

    if (authSession)
      recordWideEvent({
        'user.id': authSession.user.id,
        'user.admin': authSession.isAdmin,
        'session.id': authSession.session.id
      })

    return next({
      ctx: {
        ...ctx,
        ...authSession
      }
    })
  }
)

export const authActionClient = actionClient.use(async ({ ctx, next }) => {
  if (!ctx?.user || !ctx?.session) {
    throw new Error('Unauthorized')
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session
    }
  })
})

export const adminActionClient = authActionClient.use(async ({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new Error('Forbidden')
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session
    }
  })
})
