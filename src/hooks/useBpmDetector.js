import { useState, useRef, useCallback } from 'react'

const MAX_BEATS = 20
const MIN_BEATS = 4
const TIMEOUT_MS = 20000
const POLL_MS = 50
const COOLDOWN_MS = 250
const HISTORY = 40
const BEAT_RATIO = 1.4
const MIN_RMS = 0.006

function medianBpm(times) {
  if (times.length < 2) return null
  const intervals = []
  for (let i = 1; i < times.length; i++) intervals.push(times[i] - times[i - 1])
  intervals.sort((a, b) => a - b)
  const m = Math.floor(intervals.length / 2)
  const median = intervals.length % 2 === 0 ? (intervals[m - 1] + intervals[m]) / 2 : intervals[m]
  const bpm = Math.round(60000 / median)
  return bpm >= 40 && bpm <= 240 ? bpm : null
}

export function useBpmDetector() {
  const [phase, setPhase]         = useState('idle')
  const [beatCount, setBeatCount] = useState(0)
  const [liveBpm, setLiveBpm]     = useState(null)
  const [finalBpm, setFinalBpm]   = useState(null)
  const [error, setError]         = useState(null)

  const ctxRef     = useRef(null)
  const streamRef  = useRef(null)
  const timerRef   = useRef(null)
  const pollRef    = useRef(null)
  const beatTimes  = useRef([])
  const lastBeat   = useRef(0)
  const energyHist = useRef([])

  const cleanup = useCallback(() => {
    clearInterval(pollRef.current)
    clearTimeout(timerRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    ctxRef.current?.close()
    ctxRef.current = null
  }, [])

  const finish = useCallback((times) => {
    cleanup()
    const bpm = medianBpm(times)
    if (bpm) { setFinalBpm(bpm); setPhase('detected') }
    else { setError('Could not lock onto a tempo. Try steady claps closer to the mic.'); setPhase('error') }
  }, [cleanup])

  const start = useCallback(async () => {
    cleanup()
    setError(null); setBeatCount(0); setLiveBpm(null); setFinalBpm(null)
    beatTimes.current = []; lastBeat.current = 0; energyHist.current = []
    setPhase('listening')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream
      const ctx = new AudioContext()
      ctxRef.current = ctx
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      src.connect(analyser)
      const buf = new Float32Array(analyser.fftSize)
      pollRef.current = setInterval(() => {
        analyser.getFloatTimeDomainData(buf)
        let rms = 0
        for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i]
        rms = Math.sqrt(rms / buf.length)
        energyHist.current.push(rms)
        if (energyHist.current.length > HISTORY) energyHist.current.shift()
        const avg = energyHist.current.reduce((s, v) => s + v, 0) / energyHist.current.length
        const now = performance.now()
        const warmup = energyHist.current.length >= 10
        if (warmup && rms > MIN_RMS && rms > avg * BEAT_RATIO && now - lastBeat.current > COOLDOWN_MS) {
          lastBeat.current = now
          beatTimes.current.push(now)
          const count = beatTimes.current.length
          setBeatCount(count)
          if (count >= 2) { const live = medianBpm(beatTimes.current); if (live) setLiveBpm(live) }
          if (count >= MAX_BEATS) finish(beatTimes.current)
        }
      }, POLL_MS)
      timerRef.current = setTimeout(() => {
        if (beatTimes.current.length >= MIN_BEATS) finish(beatTimes.current)
        else { cleanup(); setError('Not enough beats detected. Clap louder or closer to your mic.'); setPhase('error') }
      }, TIMEOUT_MS)
    } catch (err) {
      cleanup()
      setError(err.name === 'NotAllowedError' ? 'Microphone access was denied.' : err.message)
      setPhase('error')
    }
  }, [cleanup, finish])

  const reset = useCallback(() => {
    cleanup()
    setPhase('idle'); setBeatCount(0); setLiveBpm(null); setFinalBpm(null); setError(null)
  }, [cleanup])

  return { phase, beatCount, liveBpm, finalBpm, error, start, reset }
}
