import { useState, useEffect, useRef } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import { Target, Check, ChevronDown } from 'lucide-react'
import { fireConfetti } from '../lib/confetti'
import { playLevelUp } from '../lib/sounds'

const GOAL_PRESETS = [
  { xp: 20, label: 'Casual', desc: '~5 min/dia', emoji: '☕' },
  { xp: 50, label: 'Regular', desc: '~10 min/dia', emoji: '📚' },
  { xp: 100, label: 'Sério', desc: '~20 min/dia', emoji: '🔥' },
  { xp: 200, label: 'Intenso', desc: '~40 min/dia', emoji: '⚡' },
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function DailyGoalCard({ compact = false }) {
  const { dailyLog, dailyGoal, setDailyGoal } = useProgress()
  const [showPicker, setShowPicker] = useState(false)

  const todayXp = dailyLog[todayISO()]?.xp || 0
  const percent = Math.min((todayXp / dailyGoal) * 100, 100)
  const isComplete = percent >= 100

  // Detecta quando meta é completada e dispara confetti/som
  const wasCompleteRef = useRef(isComplete)
  useEffect(() => {
    if (isComplete && !wasCompleteRef.current) {
      fireConfetti({ count: 80, origin: { x: 0.5, y: 0.3 } })
      playLevelUp()
    }
    wasCompleteRef.current = isComplete
  }, [isComplete])

  if (compact) {
    return (
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-white">Meta de hoje</span>
          </div>
          <span className="text-xs font-mono text-purple-300">{todayXp}/{dailyGoal} XP</span>
        </div>
        <div className="progress-bar h-2">
          <div className="progress-fill transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
        {isComplete && (
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <Check size={12} /> Meta completa!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="card-elevated p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-glow-sm transition-all ${
            isComplete
              ? 'bg-gradient-to-br from-emerald-500 to-teal-700'
              : 'bg-gradient-to-br from-purple-600 to-fuchsia-800'
          }`}>
            {isComplete ? <Check size={22} className="text-white" /> : <Target size={22} className="text-white" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Meta diária</h3>
            <p className="text-xs text-gray-400">
              {isComplete ? '🎉 Você atingiu sua meta!' : 'Estude um pouco todo dia'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPicker(!showPicker)}
          className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-bg-elevated transition-colors"
        >
          Ajustar
          <ChevronDown size={14} className={`transition-transform ${showPicker ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Progresso */}
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-2xl font-bold text-white">
          {todayXp}
          <span className="text-gray-500 text-sm font-normal">/{dailyGoal} XP</span>
        </p>
        <p className="text-xs text-gray-400">{Math.round(percent)}%</p>
      </div>

      <div className="progress-bar h-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isComplete
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-purple-600 to-fuchsia-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {!isComplete && (
        <p className="text-xs text-gray-400 mt-3">
          Faltam <span className="text-purple-300 font-semibold">{dailyGoal - todayXp} XP</span>
          {dailyGoal - todayXp <= 20 && ' — quase lá! 💪'}
        </p>
      )}

      {/* Picker de meta */}
      {showPicker && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <p className="text-xs text-gray-400 mb-3">Escolha sua meta diária:</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {GOAL_PRESETS.map(preset => (
              <button
                key={preset.xp}
                onClick={() => {
                  setDailyGoal(preset.xp)
                  setShowPicker(false)
                }}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  dailyGoal === preset.xp
                    ? 'border-purple-500 bg-purple-950/40 shadow-glow-sm'
                    : 'border-border-subtle bg-bg-elevated hover:border-purple-800/60'
                }`}
              >
                <div className="text-2xl mb-1">{preset.emoji}</div>
                <p className="text-sm font-semibold text-white">{preset.label}</p>
                <p className="text-[10px] text-gray-400">{preset.desc}</p>
                <p className="text-xs font-mono text-purple-300 mt-1">{preset.xp} XP</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
