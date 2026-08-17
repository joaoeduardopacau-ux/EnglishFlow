import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { createCard, reviewCard as reviewSM2, getDueCards, getReviewStats, sortByPriority } from '../lib/spacedRepetition'

const ReviewContext = createContext(null)

export function ReviewProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid || 'guest'
  const storageKey = `review:${uid}`

  const [cards, setCards] = useState({})

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      setCards(raw ? JSON.parse(raw) : {})
    } catch {
      setCards({})
    }
  }, [storageKey])

  // Save
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cards))
    } catch {}
  }, [cards, storageKey])

  // Registra uma resposta (correct: boolean)
  const recordAnswer = useCallback((wordKey, correct) => {
    setCards(prev => {
      const card = prev[wordKey] || createCard(wordKey)
      const grade = correct ? 4 : 1 // simplificado: acertou=4 (bom), errou=1 (recomeça)
      return { ...prev, [wordKey]: reviewSM2(card, grade) }
    })
  }, [])

  const dueCards = useMemo(() => sortByPriority(getDueCards(cards)), [cards])
  const stats = useMemo(() => getReviewStats(cards), [cards])

  const resetReview = useCallback(() => {
    setCards({})
  }, [])

  const value = {
    cards,
    dueCards,
    stats,
    recordAnswer,
    resetReview,
  }

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
}

export function useReview() {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error('useReview must be used within ReviewProvider')
  return ctx
}
