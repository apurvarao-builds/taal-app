import { cn, CATEGORIES, ENTRY_TYPES } from '../../lib/utils'

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium transition-all',
        active
          ? 'bg-gold text-bg'
          : 'bg-surface-2 text-text-sub hover:text-text-main hover:bg-border',
      )}
    >
      {children}
    </button>
  )
}

export function EntryFilters({ filters, onChange }) {
  const { category, entryType } = filters

  function toggleCategory(c) {
    onChange({ ...filters, category: category === c ? '' : c })
  }

  function toggleType(t) {
    onChange({ ...filters, entryType: entryType === t ? '' : t })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <Pill key={c} active={category === c} onClick={() => toggleCategory(c)}>
            {c}
          </Pill>
        ))}
      </div>
      <div className="flex gap-1.5">
        {ENTRY_TYPES.map((t) => (
          <Pill key={t} active={entryType === t} onClick={() => toggleType(t)}>
            {t}
          </Pill>
        ))}
      </div>
    </div>
  )
}
