import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Library, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'

const nav = [
  { to: '/',            label: 'Home',     Icon: Home,     end: true },
  { to: '/journal',     label: 'Journal',  Icon: BookOpen, end: false },
  { to: '/bol-library', label: 'Bols',     Icon: Library,  end: false },
  { to: '/practice',    label: 'Practice', Icon: Zap,      end: false },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 flex safe-bottom">
      {nav.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
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
