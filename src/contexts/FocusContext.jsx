import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

// Focus = what aspect of English the user is drilling right now.
// Two orthogonal axes:
//   grammar: structural focus (tense, sentence type, to-be, etc.)
//   theme:   topical vocabulary (food, travel, work, all, ...)
// Every practice module reads from here so the Learn page is the single source of truth.

export const GRAMMAR_FOCUSES = [
  { id: 'any',                 label: 'Variado',           emoji: '🎲', description: 'Frases de vários tipos misturadas', example: 'Sem restrição' },
  { id: 'present-simple',      label: 'Presente Simples',  emoji: '📅', description: 'Ações de rotina e fatos', example: 'She works every day.' },
  { id: 'past-simple',         label: 'Passado Simples',   emoji: '⏮️', description: 'Ações concluídas no passado', example: 'She worked yesterday.' },
  { id: 'future-will',         label: 'Futuro (will)',     emoji: '⏭️', description: 'Previsões e decisões espontâneas', example: 'She will work tomorrow.' },
  { id: 'future-going-to',     label: 'Futuro (going to)', emoji: '🎯', description: 'Planos e intenções', example: 'She is going to work tomorrow.' },
  { id: 'present-continuous',  label: 'Presente Contínuo', emoji: '🔄', description: 'Ações acontecendo agora', example: 'She is working now.' },
  { id: 'to-be',               label: 'Verbo To Be',       emoji: '🪞', description: 'am / is / are + estados', example: 'She is happy.' },
  { id: 'questions',           label: 'Perguntas',         emoji: '❓', description: 'Interrogativas Do/Does/Did', example: 'Does she work here?' },
  { id: 'negatives',           label: 'Negativas',         emoji: '🚫', description: "don't / doesn't / didn't", example: "She doesn't work." },
  { id: 'adjectives',          label: 'Adjetivos',         emoji: '🎨', description: 'Sujeito + to be + adjetivo', example: 'They are tired.' },
]

export const THEME_FOCUSES = [
  { id: 'all',        label: 'Todos',      emoji: '🌐' },
  { id: 'food',       label: 'Comida',     emoji: '🍎' },
  { id: 'family',     label: 'Família',    emoji: '👨‍👩‍👧' },
  { id: 'animals',    label: 'Animais',    emoji: '🐶' },
  { id: 'work',       label: 'Trabalho',   emoji: '💼' },
  { id: 'travel',     label: 'Viagem',     emoji: '✈️' },
  { id: 'transport',  label: 'Transporte', emoji: '🚗' },
  { id: 'house',      label: 'Casa',       emoji: '🏠' },
  { id: 'nature',     label: 'Natureza',   emoji: '🌳' },
  { id: 'sports',     label: 'Esportes',   emoji: '⚽' },
  { id: 'education',  label: 'Educação',   emoji: '📚' },
  { id: 'body',       label: 'Corpo',      emoji: '👤' },
  { id: 'clothes',    label: 'Roupas',     emoji: '👕' },
  { id: 'time',       label: 'Tempo',      emoji: '🕐' },
  { id: 'places',     label: 'Lugares',    emoji: '📍' },
  { id: 'tech',       label: 'Tecnologia', emoji: '💻' },
]

export const DEFAULT_FOCUS = { grammar: 'any', theme: 'all' }

export function grammarById(id) {
  return GRAMMAR_FOCUSES.find(g => g.id === id) || GRAMMAR_FOCUSES[0]
}
export function themeById(id) {
  return THEME_FOCUSES.find(t => t.id === id) || THEME_FOCUSES[0]
}

const FocusContext = createContext(null)

export function FocusProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid || 'guest'
  const storageKey = `focus:${uid}`

  const [focus, setFocusState] = useState(DEFAULT_FOCUS)

  // Load on user change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setFocusState({
          grammar: parsed.grammar || 'any',
          theme: parsed.theme || 'all',
        })
      } else {
        setFocusState(DEFAULT_FOCUS)
      }
    } catch {
      setFocusState(DEFAULT_FOCUS)
    }
  }, [storageKey])

  // Persist
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(focus)) } catch {}
  }, [focus, storageKey])

  const setGrammar = useCallback((id) => setFocusState(f => ({ ...f, grammar: id })), [])
  const setTheme   = useCallback((id) => setFocusState(f => ({ ...f, theme: id })), [])
  const setFocus   = useCallback((next) => setFocusState(next), [])
  const reset      = useCallback(() => setFocusState(DEFAULT_FOCUS), [])

  return (
    <FocusContext.Provider value={{
      focus,
      grammar: grammarById(focus.grammar),
      theme:   themeById(focus.theme),
      setGrammar, setTheme, setFocus, reset,
      grammars: GRAMMAR_FOCUSES,
      themes:   THEME_FOCUSES,
    }}>
      {children}
    </FocusContext.Provider>
  )
}

export function useFocus() {
  const ctx = useContext(FocusContext)
  if (!ctx) throw new Error('useFocus must be used within FocusProvider')
  return ctx
}
