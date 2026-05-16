import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '../lib/utils'

const TAALS = [
  {
    name: 'Teentaal', alt: 'Teen Taal / Tritaal',
    beats: 16, vibhag: [4, 4, 4, 4],
    sam: 0, khali: [8], tali: [0, 4, 12],
    theka: ['Dha','Dhin','Dhin','Dha','Dha','Dhin','Dhin','Dha','Dha','Tin','Tin','Ta','Ta','Dhin','Dhin','Dha'],
    context: 'Khayal · Kathak · All speeds', kathak: true,
  },
  {
    name: 'Ektaal', alt: '12 Beats',
    beats: 12, vibhag: [2, 2, 2, 2, 2, 2],
    sam: 0, khali: [2, 6], tali: [0, 4, 8, 10],
    theka: ['Dhin','Dhin','DhageNa','Tinna','Kita','Dha','DhageNa','Tinna','Kita','Dha','Dhin','Na'],
    context: 'Vilambit Khayal · Drut Khayal · Kathak', kathak: true,
  },
  {
    name: 'Jhaptaal', alt: 'Jhaptal',
    beats: 10, vibhag: [2, 3, 2, 3],
    sam: 0, khali: [5], tali: [0, 2, 7],
    theka: ['Dhi','Na','Dhi','Dhi','Na','Ti','Na','Dhi','Dhi','Na'],
    context: 'Madhya / Drut Khayal · Kathak', kathak: true,
  },
  {
    name: 'Rupak', alt: 'Roopak',
    beats: 7, vibhag: [3, 2, 2],
    sam: 0, khali: [0], tali: [3, 5],
    theka: ['Tin','Tin','Na','Dhi','Na','Dhi','Na'],
    context: 'Bhajan · Instrumental · Kathak · Sam = Khali', kathak: true,
  },
  {
    name: 'Keherwa', alt: 'Kaharwa',
    beats: 8, vibhag: [4, 4],
    sam: 0, khali: [4], tali: [0],
    theka: ['Dha','Ge','Na','Ti','Na','Ke','Dhi','Na'],
    context: 'Light Classical · Folk · Thumri · Bhajan', kathak: false,
  },
  {
    name: 'Dadra', alt: '6 Beats',
    beats: 6, vibhag: [3, 3],
    sam: 0, khali: [3], tali: [0],
    theka: ['Dha','Dhi','Na','Dha','Ti','Na'],
    context: 'Thumri · Ghazal · Light Classical', kathak: false,
  },
  {
    name: 'Tilwada', alt: 'Tilwara',
    beats: 16, vibhag: [4, 4, 4, 4],
    sam: 0, khali: [8], tali: [0, 4, 12],
    theka: ['Dha','Tere','Kite','Dha','Dha','Tere','Kite','Dha','Dha','Tere','Kite','Ta','Tete','Kite','Dha','Dha'],
    context: 'Vilambit Khayal only', kathak: false,
  },
  {
    name: 'Jhoomra', alt: 'Jhumra',
    beats: 14, vibhag: [3, 4, 3, 4],
    sam: 0, khali: [7], tali: [0, 3, 10],
    theka: ['Dhin','Dhin','DhageNa','Tita','Kita','Dha','Dhin','Dhin','DhageNa','Tita','Kita','Dha','Dhin','Na'],
    context: 'Vilambit Khayal · Dhrupad', kathak: false,
  },
  {
    name: 'Dhamar', alt: '14 Beats',
    beats: 14, vibhag: [5, 2, 3, 4],
    sam: 0, khali: [7], tali: [0, 5, 10],
    theka: ['Ka','Dhi','Ta','Dhi','Ta','Dhi','Ta','Ka','Dhi','Ta','Ka','Ti','Ta','Dhi'],
    context: 'Dhrupad · Holi / Dhamar compositions · Kathak', kathak: true,
  },
  {
    name: 'Chautal', alt: 'Chowtal',
    beats: 12, vibhag: [2, 2, 2, 2, 2, 2],
    sam: 0, khali: [4, 8], tali: [0, 6, 8, 10],
    theka: ['Dha','Dha','Din','Ta','Kita','Dha','Din','Ta','Tita','Kata','Gadi','Gana'],
    context: 'Dhrupad · Pakhawaj tradition', kathak: false,
  },
  {
    name: 'Tivra', alt: 'Teora / Tevra',
    beats: 7, vibhag: [3, 2, 2],
    sam: 0, khali: [], tali: [0, 3, 5],
    theka: ['Dha','Din','Ta','Tita','Kata','Gadi','Gana'],
    context: 'Dhrupad / Dhamar · No khali beat', kathak: false,
  },
  {
    name: 'Sultaal', alt: 'Sooltaal',
    beats: 10, vibhag: [2, 2, 2, 2, 2],
    sam: 0, khali: [2, 6], tali: [0, 4, 8],
    theka: ['Dha','Dha','Din','Ta','Kata','Dha','Tita','Kata','Gadi','Gana'],
    context: 'Dhrupad · Pakhawaj · Instrumental', kathak: false,
  },
  {
    name: 'Deepchandi', alt: 'Dipchandi',
    beats: 14, vibhag: [3, 4, 3, 4],
    sam: 0, khali: [7], tali: [0, 3, 10],
    theka: ['Dha','Dhin','Dhin','Dha','Dha','Tin','Tin','Ta','Dhin','Dhin','Dha','Dha','Dhin','Dhin'],
    context: 'Thumri · Hori · Kajri · Kathak abhinaya', kathak: true,
  },
  {
    name: 'Addha', alt: 'Addha Teentaal',
    beats: 16, vibhag: [4, 4, 4, 4],
    sam: 0, khali: [8], tali: [0, 4, 12],
    theka: ['Dha','Dhin','—','Dha','Dha','Dhin','—','Dha','Dha','Tin','—','Ta','Ta','Dhin','—','Dha'],
    context: 'Semi-classical · Thumri · Light forms', kathak: false,
  },
]

