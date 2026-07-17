'use client'

import { cjk } from '@streamdown/cjk'
import { code } from '@streamdown/code'
import { math } from '@streamdown/math'
import { mermaid } from '@streamdown/mermaid'
import type { ComponentProps } from 'react'
import { Streamdown } from 'streamdown'
import { cn } from '~/lib/cn'

const plugins = { cjk, code, math, mermaid }

export function Message({
  from,
  className,
  ...props
}: ComponentProps<'article'> & { from: 'user' | 'assistant' | 'system' }) {
  return (
    <article
      data-role={from}
      className={cn(
        'group/message flex w-full',
        from === 'user' ? 'justify-end' : 'justify-start',
        className
      )}
      {...props}
    />
  )
}

export function MessageContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'max-w-[88%] min-w-0 text-sm leading-7',
        'group-data-[role=user]/message:bg-secondary group-data-[role=user]/message:rounded-2xl group-data-[role=user]/message:px-4 group-data-[role=user]/message:py-2',
        'group-data-[role=assistant]/message:w-full',
        className
      )}
      {...props}
    />
  )
}

export function MessageResponse({
  className,
  ...props
}: ComponentProps<typeof Streamdown>) {
  return (
    <Streamdown
      className={cn(
        'break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        className
      )}
      plugins={plugins}
      {...props}
    />
  )
}
