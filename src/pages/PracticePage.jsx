import { useState } from 'react'
import { Mic, MicOff, RotateCcw, Music, ExternalLink, ChevronRight, Square } from 'lucide-react'
import { useBpmDetector } from '../hooks/useBpmDetector'
import { useSpotify } from '../hooks/useSpotify'
import { cn } from '../lib/utils'

const GENRES = ['Bollywood', 'Hindustani Classical', 'Fusion', 'Any']

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
  const [genre, setGenre]       = useState('Any')
  const [tracks, setTracks]     = useState(null)
  const [fetching, setFetching] = useState(false)
  const [fetchErr, setFetchErr] = useState(null)
  const { phase, beatCount, liveBpm, finalBpm, error: bpmError, start, stop, reset } = useBpmDetector()
  const { getRecommendations } = useSpotify()

  async function handleFindMusic() {
    setFetching(true); setFetchErr(null); setTracks(null)
    try { const results = await getRecommendations(finalBpm, genre); setTracks(results) }
    catch (err) { setFetchErr(err.message) }
    finally { setFetching(false) }
  }

  function handleRetry() { setTracks(null); setFetchErr(null); reset() }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Practice Mode</h1>
        <p className="text-sm text-text-sub mt-1">Clap your bol &mdash; we'll detect the BPM and find matching music.</p>
      </div>
      <div>
        <p className="text-xs text-muted mb-2 uppercase tracking-wider">Genre</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button key={g} onClick={() => setGenre(g)}
              className={cn('px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                genre === g ? 'bg-gold/20 border-gold/50 text-gold' : 'bg-surface border-border text-text-sub hover:border-gold/30 hover:text-text-main')}>
              {g}
            </button>
          ))}
        </div>
      </div>
      {(phase === 'idle' || phase === 'listening' || phase === 'error') && !tracks && (
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
          {phase === 'idle' && <p className="text-sm text-text-sub text-center max-w-xs">Tap the mic, then clap steadily for 8&ndash;16 beats</p>}
          {phase === 'listening' && (
            <div className="text-center space-y-3">
              <div>
                <p className="text-3xl font-bold text-gold tabular-nums">{liveBpm ? `${liveBpm} BPM` : '...'}</p>
                {liveBpm && (() => { const l = getLaya(liveBpm); return (
                  <p className={`text-sm font-medium mt-0.5 ${l.color}`}>{l.name} · {l.sub}</p>
                )})()}
                <p className="text-sm text-text-sub mt-1">{beatCount} beat{beatCount !== 1 ? 's' : ''} detected — keep clapping</p>
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
      {phase === 'detected' && !tracks && !fetching && (() => {
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
          {fetchErr && <p className="text-sm text-red-400 text-center max-w-xs">{fetchErr}</p>}
          <div className="flex gap-3">
            <button onClick={handleRetry} className="px-5 py-3 rounded-xl border border-border text-sm text-text-sub hover:text-text-main hover:border-gold/30 transition-colors">
              <RotateCcw size={14} className="inline mr-1.5" /> Retry
            </button>
            <button onClick={handleFindMusic} style={{ minHeight: '48px' }}
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-bg font-semibold text-sm flex items-center gap-2 transition-colors active:scale-95">
              <Music size={16} /> Find Music <ChevronRight size={16} />
            </button>
          </div>
        </div>
        )
      })()}
      {fetching && (
        <div className="flex flex-col items-center py-12 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          <p className="text-sm text-text-sub">Finding tracks near {finalBpm} BPM...</p>
        </div>
      )}
      {tracks && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-main">{tracks.length} tracks &middot; {finalBpm} BPM &middot; {genre}</p>
            <button onClick={handleRetry} className="text-xs text-muted hover:text-text-sub flex items-center gap-1 transition-colors">
              <RotateCcw size={12} /> New search
            </button>
          </div>
          {tracks.length === 0 && <div className="text-center py-10 text-text-sub text-sm">No tracks found. Try a different genre.</div>}
          <div className="space-y-2">
            {tracks.map((track) => (
              <a key={track.id} href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface border border-border hover:border-gold/30 rounded-xl p-3 transition-colors group">
                {track.album?.images?.[2]?.url
                  ? <img src={track.album.images[2].url} alt={track.album.name} className="w-12 h-12 rounded-lg flex-shrink-0 object-cover" />
                  : <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0"><Music size={18} className="text-muted" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">{track.name}</p>
                  <p className="text-xs text-text-sub truncate">{track.artists?.map((a) => a.name).join(', ')}</p>
                </div>
                <ExternalLink size={14} className="text-muted group-hover:text-gold flex-shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
