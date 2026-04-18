import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Volume2, RotateCw, Check, Trophy, Lightbulb, Delete, Sparkles } from 'lucide-react'
import { getRandomSentence, shuffleWords } from '../data/sentences'
import { dictionary } from '../data/dictionary'
import { useSpeech } from '../hooks/useSpeech'
import { useProgress } from '../contexts/ProgressContext'
import { useStage, filterByStage } from '../contexts/StageContext'
import { useFocus } from '../contexts/FocusContext'

const XP_PER_LEVEL = { 'Ini-1': 6, 'Inter-2': 12, 'Avanc-3': 20 }

export default function SentenceBuilder() {
  const { speak, supported } = useSpeech()
  const { addXP } = useProgress()
  const { stage } = useStage()
  const { focus, grammar, theme } = useFocus()
  const [round, setRound] = useState(null)
  const [placed, setPlaced] = useState([])      // indices do bank
  const [feedback, setFeedback] = useState(null) // null | 'ok' | 'wrong'
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showHint, setShowHint] = useState(false)

  function newRound() {
    const s = getRandomSentence(stage.maxLevel, focus.theme, focus.grammar)
    // Distractor count comes from the current stage.
    const distractorCount = stage.builderDistractors
    const existing = new Set(s.words.map(w => w.toLowerCase()))
    const distractors = filterByStage(dictionary, stage)
      .filter(d => !existing.has(d.word.toLowerCase()) && /^[a-zA-Z']+$/.test(d.word))
      .sort(() => Math.random() - 0.5)
      .slice(0, distractorCount)
      .map(d => d.word)

    const bank = shuffleWords([...s.words, ...distractors]).map((w, i) => ({ id: i, word: w, used: false }))
    setRound({ sentence: s, bank })
    setPlaced([])
    setFeedback(null)
    setShowHint(false)
  }

  useEffect(() => { newRound() }, [stage.id, focus.grammar, focus.theme])

  function addWord(idx) {
    if (feedback) return
    setPlaced(p => [...p, idx])
    setRound(r => ({
      ...r,
      bank: r.bank.map(b => b.id === idx ? { ...b, used: true } : b)
    }))
  }

  function removeAt(pos) {
    if (feedback) return
    const idx = placed[pos]
    setPlaced(p => p.filter((_, i) => i !== pos))
    setRound(r => ({
      ...r,
      bank: r.bank.map(b => b.id === idx ? { ...b, used: false } : b)
    }))
  }

  function undo() {
    if (placed.length === 0 || feedback) return
    removeAt(placed.length - 1)
  }

  function clearAll() {
    if (feedback) return
    setPlaced([])
    setRound(r => ({ ...r, bank: r.bank.map(b => ({ ...b, used: false })) }))
  }

  function check() {
    if (!round || placed.length === 0) return
    const built = placed.map(i => round.bank.find(b => b.id === i).word)
    const target = round.sentence.words
    const normalize = arr => arr.map(w => w.toLowerCase()).join(' ')
    const ok = normalize(built) === normalize(target)
    setFeedback(ok ? 'ok' : 'wrong')
    setTotal(t => t + 1)
    if (ok) setScore(s => s + 1)
    const base = Math.ceil((XP_PER_LEVEL[round.sentence.level] || 6) * stage.xpMultiplier)
    addXP(ok ? base : 2, { module: 'builder', correct: ok })
  }

  const preview = useMemo(() => {
    if (!round) return ''
    return placed
      .map(i => round.bank.find(b => b.id === i).word)
      .join(' ')
      .replace(/\s([.,!?;:])/g, '$1')
  }, [placed, round])

  if (!round) return null

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Montar Frase</h1>
          <p className="section-subtitle">Use as palavras para construir a frase em inglês</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Trophy size={16} className="text-yellow-400" />
          <span className="font-mono font-semibold text-white">{score}</span>
          <span className="text-gray-500">/ {total}</span>
        </div>
      </header>

      {/* Focus chip */}
      <Link
        to="/learn"
        className="flex items-center gap-2 card p-3 mb-5 hover:border-border-bright transition-colors"
      >
        <Sparkles size={14} className="text-purple-400 shrink-0" />
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold shrink-0">Foco:</span>
        <span className="badge-purple !text-xs"><span className="mr-1">{grammar.emoji}</span>{grammar.label}</span>
        <span className="badge-purple !text-xs"><span className="mr-1">{theme.emoji}</span>{theme.label}</span>
        <span className="ml-auto text-xs text-purple-400">trocar →</span>
      </Link>

      {/* Portuguese prompt */}
      <div className="card-elevated p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Traduza para inglês</p>
            <p className="text-xl lg:text-2xl font-semibold text-white mt-2 leading-snug">
              {round.sentence.portuguese}
            </p>
          </div>
          <span className="badge-purple shrink-0">{round.sentence.level}</span>
        </div>

        {/* Hint */}
        <button
          onClick={() => setShowHint(h => !h)}
          className="mt-3 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
        >
          <Lightbulb size={14} />
          {showHint ? 'Ocultar dica' : 'Mostrar dica'}
        </button>
        {showHint && (
          <p className="text-xs text-gray-400 mt-2 italic">
            Começa com: <span className="text-purple-300">"{round.sentence.words.slice(0, 2).join(' ')}..."</span>
            {' · '}{round.sentence.words.filter(w => /^[a-zA-Z']+$/.test(w)).length} palavras
          </p>
        )}
      </div>

      {/* Answer area */}
      <div className="mt-4 card p-4 min-h-[100px]">
        <p className="text-xs text-gray-500 mb-2">Sua resposta:</p>
        {placed.length === 0 ? (
          <p className="text-gray-600 italic py-4 text-center">
            Toque nas palavras abaixo para montar a frase
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placed.map((idx, pos) => {
              const w = round.bank.find(b => b.id === idx).word
              return (
                <button
                  key={pos}
                  onClick={() => removeAt(pos)}
                  disabled={!!feedback}
                  className={
                    feedback === 'ok' ? 'word-chip-correct' :
                    feedback === 'wrong' ? 'word-chip-wrong' :
                    'word-chip-active'
                  }
                >
                  {w}
                </button>
              )
            })}
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <p className="text-xs text-gray-500">Resposta correta:</p>
            <p className="text-emerald-300 font-medium mt-1">{round.sentence.english}</p>
          </div>
        )}
      </div>

      {/* Word bank */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Banco de palavras</p>
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!placed.length || !!feedback}
              className="btn-ghost !px-2 !py-1 text-xs flex items-center gap-1 disabled:opacity-40"
            >
              <Delete size={14} /> Desfazer
            </button>
            <button
              onClick={clearAll}
              disabled={!placed.length || !!feedback}
              className="btn-ghost !px-2 !py-1 text-xs disabled:opacity-40"
            >
              Limpar
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {round.bank.map(b => (
            <button
              key={b.id}
              onClick={() => addWord(b.id)}
              disabled={b.used || !!feedback}
              className={b.used ? 'word-chip opacity-30 cursor-default border-border-subtle bg-bg-elevated text-gray-500' : 'word-chip-idle'}
            >
              {b.word}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        {!feedback && (
          <button
            onClick={check}
            disabled={placed.length === 0}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Check size={18} /> Verificar
          </button>
        )}
        {feedback && (
          <>
            {supported && (
              <button
                onClick={() => speak(round.sentence.english)}
                className="btn-secondary flex items-center gap-2"
              >
                <Volume2 size={16} /> Ouvir
              </button>
            )}
            <button onClick={newRound} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <RotateCw size={16} /> Próxima
            </button>
          </>
        )}
      </div>

      {feedback === 'ok' && (
        <div className="mt-5 card p-4 bg-emerald-950/30 border-emerald-800/40 text-center">
          <p className="text-emerald-300 font-semibold">✓ Perfeito! Continue assim.</p>
        </div>
      )}
    </div>
  )
}
