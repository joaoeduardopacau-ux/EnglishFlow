import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

// Learning stage — a global difficulty knob that every module reads from.
// Controls: which levels appear, number of options/distractors, timer speed,
// and TTS playback rate. Persisted per-user in localStorage.
//
// Three-tier system: Ini-1 (iniciante) → Inter-2 (intermediário) → Avanc-3 (avançado).

export const STAGES = {
  beginner: {
    id: 'beginner',
    label: 'Iniciante',
    emoji: '🌱',
    description: 'Vocabulário Ini-1 · dicas generosas',
    maxLevel: 'Ini-1',
    mcOptions: 2,           // Multiple-choice answer count
    builderDistractors: 0,  // Extra words added to the word bank
    speedSeconds: 20,       // SpeedGame timer
    matchPairs: 4,          // Number of pairs in WordMatch
    listeningPool: 15,      // Size of pool for phonetic distractor picking
    ttsRate: 0.75,          // Listening playback speed
    speakingThreshold: 0.80,// Pronunciation similarity required
    xpMultiplier: 1.0,      // XP is the same, but keep as knob for future tuning
  },
  intermediate: {
    id: 'intermediate',
    label: 'Intermediário',
    emoji: '🌿',
    description: 'Vocabulário Ini-1 a Inter-2 · dificuldade padrão',
    maxLevel: 'Inter-2',
    mcOptions: 4,
    builderDistractors: 2,
    speedSeconds: 15,
    matchPairs: 6,
    listeningPool: 30,
    ttsRate: 0.9,
    speakingThreshold: 0.85,
    xpMultiplier: 1.25,
  },
  advanced: {
    id: 'advanced',
    label: 'Avançado',
    emoji: '🌳',
    description: 'Vocabulário completo até Avanc-3',
    maxLevel: 'Avanc-3',
    mcOptions: 4,
    builderDistractors: 4,
    speedSeconds: 10,
    matchPairs: 8,
    listeningPool: 50,
    ttsRate: 1.0,
    speakingThreshold: 0.88,
    xpMultiplier: 1.5,
  },
}

export const STAGE_LIST = [STAGES.beginner, STAGES.intermediate, STAGES.advanced]

const LEVEL_ORDER = { 'Ini-1': 1, 'Inter-2': 2, 'Avanc-3': 3 }

// Level pills allowed per stage (only levels up to maxLevel)
export function allowedLevelsForStage(stage) {
  const max = LEVEL_ORDER[stage.maxLevel] || 3
  return Object.keys(LEVEL_ORDER).filter(l => LEVEL_ORDER[l] <= max)
}

// Given a chosen level filter ('all' | 'Ini-1' | ...) and the current stage,
// returns the effective max level to pass to generators / filters.
export function resolveMaxLevel(levelFilter, stage) {
  if (levelFilter && levelFilter !== 'all') {
    // User narrowed it — respect but still clamp to stage.maxLevel
    const userOrder = LEVEL_ORDER[levelFilter] || 1
    const stageOrder = LEVEL_ORDER[stage.maxLevel] || 3
    return userOrder <= stageOrder ? levelFilter : stage.maxLevel
  }
  return stage.maxLevel
}

// Filter an array of `{ level }` items down to stage maxLevel.
export function filterByStage(arr, stage) {
  const max = LEVEL_ORDER[stage.maxLevel] || 3
  return arr.filter(item => (LEVEL_ORDER[item.level] || 1) <= max)
}

const StageContext = createContext(null)

export function StageProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid || 'guest'
  const storageKey = `stage:${uid}`

  const [stageId, setStageId] = useState('beginner')

  // Load saved stage on user change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved && STAGES[saved]) setStageId(saved)
      else setStageId('beginner')
    } catch {
      setStageId('beginner')
    }
  }, [storageKey])

  // Persist
  useEffect(() => {
    try { localStorage.setItem(storageKey, stageId) } catch {}
  }, [stageId, storageKey])

  const setStage = useCallback((id) => {
    if (STAGES[id]) setStageId(id)
  }, [])

  const stage = STAGES[stageId]

  return (
    <StageContext.Provider value={{ stage, stageId, setStage, stages: STAGE_LIST }}>
      {children}
    </StageContext.Provider>
  )
}

export function useStage() {
  const ctx = useContext(StageContext)
  if (!ctx) throw new Error('useStage must be used within StageProvider')
  return ctx
}
