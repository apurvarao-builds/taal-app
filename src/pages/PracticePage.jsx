import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, RotateCcw, Square, Drum } from 'lucide-react'
import { useBpmDetector } from '../hooks/useBpmDetector'
import { cn } from '../lib/utils'

const LAYA_LEVELS = [
  { max: 45,  name: 'Vilambit',  sub: 'Slow',         color: 'text-indigo-light' },
  { max: 90,  name: 'Madhya',    sub: 'Medium',        color: 'text-gold' },
  { max: 150, name: 'Drut',      sub: 'Fast',          color: 'text-saffron-light' },
  { max: 210, name: 'Dugun',     sub: 'Double speed',  color: 'text-burgundy-light' },
  { max: 300, name: 'Chougun',   sub: 'Quad speed',    color: 'text-red-400' },
  { max: Infinity, name: 'Athgun', sub: 'Octal speed', color: 'text-red-500' },
]

function getLaya(bpm) {
  return LAYA_LEVELS.find((l) => bpm <= l.max) ?? LAYA_LEVELS[LAYA_LEVELS.length - 1]
}

export function PracticePage() {
  const navigate = useNavigate()
  const { phase, beatCount, liveBpm, finalBpm, error: bpmError, start, stop, reset } = useBpmDetector()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Practice Mode</h1>
        <p className="text-sm text-text-sub mt-1">Clap or tap your bol — we'll detect the tempo and laya.</p>
      </div>

      {(phase === 'idle' || phase === 'listening' || phase === 'error') && (
        <div className="flex flex-col items-center py-8 space-y-6">
          <div className="relative">
            {phase === 'listening' && (<>
              <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
              <span className="absolute inset-[-16px] rounded-full bg-gold/10 animate-pulse" />
            </>)}
            <button onClick={phase === 'listening' ? undefined : start} disabled={phase === 'listening'}
              style={{ width: 96, height: 96 }}
              className={cn('relative rounded-full flex items-center justify-center transition-all',
                phase === 'listening' ? 'bg-gold text-bg cursor-default' : 'bg-gold hover:bg-gold-light text-bg active:scale-95')}>
              <Mic size={36} />
            </button>
          </div>
          {phase === 'idle' && <p className="text-sm text-text-sub text-center max-w-xs">Tap the mic, then clap or speak your bols steadily</p>}
          {phase === 'listening' && (
            <div className="text-center space-y-3">
              <div>
                <p className="text-3xl font-bold text-gold tabular-nums">{liveBpm ? `${liveBpm} BPM` : '...'}</p>
                {liveBpm && (() => { const l = getLaya(liveBpm); return (
                  <p className={`text-sm font-medium mt-0.5 ${l.color}`}>{l.name} · {l.sub}</p>
                )})()}
                <p className="text-sm text-text-sub mt-1">{beatCount} beat{beatCount !== 1 ? 's' : ''} detected — keep going</p>
              </div>
              <button onClick={stop} className="flex items-center gap-2 text-sm text-text-sub hover:text-text-main border border-border hover:border-gold/30 rounded-xl px-4 py-2 transition-colors">
                <Square size={13} fill="currentColor" /> Stop
              </button>
            </div>
          )}
          {phase === 'error' && (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-900/20 border border-red-700/30 flex items-center justify-center mx-auto">
                <MicOff size={22} className="text-red-400" />
              </div>
              <p className="text-sm text-red-400 max-w-xs">{bpmError}</p>
              <button onClick={reset} className="flex items-center gap-2 text-sm text-text-sub hover:text-text-main transition-colors">
                <RotateCcw size={14} /> Try again
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'detected' && (() => {
        const laya = getLaya(finalBpm)
        return (
          <div className="flex flex-col items-center py-8 space-y-5">
            <div className="text-center">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Detected tempo</p>
              <p className="text-6xl font-bold text-gold tabular-nums">{finalBpm}</p>
              <p className="text-lg text-text-sub mt-1">BPM</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5">
                <span className={`text-base font-semibold ${laya.color}`}>{laya.name}</span>
                <span className="text-xs text-muted">·</span>
                <span className="text-xs text-text-sub">{laya.sub}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-sm text-text-sub hover:text-text-main hover:border-gold/30 transition-colors">
                <RotateCcw size={14} /> Detect again
              </button>
              <button onClick={() => navigate(`/taals?bpm=${finalBpm}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border hover:border-gold/30 text-sm text-text-sub hover:text-text-main transition-colors">
                <Drum size={14} /> See taals
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
