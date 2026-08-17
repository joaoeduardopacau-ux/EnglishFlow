import { useMemo } from 'react'
import { useProgress, ACHIEVEMENTS } from '../contexts/ProgressContext'
import { TrendingUp, Award, Target, Zap, Calendar, Flame, BookOpen, Star, BarChart3 } from 'lucide-react'

const MODULE_LABELS = {
  flashcards: { label: 'Flashcards', color: '#a855f7', emoji: '📚' },
  games: { label: 'Jogos', color: '#8b5cf6', emoji: '🎮' },
  listening: { label: 'Listening', color: '#7c3aed', emoji: '🎧' },
  builder: { label: 'Montar Frase', color: '#c084fc', emoji: '🧱' },
  speaking: { label: 'Speaking', color: '#e879f9', emoji: '🎙️' },
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function getDateArray(days) {
  const dates = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

export default function Dashboard() {
  const {
    xp, level, totalCorrect, totalAttempts, streak, bestStreak,
    perModule, dailyLog, dailyGoal, achievements, xpInLevel, xpToNext,
  } = useProgress()

  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  const todayXp = dailyLog[todayISO()]?.xp || 0
  const goalPercent = Math.min((todayXp / dailyGoal) * 100, 100)

  // Heatmap - últimos 90 dias
  const heatmapDates = useMemo(() => getDateArray(91), [])
  const maxXpInPeriod = useMemo(() => {
    return Math.max(1, ...heatmapDates.map(d => dailyLog[d]?.xp || 0))
  }, [dailyLog, heatmapDates])

  // Gráfico XP últimos 7 dias
  const last7Days = useMemo(() => getDateArray(7), [])
  const maxXp7 = Math.max(1, ...last7Days.map(d => dailyLog[d]?.xp || 0))

  // Total de dias ativos
  const activeDays = Object.keys(dailyLog).length
  const totalXpEver = Object.values(dailyLog).reduce((sum, d) => sum + (d.xp || 0), 0)

  // Últimas conquistas
  const recentAchievements = achievements.slice(-3).map(id =>
    ACHIEVEMENTS.find(a => a.id === id)
  ).filter(Boolean).reverse()

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-800 flex items-center justify-center shadow-glow-sm">
          <BarChart3 size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm">Seu progresso em detalhes</p>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BigStatCard icon={Star} label="Nível" value={level} sub={`${xp} XP totais`} color="from-purple-600 to-purple-900" />
        <BigStatCard icon={Flame} label="Sequência" value={`${streak}`} sub={`Melhor: ${bestStreak || streak}`} color="from-orange-500 to-red-700" />
        <BigStatCard icon={Target} label="Precisão" value={`${accuracy}%`} sub={`${totalCorrect}/${totalAttempts}`} color="from-emerald-500 to-teal-800" />
        <BigStatCard icon={Calendar} label="Dias ativos" value={activeDays} sub={`de ${Math.max(1, activeDays)} totais`} color="from-blue-500 to-indigo-800" />
      </div>

      {/* Meta diária */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-700 flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Meta de hoje</h3>
              <p className="text-xs text-gray-400">Continue estudando para atingir sua meta diária</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{todayXp}<span className="text-gray-500 text-sm">/{dailyGoal}</span></p>
            <p className="text-xs text-gray-400">XP hoje</p>
          </div>
        </div>
        <div className="progress-bar h-3">
          <div
            className="progress-fill transition-all duration-500"
            style={{ width: `${goalPercent}%` }}
          />
        </div>
        {goalPercent >= 100 ? (
          <p className="text-sm text-emerald-400 mt-3 flex items-center gap-1">
            <span>🎉</span> Meta atingida! Continue para ganhar mais XP.
          </p>
        ) : (
          <p className="text-sm text-gray-400 mt-3">
            Faltam <span className="text-purple-300 font-semibold">{dailyGoal - todayXp} XP</span> para atingir sua meta hoje.
          </p>
        )}
      </div>

      {/* Progresso do nível */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-700 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nível {level} → {level + 1}</h3>
              <p className="text-xs text-gray-400">Ganhe XP para subir de nível</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white font-mono">{xpInLevel}/{xpToNext}</p>
            <p className="text-xs text-gray-400">XP</p>
          </div>
        </div>
        <div className="progress-bar h-3">
          <div
            className="progress-fill transition-all duration-500"
            style={{ width: `${(xpInLevel / Math.max(xpToNext, 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Gráfico últimos 7 dias */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={20} className="text-purple-400" />
          <h3 className="text-lg font-bold text-white">Últimos 7 dias</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-40 pt-4">
          {last7Days.map(date => {
            const dayXp = dailyLog[date]?.xp || 0
            const height = maxXp7 > 0 ? (dayXp / maxXp7) * 100 : 0
            const d = new Date(date + 'T00:00:00')
            const dayName = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][d.getDay()]
            const isToday = date === todayISO()
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="flex-1 w-full flex items-end relative">
                  {dayXp > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {dayXp} XP
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-fuchsia-600 to-purple-400 shadow-glow-sm'
                        : dayXp > 0
                        ? 'bg-gradient-to-t from-purple-800 to-purple-500'
                        : 'bg-bg-elevated'
                    }`}
                    style={{ height: `${Math.max(height, dayXp > 0 ? 8 : 4)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${isToday ? 'text-purple-300' : 'text-gray-500'}`}>
                  {dayName}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Heatmap 90 dias */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-purple-400" />
            <h3 className="text-lg font-bold text-white">Atividade (últimos 90 dias)</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Menos</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map(i => (
                <div key={i} className="w-3 h-3 rounded" style={{ background: heatColor(i) }} />
              ))}
            </div>
            <span>Mais</span>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
          {heatmapDates.map(date => {
            const xp = dailyLog[date]?.xp || 0
            const intensity = xp / maxXpInPeriod
            return (
              <div
                key={date}
                className="aspect-square rounded transition-transform hover:scale-125 cursor-help"
                style={{ background: xp > 0 ? heatColor(intensity) : '#1e1b2e' }}
                title={`${date}: ${xp} XP`}
              />
            )
          })}
        </div>
      </div>

      {/* Progresso por módulo */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={20} className="text-purple-400" />
          <h3 className="text-lg font-bold text-white">Progresso por módulo</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(perModule).map(([key, data]) => {
            const info = MODULE_LABELS[key] || { label: key, color: '#a855f7', emoji: '📖' }
            const acc = data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 0
            const barWidth = data.attempts > 0 ? Math.min(100, (data.correct / 100) * 100) : 0
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info.emoji}</span>
                    <span className="text-sm font-semibold text-white">{info.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-400">{data.correct} acertos</span>
                    <span className="text-purple-300 font-semibold">{acc}%</span>
                  </div>
                </div>
                <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(barWidth, data.correct > 0 ? 3 : 0)}%`,
                      background: `linear-gradient(90deg, ${info.color}, ${info.color}dd)`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Conquistas recentes */}
      {recentAchievements.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award size={20} className="text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Conquistas recentes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentAchievements.map(a => (
              <div key={a.id} className="bg-bg-elevated rounded-xl p-4 border border-purple-800/30">
                <div className="text-3xl mb-2">{a.emoji}</div>
                <p className="text-sm font-semibold text-white">{a.label}</p>
                <p className="text-xs text-gray-400 mt-1">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total XP */}
      <div className="card-elevated p-6 text-center">
        <p className="text-gray-400 text-sm">XP acumulado total</p>
        <p className="text-4xl font-bold text-gradient mt-2">{totalXpEver.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">em {activeDays} dia{activeDays !== 1 ? 's' : ''} de estudo</p>
      </div>
    </div>
  )
}

function BigStatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className={`card-elevated p-4 bg-gradient-to-br ${color} border-white/10`}>
      <Icon size={22} className="text-white/90" />
      <p className="text-xs text-white/70 mt-2">{label}</p>
      <p className="text-2xl lg:text-3xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-white/60 mt-1">{sub}</p>
    </div>
  )
}

function heatColor(intensity) {
  if (intensity === 0) return '#1e1b2e'
  if (intensity < 0.25) return '#4c1d95'  // purple-900
  if (intensity < 0.5) return '#6d28d9'   // purple-700
  if (intensity < 0.75) return '#8b5cf6'  // purple-500
  return '#c084fc'                          // purple-400
}
