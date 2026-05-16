import { useState, useRef, useCallback } from 'react'

export function useBolTranscriber() {
  const [phase, setPhase]           = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError]           = useState(null)

  const recognitionRef = useRef(null)
  const accumulatedRef = useRef('')

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Use Chrome or Safari.')
      setPhase('error')
      return
    }

    setPhase('recording')
    setTranscript('')
    setError(null)
    accumulatedRef.current = ''

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (e) => {
      let final = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' '
      }
      if (final) accumulatedRef.current = final
      let interim = accumulatedRef.current
      for (let i = e.results.length - 1; i >= 0; i--) {
        if (!e.results[i].isFinal) { interim += e.results[i][0].transcript; break }
      }
      setTranscript(interim.trim())
    }

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return
      setError(`Recognition error: ${e.error}`)
      setPhase('error')
    }

    recognition.onend = () => {
      setTranscript(accumulatedRef.current.trim())
      setPhase('done')
    }

    recognition.start()
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const reset = useCallback(() => {
    recognitionRef.current?.abort()
    recognitionRef.current = null
    accumulatedRef.current = ''
    setPhase('idle')
    setTranscript('')
    setError(null)
  }, [])

  return { phase, transcript, error, start, stop, reset }
}
