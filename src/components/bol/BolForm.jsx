import { useState, useRef } from 'react'
import { Upload, X, FileAudio } from 'lucide-react'
import { Input, Textarea, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { AudioPlayer } from '../ui/AudioPlayer'
import { LAYAS, PERFORMERS, formatDuration } from '../../lib/utils'

export function BolForm({ recording, onSubmit, onCancel, submitting }) {
  const isEdit = Boolean(recording)

  const [fields, setFields] = useState({
    bol_name:  recording?.bol_name  ?? '',
    laya:      recording?.laya      ?? LAYAS[1],
    performer: recording?.performer ?? PERFORMERS[0],
    notes:     recording?.notes     ?? '',
  })
  const [errors, setErrors] = useState({})

  const [audioFile, setAudioFile] = useState(null)
  const [audioDuration, setAudioDuration] = useState(null)
  const fileInputRef = useRef(null)

  function set(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const e = {}
    if (!fields.bol_name.trim()) e.bol_name = 'Bol name is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    await onSubmit(
      { ...fields, duration_sec: audioDuration },
      audioFile || undefined,
    )
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const isAudio = file.type.startsWith('audio/') ||
      /\.(mp3|m4a|ogg|wav|opus|aac|flac|webm)$/i.test(file.name)
    if (!isAudio) {
      setErrors((err) => ({ ...err, audio: 'Please select an audio file' }))
      return
    }
    setErrors((err) => ({ ...err, audio: undefined }))
    setAudioFile(file)

    const url = URL.createObjectURL(file)
    const audio = new Audio(url)
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(isFinite(audio.duration) ? Math.round(audio.duration) : null)
      URL.revokeObjectURL(url)
    })
  }

  function clearFile() {
    setAudioFile(null)
    setAudioDuration(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
      <Input
        label="Bol name"
        placeholder="e.g. Ta Thei Thei Ta, Tihai, Paran..."
        value={fields.bol_name}
        onChange={(e) => set('bol_name', e.target.value)}
        error={errors.bol_name}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Laya / Speed"
          value={fields.laya}
          onChange={(e) => set('laya', e.target.value)}
        >
          {LAYAS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>

        <Select
          label="Performer"
          value={fields.performer}
          onChange={(e) => set('performer', e.target.value)}
        >
          {PERFORMERS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Notes"
        placeholder="Context, observations, source..."
        value={fields.notes}
        onChange={(e) => set('notes', e.target.value)}
        rows={3}
      />

      {/* Audio upload */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-sub uppercase tracking-wider">
          Audio file
        </p>

        {isEdit && recording.audio_path && !audioFile && (
          <div className="space-y-2">
            <AudioPlayer audioPath={recording.audio_path} />
            <p className="text-xs text-muted">Upload below to replace</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="*/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {audioFile ? (
          <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-lg px-3 py-2.5">
            <FileAudio size={16} className="text-gold flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-main truncate">{audioFile.name}</p>
              {audioDuration != null && (
                <p className="text-xs text-muted">{formatDuration(audioDuration)}</p>
              )}
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="p-1 rounded text-muted hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-lg px-4 py-3 text-sm text-muted hover:text-text-sub hover:border-gold/40 hover:bg-surface-2/40 transition-colors"
          >
            <Upload size={15} />
            Click to upload audio
          </button>
        )}
        {errors.audio && (
          <p className="text-xs text-red-400">{errors.audio}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <Button type="submit" disabled={submitting} className="flex-1 justify-center">
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add recording'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
