import { Link } from 'react-router-dom'
import { Layers, Gamepad2, Headphones, Blocks, BookOpen, Flame, TrendingUp, Trophy, Mic, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useFocus } from '../contexts/FocusContext'
import { dictionary } from '../data/dictionary'

const modules = [
  {
    to: '/flashcards',
    icon: Layers,
    title: 'Flashcards',
    desc: 'Aprenda palavras com cartões interativos',
    gradient: 'from-purple-700 to-purple-900',
  },
  {
    to: '/listening',
    icon: Headphones,
    title: 'Listening',
    desc: 'Treine seu ouvido com áudios em inglês',
    gradient: 'from-violet-600 to-purple-800',
  },
  {
    to: '/speaking',
    icon: Mic,
    title: 'Speaking',
    desc: 'Pratique pronúncia em voz alta',
    gradient: 'from-fuchsia-600 to-pink-800',
  },
  {
    to: '/builder',
    icon: Blocks,
    title: 'Montar Frase',
    desc: 'Construa frases em inglês a partir do português',
    gradient: 'from-fuchsia-700 to-purple-900',
  },
  {
    to: '/games',
    icon: Gamepad2,
    title: 'Jogos',
    desc: 'Pratique com mini-jogos didáticos',
    gradient: 'from-purple-600 to-indigo-900',
  },
  {
    to: '/dictionary',
    icon: BookOpen,
    title: 'Dicionário',
    desc: 'Explore todo o vocabulário do app',
    gradient: 'from-purple-800 to-slate-900',
  },
  {
    to: '/achievements',
    icon: Trophy,
    title: 'Conquistas',
    desc: 'Veja seu progresso e badges',
    gradient: 'from-amber-600 to-yellow-800',
  },
]

export default function Home() {
  const { user } = useAuth()
  const { level, xp, streak } = useProgress()
  const { grammar, theme, focus } = useFocus()
  const firstName = (user?.displayName || 'Estudante').split(' ')[0]
  const focusActive = focus.grammar !== 'any' || focus.theme !== 'all'

  const learned = JSON.parse(localStorage.getItem('learned_words') || '[]').length

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 via-bg-card to-bg-base border border-purple-800/30 p-6 lg:p-10">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-purple-300/80 text-sm font-medium">Olá, {firstName} 👋</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gradient mt-2 tracking-tight">
            Pronto para aprender?
          </h1>
          <p className="text-gray-400 mt-2 max-w-lg">
            Continue de onde parou ou escolha um novo módulo para hoje.
          </p>

          <div className="grid grid-cols-4 gap-3 mt-6 max-w-xl">
            <Stat icon={Flame} label="Sequência" value={`${streak}`} suffix="dias" color="text-orange-300" />
            <Stat icon={TrendingUp} label="Aprendidas" value={`${learned}`} suffix="palavras" color="text-emerald-300" />
            <Stat icon={Trophy} label="Nível" value={`${level}`} suffix={`${xp} XP`} color="text-purple-300" />
            <Stat icon={BookOpen} label="Dicionário" value={`${dictionary.length}`} suffix="palavras" color="text-fuchsia-300" />
          </div>
        </div>
      </section>

      {/* Learn focus hub */}
      <section>
        <Link
          to="/learn"
          className="block card-elevated p-5 lg:p-6 hover:border-border-bright hover:shadow-glow-sm transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-800 flex items-center justify-center shadow-glow-sm shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white">Foco de estudo</h3>
                <ArrowRight size={18} className="text-purple-400 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
              {focusActive ? (
                <>
                  <p className="text-sm text-gray-400 mt-1">Treinando agora:</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="badge-purple"><span className="mr-1">{grammar.emoji}</span>{grammar.label}</span>
                    <span className="badge-purple"><span className="mr-1">{theme.emoji}</span>{theme.label}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 mt-1">
                  Escolha uma gramática (presente, passado, perguntas…) e um tema antes de começar.
                </p>
              )}
            </div>
          </div>
        </Link>
      </section>

      {/* Modules grid */}
      <section>
        <h2 className="section-title">Módulos</h2>
        <p className="section-subtitle">Escolha uma atividade para começar</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {modules.map(({ to, icon: Icon, title, desc, gradient }) => (
            <Link
              key={to}
              to={to}
              className="group card p-5 hover:border-border-bright hover:shadow-glow-sm transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400 mt-1">{desc}</p>
              <div className="flex items-center gap-2 mt-4 text-purple-400 text-sm font-medium">
                <span>Começar</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-white">Biblioteca do app</h3>
          <div className="mt-4 space-y-2.5">
            <Row label="Palavras no dicionário" value={dictionary.length} />
            <Row label="Frases" value="ilimitadas" />
            <Row label="Focos de gramática" value="10" />
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-white">Dica de hoje</h3>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Estudar <span className="text-purple-300 font-medium">15 minutos por dia</span> é muito
            mais eficiente do que sessões longas uma vez por semana. Consistência é a chave.
          </p>
        </div>
      </section>
    </div>
  )
}

function Stat({ icon: Icon, label, value, suffix, color }) {
  return (
    <div className="bg-bg-elevated/60 border border-border-subtle rounded-2xl p-3">
      <Icon size={16} className={color} />
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      <p className="text-lg font-bold text-white">
        {value} <span className="text-xs font-normal text-gray-400">{suffix}</span>
      </p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}
