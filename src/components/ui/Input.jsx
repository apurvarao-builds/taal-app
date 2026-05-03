import { cn } from '../../lib/utils'

export function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-text-sub uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={cn(
          'bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-main placeholder-muted',
          'focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
          'transition-colors',
          error && 'border-red-500/60',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-text-sub uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-main placeholder-muted',
          'focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
          'transition-colors resize-none',
          error && 'border-red-500/60',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-text-sub uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={cn(
          'bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-main',
          'focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
          'transition-colors cursor-pointer',
          error && 'border-red-500/60',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
