'use client'

import { DefaultChatTransport, type UIMessage } from 'ai'
import { useChat } from '@ai-sdk/react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowUpIcon,
  BotIcon,
  CircleStopIcon,
  RotateCcwIcon,
  SparklesIcon
} from 'lucide-react'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '~/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse
} from '~/components/ai-elements/message'
import { Button } from '~/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea
} from '~/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Spinner } from '~/components/ui/spinner'
import {
  getThreadMessagesAction,
  listModelsAction,
  createThreadAction
} from '~/app/(app)/app/actions'
import {
  useSafeActionMutation,
  useSafeActionQuery
} from '~/lib/safe-action-client'

export function ThreadPage({ threadId }: { threadId?: string }) {
  const threadQuery = useSafeActionQuery(
    'thread',
    getThreadMessagesAction,
    {
      threadId: threadId ?? ''
    },
    {
      enabled: threadId !== undefined
    }
  )
  const modelsQuery = useSafeActionQuery('models', listModelsAction, {})

  if (threadId && threadQuery.isLoading) return <ThreadLoading />
  if (threadId && !threadQuery.data) return <ThreadUnavailable />

  return (
    <ChatThread
      key={threadId ?? 'new'}
      initialThreadId={threadId}
      initialMessages={(threadQuery.data?.messages ?? []) as UIMessage[]}
      models={modelsQuery.data ?? []}
      modelsLoading={modelsQuery.isLoading}
      modelsError={modelsQuery.isError}
    />
  )
}

