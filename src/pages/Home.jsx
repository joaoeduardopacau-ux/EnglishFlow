import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress, ACHIEVEMENTS } from '../contexts/ProgressContext'
import { useFocus } from '../contexts/FocusContext'
import NavIcon from '../components/NavIcon'
import LineChart from '../components/charts/LineChart'
import CircularProgress from '../components/charts/CircularProgress'
import HexagonBadge from '../components/charts/HexagonBadge'

const practiceModules = [
  { to: '/flashcards', icon: 'bookmark',   title: 'Flashcards',   sub: 'Estude palavras de forma inteligente' },
  { to: '/listening',  icon: 'headphones', title: 'Listening',    sub: 'Treine sua compreensão' },
  { to: '/speaking',   icon: 'mic',        title: 'Speaking',     sub: 'Pratique sua pronúncia' },
  { to: '/games',      icon: 'gamepad',    title: 'Jogos',        sub: 'Aprenda se divertindo', highlight: true },
  { to: '/builder',    icon: 'translate',  title: 'Montar Frase', sub: 'Monte frases e fixe o conteúdo' },
  { to: '/dictionary', icon: 'book',       title: 'Dicionário',   sub: 'Pesquise e aprenda novas palavras' },
]

function todayISO() { return new Date().toISOString().slice(0,10) }
function daysAgoISO(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0,10)
}
const DAY_LABELS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

