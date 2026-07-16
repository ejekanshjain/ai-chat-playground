'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'

export const ReactQueryProvider: FC<{
  children?: ReactNode
}> = ({ children }) => {
  const client = new QueryClient({})

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
