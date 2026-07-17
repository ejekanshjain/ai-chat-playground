'use server'

import { and, asc, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/db'
import { threadMessagesTable, threadsTable } from '~/db/schema'
import { getAIModels } from '~/lib/ai-models'
import { authActionClient } from '~/lib/safe-action'

export const listThreadsAction = authActionClient.action(async ({ ctx }) => {
  return db.query.threadsTable.findMany({
    where: eq(threadsTable.userId, ctx.user.id),
    orderBy: desc(threadsTable.updatedAt)
  })
})

export const getThreadMessagesAction = authActionClient
  .inputSchema(z.object({ threadId: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const thread = await db.query.threadsTable.findFirst({
      where: and(
        eq(threadsTable.id, parsedInput.threadId),
        eq(threadsTable.userId, ctx.user.id)
      )
    })

    if (!thread) return null

    const messages = await db.query.threadMessagesTable.findMany({
      where: eq(threadMessagesTable.threadId, parsedInput.threadId),
      orderBy: asc(threadMessagesTable.createdAt)
    })

    return { thread, messages }
  })

export const deleteThreadAction = authActionClient
  .inputSchema(z.object({ threadId: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    await db
      .delete(threadsTable)
      .where(
        and(
          eq(threadsTable.id, parsedInput.threadId),
          eq(threadsTable.userId, ctx.user.id)
        )
      )
  })

export const listModelsAction = authActionClient
  .inputSchema(z.object({}))
  .action(async () => {
    return await getAIModels()
  })
