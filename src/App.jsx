import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProgressProvider } from './contexts/ProgressContext'
import { StageProvider } from './contexts/StageContext'
import { FocusProvider } from './contexts/FocusContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AchievementToasts from './components/AchievementToasts'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Flashcards from './pages/Flashcards'
import Games from './pages/Games'
import Listening from './pages/Listening'
import SentenceBuilder from './pages/SentenceBuilder'
import Dictionary from './pages/Dictionary'
import Speaking from './pages/Speaking'
import Achievements from './pages/Achievements'
import Learn from './pages/Learn'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center shadow-glow animate-pulse-slow">
          <span className="text-2xl">🌊</span>
        </div>
        <div className="w-32 h-1 bg-bg-elevated rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-700 to-purple-400 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <StageProvider>
            <FocusProvider>
              <AchievementToasts />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="learn" element={<Learn />} />
                  <Route path="flashcards" element={<Flashcards />} />
                  <Route path="games" element={<Games />} />
                  <Route path="listening" element={<Listening />} />
                  <Route path="builder" element={<SentenceBuilder />} />
                  <Route path="speaking" element={<Speaking />} />
                  <Route path="dictionary" element={<Dictionary />} />
                  <Route path="achievements" element={<Achievements />} />
                </Route>
              </Routes>
            </FocusProvider>
          </StageProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
