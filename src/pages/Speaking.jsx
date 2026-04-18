import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mic, MicOff, Volume2, RotateCw, Check, Trophy, AlertCircle, Sparkles } from 'lucide-react'
import { getRandomSentence } from '../data/sentences'
import { useSpeech } from '../hooks/useSpeech'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useProgress } from '../contexts/ProgressContext'
import { useStage } from '../contexts/StageContext'
import { useFocus } from '../contexts/FocusContext'
import { levenshtein } from '../utils/phonetic'

const XP_PER_LEVEL = { 'Ini-1': 8, 'Inter-2': 15, 'Avanc-3': 24 }

// Normalize for comparison: lowercase, strip punctuation, collapse whitespace.
function normalize(s) {
  return s.toLowerCase().replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim()
}

// Similarity ratio between 0 and 1 based on normalized edit distance.
function similarity(a, b) {
  const na = normalize(a)
  const nb = normalize(b)
  if (!na || !nb) return 0
  const maxLen = Math.max(na.length, nb.length)
  return 1 - levenshtein(na, nb) / maxLen
}

export default function Speaking() {
  const ttsAvailable = useSpeech()
  const { supported, listening, transcript, interimTranscript, error, start, stop, reset } = useSpeechRecognition()
  const { addXP } = useProgress()
  const { stage } = useStage()
  const { focus, grammar, theme } = useFocus()
  const [sentence, setSentence] = useState(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | { ok, sim }

  function newRound() {
    reset()
    setFeedback(null)
    setSentence(getRandomSentence(stage.maxLevel, focus.theme, focus.grammar))
  }

  useEffect(() => { newRound() }, [stage.id, focus.grammar, focus.theme])

  function check() {
    if (!transcript || !sentence) return
    const sim = similarity(transcript, sentence.english)
    // Threshold adapts to stage (beginner is more lenient)
    const ok = sim >= stage.speakingThreshold
    setFeedback({ ok, sim })
    setTotal(t => t + 1)
    if (ok) setScore(s => s + 1)
    const base = Math.ceil((XP_PER_LEVEL[sentence.level] || 8) * stage.xpMultiplier)
    addXP(ok ? base : 2, { module: 'speaking', correct: ok })
  }

  function toggleMic() {
    if (listening) stop()
    else { reset(); start() }
  }

  if (!supported) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="card-elevated p-8 text-center">
          <AlertCircle size={40} className="mx-auto text-yellow-400 mb-3" />
          <h2 className="text-xl font-bold text-white">Speaking indisponível</h2>
          <p className="text-gray-400 mt-3">
            Seu navegador não suporta reconhecimento de voz. Recomendado: Chrome ou Edge no desktop/Android.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Speaking</h1>
          <p className="section-subtitle">Leia a frase em voz alta</p>
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

      {/* Target sentence */}
      {sentence && (
        <div className="card-elevated p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Diga em voz alta</p>
            <span className="badge-purple shrink-0">{sentence.level}</span>
          </div>
          <p className="text-2xl lg:text-3xl font-semibold text-white leading-snug">
            {sentence.english}
          </p>
          <p className="text-sm text-gray-400 mt-2 italic">{sentence.portuguese}</p>
          {ttsAvailable.supported && (
            <button
              onClick={() => ttsAvailable.speak(sentence.english)}
              className="btn-ghost !px-3 !py-1.5 mt-4 text-sm flex items-center gap-2"
            >
              <Volume2 size={14} /> Ouvir pronúncia
            </button>
          )}
        </div>
      )}

      {/* Mic control */}
      <div className="mt-5 card-elevated p-6 text-center">
        <button
          onClick={toggleMic}
          disabled={!!feedback}
          className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-95 ${
            listening
              ? 'bg-gradient-to-br from-red-500 to-red-800 shadow-glow-lg animate-pulse'
              : 'bg-gradient-to-br from-purple-600 to-purple-900 shadow-glow'
          } disabled:opacity-40`}
        >
          {listening
            ? <MicOff size={40} className="text-white" />
            : <Mic size={40} className="text-white" />
          }
        </button>
        <p className="text-sm text-gray-400 mt-3">
          {listening ? 'Ouvindo... fale agora' : feedback ? 'Tente de novo para outra frase' : 'Toque para começar a falar'}
        </p>

        {/* Live transcript */}
        {(transcript || interimTranscript) && (
          <div className="mt-4 card p-3 text-left">
            <p className="text-xs text-gray-500 mb-1">Você disse:</p>
            <p className="text-white">
              {transcript}
              {interimTranscript && <span className="text-gray-500"> {interimTranscript}</span>}
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 mt-3">Erro: {error}. Permita o microfone nas configurações do navegador.</p>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-4 card p-4 ${feedback.ok ? 'bg-emerald-950/30 border-emerald-800/40' : 'bg-red-950/20 border-red-900/40'}`}>
          <div className="flex items-center gap-2 mb-2">
            {feedback.ok
              ? <Check size={18} className="text-emerald-400" />
              : <AlertCircle size={18} className="text-red-400" />}
            <p className={`font-semibold ${feedback.ok ? 'text-emerald-300' : 'text-red-300'}`}>
              {feedback.ok ? 'Ótima pronúncia!' : 'Quase lá!'}
            </p>
            <span className="ml-auto text-xs font-mono text-gray-400">
              {Math.round(feedback.sim * 100)}% de precisão
            </span>
          </div>
          {!feedback.ok && (
            <div className="text-sm text-gray-400">
              <p>Esperado: <span className="text-white">{sentence.english}</span></p>
              <p className="mt-1">Reconhecido: <span className="text-yellow-300">{transcript || '(nada)'}</span></p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3">
        {!feedback && transcript && !listening && (
          <button onClick={check} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Check size={18} /> Verificar
          </button>
        )}
        {feedback && (
          <button onClick={newRound} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RotateCw size={16} /> Próxima frase
          </button>
        )}
      </div>
    </div>
  )
}
