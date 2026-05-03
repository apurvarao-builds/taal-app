import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, FolderOpen } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { useJournalEntries } from '../hooks/useJournalEntries'
import { EntryCard } from '../components/journal/EntryCard'
import { EntryForm } from '../components/journal/EntryForm'
import { ProjectForm } from '../components/projects/ProjectForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { formatDate } from '../lib/utils'

export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { projects, updateProject } = useProjects()
  const project = projects.find((p) => p.id === id)

  const { entries, loading, createEntry, updateEntry, deleteEntry } =
    useJournalEntries({ projectId: id })

  const [entryModalOpen, setEntryModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  function toast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  async function handleEntrySubmit(fields, audioBlob) {
    setSubmitting(true)
    try {
      // Pre-fill project_id
      const enriched = { ...fields, project_id: id }
      if (editEntry) {
        await updateEntry(editEntry.id, enriched, audioBlob)
        toast('Entry updated')
      } else {
        await createEntry(enriched, audioBlob)
        toast('Entry added')
      }
      setEntryModalOpen(false)
      setEditEntry(null)
    } catch (err) {
      toast('Error: ' + (err.message || 'Could not save'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleProjectEdit(fields) {
    setSubmitting(true)
    try {
      await updateProject(id, fields)
      toast('Project updated')
      setEditProjectOpen(false)
    } catch (err) {
      toast('Error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center py-16">
          <p className="text-text-sub">Project not found</p>
          <Button variant="ghost" onClick={() => navigate('/projects')} className="mt-4">
            Back to projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-text-main transition-colors mb-5"
      >
        <ArrowLeft size={14} />
        Projects
      </button>

      {/* Project header */}
      <div className="bg-surface border border-border rounded-xl p-5 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
              <FolderOpen size={18} className="text-gold" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-main">{project.name}</h1>
              <p className="text-xs text-muted mt-0.5">
                Created {formatDate(project.created_at.split('T')[0])}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditProjectOpen(true)}
            className="p-2 rounded-lg text-muted hover:text-text-main hover:bg-surface-2 transition-colors"
            title="Edit project"
          >
            <Pencil size={15} />
          </button>
        </div>

        {project.description && (
          <p className="text-sm text-text-sub mt-3 leading-relaxed">{project.description}</p>
        )}
      </div>

      {/* Entries header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-sub uppercase tracking-wider">
          Journal entries ({entries.length})
        </h2>
        <Button
          size="sm"
          onClick={() => { setEditEntry(null); setEntryModalOpen(true) }}
        >
          <Plus size={13} />
          Add entry
        </Button>
      </div>

      {/* Entries */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-12 bg-surface border border-border rounded-xl">
          <p className="text-text-sub text-sm">No entries linked to this project yet</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={(e) => { setEditEntry(e); setEntryModalOpen(true) }}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      )}

      {/* Entry modal */}
      <Modal
        open={entryModalOpen}
        onClose={() => { setEntryModalOpen(false); setEditEntry(null) }}
        title={editEntry ? 'Edit entry' : 'New entry'}
        size="md"
      >
        <EntryForm
          entry={editEntry ? { ...editEntry, project_id: id } : { project_id: id }}
          projects={[project]}
          onSubmit={handleEntrySubmit}
          onCancel={() => { setEntryModalOpen(false); setEditEntry(null) }}
          submitting={submitting}
        />
      </Modal>

      {/* Edit project modal */}
      <Modal
        open={editProjectOpen}
        onClose={() => setEditProjectOpen(false)}
        title="Edit project"
        size="sm"
      >
        <ProjectForm
          project={project}
          onSubmit={handleProjectEdit}
          onCancel={() => setEditProjectOpen(false)}
          submitting={submitting}
        />
      </Modal>

      {toastMsg && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-surface-2 border border-border text-text-main text-sm px-4 py-2.5 rounded-full shadow-xl z-50">
          {toastMsg}
        </div>
      )}
    </div>
  )
}
