import { NavLink } from 'react-router-dom'
import { BookOpen, FolderOpen, Library, LogOut } from 'lucide-react'
import { signOut } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/utils'

const nav = [
  { to: '/journal',     label: 'Journal',     Icon: BookOpen },
  { to: '/projects',    label: 'Projects',    Icon: FolderOpen },
  { to: '/bol-library', label: 'Bol Library', Icon: Library },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)

  return (
    <aside className="hidden md:flex flex-col w-56 bg-surface border-r border-border min-h-screen px-3 py-5 flex-shrink-0">
      {/* Logo */}
      <div className="px-3 mb-8">
        <h1 className="text-xl font-bold text-gold tracking-tight">Taal</h1>
        <p className="text-xs text-muted mt-0.5">Kathak Practice</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {nav.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-gold/15 text-gold font-medium'
                  : 'text-text-sub hover:bg-surface-2 hover:text-text-main',
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="border-t border-border pt-3 mt-3">
        <p className="px-3 text-xs text-muted truncate mb-2">{user?.email}</p>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-text-sub hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
