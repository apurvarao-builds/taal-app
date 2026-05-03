import { useState, useRef, useCallback } from 'react'

/**
 * States: idle → requesting → recording → stopped
 *
 * Returns:
 *  state        – current recorder state
 *  blob         – recorded Blob (available after stop)
 *  objectUrl    – local URL for preview (revoke on unmount)
 *  durationSec  – recorded duration in seconds
 *  start()      – request mic + start recording
 *  stop()       – stop recording
 *  reset()      – clear blob/url, go back to idle
 */
export function useAudioRecorder() {
  const [state, setState] = useState('idle')
  const [blob, setBlob] = useState(null)
  const [objectUrl, setObjectUrl] = useState(null)
  const [durationSec, setDurationSec] = useState(0)

  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const timer = useRef(null)
  const streamRef = useRef(null)

  const start = useCallback(async () => {
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })
      mediaRecorder.current = recorder
      chunks.current = []
      setDurationSec(0)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      recorder.onstop = () => {
        const recorded = new Blob(chunks.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(recorded)
        setBlob(recorded)
        setObjectUrl(url)
        setState('stopped')
        // Stop all tracks
        streamRef.current?.getTracks().forEach((t) => t.stop())
      }

      recorder.start(250) // 250 ms chunks
      setState('recording')

      timer.current = setInterval(() => {
        setDurationSec((d) => d + 1)
      }, 1000)
    } catch (err) {
      setState('idle')
      throw err
    }
  }, [])

  const stop = useCallback(() => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop()
    }
    clearInterval(timer.current)
  }, [])

  const reset = useCallback(() => {
    stop()
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setBlob(null)
    setObjectUrl(null)
    setDurationSec(0)
    setState('idle')
  }, [stop, objectUrl])

  return { state, blob, objectUrl, durationSec, start, stop, reset }
}
