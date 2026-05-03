import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { useJournalEntries } from '../hooks/useJournalEntries'
import { useProjects } from '../hooks/useProjects'
import { EntryCard } from '../components/journal/EntryCard'
import { EntryFilters } from '../components/journal/EntryFilters'
import { EntryForm } from '../components/journal/EntryForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

export function JournalPage() {
  const [filters, setFilters] = useState({ category: '', entryType: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const { entries, loading, error, createEntry, updateEntry, deleteEntry } =
    useJournalEntries({ category: filters.category, entryType: filters.entryType })
  const { projects } = useProjects()

  function openNew() {
    setEditEntry(null)
    setModalOpen(true)
  }

  function openEdit(entry) {
    setEditEntry(entry)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditEntry(null)
  }

  function toast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  async function handleSubmit(fields, audioBlob) {
    setSubmitting(true)
    try {
      if (editEntry) {
        await updateEntry(editEntry.id, fields, audioBlob)
        toast('Entry updated')
      } else {
        await createEntry(fields, audioBlob)
        toast('Entry added')
      }
      closeModal()
    } catch (err) {
      toast('Error: ' + (err.message || 'Could not save'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteEntry(id)
      toast('Entry deleted')
    } catch (err) {
      toast('Error: ' + (err.message || 'Could not delete'))
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
            <BookOpen size={20} className="text-gold" />
            Journal
          </h1>
          <p className="text-xs text-muted mt-0.5">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <Button onClick={openNew} size="sm">
          <Plus size={15} />
          New entry
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-5">
        <EntryFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-400 text-center py-8">{error}</p>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={32} className="text-muted mx-auto mb-3" />
          <p className="text-text-sub font-medium">No entries yet</p>
          <p className="text-sm text-muted mt-1">
            {filters.category || filters.entryType
              ? 'Try clearing the filters'
              : 'Start by adding your first practice session'}
          </p>
          {!filters.category && !filters.entryType && (
            <Button onClick={openNew} className="mt-4" size="sm">
              <Plus size={14} /> Add first entry
            </Button>
          )}
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Entry modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editEntry ? 'Edit entry' : 'New journal entry'}
        size="md"
      >
        <EntryForm
          entry={editEntry}
          projects={projects}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-surface-2 border border-border text-text-main text-sm px-4 py-2.5 rounded-full shadow-xl z-50">
          {toastMsg}
        </div>
      )}
    </div>
  )
}
