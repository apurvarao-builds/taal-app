import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { Plus, X } from 'lucide-react'
import { Input, Textarea, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { AudioRecorderWidget } from './AudioRecorderWidget'
import { AudioPlayer } from '../ui/AudioPlayer'
import { CATEGORIES, ENTRY_TYPES } from '../../lib/utils'

const today = format(new Date(), 'yyyy-MM-dd')

export function EntryForm({ entry, projects, onSubmit, onCancel, submitting, onCreateProject }) {
  const isEdit = Boolean(entry)

  const [fields, setFields] = useState({
    title:      entry?.title      ?? '',
    entry_date: entry?.entry_date ?? today,
    notes:      entry?.notes      ?? '',
    category:   entry?.category   ?? CATEGORIES[0],
    entry_type: entry?.entry_type ?? ENTRY_TYPES[0],
    project_id: entry?.project_id ?? '',
  })
  const [errors, setErrors] = useState({})

  const [creatingProject, setCreatingProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [projectBusy, setProjectBusy] = useState(false)

  const audioBlob = useRef(null)
  const audioDuration = useRef(null)
  const [hasNewAudio, setHasNewAudio] = useState(false)

  function set(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const e = {}
    if (!fields.title.trim()) e.title = 'Title is required'
    if (!fields.entry_date)   e.entry_date = 'Date is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    await onSubmit(
      { ...fields, duration_sec: audioDuration.current },
      hasNewAudio ? audioBlob.current : undefined,
    )
  }

  function handleRecorded(blob, sec) {
    audioBlob.current = blob
    audioDuration.current = sec
    setHasNewAudio(true)
  }

  async function handleCreateProject(e) {
    e?.preventDefault()
    if (!newProjectName.trim() || !onCreateProject) return
    setProjectBusy(true)
    try {
      const project = await onCreateProject({ name: newProjectName.trim() })
      set('project_id', project.id)
      setCreatingProject(false)
      setNewProjectName('')
    } catch {
      // leave the input open so the user can retry
    } finally {
      setProjectBusy(false)
    }
  }

  function handleClear() {
    audioBlob.current = null
    audioDuration.current = null
    setHasNewAudio(false)
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
      <Input
        label="Title"
        placeholder="e.g. Teentaal Tatkaar drill"
        value={fields.title}
        onChange={(e) => set('title', e.target.value)}
        error={errors.title}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Date"
          type="date"
          value={fields.entry_date}
          onChange={(e) => set('entry_date', e.target.value)}
          error={errors.entry_date}
        />
        <Select
          label="Entry type"
          value={fields.entry_type}
          onChange={(e) => set('entry_type', e.target.value)}
        >
          {ENTRY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Category"
          value={fields.category}
          onChange={(e) => set('category', e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <div>
          <Select
            label="Project"
            value={fields.project_id}
            onChange={(e) => set('project_id', e.target.value)}
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
          {onCreateProject && !creatingProject && (
            <button
              type="button"
              onClick={() => setCreatingProject(true)}
              className="mt-1 flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors"
            >
              <Plus size={11} /> New project
            </button>
          )}
        </div>
      </div>

      {creatingProject && (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-sm text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateProject(e)
              if (e.key === 'Escape') { setCreatingProject(false); setNewProjectName('') }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleCreateProject}
            disabled={projectBusy || !newProjectName.trim()}
          >
            {projectBusy ? '…' : 'Create'}
          </Button>
          <button
            type="button"
            onClick={() => { setCreatingProject(false); setNewProjectName('') }}
            className="text-muted hover:text-text-sub transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <Textarea
        label="Notes"
        placeholder="What did you work on? Any breakthroughs or areas to improve?"
        value={fields.notes}
        onChange={(e) => set('notes', e.target.value)}
        rows={4}
      />

      {/* Audio section */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-sub uppercase tracking-wider">
          Recording
        </p>
        {isEdit && entry.audio_path && !hasNewAudio && (
          <div className="space-y-2">
            <AudioPlayer audioPath={entry.audio_path} />
            <p className="text-xs text-muted">Record below to replace</p>
          </div>
        )}
        <AudioRecorderWidget onRecorded={handleRecorded} onClear={handleClear} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <Button type="submit" disabled={submitting} className="flex-1 justify-center">
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add entry'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
