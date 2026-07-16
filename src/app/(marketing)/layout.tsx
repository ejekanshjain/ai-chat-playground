import { SiteFooter } from '~/components/site-footer'

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col space-y-4">
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
