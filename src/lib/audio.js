import { supabase } from './supabase'

/** Upload a recorded Blob to Supabase Storage.
 *  Path: {userId}/{uuid}.webm
 *  Returns the storage path string on success.
 */
export async function uploadAudio(userId, blob) {
  const fileName = `${crypto.randomUUID()}.webm`
  const path = `${userId}/${fileName}`

  const { error } = await supabase.storage
    .from('audio-recordings')
    .upload(path, blob, { contentType: 'audio/webm' })

  if (error) throw error
  return path
}

/** Get a signed URL for a stored audio file (expires in 1 hour). */
export async function getAudioUrl(path) {
  const { data, error } = await supabase.storage
    .from('audio-recordings')
    .createSignedUrl(path, 3600)

  if (error) throw error
  return data.signedUrl
}

/** Delete a stored audio file. */
export async function deleteAudio(path) {
  const { error } = await supabase.storage
    .from('audio-recordings')
    .remove([path])

  if (error) throw error
}

/** Download a Google Drive sharing URL and upload to Supabase Storage via Edge Function.
 *  The file must be publicly shared ("Anyone with the link can view").
 *  Returns the storage path string on success.
 */
export async function uploadFromUrl(userId, url) {
  const { data, error } = await supabase.functions.invoke('upload-from-url', {
    body: { url, user_id: userId },
  })
  if (error) throw error
  if (!data?.path) throw new Error('No storage path returned from upload function')
  return data.path
}

/** Upload a File object (from a device file input) to Supabase Storage.
 *  Preserves the original file extension and MIME type.
 *  Returns the storage path string on success.
 */
export async function uploadFile(userId, file) {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'audio'
  const fileName = `${crypto.randomUUID()}.${ext}`
  const path = `${userId}/${fileName}`

  const { error } = await supabase.storage
    .from('audio-recordings')
    .upload(path, file, { contentType: file.type || 'audio/*' })

  if (error) throw error
  return path
}
