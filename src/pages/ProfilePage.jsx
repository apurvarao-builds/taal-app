import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { signOut } from '../hooks/useAuth'
import { Input, Select } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

const GHARANAS = ['Lucknow', 'Jaipur', 'Benaras', 'Other']
const GOALS = ['1', '2', '3', '4', '5', '6', '7']

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const meta = user?.user_metadata ?? {}

  const [fields, setFields] = useState({
    display_name:   meta.display_name   ?? '',
    gharana:        meta.gharana        ?? '',
    years_practice: meta.years_practice ?? '',
    guru_name:      meta.guru_name      ?? '',
    practice_goal:  meta.practice_goal  ?? '3',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  function set(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { error: err } = await supabase.auth.updateUser({ data: fields })
      if (err) throw err
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const initials = (fields.display_name || user?.email || 'D')[0].toUpperCase()

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-text-main transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Home
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center text-gold text-3xl font-bold mb-3">
          {initials}
        </div>
        <p className="text-xs text-muted">{user?.email}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label="Display name"
          placeholder="Your name"
          value={fields.display_name}
          onChange={(e) => set('display_name', e.target.value)}
        />

        <Select
          label="Gharana / Style"
          value={fields.gharana}
          onChange={(e) => set('gharana', e.target.value)}
        >
          <option value="">Select gharana…</option>
          {GHARANAS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </Select>

        <Input
          label="Guru name"
          placeholder="Your teacher's name"
          value={fields.guru_name}
          onChange={(e) => set('guru_name', e.target.value)}
        />

        <Input
          label="Years of practice"
          type="number"
          min="0"
          max="60"
          placeholder="e.g. 5"
          value={fields.years_practice}
          onChange={(e) => set('years_practice', e.target.value)}
        />

        <Select
          label="Practice goal (sessions per week)"
          value={fields.practice_goal}
          onChange={(e) => set('practice_goal', e.target.value)}
        >
          {GOALS.map((g) => (
            <option key={g} value={g}>{g} {g === '1' ? 'session' : 'sessions'} / week</option>
          ))}
        </Select>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <Button
          type="submit"
          disabled={saving}
          className="w-full justify-center"
          style={{ minHeight: '56px' }}
        >
          <Save size={16} />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save profile'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-border">
        <button
          onClick={() => signOut()}
          style={{ minHeight: '56px' }}
          className="w-full flex items-center justify-center gap-2 text-sm text-text-sub hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-colors border border-border"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  )
}
