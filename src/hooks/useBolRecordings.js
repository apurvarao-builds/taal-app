import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { deleteAudio, uploadFile } from '../lib/audio'

export function useBolRecordings(filters = {}) {
  const user = useAuthStore((s) => s.user)
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { laya, performer } = filters

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    let q = supabase
      .from('bol_recordings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (laya)      q = q.eq('laya', laya)
    if (performer) q = q.eq('performer', performer)

    const { data, error: err } = await q
    if (err) setError(err.message)
    else setRecordings(data ?? [])
    setLoading(false)
  }, [user, laya, performer])

  useEffect(() => { fetch() }, [fetch])

  async function createRecording(fields, audioFile) {
    let audio_path = null
    let duration_sec = fields.duration_sec ?? null

    if (audioFile) {
      audio_path = await uploadFile(user.id, audioFile)
    }

    const { error: err } = await supabase.from('bol_recordings').insert({
      user_id: user.id,
      bol_name: fields.bol_name,
      laya: fields.laya,
      performer: fields.performer,
      notes: fields.notes,
      audio_path,
      duration_sec,
    })

    if (err) throw err
    await fetch()
  }

  async function updateRecording(id, fields, audioFile) {
    const existing = recordings.find((r) => r.id === id)
    let audio_path = existing?.audio_path ?? null
    let duration_sec = fields.duration_sec ?? existing?.duration_sec ?? null

    if (audioFile) {
      if (existing?.audio_path) {
        await deleteAudio(existing.audio_path).catch(() => {})
      }
      audio_path = await uploadFile(user.id, audioFile)
      duration_sec = fields.duration_sec ?? null
    }

    const { error: err } = await supabase
      .from('bol_recordings')
      .update({
        bol_name: fields.bol_name,
        laya: fields.laya,
        performer: fields.performer,
        notes: fields.notes,
        audio_path,
        duration_sec,
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (err) throw err
    await fetch()
  }

  async function deleteRecording(id) {
    const recording = recordings.find((r) => r.id === id)
    if (recording?.audio_path) {
      await deleteAudio(recording.audio_path).catch(() => {})
    }

    const { error: err } = await supabase
      .from('bol_recordings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (err) throw err
    await fetch()
  }

  return { recordings, loading, error, createRecording, updateRecording, deleteRecording, refresh: fetch }
}
