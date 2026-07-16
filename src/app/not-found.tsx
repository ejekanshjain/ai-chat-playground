'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '~/components/ui/button'

export default function NotFound() {
  const pathname = usePathname()
  const homeRoute = pathname?.startsWith('/admin') ? '/admin' : '/'

  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col">
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-foreground mb-2 text-6xl font-bold">404</h1>
          <p className="text-muted-foreground mb-8 text-xl">Page not found</p>
          <p className="text-muted-foreground mb-8 max-w-md text-base">
            The page you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href={homeRoute}>Return to Home</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
