import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RotateCw, Check, X, Volume2, Sparkles } from 'lucide-react'
import { dictionary, categories } from '../data/dictionary'
import { useSpeech } from '../hooks/useSpeech'
import { useProgress } from '../contexts/ProgressContext'
import { useStage } from '../contexts/StageContext'
import { useFocus } from '../contexts/FocusContext'

const STORAGE = 'learned_words'
const LEVEL_ORDER = { 'Ini-1': 1, 'Inter-2': 2, 'Avanc-3': 3 }

// Map grammar focus → preferred POS when building the deck. Verbs dominate
// tense-focused practice; adjectives focus prioritizes descriptors.
const GRAMMAR_TO_POS = {
  'present-simple':     ['v'],
  'past-simple':        ['v'],
  'future-will':        ['v'],
  'future-going-to':    ['v'],
  'present-continuous': ['v'],
  'questions':          ['v'],
  'negatives':          ['v'],
  'to-be':              [],          // no bias
  'adjectives':         ['adj'],
  'any':                [],
}

function buildDeck({ stage, focusTheme, focusGrammar, category }) {
  const maxRank = LEVEL_ORDER[stage.maxLevel] || 3
  let pool = dictionary.filter(w => (LEVEL_ORDER[w.level] || 1) <= maxRank)
  // Theme filter (prefer explicit category pill; fall back to focus theme).
  const effectiveCategory = category !== 'all' ? category : (focusTheme !== 'all' ? focusTheme : 'all')
  if (effectiveCategory !== 'all') pool = pool.filter(w => w.category === effectiveCategory)
  // Grammar → POS bias (soft: if filter leaves >=5 words, apply it; else keep all).
  const preferredPOS = GRAMMAR_TO_POS[focusGrammar] || []
  if (preferredPOS.length) {
    const biased = pool.filter(w => preferredPOS.includes(w.pos))
    if (biased.length >= 5) pool = biased
  }
  return pool.sort(() => Math.random() - 0.5).slice(0, 20)
}

