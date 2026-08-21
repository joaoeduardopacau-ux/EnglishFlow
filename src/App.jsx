import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProgressProvider } from './contexts/ProgressContext'
import { StageProvider } from './contexts/StageContext'
import { FocusProvider } from './contexts/FocusContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ReviewProvider } from './contexts/ReviewContext'
import AchievementToasts from './components/AchievementToasts'
import InstallPrompt from './components/InstallPrompt'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'

// Lazy — split rotas menos usadas
const Flashcards    = lazy(() => import('./pages/Flashcards'))
const Games         = lazy(() => import('./pages/Games'))
const Listening     = lazy(() => import('./pages/Listening'))
const SentenceBuilder = lazy(() => import('./pages/SentenceBuilder'))
const Dictionary    = lazy(() => import('./pages/Dictionary'))
const Speaking      = lazy(() => import('./pages/Speaking'))
const Achievements  = lazy(() => import('./pages/Achievements'))
const Learn         = lazy(() => import('./pages/Learn'))
const Dashboard     = lazy(() => import('./pages/Dashboard'))
const StreakCalendar = lazy(() => import('./pages/StreakCalendar'))
const Review        = lazy(() => import('./pages/Review'))
const Writing       = lazy(() => import('./pages/Writing'))
const Songs         = lazy(() => import('./pages/Songs'))
const LevelTest     = lazy(() => import('./pages/LevelTest'))
const Settings      = lazy(() => import('./pages/Settings'))
const Leaderboard   = lazy(() => import('./pages/Leaderboard'))
const Chatbot       = lazy(() => import('./pages/Chatbot'))
const Privacy       = lazy(() => import('./pages/Privacy'))
const Terms         = lazy(() => import('./pages/Terms'))
const NotFound      = lazy(() => import('./pages/NotFound'))

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
        <img
          src="/mascot.png"
          alt="EnglishFlow"
          className="w-16 h-16 object-contain animate-pulse-slow drop-shadow-[0_0_16px_rgba(59,130,246,0.4)]"
        />
        <div className="w-32 h-1 bg-bg-elevated rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ProgressProvider>
            <ReviewProvider>
              <StageProvider>
                <FocusProvider>
                  <AchievementToasts />
                  <InstallPrompt />
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <Layout />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<Home />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="streak" element={<StreakCalendar />} />
                        <Route path="review" element={<Review />} />
                        <Route path="writing" element={<Writing />} />
                        <Route path="songs" element={<Songs />} />
                        <Route path="level-test" element={<LevelTest />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="chatbot" element={<Chatbot />} />
                        <Route path="learn" element={<Learn />} />
                        <Route path="flashcards" element={<Flashcards />} />
                        <Route path="games" element={<Games />} />
                        <Route path="listening" element={<Listening />} />
                        <Route path="builder" element={<SentenceBuilder />} />
                        <Route path="speaking" element={<Speaking />} />
                        <Route path="dictionary" element={<Dictionary />} />
                        <Route path="achievements" element={<Achievements />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </FocusProvider>
              </StageProvider>
            </ReviewProvider>
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
