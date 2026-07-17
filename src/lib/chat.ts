import { createId } from '@paralleldrive/cuid2'

export const generateThreadId = () => `thread_${createId()}`

export const generateMessageId = () => `msg_${createId()}`
