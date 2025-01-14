import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const useThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
  }

  if (!mounted) {
    return { theme: undefined, toggleTheme }
  }

  return { theme, toggleTheme }
}

