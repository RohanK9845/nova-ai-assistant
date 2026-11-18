import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      className="theme-button"
      onClick={onToggle}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}

export default ThemeToggle