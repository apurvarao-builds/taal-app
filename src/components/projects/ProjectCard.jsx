import { useNavigate } from 'react-router-dom'
import { FolderOpen, Pencil, Trash2, ArrowRight } from 'lucide-react'
import { formatDate } from '../../lib/utils'

export function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate()

  async function handleDelete(e) {
    e.stopPropagation()
    if (!window.confirm(`Delete "${project.name}"? Linked journal entries will be unlinked but not deleted.`)) return
    await onDelete(project.id)
  }

  return (
    <article
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-surface border border-border rounded-xl p-4 cursor-pointer hover:border-gold/30 hover:bg-surface/80 transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0">
            <FolderOpen size={15} className="text-gold" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-text-main truncate group-hover:text-gold transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-muted mt-0.5">Created {formatDate(project.created_at.split('T')[0])}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(project) }}
            className="p-1.5 rounded-md text-muted hover:text-text-main hover:bg-surface-2 transition-colors"
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-text-sub mt-3 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center justify-end mt-3 text-xs text-muted group-hover:text-gold/60 transition-colors">
        <span className="flex items-center gap-1">
          View entries <ArrowRight size={11} />
        </span>
      </div>
    </article>
  )
}
