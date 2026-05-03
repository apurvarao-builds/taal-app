import { useEffect, useRef } from 'react'
import { Mic, Square, Trash2 } from 'lucide-react'
import { useAudioRecorder } from '../../hooks/useAudioRecorder'
import { AudioPlayer } from '../ui/AudioPlayer'
import { Button } from '../ui/Button'
import { formatDuration, cn } from '../../lib/utils'

/** Controlled recorder widget.
 *  onRecorded(blob, durationSec) — called once when recording stops.
 *  onClear()                     — called when user discards the recording.
 */
export function AudioRecorderWidget({ onRecorded, onClear }) {
  const { state, blob, objectUrl, durationSec, start, stop, reset } = useAudioRecorder()
  const notifiedRef = useRef(false)

  // Notify parent exactly once when a new recording is ready
  useEffect(() => {
    if (state === 'stopped' && blob && !notifiedRef.current) {
      notifiedRef.current = true
      onRecorded(blob, durationSec)
    }
    if (state !== 'stopped') {
      notifiedRef.current = false
    }
  }, [state, blob, durationSec, onRecorded])

  function handleReset() {
    reset()
    onClear()
  }

  return (
    <div className="space-y-3">
      {state === 'idle' && (
        <Button
          variant="secondary"
          onClick={start}
          type="button"
          className="w-full justify-center"
        >
          <Mic size={15} />
          Record audio
        </Button>
      )}

      {state === 'requesting' && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Mic size={15} className="animate-pulse" />
          Requesting microphone…
        </div>
      )}

      {state === 'recording' && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 bg-surface-2 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-slow" />
            <span className="text-sm text-text-main font-mono">
              {formatDuration(durationSec)}
            </span>
            <div className="flex-1 flex items-end gap-0.5 h-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-0.5 rounded-full bg-gold/50 animate-pulse',
                  )}
                  style={{
                    height: `${30 + Math.sin(i * 0.8) * 40}%`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
          </div>
          <Button variant="danger" onClick={stop} type="button" size="sm">
            <Square size={13} />
            Stop
          </Button>
        </div>
      )}

      {state === 'stopped' && objectUrl && (
        <div className="space-y-2">
          <AudioPlayer localUrl={objectUrl} />
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
            Remove recording
          </button>
        </div>
      )}
    </div>
  )
}