const FILTERS = ['All', 'Kathak', 'Other']

function BeatCycle({ taal }) {
  const { vibhag, sam, khali, tali, theka } = taal
  const groups = []
  let beatIdx = 0
  for (const groupSize of vibhag) {
    const group = []
    for (let i = 0; i < groupSize; i++) { group.push(beatIdx); beatIdx++ }
    groups.push(group)
  }
  const compact = taal.beats > 12

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {groups.map((group, gi) => (
          <div key={gi} className="flex gap-1 items-end">
            {group.map((bi) => {
              const isSam   = bi === sam
              const isKhali = khali.includes(bi)
              const isTali  = tali.includes(bi) && !isKhali
              return (
                <div key={bi} className="flex flex-col items-center gap-0.5">
                  <div className={cn(
                    'rounded-full flex items-center justify-center font-semibold border',
                    compact ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-xs',
                    isSam   ? 'bg-gold text-bg border-gold' :
                    isKhali ? 'bg-transparent text-muted border-border' :
                    isTali  ? 'bg-gold/10 text-gold border-gold/40' :
                              'bg-surface-2 text-text-sub border-border/50'
                  )}>
                    {isSam ? 'X' : isKhali ? '0' : bi + 1}
                  </div>
                  {!compact && (
                    <span className="text-[9px] text-muted text-center leading-tight w-8 truncate">
                      {theka[bi]}
                    </span>
                  )}
                </div>
              )
            })}
            {gi < groups.length - 1 && (
              <div className="w-px bg-border/60 self-stretch mb-4 mx-0.5" />
            )}
          </div>
        ))}
      </div>
      {compact && (
        <p className="text-[10px] text-muted font-mono leading-relaxed">
          {theka.join(' · ')}
        </p>
      )}
    </div>
  )
}

function TaalCard({ taal, bpm }) {
  const cyclesPerMin = bpm ? (bpm / taal.beats).toFixed(1) : null
  const msPerBeat    = bpm ? Math.round(60000 / bpm) : null

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-text-main">{taal.name}</h3>
            {taal.kathak && (
              <span className="text-[10px] bg-gold/15 text-gold border border-gold/30 rounded-full px-2 py-0.5 font-medium">Kathak</span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">{taal.alt}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-gold tabular-nums">{taal.beats}</p>
          <p className="text-[10px] text-muted">matras</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-[10px]">
        <span className="bg-surface-2 text-text-sub rounded px-2 py-0.5">{taal.vibhag.join(' + ')}</span>
        <span className="bg-surface-2 text-text-sub rounded px-2 py-0.5">Sam: beat {taal.sam + 1}</span>
        {taal.khali.length > 0
          ? <span className="bg-surface-2 text-text-sub rounded px-2 py-0.5">Khali: beat{taal.khali.length > 1 ? 's' : ''} {taal.khali.map(k => k + 1).join(', ')}</span>
          : <span className="bg-surface-2 text-muted rounded px-2 py-0.5">No khali</span>
        }
      </div>

      <BeatCycle taal={taal} />

      <p className="text-xs text-text-sub">{taal.context}</p>

      {bpm && (
        <div className="border-t border-border/60 pt-2 flex gap-4 text-xs flex-wrap">
          <span className="text-text-sub">At <span className="text-gold font-medium">{bpm} BPM</span>:</span>
          <span className="text-text-sub"><span className="text-text-main font-medium">{cyclesPerMin}</span> cycles/min</span>
          <span className="text-text-sub"><span className="text-text-main font-medium">{msPerBeat}ms</span>/beat</span>
        </div>
      )}
    </div>
  )
}

export function TaalPage() {
  const [searchParams] = useSearchParams()
  const bpm = searchParams.get('bpm') ? Number(searchParams.get('bpm')) : null
  const [filter, setFilter] = useState('All')

  const filtered = TAALS.filter((t) => {
    if (filter === 'Kathak') return t.kathak
    if (filter === 'Other')  return !t.kathak
    return true
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Taal Reference</h1>
        <p className="text-sm text-text-sub mt-1">14 Hindustani taals — beat cycles, vibhags, and thekas.</p>
      </div>

      {bpm && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <div>
            <p className="text-xs text-muted">Your detected tempo</p>
            <p className="text-lg font-bold text-gold">{bpm} BPM</p>
          </div>
          <p className="text-xs text-text-sub ml-2">Each card shows cycles per minute and milliseconds per beat at this tempo.</p>
        </div>
      )}

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              filter === f
                ? 'bg-gold/20 border-gold/50 text-gold'
                : 'bg-surface border-border text-text-sub hover:border-gold/30')}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((taal) => (
          <TaalCard key={taal.name} taal={taal} bpm={bpm} />
        ))}
      </div>

      <div className="border border-border rounded-xl p-4 space-y-2 text-xs text-text-sub">
        <p className="font-medium text-text-main mb-1">Legend</p>
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-bg font-bold text-[10px]">X</div><span>Sam — first beat of the cycle</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold font-bold text-[10px]">2</div><span>Tali — clap beat</span></div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted font-bold text-[10px]">0</div><span>Khali — wave / empty beat</span></div>
      </div>
    </div>
  )
}
