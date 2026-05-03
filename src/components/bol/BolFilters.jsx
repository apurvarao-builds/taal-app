import { cn, LAYAS, PERFORMERS } from '../../lib/utils'

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

export function BolFilters({ filters, onChange }) {
  const { laya, performer } = filters

  function toggleLaya(l) {
    onChange({ ...filters, laya: laya === l ? '' : l })
  }

  function togglePerformer(p) {
    onChange({ ...filters, performer: performer === p ? '' : p })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {LAYAS.map((l) => (
          <Pill key={l} active={laya === l} onClick={() => toggleLaya(l)}>
            {l}
          </Pill>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PERFORMERS.map((p) => (
          <Pill key={p} active={performer === p} onClick={() => togglePerformer(p)}>
            {p}
          </Pill>
        ))}
      </div>
    </div>
  )
}
