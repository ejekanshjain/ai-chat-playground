'use client'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const nextTheme =
    theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Theme: ${theme ?? 'system'}. Switch to ${nextTheme}`}
      title={`Switch to ${nextTheme} theme`}
      onClick={() => setTheme(nextTheme)}
    >
      {theme === 'light' ? (
        <SunIcon />
      ) : theme === 'dark' ? (
        <MoonIcon />
      ) : (
        <MonitorIcon />
      )}
    </Button>
  )
}
