import { Trophy, Flame, Target, TrendingUp } from 'lucide-react'
import { useProgress, ACHIEVEMENTS, levelFromXP, xpForLevel } from '../contexts/ProgressContext'

export default function Achievements() {
  const p = useProgress()
  const unlockedSet = new Set(p.achievements)
  const accuracy = p.totalAttempts > 0 ? Math.round((p.totalCorrect / p.totalAttempts) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <header className="mb-6">
        <h1 className="section-title">Conquistas</h1>
        <p className="section-subtitle">Acompanhe seu progresso e desbloqueie badges</p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard icon={TrendingUp} label="Nível" value={p.level} sub={`${p.xp} XP total`} />
        <StatCard icon={Target} label="Precisão" value={`${accuracy}%`} sub={`${p.totalCorrect}/${p.totalAttempts}`} />
        <StatCard icon={Flame} label="Sequência" value={`${p.streak}d`} sub={p.streak > 0 ? 'Continue assim!' : 'Pratique hoje'} />
        <StatCard icon={Trophy} label="Conquistas" value={`${unlockedSet.size}/${ACHIEVEMENTS.length}`} sub="desbloqueadas" />
      </div>

      {/* Level progress */}
      <div className="card-elevated p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">Progresso</p>
            <p className="text-lg font-bold text-white">Nível {p.level} → {p.level + 1}</p>
          </div>
          <p className="text-sm font-mono text-gray-400">
            {p.xpInLevel} / {p.xpToNext} XP
          </p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(p.xpInLevel / Math.max(p.xpToNext, 1)) * 100}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Faltam {Math.max(p.xpToNext - p.xpInLevel, 0)} XP para o próximo nível
        </p>
      </div>

      {/* Per-module */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Por módulo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ModuleCard name="Flashcards" emoji="🃏" stats={p.perModule.flashcards} />
          <ModuleCard name="Jogos" emoji="🎮" stats={p.perModule.games} />
          <ModuleCard name="Listening" emoji="🎧" stats={p.perModule.listening} />
          <ModuleCard name="Montar Frase" emoji="🧱" stats={p.perModule.builder} />
          <ModuleCard name="Speaking" emoji="🎙️" stats={p.perModule.speaking} />
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map(a => {
            const unlocked = unlockedSet.has(a.id)
            return (
              <div
                key={a.id}
                className={`card p-4 text-center transition-all ${unlocked ? 'border-purple-700/60 shadow-glow-sm' : 'opacity-50 grayscale'}`}
              >
                <div className="text-4xl mb-2">{a.emoji}</div>
                <p className="text-sm font-bold text-white">{a.label}</p>
                <p className="text-xs text-gray-400 mt-1">{a.desc}</p>
                {unlocked ? (
                  <span className="badge-purple mt-3 inline-block">Desbloqueada</span>
                ) : (
                  <span className="badge mt-3 inline-block bg-bg-elevated text-gray-500 border border-border-subtle">Bloqueada</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-purple-300">
        <Icon size={14} />
        <p className="text-xs font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  )
}

function ModuleCard({ name, emoji, stats }) {
  const acc = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <p className="font-semibold text-white">{name}</p>
      </div>
      <div className="mt-3 text-sm text-gray-400">
        <p>{stats.correct} acertos · {stats.attempts} tentativas</p>
        <div className="progress-bar mt-2">
          <div className="progress-fill" style={{ width: `${acc}%` }} />
        </div>
        <p className="text-xs font-mono text-gray-500 mt-1">{acc}% de precisão</p>
      </div>
    </div>
  )
}
