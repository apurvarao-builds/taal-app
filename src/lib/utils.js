import { format, parseISO } from 'date-fns'

/** Merge class names, filtering falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/** Format a date string (YYYY-MM-DD) to a human-readable form. */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy')
  } catch {
    return dateStr
  }
}

/** Format seconds to mm:ss */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export const CATEGORIES = ['Bols', 'Chakkar', 'Tatkaar', 'Composition', 'Freestyle']
export const ENTRY_TYPES = ['Exercise', 'Piece']

export const CATEGORY_COLORS = {
  Bols:        'bg-violet-900/60 text-violet-300',
  Chakkar:     'bg-blue-900/60 text-blue-300',
  Tatkaar:     'bg-emerald-900/60 text-emerald-300',
  Composition: 'bg-amber-900/60 text-amber-300',
  Freestyle:   'bg-rose-900/60 text-rose-300',
}

export const TYPE_COLORS = {
  Exercise: 'bg-surface-2 text-text-sub',
  Piece:    'bg-gold/20 text-gold',
}

export const LAYAS = ['Vilambit', 'Madhya', 'Drut']
export const PERFORMERS = ['Me', 'Guru', 'Reference']

export const LAYA_COLORS = {
  Vilambit: 'bg-purple-900/60 text-purple-300',
  Madhya:   'bg-teal-900/60 text-teal-300',
  Drut:     'bg-red-900/60 text-red-300',
}

export const PERFORMER_COLORS = {
  Me:        'bg-gold/20 text-gold',
  Guru:      'bg-emerald-900/60 text-emerald-300',
  Reference: 'bg-blue-900/60 text-blue-300',
}
