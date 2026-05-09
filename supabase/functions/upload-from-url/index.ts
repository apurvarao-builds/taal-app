import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function extractDriveFileId(url: string): string | null {
  try {
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (fileMatch) return fileMatch[1]
    const parsed = new URL(url)
    return parsed.searchParams.get('id')
  } catch {
    return null
  }
}

const EXT_MAP: Record<string, string> = {
  'audio/mpeg':  'mp3',
  'audio/mp3':   'mp3',
  'audio/mp4':   'm4a',
  'audio/x-m4a': 'm4a',
  'audio/ogg':   'ogg',
  'audio/opus':  'opus',
  'audio/wav':   'wav',
  'audio/x-wav': 'wav',
  'audio/webm':  'webm',
  'audio/aac':   'aac',
  'audio/flac':  'flac',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { url, user_id } = await req.json()
    if (!url || !user_id) return json({ error: 'Missing url or user_id' }, 400)

    const fileId = extractDriveFileId(url)
    if (!fileId) return json({ error: 'Could not parse a Google Drive file ID from that URL' }, 400)

    // confirm=t bypasses the virus-scan warning page for larger files
    const downloadUrl =
      `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`

    const driveRes = await fetch(downloadUrl, { redirect: 'follow' })
    if (!driveRes.ok) return json({ error: `Google Drive responded with ${driveRes.status}` }, 502)

    const contentType = (driveRes.headers.get('content-type') ?? 'audio/mpeg').split(';')[0].trim()

    if (contentType.includes('text/html')) {
      return json({ error: 'File is not publicly shared or requires sign-in. Set sharing to "Anyone with the link".' }, 400)
    }

    const fileBuffer = await driveRes.arrayBuffer()
    const ext = EXT_MAP[contentType] ?? 'audio'
    const path = `${user_id}/${crypto.randomUUID()}.${ext}`

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { error: uploadErr } = await supabase.storage
      .from('audio-recordings')
      .upload(path, fileBuffer, { contentType })

    if (uploadErr) return json({ error: uploadErr.message }, 500)

    return json({ path })
  } catch (err) {
    return json({ error: (err as Error).message ?? 'Unexpected error' }, 500)
  }
})
