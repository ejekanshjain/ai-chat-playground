import { ThreadPage } from '~/components/app/thread-page'

export default async function Page({
  params
}: {
  params: Promise<{ threadId: string }>
}) {
  const { threadId } = await params

  return <ThreadPage threadId={threadId} />
}
