import { useState } from 'react'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'

export function ProjectForm({ project, onSubmit, onCancel, submitting }) {
  const isEdit = Boolean(project)

  const [fields, setFields] = useState({
    name:        project?.name        ?? '',
    description: project?.description ?? '',
  })
  const [errors, setErrors] = useState({})

  function set(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!fields.name.trim()) {
      setErrors({ name: 'Name is required' })
      return
    }
    await onSubmit(fields)
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
      <Input
        label="Project name"
        placeholder="e.g. Teentaal recital 2025"
        value={fields.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors.name}
      />

      <Textarea
        label="Description (optional)"
        placeholder="What is this piece or performance about?"
        value={fields.description}
        onChange={(e) => set('description', e.target.value)}
        rows={3}
      />

      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <Button type="submit" disabled={submitting} className="flex-1 justify-center">
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
