import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import { loadCloudProgress, saveCloudProgress, mergeProgress } from '../lib/cloudProgress'

// XP + achievements + daily streak.
// - localStorage é o cache rápido (funciona offline e em modo demo)
// - Se o usuário está logado com Firebase, também sincroniza com Firestore:
//     - no login: carrega do Firestore, faz merge com o local (preserva progresso
//       feito como convidado antes do login)
//     - durante a sessão: save debounced de 800ms
// Level formula: level = floor(sqrt(xp / 50)) → XP to next level rises smoothly.

const ProgressContext = createContext(null)

const DEFAULT_STATE = {
  xp: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  streak: 0,              // consecutive days with ≥1 correct answer
  lastActiveDate: null,   // ISO date string (yyyy-mm-dd)
  perModule: {
    flashcards: { correct: 0, attempts: 0 },
    games: { correct: 0, attempts: 0 },
    listening: { correct: 0, attempts: 0 },
    builder: { correct: 0, attempts: 0 },
    speaking: { correct: 0, attempts: 0 },
  },
  achievements: [], // unlocked achievement ids
}

// ── Achievements catalog ────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_step',      label: 'Primeiro passo',         desc: 'Acerte sua primeira resposta',          emoji: '🌱', test: s => s.totalCorrect >= 1 },
  { id: 'ten_correct',     label: 'Dez de dez',             desc: '10 respostas corretas',                  emoji: '⭐', test: s => s.totalCorrect >= 10 },
  { id: 'fifty_correct',   label: 'Meio-centenar',          desc: '50 respostas corretas',                  emoji: '🏅', test: s => s.totalCorrect >= 50 },
  { id: 'hundred_correct', label: 'Centurião',              desc: '100 respostas corretas',                 emoji: '🏆', test: s => s.totalCorrect >= 100 },
  { id: 'level_5',         label: 'Nível 5',                desc: 'Alcance o nível 5',                      emoji: '🎖️', test: s => levelFromXP(s.xp) >= 5 },
  { id: 'level_10',        label: 'Nível 10',               desc: 'Alcance o nível 10',                     emoji: '👑', test: s => levelFromXP(s.xp) >= 10 },
  { id: 'streak_3',        label: 'Embalando',              desc: '3 dias seguidos',                        emoji: '🔥', test: s => s.streak >= 3 },
  { id: 'streak_7',        label: 'Uma semana firme',       desc: '7 dias seguidos',                        emoji: '🔥', test: s => s.streak >= 7 },
  { id: 'streak_30',       label: 'Mês consistente',        desc: '30 dias seguidos',                       emoji: '🌋', test: s => s.streak >= 30 },
  { id: 'polyglot',        label: 'Poliglota em treinamento', desc: 'Use todos os módulos',                emoji: '🧠', test: s => Object.values(s.perModule).filter(m => m.attempts > 0).length >= 5 },
  { id: 'listen_ace',      label: 'Ouvido afinado',         desc: '20 acertos no Listening',                emoji: '👂', test: s => s.perModule.listening.correct >= 20 },
  { id: 'builder_ace',     label: 'Arquiteto de frases',    desc: '20 frases montadas',                     emoji: '🧱', test: s => s.perModule.builder.correct >= 20 },
  { id: 'speaker_ace',     label: 'Falante confiante',      desc: '20 acertos no Speaking',                 emoji: '🎙️', test: s => s.perModule.speaking.correct >= 20 },
]

export function levelFromXP(xp) {
  return Math.floor(Math.sqrt(xp / 50))
}
export function xpForLevel(n) {
  return 50 * n * n
}

const todayISO = () => new Date().toISOString().slice(0, 10)

function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00Z')
  const d2 = new Date(b + 'T00:00:00Z')
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
}

function normalizeState(parsed) {
  if (!parsed) return DEFAULT_STATE
  return {
    ...DEFAULT_STATE,
    ...parsed,
    perModule: { ...DEFAULT_STATE.perModule, ...(parsed.perModule || {}) },
  }
}

