import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, Layers, Gamepad2, Headphones, Blocks, BookOpen, LogOut, Mic, Trophy, Sun, Moon, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useTheme } from '../contexts/ThemeContext'
import BottomNav from './BottomNav'

const navItems = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/learn', icon: Sparkles, label: 'Foco de Estudo' },
  { to: '/flashcards', icon: Layers, label: 'Flashcards' },
  { to: '/games', icon: Gamepad2, label: 'Jogos' },
  { to: '/listening', icon: Headphones, label: 'Listening' },
  { to: '/speaking', icon: Mic, label: 'Speaking' },
  { to: '/builder', icon: Blocks, label: 'Montar Frase' },
  { to: '/dictionary', icon: BookOpen, label: 'Dicionário' },
  { to: '/achievements', icon: Trophy, label: 'Conquistas' },
]

// Bottom nav on mobile — keep it to 5 most-used items
const bottomNavItems = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/learn', icon: Sparkles, label: 'Foco' },
  { to: '/flashcards', icon: Layers, label: 'Cards' },
  { to: '/listening', icon: Headphones, label: 'Ouvir' },
  { to: '/speaking', icon: Mic, label: 'Falar' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const { xp, level, xpInLevel, xpToNext, streak } = useProgress()
  const { theme, toggle: toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border-subtle bg-bg-base/80 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-6 flex items-center justify-between">
          <Logo />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-bg-elevated text-gray-400 hover:text-white transition-colors"
            title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* XP banner */}
        <div className="px-4 mb-3">
          <div className="card px-4 py-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-purple-300 font-semibold">Nível {level}</span>
              <span className="text-gray-500 font-mono">{xp} XP</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(xpInLevel / Math.max(xpToNext, 1)) * 100}%` }} />
            </div>
            {streak > 0 && (
              <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                <span>🔥</span> {streak} dia{streak > 1 ? 's' : ''} de sequência
              </p>
            )}
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-950/40 text-white shadow-glow-sm border border-purple-800/40'
                    : 'text-gray-400 hover:text-white hover:bg-bg-elevated'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border-subtle">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar user={user} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-bg-elevated text-gray-400 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-bg-base/80 backdrop-blur-xl border-b border-border-subtle safe-pt">
          <div className="flex items-center justify-between px-5 py-4">
            <Logo compact />
            <div className="flex items-center gap-1.5">
              <div className="px-2.5 py-1 rounded-full bg-purple-950/40 border border-purple-800/40 text-xs font-semibold text-purple-300 font-mono">
                Lv.{level} · {xp}XP
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-400"
                title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={signOut} className="p-2 rounded-lg text-gray-400">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-24 lg:pb-8">
          <div key={location.pathname} className="page-enter page-enter-active">
            <Outlet />
          </div>
        </main>

        <BottomNav items={bottomNavItems} />
      </div>
    </div>
  )
}

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-glow-sm">
        <span className="text-white text-lg font-bold">L</span>
      </div>
      {!compact && (
        <div>
          <p className="text-white font-bold tracking-tight">LinguaFlow</p>
          <p className="text-xs text-gray-500">English Trainer</p>
        </div>
      )}
      {compact && <p className="text-white font-bold tracking-tight">LinguaFlow</p>}
    </div>
  )
}

function Avatar({ user }) {
  if (user?.photoURL) {
    return <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover" />
  }
  const letter = (user?.displayName || user?.email || '?')[0].toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold text-sm">
      {letter}
    </div>
  )
}
