import { NavLink } from 'react-router-dom'
import { BookOpen, FolderOpen, Library } from 'lucide-react'
import { cn } from '../../lib/utils'

const nav = [
  { to: '/journal',     label: 'Journal',  Icon: BookOpen },
  { to: '/projects',    label: 'Projects', Icon: FolderOpen },
  { to: '/bol-library', label: 'Bols',     Icon: Library },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 flex safe-bottom">
      {nav.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center justify-center py-3 text-xs transition-colors',
              isActive ? 'text-gold' : 'text-muted hover:text-text-sub',
            )
          }
        >
          <Icon size={20} />
          <span className="mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
