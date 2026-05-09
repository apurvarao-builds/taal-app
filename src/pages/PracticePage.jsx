export function PracticePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="text-center py-20">
        <div className="text-6xl mb-5">\U0001f941</div>
        <h1 className="text-2xl font-bold text-text-main mb-3">Practice Mode</h1>
        <p className="text-text-sub text-sm max-w-xs mx-auto leading-relaxed">
          Coming soon — tap your bol to detect BPM, then find matching tracks on Spotify to practice to.
        </p>
        <div className="mt-8 flex flex-col gap-3 max-w-xs mx-auto">
          {[
            { icon: '\U0001f3b5', label: 'BPM detection from tapping' },
            { icon: '\U0001f3a7', label: 'Spotify track matching' },
            { icon: '\U0001f4ca', label: 'Tempo tracking over time' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 text-left"
            >
              <span className="text-xl">{icon}</span>
              <span className="text-sm text-text-sub">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
