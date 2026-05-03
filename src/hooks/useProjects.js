import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useProjects() {
  const user = useAuthStore((s) => s.user)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (err) setError(err.message)
    else setProjects(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  async function createProject(fields) {
    const { data, error: err } = await supabase.from('projects').insert({
      user_id: user.id,
      name: fields.name,
      description: fields.description || null,
    }).select().single()
    if (err) throw err
    await fetch()
    return data
  }

  async function updateProject(id, fields) {
    const { error: err } = await supabase
      .from('projects')
      .update({ name: fields.name, description: fields.description || null })
      .eq('id', id)
      .eq('user_id', user.id)
    if (err) throw err
    await fetch()
  }

  async function deleteProject(id) {
    const { error: err } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (err) throw err
    await fetch()
  }

  return { projects, loading, error, createProject, updateProject, deleteProject, refresh: fetch }
}
