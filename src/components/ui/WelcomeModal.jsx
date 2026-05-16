import { Mic, Drum, Library, BookOpen, X, ChevronRight } from 'lucide-react'

const FEATURES = [
  {
    Icon: Mic,
    title: 'Practice Mode',
    desc: 'Tap the mic and clap or speak your bols. We detect your BPM and tell you the laya — Vilambit, Madhya, Drut, and beyond.',
  },
  {
    Icon: Drum,
    title: 'Taal Reference',
    desc: 'Browse all 14 Hindustani taals with beat cycle visuals, vibhag structure, and theka bols. Tap "See taals" after detecting a tempo to see matching cycles.',
  },
  {
    Icon: Library,
    title: 'Bol Library',
    desc: 'Upload and organise your practice recordings. Filter by laya or performer, expand a card to play back audio.',
  },
  {
    Icon: BookOpen,
    title: 'Journal',
    desc: 'Log your practice sessions — what you worked on, how it felt, what to revisit.',
  },
]

export function WelcomeModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gold">Welcome to Taal</h2>
            <p className="text-sm text-text-sub mt-0.5">Your Kathak practice companion</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text-main transition-colors p-1 -mr-1 -mt-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={15} className="text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main">{title}</p>
                <p className="text-xs text-text-sub mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-bg font-semibold text-sm py-3 rounded-xl transition-colors active:scale-95"
          >
            Get started <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
