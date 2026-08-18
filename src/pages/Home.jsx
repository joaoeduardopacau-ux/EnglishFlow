import { Link } from 'react-router-dom'
import { ArrowRight, Flame } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useFocus } from '../contexts/FocusContext'
import DailyGoalCard from '../components/DailyGoalCard'
import SharkMascot from '../components/SharkMascot'
import NavIcon from '../components/NavIcon'

// Módulos principais na Home — reduzidos aos mais usados no dia a dia.
// (Dashboard e Conquistas continuam no sidebar.)
const modules = [
  { to: '/flashcards', icon: 'bookmark',   title: 'Flashcards'   },
  { to: '/listening',  icon: 'headphones', title: 'Listening'    },
  { to: '/speaking',   icon: 'mic',        title: 'Speaking'     },
  { to: '/games',      icon: 'gamepad',    title: 'Jogos'        },
  { to: '/builder',    icon: 'translate',  title: 'Montar Frase' },
  { to: '/dictionary', icon: 'book',       title: 'Dicionário'   },
]

export default function Home() {
  const { user } = useAuth()
  const { streak } = useProgress()
  const { grammar, theme, focus } = useFocus()
  const firstName = (user?.displayName || 'Estudante').split(' ')[0]
  const focusActive = focus.grammar !== 'any' || focus.theme !== 'all'

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-10 lg:py-16 space-y-12">
      {/* Hero — minimal */}
      <section className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Olá, {firstName}</p>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-white tracking-tight mt-1">
            Pronto pra aprender?
          </h1>
          {streak > 0 && (
            <p className="text-sm text-gray-400 mt-3 flex items-center gap-1.5">
              <Flame size={14} className="text-orange-400" />
              {streak} dia{streak > 1 ? 's' : ''} de sequência
            </p>
          )}
        </div>
        <div className="hidden sm:block shrink-0 opacity-90">
          <SharkMascot size={120} animated />
        </div>
      </section>

      {/* Meta diária — compacta */}
      <section>
        <DailyGoalCard compact />
      </section>

      {/* Foco de estudo — CTA principal */}
      <section>
        <Link
          to="/learn"
          className="block group card-elevated p-5 lg:p-6 hover:border-border-bright hover:shadow-glow-sm transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 group-hover:scale-105 transition-transform">
              <NavIcon name="target" size={48} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white">Foco de estudo</h3>
              {focusActive ? (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="badge-purple"><span className="mr-1">{grammar.emoji}</span>{grammar.label}</span>
                  <span className="badge-purple"><span className="mr-1">{theme.emoji}</span>{theme.label}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-0.5">Escolha uma gramática e um tema</p>
              )}
            </div>
            <ArrowRight size={18} className="text-gray-500 shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
          </div>
        </Link>
      </section>

      {/* Módulos — grade minimalista */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
            Praticar
          </h2>
          <span className="text-xs text-gray-600">{modules.length} atividades</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {modules.map(({ to, icon, title }) => (
            <Link
              key={to}
              to={to}
              className="group card p-5 flex flex-col items-center text-center hover:border-border-bright hover:-translate-y-0.5 transition-all"
            >
              <div className="group-hover:scale-110 transition-transform">
                <NavIcon name={icon} size={56} />
              </div>
              <h3 className="text-sm font-semibold text-white mt-3">{title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
