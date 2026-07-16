'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { FC } from 'react'
import { Button } from './ui/button'

export const ThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="hidden h-5 w-5 dark:inline" />
      <Moon className="inline h-5 w-5 dark:hidden" />
    </Button>
  )
}
