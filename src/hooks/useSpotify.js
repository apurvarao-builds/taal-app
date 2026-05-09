import { useRef } from 'react'

const CLIENT_ID     = import.meta.env.VITE_SPOTIFY_CLIENT_ID     || '31b6c3fd163241d8b9dbd5edff9035a0'
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || ''

const GENRE_SEEDS = {
  'Bollywood':            'indian',
  'Hindustani Classical': 'classical',
  'Fusion':               'world-music',
  'Any':                  'pop,dance',
}

export function useSpotify() {
  const tokenCache = useRef(null)

  async function getToken() {
    if (tokenCache.current && Date.now() < tokenCache.current.expiresAt) {
      return tokenCache.current.value
    }
    if (!CLIENT_SECRET) {
      throw new Error('VITE_SPOTIFY_CLIENT_SECRET is not set. Add it to your Vercel environment variables.')
    }
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
      body: 'grant_type=client_credentials',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error_description || 'Spotify auth failed')
    tokenCache.current = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 }
    return tokenCache.current.value
  }

  async function getRecommendations(bpm, genre) {
    const token = await getToken()
    const seeds = GENRE_SEEDS[genre] ?? GENRE_SEEDS['Any']
    const params = new URLSearchParams({
      seed_genres: seeds,
      target_tempo: Math.round(bpm),
      min_tempo:    Math.round(bpm - 15),
      max_tempo:    Math.round(bpm + 15),
      limit:        20,
      market:       'US',
    })
    const res = await fetch(`https://api.spotify.com/v1/recommendations?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Spotify recommendations failed')
    return (data.tracks ?? []).filter((t) => t.external_urls?.spotify)
  }

  return { getRecommendations }
}
