import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from './Logo'
import NavIcon from './NavIcon'
import { LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useTheme } from '../contexts/ThemeContext'
import BottomNav from './BottomNav'

// Sidebar agrupada em seções — reduz ruído visual sem esconder nada.
const navSections = [
  {
    title: null,
    items: [
      { to: '/',          icon: 'home',   label: 'Início' },
      { to: '/learn',     icon: 'target', label: 'Foco de Estudo' },
    ],
  },
  {
    title: 'Praticar',
    items: [
      { to: '/flashcards', icon: 'bookmark',   label: 'Flashcards' },
      { to: '/listening',  icon: 'headphones', label: 'Listening' },
      { to: '/speaking',   icon: 'mic',        label: 'Speaking' },
      { to: '/games',      icon: 'gamepad',    label: 'Jogos' },
      { to: '/builder',    icon: 'translate',  label: 'Montar Frase' },
    ],
  },
  {
    title: 'Aprender',
    items: [
      { to: '/dictionary', icon: 'book',        label: 'Dicionário' },
      { to: '/songs',      icon: 'headphones',  label: 'Músicas' },
      { to: '/writing',    icon: 'notepad',     label: 'Writing' },
      { to: '/chatbot',    icon: 'chat',        label: 'AI Chatbot' },
      { to: '/review',     icon: 'bulb',        label: 'Revisão' },
      { to: '/level-test', icon: 'certificate', label: 'Nível' },
    ],
  },
  {
    title: 'Progresso',
    items: [
      { to: '/dashboard',    icon: 'chart',  label: 'Dashboard' },
      { to: '/streak',       icon: 'flame',  label: 'Streak' },
      { to: '/achievements', icon: 'medal',  label: 'Conquistas' },
      { to: '/leaderboard',  icon: 'trophy', label: 'Ranking' },
    ],
  },
]

// Bottom nav on mobile — 5 most-used items
const bottomNavItems = [
  { to: '/',           icon: 'home',       label: 'Início' },
  { to: '/learn',      icon: 'target',     label: 'Foco' },
  { to: '/flashcards', icon: 'bookmark',   label: 'Cards' },
  { to: '/listening',  icon: 'headphones', label: 'Ouvir' },
  { to: '/speaking',   icon: 'mic',        label: 'Falar' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const { xp, level } = useProgress()
  const { theme, toggle: toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border-subtle bg-bg-base sticky top-0 h-screen">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <LogoBadge />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-bg-elevated text-gray-500 hover:text-white transition-colors"
            title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-3 pb-3 space-y-6 overflow-y-auto scrollbar-hide">
          {navSections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ to, icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-950/40 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-bg-elevated'
                      }`
                    }
                  >
                    <NavIcon name={icon} size={22} />
                    <span className="text-sm font-medium">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-border-subtle">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-purple-950/40 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-bg-elevated'
              }`
            }
          >
            <NavIcon name="gear" size={22} />
            <span className="text-sm font-medium">Configurações</span>
          </NavLink>
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar user={user} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || 'Usuário'}</p>
              <p className="text-[11px] text-gray-500 truncate">Nível {level} · {xp} XP</p>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 rounded-lg hover:bg-bg-elevated text-gray-500 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-bg-base/90 backdrop-blur-xl border-b border-border-subtle safe-pt">
          <div className="flex items-center justify-between px-5 py-4">
            <LogoBadge compact />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-mono">Lv.{level} · {xp}XP</span>
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
      <Logo size={compact ? 36 : 38} />
      <p className={`text-white font-display font-black tracking-tight ${compact ? 'text-base' : 'text-[15px]'}`}>
        EnglishFlow
      </p>
    </div>
  )
}

function Avatar({ user }) {
  if (user?.photoURL) {
    return <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
  }
  const letter = (user?.displayName || user?.email || '?')[0].toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold text-xs">
      {letter}
    </div>
  )
}