export default function Home() {
  const { user } = useAuth()
  const { xp, level, xpInLevel, xpToNext, streak, dailyLog, dailyGoal, totalCorrect, totalAttempts, achievements: unlocked } = useProgress()
  const { focus, grammar, theme } = useFocus()

  const firstName = (user?.displayName || 'Estudante').split(' ')[0]
  const focusActive = focus.grammar !== 'any' || focus.theme !== 'all'

  const todayXp = dailyLog[todayISO()]?.xp || 0
  const todayMin = Math.round(todayXp / 5) // ~5 XP por minuto
  const goalMin = Math.round(dailyGoal / 5)
  const metaSegments = 12
  const metaFilled = Math.round((todayXp / dailyGoal) * metaSegments)

  // Line chart: últimos 7 dias — Seg..Dom
  const weekData = useMemo(() => {
    const arr = []
    for (let i = 6; i >= 0; i--) {
      const iso = daysAgoISO(i)
      const d = new Date(iso)
      const xp = dailyLog[iso]?.xp || 0
      arr.push({ label: DAY_LABELS[d.getDay()], value: Math.round(xp / 5) })
    }
    return arr
  }, [dailyLog])

  const weekTotalMin = weekData.reduce((s, d) => s + d.value, 0)
  const monthTotalMin = useMemo(() => {
    let total = 0
    for (let i = 0; i < 30; i++) {
      const iso = daysAgoISO(i)
      total += Math.round((dailyLog[iso]?.xp || 0) / 5)
    }
    return total
  }, [dailyLog])

  // Precisão
  const precision = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  const precisionLabel = precision >= 90 ? 'Excelente!' : precision >= 75 ? 'Muito bom!' : precision >= 50 ? 'Continue!' : 'Comece!'

  // Últimas conquistas — pega as 3 mais recentes desbloqueadas
  const recentAchievements = useMemo(() => {
    const unlockedIds = new Set(unlocked || [])
    return ACHIEVEMENTS.filter(a => unlockedIds.has(a.id)).slice(-3).reverse()
  }, [unlocked])

  // Próximo nível
  const nextLevelProgress = xpToNext > 0 ? Math.round((xpInLevel / xpToNext) * 100) : 0
  const xpTotal = xpInLevel + xpToNext
  const xpNeededForNext = xpToNext - xpInLevel

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-10 pt-6 pb-10 lg:pt-8 lg:pb-16 space-y-6 lg:space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-bg-card border border-border-subtle p-6 lg:p-10">
        {/* Wolf + concentric circles, ambos no MESMO container pra centralizar */}
        <div className="hidden sm:flex absolute right-4 lg:right-16 top-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 items-center justify-center pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-blue-500/20" />
          <div className="absolute inset-4 rounded-full border border-blue-500/15" />
          <div className="absolute inset-10 rounded-full border border-blue-500/10" />
          <img
            src="/mascot.png"
            alt="Lobo-guará"
            className="relative w-2/3 h-2/3 object-contain opacity-95"
          />
        </div>
        <div className="relative max-w-md">
          <p className="text-3xl lg:text-4xl font-display font-bold text-white leading-tight">
            Olá, {firstName}! <span className="inline-block">👋</span>
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tight mt-1">
            Pronto pra aprender?
          </h1>
          <p className="text-sm lg:text-base text-gray-400 mt-3">
            Seu inglês de hoje começa aqui.
          </p>
        </div>
      </section>

      {/* META DE HOJE */}
      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <NavIcon name="target" size={22} />
            <span className="kbd">Meta de hoje</span>
          </div>
          <span className="text-xs font-semibold text-blue-400">+{todayXp} XP</span>
        </div>
        <div className="flex gap-1 mb-3">
          {Array.from({ length: metaSegments }).map((_, i) => (
            <div key={i} className={`flex-1 h-2.5 rounded-full transition-colors ${
              i < metaFilled ? 'bg-blue-500' : 'bg-white/10'
            }`} />
          ))}
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-display font-bold text-white">
            {todayMin}
            <span className="text-sm text-gray-500 font-normal">/ {goalMin} min</span>
          </p>
          <p className="text-xs text-gray-500">
            {todayXp >= dailyGoal
              ? '🎉 Meta batida hoje!'
              : `Faltam ${dailyGoal - todayXp} XP · continue assim!`}
          </p>
        </div>
      </section>

      {/* Foco de estudo (só aparece se não tá ativo) */}
      {!focusActive && (
        <section>
          <Link to="/learn" className="block group card p-4 hover:border-border-bright transition-colors">
            <div className="flex items-center gap-3">
              <NavIcon name="target" size={40} />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">Definir foco de estudo</h3>
                <p className="text-xs text-gray-500">Escolha uma gramática e um tema pra treinar</p>
              </div>
              <ChevronRight size={16} className="text-gray-500 group-hover:text-purple-400" />
            </div>
          </Link>
        </section>
      )}

      {focusActive && (
        <section>
          <Link to="/learn" className="block group card p-4 hover:border-border-bright transition-colors">
            <div className="flex items-center gap-3">
              <NavIcon name="target" size={40} />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">Foco de estudo ativo</h3>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="badge-purple"><span className="mr-1">{grammar.emoji}</span>{grammar.label}</span>
                  <span className="badge-purple"><span className="mr-1">{theme.emoji}</span>{theme.label}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-500 group-hover:text-purple-400" />
            </div>
          </Link>
        </section>
      )}

      {/* O QUE VOCÊ QUER PRATICAR? */}
      <section>
        <h2 className="text-base lg:text-lg font-display font-bold text-white mb-4">
          O que você quer praticar?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {practiceModules.map(({ to, icon, title, sub, highlight }) => (
            <Link
              key={to}
              to={to}
              className={`group card p-4 flex flex-col items-center text-center transition-all hover:-translate-y-0.5 ${
                highlight ? 'border-orange-500/50 shadow-[0_0_28px_-4px_rgba(249,115,22,0.35)]' : 'hover:border-border-bright'
              }`}
            >
              <div className="transition-transform group-hover:scale-105">
                <NavIcon name={icon} size={44} />
              </div>
              <h3 className="text-[13px] font-semibold text-white mt-3 leading-tight">{title}</h3>
              <p className="text-[11px] text-gray-500 mt-1 leading-snug">{sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Progresso */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="kbd">Seu progresso</span>
            <span className="text-[10px] text-gray-500">Últimos 7 dias</span>
          </div>
          <div className="text-blue-400">
            <LineChart data={weekData} color="#3b82f6" height={140} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <StatBlock v={todayMin} label="min hoje" accent />
            <StatBlock v={weekTotalMin} label="min esta semana" />
            <StatBlock v={monthTotalMin} label="min este mês" />
          </div>
        </div>

        {/* Precisão */}
        <div className="card p-5 flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="kbd">Precisão</span>
          </div>
          <CircularProgress
            value={precision}
            size={140}
            color="#3b82f6"
            label={`${precision}%`}
            sublabel={precisionLabel}
          />
          <p className="text-xs text-gray-500 mt-3">
            {totalAttempts > 0 ? `${totalCorrect} acertos em ${totalAttempts} tentativas` : 'Comece a estudar!'}
          </p>
        </div>

        {/* Próximo nível */}
        <div className="card p-5 flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="kbd">Próximo nível</span>
          </div>
          <HexagonBadge level={level + 1} progress={nextLevelProgress} />
          <p className="text-sm font-semibold text-white mt-3">
            {xpInLevel} <span className="text-gray-500 font-normal">/ {xpTotal} XP</span>
          </p>
          <p className="text-xs text-gray-500">
            Faltam {xpNeededForNext} XP para o nível {level + 1}
          </p>
        </div>
      </section>

      {/* CONQUISTAS */}
      {recentAchievements.length > 0 && (
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="kbd">Últimas conquistas</span>
            <Link to="/achievements" className="text-xs text-blue-400 hover:text-blue-300">Ver todas →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentAchievements.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                <div className="text-2xl">{a.emoji}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{a.label}</p>
                  <p className="text-xs text-gray-500 truncate">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

function StatBlock({ v, label, accent }) {
  return (
    <div>
      <p className={`text-xl font-display font-bold ${accent ? 'text-blue-400' : 'text-white'}`}>{v}</p>
      <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{label}</p>
    </div>
  )
}
