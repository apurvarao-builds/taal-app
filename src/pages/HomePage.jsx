import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, BookOpen, Library, FolderOpen, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useJournalEntries } from '../hooks/useJournalEntries'
import { useProjects } from '../hooks/useProjects'
import { formatDate } from '../lib/utils'
import { Modal } from '../components/ui/Modal'
import { EntryForm } from '../components/journal/EntryForm'

function calcStreak(entries) {
  if (!entries.length) return 0
  const days = new Set(entries.map((e) => e.entry_date))
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const start = new Date(today)
  if (!days.has(todayStr)) start.setDate(start.getDate() - 1)
  let streak = 0
  const cur = new Date(start)
  for (let i = 0; i < 365; i++) {
    const key = cur.toISOString().split('T')[0]
    if (days.has(key)) { streak++; cur.setDate(cur.getDate() - 1) }
    else break
  }
  return streak
}

const shortcuts = [
  { label: 'Journal',     Icon: BookOpen,   to: '/journal',     bg: 'bg-indigo-jewel/40', border: 'border-indigo-jewel/40', text: 'text-indigo-light' },
  { label: 'Bol Library', Icon: Library,    to: '/bol-library', bg: 'bg-gold/10',          border: 'border-gold/20',         text: 'text-gold' },
  { label: 'Projects',    Icon: FolderOpen, to: '/projects',    bg: 'bg-burgundy/20',      border: 'border-burgundy/30',     text: 'text-burgundy-light' },
  { label: 'Practice',    Icon: Zap,        to: '/practice',    bg: 'bg-saffron/15',       border: 'border-saffron/25',      text: 'text-saffron-light' },
]

export function HomePage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { entries, createEntry } = useJournalEntries()
  const { projects, createProject } = useProjects()
  const [recordOpen, setRecordOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const streak = calcStreak(entries)
  const lastEntry = entries[0]
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Dancer'

  async function handleQuickRecord(fields, audio) {
    setSubmitting(true)
    try { await createEntry(fields, audio); setRecordOpen(false) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Namaste,</p>
          <h1 className="text-2xl font-bold text-text-main capitalize">{displayName}</h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-11 h-11 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-base"
        >
          {displayName[0].toUpperCase()}
        </button>
      </div>

      <div className="relative bg-surface border border-border rounded-2xl p-5 overflow-hidden">
        <div className="absolute inset-0 mandala-bg" />
        <div className="relative flex items-center gap-5">
          <div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gold">{streak}</span>
              <span className="text-sm text-text-sub mb-1">day streak 🔥</span>
            </div>
            <p className="text-xs text-muted mt-1">
              {streak === 0 ? 'Start your streak today' : 'Keep it going!'}
            </p>
          </div>
          {lastEntry && (
            <div className="ml-auto text-right border-l border-border pl-5">
              <p className="text-xs text-muted">Last practice</p>
              <p className="text-sm text-text-main font-medium mt-0.5">{formatDate(lastEntry.entry_date)}</p>
              <p className="text-xs text-text-sub truncate max-w-[140px]">{lastEntry.title}</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setRecordOpen(true)}
        style={{ minHeight: '64px' }}
        className="w-full bg-gold hover:bg-gold-light text-bg font-semibold rounded-2xl flex items-center justify-center gap-3 transition-colors active:scale-95 text-base"
      >
        <Mic size={22} />
        Quick Record
      </button>

      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map(({ label, Icon, to, bg, border, text }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            style={{ minHeight: '64px' }}
            className={`${bg} ${border} ${text} border rounded-xl px-4 flex items-center gap-3 text-left transition-all active:scale-95`}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <Modal open={recordOpen} onClose={() => setRecordOpen(false)} title="Quick Record" size="md">
        <EntryForm
          projects={projects}
          onSubmit={handleQuickRecord}
          onCancel={() => setRecordOpen(false)}
          submitting={submitting}
          onCreateProject={createProject}
        />
      </Modal>
    </div>
  )
}
