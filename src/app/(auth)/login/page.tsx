import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { getAuthSession } from '~/lib/auth'
import { EmailLoginForm } from './email-login-form'
import { SocialLoginButtons } from './social-login-buttons'

export default async function LoginPage() {
  const authSession = await getAuthSession()

  if (authSession) redirect('/')

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <ShoppingBag className="text-primary size-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-muted-foreground/50 bg-muted/50 rounded-lg border border-dashed p-4">
            <p className="text-muted-foreground text-sm">
              <strong>New to our site?</strong> No need to create a separate
              account. Simply use one of the options below to both sign up and
              log in.
            </p>
          </div>

          <EmailLoginForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>

          <SocialLoginButtons />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator className="my-2" />
          <div className="text-muted-foreground text-center text-sm">
            <Link
              href="/"
              className="text-primary underline-offset-4 hover:underline"
            >
              Return to home page
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
