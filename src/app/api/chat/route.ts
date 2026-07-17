import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
  validateUIMessages
} from 'ai'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '~/db'
import { threadMessagesTable, threadsTable } from '~/db/schema'
import { getAIModels } from '~/lib/ai-models'
import { getAuthSession } from '~/lib/auth'

const requestSchema = z.object({
  threadId: z.string(),
  model: z.string(),
  message: z.object({
    id: z.string(),
    role: z.enum(['user']),
    parts: z.array(z.looseObject({}))
  })
})

const generateTitle = (message: UIMessage) => {
  const text = message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join(' ')
    .trim()

  return text.length > 60 ? `${text.slice(0, 60)}…` : text || 'New chat'
}

export async function POST(req: Request) {
  const authSession = await getAuthSession()

  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsedBody = requestSchema.safeParse(await req.json())

  if (!parsedBody.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { threadId, model, message } = parsedBody.data

  let thread = await db.query.threadsTable.findFirst({
    where: eq(threadsTable.id, threadId)
  })

  if (thread && thread.userId !== authSession.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!thread) {
    ;[thread] = await db
      .insert(threadsTable)
      .values({
        id: threadId,
        userId: authSession.user.id,
        title: generateTitle(message as UIMessage)
      })
      .returning()

    if (!thread)
      return NextResponse.json(
        { error: 'Failed to create thread' },
        { status: 500 }
      )
  }

  const aiModels = await getAIModels()
  const modelExists = aiModels.some(aiModel => aiModel)

  if (!modelExists) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 })
  }

  const dbMessages = await db.query.threadMessagesTable.findMany({
    where: eq(threadMessagesTable.threadId, threadId),
    orderBy: asc(threadMessagesTable.updatedAt)
  })

  let messages = dbMessages.map(
    message =>
      ({
        id: message.id,
        role: message.role,
        parts: message.parts,
        metadata: message.metadata
      }) as UIMessage
  )

  messages.push(message as UIMessage)

  try {
    messages = await validateUIMessages({
      messages
    })
  } catch {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  const newUserMessage = messages.at(-1)

  if (!newUserMessage || newUserMessage.role !== 'user') {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  await db.insert(threadMessagesTable).values({
    id: newUserMessage.id,
    threadId,
    role: 'user',
    parts: newUserMessage.parts
  })

  const llmStream = streamText({
    model,
    messages: await convertToModelMessages(messages)
  })

  llmStream.consumeStream()

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: llmStream.stream,
      originalMessages: messages,
      generateMessageId: () => threadMessagesTable.id.defaultFn!().toString(),
      onEnd: async ({ responseMessage }) => {
        await Promise.all([
          db.insert(threadMessagesTable).values({
            id: responseMessage.id,
            threadId,
            role: 'assistant',
            model,
            parts: responseMessage.parts,
            metadata: responseMessage.metadata
          }),
          db
            .update(threadsTable)
            .set({ updatedAt: new Date() })
            .where(eq(threadsTable.id, threadId))
        ])
      }
    })
  })
}
