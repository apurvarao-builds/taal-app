import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { WelcomeModal } from '../ui/WelcomeModal'

export function AppShell() {
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('taal_welcomed')) {
      setHelpOpen(true)
    }
  }, [])

  function handleClose() {
    localStorage.setItem('taal_welcomed', '1')
    setHelpOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar onHelp={() => setHelpOpen(true)} />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
      <WelcomeModal open={helpOpen} onClose={handleClose} />
    </div>
  )
}
