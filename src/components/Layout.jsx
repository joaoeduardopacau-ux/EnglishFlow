import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from './Logo'
import NavIcon from './NavIcon'
import { LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useTheme } from '../contexts/ThemeContext'
import BottomNav from './BottomNav'

// Cada item aponta pra um ícone em public/nav/*.png (via NavIcon)
const navItems = [
  { to: '/',             icon: 'home',        label: 'Início' },
  { to: '/dashboard',    icon: 'chart',       label: 'Dashboard' },
  { to: '/streak',       icon: 'flame',       label: 'Streak Calendar' },
  { to: '/review',       icon: 'bulb',        label: 'Revisão Diária' },
  { to: '/writing',      icon: 'notepad',     label: 'Writing' },
  { to: '/songs',        icon: 'headphones',  label: 'Músicas' },
  { to: '/videos',       icon: 'video',       label: 'Vídeos' },
  { to: '/level-test',   icon: 'certificate', label: 'Teste de Nível' },
  { to: '/chatbot',      icon: 'chat',        label: 'AI Chatbot' },
  { to: '/leaderboard',  icon: 'trophy',      label: 'Ranking' },
  { to: '/settings',     icon: 'gear',        label: 'Configurações' },
  { to: '/learn',        icon: 'target',      label: 'Foco de Estudo' },
  { to: '/flashcards',   icon: 'bookmark',    label: 'Flashcards' },
  { to: '/games',        icon: 'gamepad',     label: 'Jogos' },
  { to: '/listening',    icon: 'headphones',  label: 'Listening' },
  { to: '/speaking',     icon: 'mic',         label: 'Speaking' },
  { to: '/builder',      icon: 'translate',   label: 'Montar Frase' },
  { to: '/dictionary',   icon: 'book',        label: 'Dicionário' },
  { to: '/achievements', icon: 'medal',       label: 'Conquistas' },
]

// Bottom nav on mobile — keep it to 5 most-used items
const bottomNavItems = [
  { to: '/',           icon: 'home',       label: 'Início' },
  { to: '/learn',      icon: 'target',     label: 'Foco' },
  { to: '/flashcards', icon: 'bookmark',   label: 'Cards' },
  { to: '/listening',  icon: 'headphones', label: 'Ouvir' },
  { to: '/speaking',   icon: 'mic',        label: 'Falar' },
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
          <LogoBadge />
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
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-950/40 text-white shadow-glow-sm border border-purple-800/40'
                    : 'text-gray-400 hover:text-white hover:bg-bg-elevated'
                }`
              }
            >
              <NavIcon name={icon} size={26} />
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
            <LogoBadge compact />
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

function LogoBadge({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={42} className="shadow-glow-sm" />
      {!compact && (
        <div className="leading-tight">
          <p className="text-white font-display font-bold tracking-tight text-[15px]">Sinceramente</p>
          <p className="text-white font-display font-black tracking-tight text-[17px]">EnglishFlow</p>
        </div>
      )}
      {compact && (
        <p className="text-white font-display font-black tracking-tight">EnglishFlow</p>
      )}
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
