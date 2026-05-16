import { NavLink, useNavigate } from 'react-router-dom'
import { Home, BookOpen, FolderOpen, Library, Zap, User, Drum, HelpCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/utils'

const nav = [
  { to: '/',            label: 'Home',        Icon: Home,       end: true },
  { to: '/journal',     label: 'Journal',     Icon: BookOpen,   end: false },
  { to: '/projects',    label: 'Projects',    Icon: FolderOpen, end: false },
  { to: '/bol-library', label: 'Bol Library', Icon: Library,    end: false },
  { to: '/practice',    label: 'Practice',    Icon: Zap,        end: false },
  { to: '/taals',       label: 'Taals',       Icon: Drum,       end: false },
]

export function Sidebar({ onHelp }) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const meta = user?.user_metadata ?? {}
  const displayName = meta.display_name || user?.email?.split('@')[0] || 'Dancer'
  const initials = displayName[0].toUpperCase()

  return (
    <aside className="hidden md:flex flex-col w-56 bg-surface border-r border-border min-h-screen px-3 py-5 flex-shrink-0">
      <div className="px-3 mb-8">
        <h1 className="text-xl font-bold text-gold tracking-tight">Taal</h1>
        <p className="text-xs text-muted mt-0.5">Kathak Practice</p>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive ? 'bg-gold/15 text-gold font-medium' : 'text-text-sub hover:bg-surface-2 hover:text-text-main')
            }>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border pt-3 mt-3 space-y-1">
        <button onClick={onHelp}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-sub hover:bg-surface-2 hover:text-text-main transition-colors">
          <HelpCircle size={16} className="flex-shrink-0" />
          <span>Help</span>
        </button>
        <button onClick={() => navigate('/profile')}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-sub hover:bg-surface-2 hover:text-text-main transition-colors">
          <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <span className="truncate">{displayName}</span>
          <User size={13} className="ml-auto flex-shrink-0" />
        </button>
      </div>
    </aside>
  )
}
