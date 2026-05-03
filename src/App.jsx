import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthListener } from './hooks/useAuth'
import { useAuthStore } from './store/authStore'
import { AppShell } from './components/layout/AppShell'
import { AuthPage } from './pages/AuthPage'
import { JournalPage } from './pages/JournalPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { BolLibraryPage } from './pages/BolLibraryPage'

function AppRoutes() {
  const { session, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/journal" replace />} />
        <Route path="/journal"       element={<JournalPage />} />
        <Route path="/projects"      element={<ProjectsPage />} />
        <Route path="/projects/:id"  element={<ProjectDetailPage />} />
        <Route path="/bol-library"   element={<BolLibraryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/journal" replace />} />
    </Routes>
  )
}

export default function App() {
  useAuthListener()
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