function readLocal(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? normalizeState(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid || 'guest'
  const storageKey = `progress:${uid}`
  const isCloudUser = Boolean(user?.uid) && user.uid !== 'guest' && user.uid !== 'demo-user'

  const [state, setState] = useState(DEFAULT_STATE)
  const [newAchievements, setNewAchievements] = useState([]) // queue for toasts
  const [hydrating, setHydrating] = useState(true)           // true enquanto carrega do Firestore
  // Ref pra saber se já hidratamos pra esse uid (evita dupla hidratação em React strict mode)
  const hydratedForUidRef = useRef(null)

  // ── Hidratação: local + (se logado) Firestore ─────────────
  useEffect(() => {
    let cancelled = false
    setHydrating(true)

    // 1. Carrega local primeiro (rápido, UI não fica travada)
    const localState = readLocal(storageKey) || DEFAULT_STATE
    setState(localState)

    // 2. Se for usuário cloud, busca do Firestore e faz merge
    if (isCloudUser) {
      ;(async () => {
        const cloud = await loadCloudProgress(uid)
        if (cancelled) return

        // Merge: progresso do guest (se existir) + cloud + local do mesmo uid
        const guestLocal = readLocal('progress:guest')
        let merged = localState
        if (cloud) merged = mergeProgress(merged, cloud)
        if (guestLocal) merged = mergeProgress(merged, guestLocal)

        hydratedForUidRef.current = uid
        setState(merged)
        setHydrating(false)

        // Se havia dados do guest, o usuário acabou de migrar — limpa o guest
        // pra não re-mesclar em futuras sessões
        if (guestLocal) {
          try { localStorage.removeItem('progress:guest') } catch {}
        }

        // Escreve o estado merged de volta na nuvem
        saveCloudProgress(uid, merged)
      })()
    } else {
      hydratedForUidRef.current = uid
      setHydrating(false)
    }

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, isCloudUser])

  // ── Persistência ──────────────────────────────────────────
  // Sempre escreve no localStorage (cache). Se logado, também salva na nuvem
  // (debounced dentro de saveCloudProgress).
  useEffect(() => {
    if (hydrating) return  // não salva estado transitório durante a carga inicial
    try { localStorage.setItem(storageKey, JSON.stringify(state)) } catch {}
    if (isCloudUser && hydratedForUidRef.current === uid) {
      saveCloudProgress(uid, state)
    }
  }, [state, storageKey, isCloudUser, uid, hydrating])

  const addXP = useCallback((amount, { module, correct } = {}) => {
    setState(prev => {
      const today = todayISO()
      let streak = prev.streak
      if (correct) {
        if (!prev.lastActiveDate) streak = 1
        else if (prev.lastActiveDate === today) streak = Math.max(streak, 1)
        else if (daysBetween(prev.lastActiveDate, today) === 1) streak = prev.streak + 1
        else if (daysBetween(prev.lastActiveDate, today) > 1) streak = 1
      }

      const mod = prev.perModule[module] || { correct: 0, attempts: 0 }
      const nextModule = module
        ? {
            ...prev.perModule,
            [module]: {
              correct: mod.correct + (correct ? 1 : 0),
              attempts: mod.attempts + 1,
            },
          }
        : prev.perModule

      const next = {
        ...prev,
        xp: Math.max(0, prev.xp + amount),
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        totalAttempts: prev.totalAttempts + (module ? 1 : 0),
        streak,
        lastActiveDate: correct ? today : prev.lastActiveDate,
        perModule: nextModule,
      }

      // Check for newly unlocked achievements
      const unlocked = ACHIEVEMENTS
        .filter(a => !prev.achievements.includes(a.id) && a.test(next))
        .map(a => a.id)

      if (unlocked.length) {
        next.achievements = [...prev.achievements, ...unlocked]
        setNewAchievements(q => [...q, ...unlocked.map(id => ACHIEVEMENTS.find(a => a.id === id))])
      }

      return next
    })
  }, [])

  const dismissAchievement = useCallback((id) => {
    setNewAchievements(q => q.filter(a => a.id !== id))
  }, [])

  const resetProgress = useCallback(() => {
    setState(DEFAULT_STATE)
  }, [])

  const level = useMemo(() => levelFromXP(state.xp), [state.xp])
  const xpInLevel = state.xp - xpForLevel(level)
  const xpToNext = xpForLevel(level + 1) - xpForLevel(level)

  const value = {
    ...state,
    level,
    xpInLevel,
    xpToNext,
    hydrating,
    addXP,
    newAchievements,
    dismissAchievement,
    resetProgress,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
