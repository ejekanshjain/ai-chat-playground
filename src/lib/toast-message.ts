'use client'

import { toast } from 'sonner'

export const toastSuccessMessage = (message: string) =>
  toast.success(message, {
    richColors: true,
    position: 'top-center'
  })

export const toastErrorMessage = (message?: string) =>
  toast.error(message || 'Something went wrong. Please try again later.', {
    richColors: true,
    position: 'top-center'
  })
