import { Link } from 'react-router-dom'
import { ArrowRight, Flame } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useFocus } from '../contexts/FocusContext'
import DailyGoalCard from '../components/DailyGoalCard'
import WolfMascot from '../components/WolfMascot'
import NavIcon from '../components/NavIcon'

const modules = [
  { to: '/flashcards', icon: 'bookmark',   title: 'Flashcards'    },
  { to: '/listening',  icon: 'headphones', title: 'Listening'     },
  { to: '/speaking',   icon: 'mic',        title: 'Speaking'      },
  { to: '/games',      icon: 'gamepad',    title: 'Jogos'         },
  { to: '/builder',    icon: 'translate',  title: 'Montar Frase'  },
  { to: '/dictionary', icon: 'book',       title: 'Dicionário'    },
]

export default function Home() {
  const { user } = useAuth()
  const { streak } = useProgress()
  const { grammar, theme, focus } = useFocus()
  const firstName = (user?.displayName || 'Estudante').split(' ')[0]
  const focusActive = focus.grammar !== 'any' || focus.theme !== 'all'

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-8 pb-10 lg:pt-12 lg:pb-16 space-y-8 lg:space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card/70 p-6 lg:p-8">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-sm text-gray-500">Olá, {firstName}</p>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight mt-1">
              Pronto pra aprender?
            </h1>
            <p className="text-sm text-gray-400 mt-2">Seu inglês de hoje começa aqui.</p>
            {streak > 0 && (
              <p className="text-sm text-gray-400 mt-4 flex items-center gap-1.5">
                <Flame size={14} className="text-orange-400" />
                {streak} dia{streak > 1 ? 's' : ''} de sequência
              </p>
            )}
          </div>
          <WolfMascot size={148} className="hidden sm:block" />
        </div>
      </section>

      <section><DailyGoalCard compact /></section>

      <section>
        <Link to="/learn" className="block group card p-4 lg:p-5 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="shrink-0 transition-transform group-hover:scale-105"><NavIcon name="target" size={44} /></div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-white">Foco de estudo</h3>
              {focusActive ? (
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="badge-purple"><span className="mr-1">{grammar.emoji}</span>{grammar.label}</span>
                  <span className="badge-purple"><span className="mr-1">{theme.emoji}</span>{theme.label}</span>
                </div>
              ) : <p className="text-sm text-gray-500 mt-0.5">Escolha uma gramática e um tema</p>}
            </div>
            <ArrowRight size={18} className="text-gray-500 shrink-0 transition-all group-hover:translate-x-0.5 group-hover:text-blue-400" />
          </div>
        </Link>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="kbd">Praticar</h2>
          <span className="text-[11px] text-gray-600">{modules.length} atividades</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {modules.map(({ to, icon, title }) => (
            <Link key={to} to={to} className="group card p-4 lg:p-5 flex flex-col items-center text-center hover:border-blue-500/45 transition-colors">
              <div className="transition-transform group-hover:scale-105"><NavIcon name={icon} size={52} /></div>
              <h3 className="text-[13px] font-semibold text-white mt-3 leading-tight">{title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
