import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { getAudioUrl } from '../../lib/audio'
import { formatDuration } from '../../lib/utils'

/** Plays a stored audio file referenced by its storage path.
 *  Fetches a signed URL on mount and regenerates if expired.
 */
export function AudioPlayer({ audioPath, localUrl }) {
  const [src, setSrc] = useState(localUrl || null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    if (localUrl) { setSrc(localUrl); return }
    if (!audioPath) return
    getAudioUrl(audioPath)
      .then(setSrc)
      .catch(() => {})
  }, [audioPath, localUrl])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime  = () => setCurrentTime(Math.floor(audio.currentTime))
    const onMeta  = () => setDuration(Math.floor(audio.duration) || 0)
    const onEnded = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnded)
    }
  }, [src])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else         { audio.play(); setPlaying(true) }
  }

  function seek(e) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * audio.duration
  }

  if (!src) return null

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex items-center gap-3 bg-surface-2 rounded-lg px-3 py-2">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={toggle}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gold/20 hover:bg-gold/30 text-gold transition-colors flex-shrink-0"
      >
        {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </button>

      {/* Progress bar */}
      <div
        className="flex-1 h-1.5 bg-border rounded-full cursor-pointer relative"
        onClick={seek}
      >
        <div
          className="h-full bg-gold rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-xs text-muted font-mono flex-shrink-0">
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </span>

      <Volume2 size={14} className="text-muted flex-shrink-0" />
    </div>
  )
}
