import { useState } from 'react'
import { Plus, FolderOpen } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectForm } from '../components/projects/ProjectForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

export function ProjectsPage() {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects()
  const [modalOpen, setModalOpen] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  function openNew() { setEditProject(null); setModalOpen(true) }
  function openEdit(p) { setEditProject(p); setModalOpen(true) }
  function closeModal() { setModalOpen(false); setEditProject(null) }

  function toast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  async function handleSubmit(fields) {
    setSubmitting(true)
    try {
      if (editProject) {
        await updateProject(editProject.id, fields)
        toast('Project updated')
      } else {
        await createProject(fields)
        toast('Project created')
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
      await deleteProject(id)
      toast('Project deleted')
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
            <FolderOpen size={20} className="text-gold" />
            Projects
          </h1>
          <p className="text-xs text-muted mt-0.5">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <Button onClick={openNew} size="sm">
          <Plus size={15} />
          New project
        </Button>
      </div>

      {/* Content */}
      {loading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl h-28 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-400 text-center py-8">{error}</p>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-16">
          <FolderOpen size={32} className="text-muted mx-auto mb-3" />
          <p className="text-text-sub font-medium">No projects yet</p>
          <p className="text-sm text-muted mt-1">
            Group your journal entries under a named piece or performance
          </p>
          <Button onClick={openNew} className="mt-4" size="sm">
            <Plus size={14} /> Create first project
          </Button>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editProject ? 'Edit project' : 'New project'}
        size="sm"
      >
        <ProjectForm
          project={editProject}
          onSubmit={handleSubmit}
          onCancel={closeModal}
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
