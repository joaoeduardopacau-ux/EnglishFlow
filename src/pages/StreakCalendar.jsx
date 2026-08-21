import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { Flame, ChevronLeft, ChevronRight, Award, Zap, Calendar as CalIcon } from 'lucide-react'
import EmptyState from '../components/EmptyState'

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function isoDate(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

export default function StreakCalendar() {
  const { dailyLog, streak, bestStreak } = useProgress()
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Meta: dias ativos deste mês
  const activeDaysInMonth = useMemo(() => {
    let count = 0
    for (let d = 1; d <= daysInMonth; d++) {
      if ((dailyLog[isoDate(year, month, d)]?.xp || 0) > 0) count++
    }
    return count
  }, [dailyLog, year, month, daysInMonth])

  // XP total do mês
  const monthTotalXp = useMemo(() => {
    let total = 0
    for (let d = 1; d <= daysInMonth; d++) {
      total += dailyLog[isoDate(year, month, d)]?.xp || 0
    }
    return total
  }, [dailyLog, year, month, daysInMonth])

  const goPrev = () => setViewDate(new Date(year, month - 1, 1))
  const goNext = () => setViewDate(new Date(year, month + 1, 1))
  const goToday = () => setViewDate(new Date())

  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  // Grade do calendário
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center shadow-glow-sm">
          <Flame size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Streak Calendar</h1>
          <p className="text-gray-400 text-sm">Acompanhe seus dias de estudo</p>
        </div>
      </div>

      {/* Empty state se nunca estudou */}
      {streak === 0 && activeDaysInMonth === 0 && (bestStreak || 0) === 0 && (
        <EmptyState
          icon={<Flame size={22} />}
          title="Comece seu primeiro streak"
          desc="Estude pelo menos uma atividade hoje pra acender a chama. A cada dia consecutivo, o número do streak sobe."
          action={<Link to="/" className="btn-primary">Começar agora</Link>}
        />
      )}

      {/* Stats do streak */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox
          icon={Flame}
          label="Atual"
          value={streak}
          sub={streak === 1 ? 'dia' : 'dias'}
          gradient="from-orange-500 to-red-700"
        />
        <StatBox
          icon={Award}
          label="Melhor"
          value={bestStreak || streak}
          sub={(bestStreak || streak) === 1 ? 'dia' : 'dias'}
          gradient="from-yellow-500 to-orange-700"
        />
        <StatBox
          icon={Zap}
          label="Este mês"
          value={activeDaysInMonth}
          sub={`de ${daysInMonth} dias`}
          gradient="from-purple-600 to-fuchsia-800"
        />
      </div>

      {/* Calendário */}
      <div className="card-elevated p-6">
        {/* Navegação */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goPrev}
            className="p-2 rounded-lg hover:bg-bg-elevated text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-white">{MONTHS[month]} {year}</h2>
            {!isCurrentMonth && (
              <button onClick={goToday} className="text-xs text-purple-300 hover:text-purple-200 mt-1">
                Voltar para hoje
              </button>
            )}
          </div>
          <button
            onClick={goNext}
            className="p-2 rounded-lg hover:bg-bg-elevated text-gray-400 hover:text-white transition-colors"
            disabled={isCurrentMonth}
          >
            <ChevronRight size={20} className={isCurrentMonth ? 'opacity-30' : ''} />
          </button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-xs text-gray-500 font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Grade */}
        <div className="grid grid-cols-7 gap-2">
          {cells.map((day, idx) => {
            if (day === null) return <div key={idx} />

            const iso = isoDate(year, month, day)
            const dayData = dailyLog[iso]
            const hasActivity = (dayData?.xp || 0) > 0
            const isToday = iso === todayISO()
            const isFuture = new Date(iso + 'T23:59:59') > now

            let bgClass = 'bg-bg-elevated'
            if (isFuture) bgClass = 'bg-bg-base opacity-40'
            else if (hasActivity) {
              if (dayData.xp >= 100) bgClass = 'bg-gradient-to-br from-orange-500 to-red-700 shadow-glow-sm'
              else if (dayData.xp >= 50) bgClass = 'bg-gradient-to-br from-purple-500 to-fuchsia-700'
              else bgClass = 'bg-gradient-to-br from-purple-800 to-purple-950'
            }

            const ringClass = isToday
              ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-bg-base'
              : ''

            return (
              <div
                key={idx}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative group cursor-help transition-transform hover:scale-110 ${bgClass} ${ringClass}`}
                title={hasActivity ? `${iso}: ${dayData.xp} XP, ${dayData.correct}/${dayData.attempts} acertos` : `${iso}: sem atividade`}
              >
                <span className={`font-semibold ${hasActivity ? 'text-white' : 'text-gray-500'}`}>{day}</span>
                {hasActivity && (
                  <span className="text-[9px] text-white/80 font-mono">{dayData.xp}</span>
                )}
                {isToday && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full" />
                )}
              </div>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-800 to-purple-950" />
            <span>&lt;50 XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-500 to-fuchsia-700" />
            <span>50+ XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-500 to-red-700" />
            <span>100+ XP 🔥</span>
          </div>
        </div>
      </div>

      {/* Resumo do mês */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <CalIcon size={18} className="text-purple-400" />
          <h3 className="text-base font-bold text-white">Resumo de {MONTHS[month]}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-elevated rounded-lg p-3">
            <p className="text-xs text-gray-400">XP no mês</p>
            <p className="text-xl font-bold text-white mt-1">{monthTotalXp}</p>
          </div>
          <div className="bg-bg-elevated rounded-lg p-3">
            <p className="text-xs text-gray-400">Dias estudados</p>
            <p className="text-xl font-bold text-white mt-1">
              {activeDaysInMonth}
              <span className="text-sm text-gray-500"> / {daysInMonth}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Motivação */}
      {streak >= 3 && (
        <div className="card-elevated p-5 bg-gradient-to-br from-orange-900/40 via-bg-card to-bg-base border-orange-800/30">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🔥</div>
            <div>
              <p className="text-white font-bold">Você está mandando bem!</p>
              <p className="text-sm text-gray-400 mt-1">
                {streak} dias consecutivos de estudo. Continue assim para manter sua sequência!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ icon: Icon, label, value, sub, gradient }) {
  return (
    <div className={`card-elevated p-4 bg-gradient-to-br ${gradient} border-white/10`}>
      <Icon size={20} className="text-white/90" />
      <p className="text-xs text-white/70 mt-2">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-white/60">{sub}</p>
    </div>
  )
}
