import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'

export default function AchievementToasts() {
  const { newAchievements, dismissAchievement } = useProgress()

  // Auto-dismiss each toast after 4s
  useEffect(() => {
    if (newAchievements.length === 0) return
    const timers = newAchievements.map(a =>
      setTimeout(() => dismissAchievement(a.id), 4000)
    )
    return () => timers.forEach(clearTimeout)
  }, [newAchievements, dismissAchievement])

  if (newAchievements.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {newAchievements.map((a) => (
        <div
          key={a.id}
          className="pointer-events-auto card-elevated px-4 py-3 flex items-center gap-3 shadow-glow-lg border-purple-700/50 animate-[slideIn_0.3s_ease-out]"
          style={{ minWidth: 260 }}
        >
          <span className="text-3xl">{a.emoji}</span>
          <div className="flex-1">
            <p className="text-xs text-purple-300 font-semibold uppercase tracking-wide">Conquista!</p>
            <p className="text-sm font-bold text-white">{a.label}</p>
            <p className="text-xs text-gray-400">{a.desc}</p>
          </div>
          <button
            onClick={() => dismissAchievement(a.id)}
            className="text-gray-500 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
