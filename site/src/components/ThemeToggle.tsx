import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-2 text-mono text-[9px] uppercase tracking-widest hover:opacity-60 transition-opacity"
    >
      {isDark ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
      <span>{isDark ? 'LIGHT' : 'DARK'}</span>
    </button>
  )
}
