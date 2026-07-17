import { redirect } from 'next/navigation'
import { AppShell } from '~/components/app/app-shell'
import { getAuthSession } from '~/lib/auth'

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const authSession = await getAuthSession()

  if (!authSession) {
    return redirect('/login')
  }

  return <AppShell>{children}</AppShell>
}
