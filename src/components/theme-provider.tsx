'use client'

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { FC, useEffect } from 'react'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  )
}

function ThemeHotkey() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== 'd') {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      const nextTheme =
        theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'

      setTheme(nextTheme)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [setTheme, theme])

  return null
}

export const ThemeProvider: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}
