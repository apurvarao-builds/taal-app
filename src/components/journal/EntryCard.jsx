import { useState } from 'react'
import { Mic, Pencil, Trash2, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { AudioPlayer } from '../ui/AudioPlayer'
import { CATEGORY_COLORS, TYPE_COLORS, formatDate, formatDuration } from '../../lib/utils'

export function EntryCard({ entry, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return
    setDeleting(true)
    try { await onDelete(entry.id) }
    finally { setDeleting(false) }
  }

  return (
    <article className="bg-surface border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors">
      {/* Top row */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-main truncate">{entry.title}</h3>
            <p className="text-xs text-muted mt-0.5">{formatDate(entry.entry_date)}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {entry.audio_path && (
              <span className="text-gold/70" title="Has recording">
                <Mic size={13} />
              </span>
            )}
            <button
              onClick={() => onEdit(entry)}
              className="p-1.5 rounded-md text-muted hover:text-text-main hover:bg-surface-2 transition-colors"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-40"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <Badge className={CATEGORY_COLORS[entry.category]}>{entry.category}</Badge>
          <Badge className={TYPE_COLORS[entry.entry_type]}>{entry.entry_type}</Badge>
          {entry.projects?.name && (
            <Badge className="bg-surface-2 text-text-sub gap-1">
              <FolderOpen size={10} />
              {entry.projects.name}
            </Badge>
          )}
          {entry.duration_sec > 0 && (
            <Badge className="bg-surface-2 text-muted">
              {formatDuration(entry.duration_sec)}
            </Badge>
          )}
        </div>
      </div>

      {/* Expandable notes + audio */}
      {(entry.notes || entry.audio_path) && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2 border-t border-border/60 text-xs text-muted hover:text-text-sub hover:bg-surface-2/40 transition-colors"
          >
            <span>{expanded ? 'Hide details' : 'Show details'}</span>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {expanded && (
            <div className="px-4 pb-4 space-y-3 border-t border-border/60">
              {entry.notes && (
                <p className="text-sm text-text-sub whitespace-pre-wrap leading-relaxed pt-3">
                  {entry.notes}
                </p>
              )}
              {entry.audio_path && (
                <AudioPlayer audioPath={entry.audio_path} />
              )}
            </div>
          )}
        </>
      )}
    </article>
  )
}
