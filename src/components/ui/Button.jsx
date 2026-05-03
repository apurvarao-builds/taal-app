import { cn } from '../../lib/utils'

const variants = {
  primary:   'bg-gold text-bg font-semibold hover:bg-gold-light active:scale-[0.98]',
  secondary: 'bg-surface-2 text-text-main hover:bg-border active:scale-[0.98]',
  ghost:     'text-text-sub hover:text-text-main hover:bg-surface-2 active:scale-[0.98]',
  danger:    'bg-red-900/60 text-red-300 hover:bg-red-800/60 active:scale-[0.98]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