function ChatThread({
  initialThreadId,
  initialMessages,
  models,
  modelsLoading,
  modelsError
}: {
  initialThreadId?: string
  initialMessages: UIMessage[]
  models: { id: string; name: string }[]
  modelsLoading: boolean
  modelsError: boolean
}) {
  const [input, setInput] = useState('')
  const [model, setModel] = useState<string>()
  const queryClient = useQueryClient()
  const createThread = useSafeActionMutation(createThreadAction)
  const threadIdRef = useRef(initialThreadId)
  const createThreadRef = useRef(createThread.mutateAsync)
  const selectedModel = model ?? models[0]?.id
  const selectedModelRef = useRef(selectedModel)

  createThreadRef.current = createThread.mutateAsync
  selectedModelRef.current = selectedModel

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        prepareSendMessagesRequest: async ({ messages }) => {
          const message = messages.at(-1)
          const activeModel = selectedModelRef.current

          if (!message || !activeModel) throw new Error('A model is required')

          let activeThreadId = threadIdRef.current

          if (!activeThreadId) {
            activeThreadId = await createThreadRef.current({
              title: createThreadTitle(message)
            })

            if (!activeThreadId) throw new Error('Failed to create thread')

            threadIdRef.current = activeThreadId
            window.history.replaceState(null, '', `/app/${activeThreadId}`)
            void queryClient.invalidateQueries({ queryKey: ['threads'] })
          }

          return {
            body: {
              threadId: activeThreadId,
              model: activeModel,
              message
            }
          }
        }
      }),
    [queryClient]
  )
  const { clearError, error, messages, regenerate, sendMessage, status, stop } =
    useChat({
      id: initialThreadId ?? 'new-chat',
      messages: initialMessages,
      transport,
      onFinish: () => {
        void queryClient.invalidateQueries({ queryKey: ['threads'] })
        const activeThreadId = threadIdRef.current
        if (activeThreadId) {
          void queryClient.invalidateQueries({
            queryKey: ['thread', { threadId: activeThreadId }]
          })
        }
      },
      onError: () =>
        toast.error('The response could not be completed. Try again.')
    })
  const isGenerating = status === 'submitted' || status === 'streaming'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text || isGenerating || !selectedModel) return

    sendMessage({ text })
    setInput('')
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <Conversation>
        <ConversationContent
          className={
            messages.length === 0 ? 'h-full justify-center' : undefined
          }
        >
          {messages.length === 0 ? (
            <EmptyChat />
          ) : (
            <MessageList messages={messages} isGenerating={isGenerating} />
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="bg-background shrink-0 px-3 pt-2 pb-3 md:px-8 md:pb-5">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <InputGroup className="rounded-2xl shadow-sm">
            <InputGroupTextarea
              autoFocus
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (
                  event.key === 'Enter' &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder={
                modelsError
                  ? 'Models could not be loaded'
                  : 'Message AI Playground'
              }
              rows={1}
              disabled={isGenerating || !selectedModel}
              aria-label="Message"
              className="max-h-40 min-h-12"
            />
            <InputGroupAddon
              align="block-end"
              className="justify-between gap-3"
            >
              <Select
                value={selectedModel}
                onValueChange={setModel}
                disabled={modelsLoading || modelsError || models.length === 0}
              >
                <SelectTrigger
                  size="sm"
                  className="max-w-56 border-0 bg-transparent shadow-none"
                  aria-label="AI model"
                >
                  <SparklesIcon />
                  <SelectValue
                    placeholder={
                      modelsLoading
                        ? 'Loading models…'
                        : modelsError
                          ? 'Models unavailable'
                          : 'Select a model'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {models.map(modelOption => (
                      <SelectItem key={modelOption.id} value={modelOption.id}>
                        {modelOption.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {isGenerating ? (
                <InputGroupButton
                  size="icon-sm"
                  variant="secondary"
                  onClick={stop}
                  aria-label="Stop generating"
                >
                  <CircleStopIcon />
                </InputGroupButton>
              ) : (
                <InputGroupButton
                  type="submit"
                  size="icon-sm"
                  variant="default"
                  disabled={!input.trim() || !selectedModel}
                  aria-label="Send message"
                >
                  <ArrowUpIcon />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>
          <p className="text-muted-foreground mt-2 text-center text-xs">
            AI can make mistakes. Check important information.
          </p>
        </form>
        {error ? (
          <div
            className="bg-destructive/10 text-destructive mx-auto mt-2 flex max-w-3xl items-center justify-between rounded-md px-3 py-2 text-sm"
            role="alert"
          >
            <span>The response could not be completed.</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearError()
                regenerate()
              }}
            >
              <RotateCcwIcon data-icon="inline-start" />
              Retry
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function createThreadTitle(message: UIMessage) {
  const title = message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')

  if (title.length <= 64) return title

  return `${title.slice(0, 61).trimEnd()}...`
}

function EmptyChat() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-12 text-center">
      <div className="bg-primary text-primary-foreground mb-4 flex size-12 items-center justify-center rounded-2xl shadow-sm">
        <BotIcon />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        What can I help you with?
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        Ask a question, explore an idea, or start writing.
      </p>
    </div>
  )
}

function MessageList({
  messages,
  isGenerating
}: {
  messages: UIMessage[]
  isGenerating: boolean
}) {
  return (
    <>
      {messages.map((message, messageIndex) => {
        const isLastAssistantMessage =
          isGenerating &&
          message.role === 'assistant' &&
          messageIndex === messages.length - 1

        return (
          <Message key={message.id} from={message.role}>
            <MessageContent>
              {message.parts.map((part, index) =>
                part.type === 'text' ? (
                  <MessageResponse
                    key={`${message.id}-${index}`}
                    caret={isLastAssistantMessage ? 'block' : undefined}
                    isAnimating={isLastAssistantMessage}
                    mode={isLastAssistantMessage ? 'streaming' : 'static'}
                  >
                    {part.text}
                  </MessageResponse>
                ) : null
              )}
            </MessageContent>
          </Message>
        )
      })}
      {isGenerating && messages.at(-1)?.role === 'user' ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Spinner />
          Thinking…
        </div>
      ) : null}
    </>
  )
}

function ThreadLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  )
}

function ThreadUnavailable() {
  return (
    <div className="text-muted-foreground flex h-full items-center justify-center px-6 text-center text-sm">
      This chat is unavailable or you do not have access to it.
    </div>
  )
}
