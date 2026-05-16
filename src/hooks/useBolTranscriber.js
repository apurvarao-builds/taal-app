import { useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useBolTranscriber() {
  const [phase, setPhase]           = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError]           = useState(null)

  const mediaRef    = useRef(null)
  const chunksRef   = useRef([])
  const streamRef   = useRef(null)

  const start = useCallback(async () => {
    setPhase('recording')
    setTranscript('')
    setError(null)
    chunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/mp4'
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRef.current = recorder
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.start(100)
    } catch (err) {
      setError(err.name === 'NotAllowedError' ? 'Microphone access was denied.' : err.message)
      setPhase('error')
    }
  }, [])

  const stop = useCallback(async () => {
    if (!mediaRef.current || mediaRef.current.state === 'inactive') return
    setPhase('transcribing')
    await new Promise((resolve) => {
      mediaRef.current.onstop = resolve
      mediaRef.current.stop()
    })
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    try {
      const blob = new Blob(chunksRef.current, { type: mediaRef.current.mimeType })
      const form = new FormData()
      form.append('audio', blob, 'bol.webm')
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-bol`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: form,
        },
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Transcription failed')
      setTranscript(json.transcript)
      setPhase('done')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }, [])

  const reset = useCallback(() => {
    mediaRef.current?.state !== 'inactive' && mediaRef.current?.stop()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    chunksRef.current = []
    setPhase('idle')
    setTranscript('')
    setError(null)
  }, [])

  return { phase, transcript, error, start, stop, reset }
}
