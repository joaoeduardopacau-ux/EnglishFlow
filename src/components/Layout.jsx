import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import Logo from './Logo'
import NavIcon from './NavIcon'
import { LogOut, Sun, Moon, Bell, Flame, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useTheme } from '../contexts/ThemeContext'
import BottomNav from './BottomNav'

const navSections = [
  { title: null, items: [
    { to: '/', icon: 'home', label: 'Início' },
  ]},
  { title: 'Foco de Estudo', items: [
    { to: '/learn', icon: 'target', label: 'Foco de Estudo' },
  ]},
  { title: 'Praticar', items: [
    { to: '/flashcards', icon: 'bookmark',   label: 'Flashcards' },
    { to: '/listening',  icon: 'headphones', label: 'Listening' },
    { to: '/speaking',   icon: 'mic',        label: 'Speaking' },
    { to: '/games',      icon: 'gamepad',    label: 'Jogos' },
    { to: '/builder',    icon: 'translate',  label: 'Montar Frase' },
  ]},
  { title: 'Aprender', items: [
    { to: '/dictionary', icon: 'book',        label: 'Dicionário' },
    { to: '/songs',      icon: 'music',       label: 'Músicas' },
    { to: '/writing',    icon: 'pencil',      label: 'Writing' },
    { to: '/chatbot',    icon: 'brain',       label: 'AI Chatbot' },
    { to: '/review',     icon: 'bulb',        label: 'Revisão' },
    { to: '/level-test', icon: 'cap',         label: 'Nível' },
  ]},
  { title: 'Progresso', items: [
    { to: '/dashboard',    icon: 'chart',  label: 'Dashboard' },
    { to: '/streak',       icon: 'flame',  label: 'Streak' },
    { to: '/achievements', icon: 'medal',  label: 'Conquistas' },
    { to: '/leaderboard',  icon: 'trophy', label: 'Ranking' },
  ]},
]

const bottomNavItems = [
  { to: '/',           icon: 'home',       label: 'Início' },
  { to: '/learn',      icon: 'target',     label: 'Foco' },
  { to: '/flashcards', icon: 'bookmark',   label: 'Cards' },
  { to: '/listening',  icon: 'headphones', label: 'Ouvir' },
  { to: '/speaking',   icon: 'mic',        label: 'Falar' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const { xp, level, streak } = useProgress()
  const { theme, toggle: toggleTheme } = useTheme()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar desktop */}
      <SidebarContent />

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" onClick={() => setDrawerOpen(false)}>
          <div className="w-72 max-w-[85vw] bg-bg-base border-r border-border-subtle overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border-subtle">
              <SidebarBrand />
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-bg-elevated">
                <X size={18} />
              </button>
            </div>
            <NavItems onNavigate={() => setDrawerOpen(false)} />
            <SidebarFooter user={user} level={level} xp={xp} onSignOut={signOut} />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-30 items-center justify-end gap-3 px-8 py-4 bg-bg-base/80 backdrop-blur-xl border-b border-border-subtle">
          <StreakChip streak={streak} />
          <IconBtn title="Notificações">
            <Bell size={16} />
          </IconBtn>
          <IconBtn title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'} onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </IconBtn>
          <UserChip user={user} level={level} onSignOut={signOut} />
        </header>

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-bg-base/95 backdrop-blur-xl border-b border-border-subtle safe-pt">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setDrawerOpen(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-white">
              <Menu size={20} />
            </button>
            <img src="/mascot.png" alt="EnglishFlow" className="h-8 w-8 object-contain" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
              <Flame size={12} className="text-orange-400" />
              <span className="text-xs font-semibold text-orange-300 tabular-nums">{streak}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-32 lg:pb-8">
          <div key={location.pathname} className="page-enter page-enter-active">
            <Outlet />
          </div>
        </main>

        <BottomNav items={bottomNavItems} />
      </div>
    </div>
  )
}

function SidebarContent() {
  const { user, signOut } = useAuth()
  const { xp, level } = useProgress()
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border-subtle bg-bg-base sticky top-0 h-screen">
      <div className="px-5 pt-6 pb-5 flex items-center justify-between">
        <SidebarBrand />
      </div>
      <NavItems />
      <SidebarFooter user={user} level={level} xp={xp} onSignOut={signOut} />
    </aside>
  )
}

function SidebarBrand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 min-w-0">
      <img src="/icon-source.png" alt="" className="w-10 h-10 rounded-xl shrink-0" />
      <div className="leading-tight min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Sinceramente</p>
        <p className="text-white font-display font-black text-base tracking-tight -mt-0.5 truncate">
          English<span className="text-blue-400">Flow</span>
        </p>
      </div>
    </Link>
  )
}

function NavItems({ onNavigate }) {
  return (
    <nav className="flex-1 px-3 pb-3 space-y-4 overflow-y-auto scrollbar-hide">
      {navSections.map((section, si) => (
        <div key={si}>
          {section.title && (
            <p className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.14em] text-gray-500 font-semibold">
              {section.title}
            </p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <NavItem key={item.to} {...item} onClick={onNavigate} />
            ))}
          </div>
        </div>
      ))}
      <div>
        <NavItem to="/settings" icon="gear" label="Configurações" onClick={onNavigate} />
      </div>
    </nav>
  )
}

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-500/10 text-blue-300'
            : 'text-gray-400 hover:text-white hover:bg-bg-elevated'
        }`
      }
    >
      <NavIcon name={icon} size={22} />
      <span className="text-[13px] font-medium tracking-tight">{label}</span>
    </NavLink>
  )
}

function SidebarFooter({ user, level, xp, onSignOut }) {
  return (
    <div className="px-3 py-3 border-t border-border-subtle space-y-3">
      <Link
        to="/settings"
        className="block p-4 rounded-xl bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-blue-950/40 border border-blue-500/20 text-center hover:border-blue-500/40 transition-colors"
      >
        <div className="text-2xl mb-1">💎</div>
        <p className="text-sm font-semibold text-white">Seja Premium</p>
        <p className="text-[10px] text-gray-400 mt-1 leading-tight">Desbloqueie tudo e acompanhe seu progresso sem limites</p>
      </Link>
      <div className="flex items-center gap-2.5 px-1">
        <Avatar user={user} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-white truncate leading-tight">{user?.displayName || 'Usuário'}</p>
          <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">Nível {level} · {xp} XP</p>
        </div>
        <button onClick={onSignOut} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-bg-elevated" title="Sair">
          <LogOut size={14} />
        </button>
      </div>
    </div>
  )
}

function StreakChip({ streak }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30">
      <Flame size={14} className="text-orange-400" />
      <span className="text-xs font-semibold text-orange-300">
        {streak} {streak === 1 ? 'dia' : 'dias'} de sequência
      </span>
    </div>
  )
}

function UserChip({ user, level, onSignOut }) {
  return (
    <div className="flex items-center gap-2 pl-2">
      <Avatar user={user} />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-white truncate max-w-[140px]">{user?.displayName || 'Usuário'}</p>
        <p className="text-[11px] text-gray-500">Nível {level}</p>
      </div>
      <button onClick={onSignOut} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-bg-elevated ml-1" title="Sair">
        <LogOut size={14} />
      </button>
    </div>
  )
}

function IconBtn({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.03] border border-border-subtle text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors">
      {children}
    </button>
  )
}

function Avatar({ user }) {
  if (user?.photoURL) {
    return <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover" />
  }
  const letter = (user?.displayName || user?.email || '?')[0].toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white font-semibold text-sm">
      {letter}
    </div>
  )
}
