'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { signIn } from '~/lib/auth-client'
import { toastErrorMessage, toastSuccessMessage } from '~/lib/toast-message'

const emailLoginFormSchema = z.object({
  email: z.email()
})

export const EmailLoginForm = () => {
  const form = useForm<z.infer<typeof emailLoginFormSchema>>({
    resolver: zodResolver(emailLoginFormSchema),
    defaultValues: {
      email: ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState('')

  async function onSubmit(values: z.infer<typeof emailLoginFormSchema>) {
    const email = values.email

    if (!email) return

    setIsLoading(true)
    try {
      const res = await signIn.magicLink({
        email,
        name: ''
      })
      if (res?.error) throw res.error
      setIsSent(email)
      toastSuccessMessage('Magic link sent! Check your email.')
    } catch (err) {
      console.error('Error sending magic link:', err)
      if (
        typeof err === 'object' &&
        err &&
        'message' in err &&
        typeof err.message === 'string'
      )
        toastErrorMessage(err.message)
      else toastErrorMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="rounded-lg border p-4 text-center">
        <Mail className="text-primary mx-auto mb-2 size-6" />
        <h3 className="mb-1 text-sm font-medium">Check your email</h3>
        <p className="text-muted-foreground text-xs">
          We&apos;ve sent a magic link to <strong>{isSent}</strong>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoCapitalize="off"
                autoComplete="email"
                autoFocus
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </FieldContent>
          </Field>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Magic Link'}
      </Button>
    </form>
  )
}
