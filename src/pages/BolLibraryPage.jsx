import { useState } from 'react'
import { Plus, Library } from 'lucide-react'
import { useBolRecordings } from '../hooks/useBolRecordings'
import { BolCard } from '../components/bol/BolCard'
import { BolFilters } from '../components/bol/BolFilters'
import { BolForm } from '../components/bol/BolForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

export function BolLibraryPage() {
  const [filters, setFilters] = useState({ laya: '', performer: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecording, setEditRecording] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const { recordings, loading, error, createRecording, updateRecording, deleteRecording } =
    useBolRecordings({ laya: filters.laya, performer: filters.performer })

  function openNew() {
    setEditRecording(null)
    setModalOpen(true)
  }

  function openEdit(recording) {
    setEditRecording(recording)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditRecording(null)
  }

  function toast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  async function handleSubmit(fields, audioFile) {
    setSubmitting(true)
    try {
      if (editRecording) {
        await updateRecording(editRecording.id, fields, audioFile)
        toast('Recording updated')
      } else {
        await createRecording(fields, audioFile)
        toast('Recording added')
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
      await deleteRecording(id)
      toast('Recording deleted')
    } catch (err) {
      toast('Error: ' + (err.message || 'Could not delete'))
    }
  }

  const hasFilters = filters.laya || filters.performer

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Library size={20} className="text-gold" />
            Bol Library
          </h1>
          <p className="text-xs text-muted mt-0.5">
            {recordings.length} {recordings.length === 1 ? 'recording' : 'recordings'}
          </p>
        </div>
        <Button onClick={openNew} size="sm">
          <Plus size={15} />
          Add recording
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-5">
        <BolFilters filters={filters} onChange={setFilters} />
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

      {!loading && !error && recordings.length === 0 && (
        <div className="text-center py-16">
          <Library size={32} className="text-muted mx-auto mb-3" />
          <p className="text-text-sub font-medium">No recordings yet</p>
          <p className="text-sm text-muted mt-1">
            {hasFilters
              ? 'Try clearing the filters'
              : 'Upload your first bol recording'}
          </p>
          {!hasFilters && (
            <Button onClick={openNew} className="mt-4" size="sm">
              <Plus size={14} /> Add first recording
            </Button>
          )}
        </div>
      )}

      {!loading && recordings.length > 0 && (
        <div className="space-y-3">
          {recordings.map((rec) => (
            <BolCard
              key={rec.id}
              recording={rec}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editRecording ? 'Edit recording' : 'Add bol recording'}
        size="md"
      >
        <BolForm
          recording={editRecording}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>

      {/* Mobile FAB */}
      <button
        onClick={openNew}
        className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-gold text-bg rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform"
        aria-label="Add recording"
      >
        <Plus size={24} />
      </button>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-surface-2 border border-border text-text-main text-sm px-4 py-2.5 rounded-full shadow-xl z-50">
          {toastMsg}
        </div>
      )}
    </div>
  )
}
