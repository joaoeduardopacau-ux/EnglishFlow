import { useStage } from '../contexts/StageContext'
import { useProgress } from '../contexts/ProgressContext'
import { Check } from 'lucide-react'

// Recommend a stage based on user's current level
function recommendedStageId(level) {
  if (level >= 6) return 'advanced'
  if (level >= 2) return 'intermediate'
  return 'beginner'
}

export default function StageSelector({ compact = false }) {
  const { stage, setStage, stages } = useStage()
  const { level } = useProgress()
  const recommended = recommendedStageId(level)

  if (compact) {
    // Tight pill row for inside cards / nav
    return (
      <div className="flex gap-2 flex-wrap">
        {stages.map(s => {
          const active = s.id === stage.id
          return (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                active
                  ? 'bg-purple-900/40 border-purple-600 text-white shadow-glow-sm'
                  : 'bg-bg-elevated border-border-subtle text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-1">{s.emoji}</span>{s.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Estágio de aprendizado</p>
          <p className="text-sm text-gray-400">Escolha o nível de dificuldade</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stages.map(s => {
          const active = s.id === stage.id
          const isRec = s.id === recommended
          return (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`card p-4 text-left transition-all relative ${
                active
                  ? 'border-purple-600 bg-purple-950/30 shadow-glow-sm'
                  : 'hover:border-border-bright'
              }`}
            >
              {active && (
                <Check size={14} className="absolute top-3 right-3 text-purple-300" />
              )}
              {!active && isRec && (
                <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold text-purple-300 bg-purple-950/50 border border-purple-800/40 px-2 py-0.5 rounded-full">
                  Recomendado
                </span>
              )}
              <div className="text-3xl mb-2">{s.emoji}</div>
              <p className="font-bold text-white">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.description}</p>
              <div className="flex items-center gap-2 mt-3 text-[10px] uppercase tracking-wider">
                <span className="badge-purple">{s.maxLevel === 'Ini-1' ? 'Ini-1' : 'até ' + s.maxLevel}</span>
                <span className="text-gray-500 font-mono">×{s.xpMultiplier.toFixed(2)} XP</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
