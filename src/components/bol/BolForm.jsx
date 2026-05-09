import { useState, useRef } from 'react'
import { Upload, X, FileAudio, Link } from 'lucide-react'
import { Input, Textarea, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { AudioPlayer } from '../ui/AudioPlayer'
import { LAYAS, PERFORMERS, formatDuration } from '../../lib/utils'
import { uploadFromUrl } from '../../lib/audio'
import { useAuthStore } from '../../store/authStore'

export function BolForm({ recording, onSubmit, onCancel, submitting }) {
  const isEdit = Boolean(recording)
  const user = useAuthStore((s) => s.user)

  const [fields, setFields] = useState({
    bol_name:  recording?.bol_name  ?? '',
    laya:      recording?.laya      ?? LAYAS[1],
    performer: recording?.performer ?? PERFORMERS[0],
    notes:     recording?.notes     ?? '',
  })
  const [errors, setErrors] = useState({})

  const [urlMode, setUrlMode] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [urlError, setUrlError] = useState(null)
  const [audioPath, setAudioPath] = useState(null)

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
      { ...fields, duration_sec: audioDuration, audio_path: audioPath || undefined },
      audioFile || undefined,
    )
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

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

  async function handleLoadFromUrl() {
    if (!urlInput.trim()) return
    setUrlLoading(true)
    setUrlError(null)
    try {
      const path = await uploadFromUrl(user.id, urlInput.trim())
      setAudioPath(path)
    } catch (err) {
      setUrlError(err.message || 'Could not load file from that URL')
    } finally {
      setUrlLoading(false)
    }
  }

  function clearUrlAudio() {
    setAudioPath(null)
    setUrlInput('')
    setUrlError(null)
  }

  function switchMode(toUrl) {
    setUrlMode(toUrl)
    clearFile()
    clearUrlAudio()
    setErrors((e) => ({ ...e, audio: undefined }))
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
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-text-sub uppercase tracking-wider">Audio file</p>
          <div className="flex bg-surface-2 rounded-lg p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${!urlMode ? 'bg-gold/20 text-gold' : 'text-muted hover:text-text-sub'}`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${urlMode ? 'bg-gold/20 text-gold' : 'text-muted hover:text-text-sub'}`}
            >
              URL
            </button>
          </div>
        </div>

        {isEdit && recording.audio_path && !audioFile && !audioPath && (
          <div className="space-y-2">
            <AudioPlayer audioPath={recording.audio_path} />
            <p className="text-xs text-muted">{urlMode ? 'Paste a URL below to replace' : 'Upload below to replace'}</p>
          </div>
        )}

        {urlMode ? (
          <div className="space-y-2">
            {audioPath ? (
              <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-lg px-3 py-2.5">
                <Link size={16} className="text-gold flex-shrink-0" />
                <p className="flex-1 text-sm text-text-main">Loaded from Google Drive</p>
                <button
                  type="button"
                  onClick={clearUrlAudio}
                  className="p-1 rounded text-muted hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste Google Drive sharing link…"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setUrlError(null) }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLoadFromUrl() } }}
                  className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleLoadFromUrl}
                  disabled={urlLoading || !urlInput.trim()}
                >
                  {urlLoading ? '…' : 'Load'}
                </Button>
              </div>
            )}
            {urlError && <p className="text-xs text-red-400">{urlError}</p>}
            {!audioPath && (
              <p className="text-xs text-muted">File must be shared publicly — "Anyone with the link can view"</p>
            )}
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
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
          </>
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
