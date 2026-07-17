'use client'

import {
  MenuIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Spinner } from '~/components/ui/spinner'
import { cn } from '~/lib/cn'
import {
  useSafeActionMutation,
  useSafeActionQuery
} from '~/lib/safe-action-client'
import { deleteThreadAction, listThreadsAction } from '~/app/(app)/app/actions'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [threadToDelete, setThreadToDelete] = useState<string>()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const threadsQuery = useSafeActionQuery(
    'threads',
    listThreadsAction,
    undefined
  )
  const deleteThread = useSafeActionMutation(deleteThreadAction, {
    onSuccess: (_, variables) => {
      void threadsQuery.refetch()
      if (pathname === `/app/${variables.threadId}`) router.replace('/app/new')
      setThreadToDelete(undefined)
      toast.success('Chat deleted')
    },
    onError: () => toast.error('Could not delete this chat')
  })

  const sidebar = (
    <>
      <div className="flex items-center gap-2 p-3">
        <Button className="flex-1 justify-start" asChild>
          <Link href="/app/new">
            <PlusIcon data-icon="inline-start" />
            New chat
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      <nav
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-3"
        aria-label="Chat history"
      >
        <p className="text-muted-foreground px-2 pt-3 pb-1 text-xs font-medium">
          Your chats
        </p>
        {threadsQuery.isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : null}
        {threadsQuery.data?.map(thread => {
          const href = `/app/${thread.id}`
          const isActive = pathname === href
          return (
            <div key={thread.id} className="group flex items-center gap-1">
              <Button
                variant="ghost"
                className={cn(
                  'min-w-0 flex-1 justify-start font-normal',
                  isActive && 'bg-sidebar-accent'
                )}
                asChild
              >
                <Link href={href} className="truncate">
                  {thread.title ?? 'Untitled chat'}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label={`Options for ${thread.title ?? 'chat'}`}
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => setThreadToDelete(thread.id)}
                    >
                      <Trash2Icon />
                      Delete chat
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })}
        {!threadsQuery.isLoading && threadsQuery.data?.length === 0 ? (
          <p className="text-muted-foreground px-2 py-3 text-sm">
            Your conversations will appear here.
          </p>
        ) : null}
      </nav>
    </>
  )

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <aside className="bg-sidebar hidden w-72 shrink-0 flex-col border-r md:flex">
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 md:hidden">
          <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <MenuIcon />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="top-0 left-0 flex h-dvh w-72 max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-0"
              onClick={event => {
                if ((event.target as HTMLElement).closest('a')) {
                  setMobileNavOpen(false)
                }
              }}
            >
              <DialogHeader className="sr-only">
                <DialogTitle>Chat navigation</DialogTitle>
                <DialogDescription>
                  Start a new chat or open a previous conversation.
                </DialogDescription>
              </DialogHeader>
              {sidebar}
            </DialogContent>
          </Dialog>
          <span className="text-sm font-medium">AI Playground</span>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/app/new" aria-label="New chat">
              <PlusIcon />
            </Link>
          </Button>
        </header>
        <main className="min-h-0 flex-1">{children}</main>
      </div>

      <Dialog
        open={threadToDelete !== undefined}
        onOpenChange={open => !open && setThreadToDelete(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this chat?</DialogTitle>
            <DialogDescription>
              This permanently removes the conversation and all of its messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setThreadToDelete(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!threadToDelete || deleteThread.isPending}
              onClick={() =>
                threadToDelete &&
                deleteThread.mutate({ threadId: threadToDelete })
              }
            >
              {deleteThread.isPending ? <Spinner /> : null}
              Delete chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
