import { useState } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { AudioPlayer } from '../ui/AudioPlayer'
import { LAYA_COLORS, PERFORMER_COLORS, formatDuration } from '../../lib/utils'
import { format, parseISO } from 'date-fns'

function formatTimestamp(ts) {
  if (!ts) return ''
  try {
    return format(parseISO(ts), 'dd MMM yyyy')
  } catch {
    return ts
  }
}

export function BolCard({ recording, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!window.confirm('Delete this recording? This cannot be undone.')) return
    setDeleting(true)
    try { await onDelete(recording.id) }
    finally { setDeleting(false) }
  }

  const hasExpandable = recording.notes || recording.audio_path

  return (
    <article className="bg-surface border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-main truncate">{recording.bol_name}</h3>
            <p className="text-xs text-muted mt-0.5">{formatTimestamp(recording.created_at)}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(recording)}
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

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <Badge className={LAYA_COLORS[recording.laya]}>{recording.laya}</Badge>
          <Badge className={PERFORMER_COLORS[recording.performer]}>{recording.performer}</Badge>
          {recording.duration_sec > 0 && (
            <Badge className="bg-surface-2 text-muted">
              {formatDuration(recording.duration_sec)}
            </Badge>
          )}
        </div>
      </div>

      {hasExpandable && (
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
              {recording.notes && (
                <p className="text-sm text-text-sub whitespace-pre-wrap leading-relaxed pt-3">
                  {recording.notes}
                </p>
              )}
              {recording.audio_path && (
                <div className="pt-1">
                  <AudioPlayer audioPath={recording.audio_path} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </article>
  )
}
