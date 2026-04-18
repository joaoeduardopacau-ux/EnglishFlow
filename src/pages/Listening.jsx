import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Volume2, Play, RotateCw, Check, Trophy, Settings2, Sparkles } from 'lucide-react'
import { getRandomSentence } from '../data/sentences'
import { generateSentences } from '../utils/sentenceGenerator'
import { pickSimilar } from '../utils/phonetic'
import { useSpeech } from '../hooks/useSpeech'
import { useProgress } from '../contexts/ProgressContext'
import { useStage } from '../contexts/StageContext'
import { useFocus } from '../contexts/FocusContext'
import StageSelector from '../components/StageSelector'

const XP_PER_LEVEL = { 'Ini-1': 5, 'Inter-2': 10, 'Avanc-3': 16 }

export default function Listening() {
  const { speak, stop, speaking, supported } = useSpeech()
  const { addXP } = useProgress()
  const { stage } = useStage()
  const { focus, grammar, theme } = useFocus()
  const [mode, setMode] = useState('choice') // 'choice' | 'typing'
  const [rate, setRate] = useState(stage.ttsRate)
  const [round, setRound] = useState(null)
  const [selected, setSelected] = useState(null)
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Reset rate when stage changes
  useEffect(() => { setRate(stage.ttsRate) }, [stage.id])

  // Distractors count adapts to stage (beginner: 1 distractor, else: 3)
  const distractorCount = stage.id === 'beginner' ? 1 : 3

  function newRound() {
    const correct = getRandomSentence(stage.maxLevel, focus.theme, focus.grammar)
    // Generate a large candidate pool with the same focus, then pick N phonetically closest.
    const candidatePool = generateSentences(stage.listeningPool, {
      level: correct.level,
      topic: focus.theme,
      grammar: focus.grammar,
    })
    const distractors = pickSimilar(correct, candidatePool, distractorCount)
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5)
    setRound({ correct, options })
    setSelected(null)
    setTyped('')
    setFeedback(null)
    setTimeout(() => speak(correct.english, { rate }), 300)
  }

  useEffect(() => { newRound() }, [stage.id, focus.grammar, focus.theme])
  useEffect(() => () => stop(), [stop])

  function replay() {
    if (round) speak(round.english ?? round.correct.english, { rate })
  }

  function pick(opt) {
    if (selected) return
    setSelected(opt)
    setTotal(t => t + 1)
    const ok = opt.id === round.correct.id
    if (ok) setScore(s => s + 1)
    setFeedback(ok ? 'ok' : 'wrong')
    const base = XP_PER_LEVEL[round.correct.level] || 5
    addXP(ok ? base : 1, { module: 'listening', correct: ok })
  }

  function submitTyped(e) {
    e.preventDefault()
    if (!typed.trim() || feedback) return
    const norm = (s) => s.toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim()
    const ok = norm(typed) === norm(round.correct.english)
    setFeedback(ok ? 'ok' : 'wrong')
    setTotal(t => t + 1)
    if (ok) setScore(s => s + 1)
    // Typing is harder → 1.5× reward
    const base = Math.ceil((XP_PER_LEVEL[round.correct.level] || 5) * 1.5)
    addXP(ok ? base : 1, { module: 'listening', correct: ok })
  }

  if (!supported) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="card-elevated p-8 text-center">
          <h2 className="text-xl font-bold text-white">Listening indisponível</h2>
          <p className="text-gray-400 mt-3">Seu navegador não suporta síntese de voz. Tente em outro navegador (Chrome, Edge, Safari).</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Listening</h1>
          <p className="section-subtitle">Escute e escolha a frase correta</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Trophy size={16} className="text-yellow-400" />
          <span className="font-mono font-semibold text-white">{score}</span>
          <span className="text-gray-500">/ {total}</span>
          <button onClick={() => setShowSettings(s => !s)} className="btn-ghost !px-2 !py-2 ml-1">
            <Settings2 size={16} />
          </button>
        </div>
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

      {/* Settings panel */}
      {showSettings && (
        <div className="card p-4 mb-4 space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-2">Modo</p>
            <div className="flex gap-2">
              <Pill active={mode === 'choice'} onClick={() => setMode('choice')}>Múltipla escolha</Pill>
              <Pill active={mode === 'typing'} onClick={() => setMode('typing')}>Digitar</Pill>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Dificuldade</p>
            <StageSelector compact />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Velocidade: {rate.toFixed(2)}x</p>
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.05"
              value={rate}
              onChange={e => setRate(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      )}

      {/* Audio card */}
      <div className="card-elevated p-8 text-center">
        <div className="relative mx-auto w-24 h-24 mb-4">
          <button
            onClick={replay}
            className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-glow-lg transition-all active:scale-95 ${speaking ? 'animate-pulse' : ''}`}
          >
            {speaking ? <Volume2 size={36} className="text-white" /> : <Play size={36} className="text-white ml-1" />}
          </button>
          {speaking && (
            <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping" />
          )}
        </div>
        <p className="text-sm text-gray-400">
          {speaking ? 'Reproduzindo...' : 'Toque para ouvir a frase'}
        </p>
        {feedback && (
          <p className="text-xs text-purple-300 mt-3 italic">"{round.correct.english}"</p>
        )}
      </div>

      {/* Mode: multiple choice */}
      {mode === 'choice' && round && (
        <div className="space-y-3 mt-5">
          {round.options.map(opt => {
            const isSel = selected?.id === opt.id
            const isCorrect = feedback && opt.id === round.correct.id
            let cls = 'card p-4 text-left hover:border-purple-600 transition-all w-full'
            if (feedback) {
              if (isCorrect) cls = 'card p-4 text-left border-emerald-600 bg-emerald-950/40 w-full'
              else if (isSel) cls = 'card p-4 text-left border-red-600 bg-red-950/40 w-full'
              else cls = 'card p-4 text-left opacity-50 w-full'
            }
            return (
              <button key={opt.id} onClick={() => pick(opt)} className={cls}>
                <span className="text-white">{opt.english}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Mode: typing */}
      {mode === 'typing' && round && (
        <form onSubmit={submitTyped} className="mt-5 space-y-3">
          <textarea
            value={typed}
            onChange={e => setTyped(e.target.value)}
            placeholder="Digite a frase que você ouviu..."
            rows={3}
            className="input resize-none"
            disabled={!!feedback}
          />
          {feedback === 'wrong' && (
            <div className="card p-3 text-sm">
              <p className="text-gray-400">A frase correta era:</p>
              <p className="text-emerald-300 font-medium mt-1">{round.correct.english}</p>
            </div>
          )}
          {!feedback && (
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Check size={18} /> Verificar
            </button>
          )}
        </form>
      )}

      {/* Next */}
      {feedback && (
        <button onClick={newRound} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
          <RotateCw size={16} /> Próxima frase
        </button>
      )}
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
        active
          ? 'bg-purple-900/40 border-purple-600 text-white'
          : 'bg-bg-elevated border-border-subtle text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
