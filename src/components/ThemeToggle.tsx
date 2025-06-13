import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button variant='ghost' size='icon' onClick={toggleTheme}>
      {theme === 'light' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