export default function Flashcards() {
  const { stage } = useStage()
  const { focus, grammar, theme } = useFocus()
  const [category, setCategory] = useState('all') // explicit override of focus theme
  const [deck, setDeck] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [learned, setLearned] = useState(() => JSON.parse(localStorage.getItem(STORAGE) || '[]'))
  const { speak, supported } = useSpeech()
  const { addXP } = useProgress()

  useEffect(() => {
    setDeck(buildDeck({ stage, focusTheme: focus.theme, focusGrammar: focus.grammar, category }))
    setIndex(0)
    setFlipped(false)
  }, [category, stage.id, focus.grammar, focus.theme])

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(learned))
  }, [learned])

  const current = deck[index]
  const progress = useMemo(() => (deck.length ? ((index + 1) / deck.length) * 100 : 0), [index, deck])

  function next() {
    setFlipped(false)
    setTimeout(() => setIndex(i => Math.min(i + 1, deck.length - 1)), 150)
  }
  function prev() {
    setFlipped(false)
    setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 150)
  }
  function markKnown() {
    if (!current) return
    const firstTime = !learned.includes(current.id)
    if (firstTime) {
      setLearned([...learned, current.id])
      addXP(2, { module: 'flashcards', correct: true })
    }
    if (index < deck.length - 1) next()
  }
  function markUnknown() {
    if (!current) return
    setLearned(learned.filter(id => id !== current.id))
    addXP(1, { module: 'flashcards', correct: false })
    if (index < deck.length - 1) next()
  }
  function reshuffle() {
    setDeck(buildDeck({ stage, focusTheme: focus.theme, focusGrammar: focus.grammar, category }))
    setIndex(0)
    setFlipped(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <header className="mb-6">
        <h1 className="section-title">Flashcards</h1>
        <p className="section-subtitle">Toque no cartão para virar</p>
      </header>

      {/* Focus chip */}
      <Link
        to="/learn"
        className="flex items-center gap-2 card p-3 mb-4 hover:border-border-bright transition-colors"
      >
        <Sparkles size={14} className="text-purple-400 shrink-0" />
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold shrink-0">Foco:</span>
        <span className="badge-purple !text-xs"><span className="mr-1">{grammar.emoji}</span>{grammar.label}</span>
        <span className="badge-purple !text-xs"><span className="mr-1">{theme.emoji}</span>{theme.label}</span>
        <span className="ml-auto text-xs text-purple-400">trocar →</span>
      </Link>

      {/* Category override (fine-grained, without going back to /learn) */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {categories.slice(0, 10).map(c => (
          <Pill key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            <span className="mr-1">{c.emoji}</span>{c.label}
          </Pill>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-6">
        <div className="progress-bar flex-1">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm text-gray-400 font-mono">{deck.length ? index + 1 : 0}/{deck.length}</span>
        <button onClick={reshuffle} className="btn-ghost !px-3 !py-2" title="Embaralhar">
          <RotateCw size={16} />
        </button>
      </div>

      {/* Card */}
      {current ? (
        <div
          onClick={() => setFlipped(f => !f)}
          className="perspective relative mx-auto w-full h-80 cursor-pointer select-none"
          style={{ perspective: '1200px' }}
        >
          <div className={`flip-card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
            {/* Front */}
            <div className="flip-card-front card-elevated w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <span className="badge-purple mb-3">{current.level} · {current.category}</span>
              <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">{current.word}</h2>
              {supported && (
                <button
                  onClick={(e) => { e.stopPropagation(); speak(current.word) }}
                  className="mt-6 btn-secondary !py-2 !px-4 flex items-center gap-2"
                >
                  <Volume2 size={16} />
                  <span className="text-sm">Ouvir</span>
                </button>
              )}
              <p className="text-xs text-gray-500 mt-6">Toque para ver a tradução</p>
            </div>
            {/* Back */}
            <div className="flip-card-back card-elevated w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-bg-elevated to-purple-950/30">
              <p className="text-xs text-purple-300 font-semibold uppercase tracking-widest">Tradução</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple mt-2">{current.translation}</h2>
              {current.example && (
                <div className="mt-6 pt-6 border-t border-border-subtle w-full max-w-sm">
                  <p className="text-xs text-gray-500 mb-2">Exemplo:</p>
                  <p className="text-gray-200 italic">"{current.example}"</p>
                  {supported && (
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(current.example) }}
                      className="mt-3 btn-ghost !py-1 !px-3 flex items-center gap-2 mx-auto text-sm"
                    >
                      <Volume2 size={14} />
                      Ouvir exemplo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-10 text-center text-gray-400">Nenhuma palavra encontrada com esses filtros.</div>
      )}

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button onClick={prev} disabled={index === 0} className="btn-secondary flex items-center gap-2 disabled:opacity-40">
          <ChevronLeft size={18} />
          <span>Anterior</span>
        </button>

        <div className="flex gap-2">
          <button onClick={markUnknown} className="btn-secondary !px-4 !py-3 !bg-red-950/40 !border-red-900/50 hover:!bg-red-900/40 text-red-300" title="Revisar">
            <X size={20} />
          </button>
          <button onClick={markKnown} className="btn-secondary !px-4 !py-3 !bg-emerald-950/40 !border-emerald-900/50 hover:!bg-emerald-900/40 text-emerald-300" title="Sei essa">
            <Check size={20} />
          </button>
        </div>

        <button onClick={next} disabled={index === deck.length - 1} className="btn-primary flex items-center gap-2 disabled:opacity-40">
          <span>Próxima</span>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        {learned.length} palavras marcadas como aprendidas · {dictionary.length} no total
      </div>
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
        active
          ? 'bg-purple-900/40 border-purple-600 text-white shadow-glow-sm'
          : 'bg-bg-elevated border-border-subtle text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
