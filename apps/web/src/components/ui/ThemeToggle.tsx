import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export default function ThemeToggle({
  className = '',
  showLabel = false,
  size = 'md',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const iconSize = size === 'sm' ? 15 : 18

  return (
    <button
      type="button"
      onClick={toggleTheme}
      id="theme-toggle-btn"
      className={`inline-flex items-center gap-2 rounded-xl border transition-base active:scale-95 ${
        showLabel ? 'px-3 py-2 text-xs font-semibold w-full justify-between' : 'p-2'
      } ${className}`}
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      }}
      aria-label={isDark ? 'Beralih ke mode terang (Light Mode)' : 'Beralih ke mode gelap (Dark Mode)'}
      title={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center w-6 h-6 rounded-lg transition-transform duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(255, 200, 87, 0.15)' : 'rgba(2, 132, 199, 0.12)',
            color: isDark ? 'var(--color-warning)' : 'var(--color-cyan)',
          }}
        >
          {isDark ? (
            <Sun size={iconSize} className="transition-transform duration-300 rotate-0" aria-hidden="true" />
          ) : (
            <Moon size={iconSize} className="transition-transform duration-300 rotate-0" aria-hidden="true" />
          )}
        </span>
        {showLabel && (
          <span className="font-medium text-xs" style={{ color: 'var(--color-text)' }}>
            {isDark ? 'Mode Terang' : 'Mode Gelap'}
          </span>
        )}
      </div>

      {showLabel && (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-muted)' }}>
          {isDark ? 'Aktif: Gelap' : 'Aktif: Terang'}
        </span>
      )}
    </button>
  )
}
