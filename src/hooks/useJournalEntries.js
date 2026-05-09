import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { deleteAudio, uploadAudio, uploadFile } from '../lib/audio'

export function useJournalEntries(filters = {}) {
  const user = useAuthStore((s) => s.user)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { projectId, category, entryType } = filters

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    let q = supabase
      .from('journal_entries')
      .select('*, projects(id, name)')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (projectId) q = q.eq('project_id', projectId)
    if (category)  q = q.eq('category', category)
    if (entryType) q = q.eq('entry_type', entryType)

    const { data, error: err } = await q
    if (err) setError(err.message)
    else setEntries(data ?? [])
    setLoading(false)
  }, [user, projectId, category, entryType])

  useEffect(() => { fetch() }, [fetch])

  async function createEntry(fields, audioBlob) {
    let audio_path = null
    let duration_sec = fields.duration_sec ?? null

    if (audioBlob) {
      audio_path = audioBlob instanceof File
        ? await uploadFile(user.id, audioBlob)
        : await uploadAudio(user.id, audioBlob)
    }

    const { error: err } = await supabase.from('journal_entries').insert({
      user_id: user.id,
      title: fields.title,
      entry_date: fields.entry_date,
      notes: fields.notes,
      category: fields.category,
      entry_type: fields.entry_type,
      project_id: fields.project_id || null,
      audio_path,
      duration_sec,
    })

    if (err) throw err
    await fetch()
  }

  async function updateEntry(id, fields, audioBlob) {
    const existing = entries.find((e) => e.id === id)
    let audio_path = existing?.audio_path ?? null
    let duration_sec = fields.duration_sec ?? existing?.duration_sec ?? null

    if (audioBlob) {
      if (existing?.audio_path) {
        await deleteAudio(existing.audio_path).catch(() => {})
      }
      audio_path = audioBlob instanceof File
        ? await uploadFile(user.id, audioBlob)
        : await uploadAudio(user.id, audioBlob)
    }

    const { error: err } = await supabase
      .from('journal_entries')
      .update({
        title: fields.title,
        entry_date: fields.entry_date,
        notes: fields.notes,
        category: fields.category,
        entry_type: fields.entry_type,
        project_id: fields.project_id || null,
        audio_path,
        duration_sec,
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (err) throw err
    await fetch()
  }

  async function deleteEntry(id) {
    const entry = entries.find((e) => e.id === id)
    if (entry?.audio_path) {
      await deleteAudio(entry.audio_path).catch(() => {})
    }

    const { error: err } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (err) throw err
    await fetch()
  }

  return { entries, loading, error, createEntry, updateEntry, deleteEntry, refresh: fetch }
}
