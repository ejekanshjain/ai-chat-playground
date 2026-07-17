'use client'

import { ArrowDownIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/cn'

export function Conversation({
  className,
  ...props
}: ComponentProps<typeof StickToBottom>) {
  return (
    <StickToBottom
      className={cn('relative min-h-0 flex-1', className)}
      initial="smooth"
      resize="smooth"
      role="log"
      {...props}
    />
  )
}

export function ConversationContent({
  className,
  ...props
}: ComponentProps<typeof StickToBottom.Content>) {
  return (
    <StickToBottom.Content
      className={cn(
        'mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 py-8 md:px-8',
        className
      )}
      {...props}
    />
  )
}

export function ConversationScrollButton() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  if (isAtBottom) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="absolute right-1/2 bottom-3 translate-x-1/2 rounded-full shadow-sm"
      onClick={() => scrollToBottom()}
      aria-label="Scroll to latest message"
    >
      <ArrowDownIcon />
    </Button>
  )
}
