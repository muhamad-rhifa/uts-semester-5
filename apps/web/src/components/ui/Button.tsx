import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const styles = {
  primary: 'font-semibold text-black hover:opacity-90 active:scale-[0.98]',
  secondary: 'font-medium border hover:opacity-80 active:scale-[0.98]',
  danger: 'font-medium hover:opacity-80 active:scale-[0.98]',
  ghost: 'font-medium hover:opacity-70',
} as const

const bgStyles = {
  primary: { backgroundColor: 'var(--color-neon)', color: '#0a0a0a' },
  secondary: { backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)', borderColor: 'var(--color-border)' },
  danger: { backgroundColor: 'rgba(255,100,124,0.12)', color: 'var(--color-danger)', border: '1px solid rgba(255,100,124,0.3)' },
  ghost: { color: 'var(--color-muted)' },
} as const

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
} as const

export default function Button({ variant = 'primary', size = 'md', className = '', children, disabled, style, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-base ${styles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{ ...bgStyles[variant], ...style }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
