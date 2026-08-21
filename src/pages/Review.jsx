import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReview } from '../contexts/ReviewContext'
import { useProgress } from '../contexts/ProgressContext'
import { dictionary } from '../data/dictionary'
import { Brain, Check, X, RotateCw, Clock, Award, ArrowLeft, Sparkles, Volume2 } from 'lucide-react'
import { useSpeech } from '../hooks/useSpeech'
import SharkMascot from '../components/WolfMascot'

// Encontra dados da palavra no dictionary
function findWord(key) {
  return dictionary.find(w => w.en === key || w.word === key)
}

export default function Review() {
  const { dueCards, stats, recordAnswer } = useReview()
  const { addXP } = useProgress()
  const speech = useSpeech()

  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [session, setSession] = useState({ correct: 0, wrong: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  // Adiciona novas palavras se não há dueCards
  const queue = useMemo(() => {
    if (dueCards.length > 0) return dueCards.slice(0, 15)
    // Se não tem cards, cria 10 novas do dicionário
    return dictionary.slice(0, 10).map(w => ({
      wordKey: w.en || w.word,
      reps: 0,
      correct: 0,
      wrong: 0,
      ease: 2.5,
      interval: 0,
      nextReview: null,
    }))
  }, [dueCards])

  const current = queue[currentIdx]
  const word = current ? findWord(current.wordKey) : null

  const handleAnswer = (correct) => {
    if (!current) return
    recordAnswer(current.wordKey, correct)

    if (correct) {
      addXP(10, { module: 'flashcards', correct: true })
    } else {
      addXP(2, { module: 'flashcards', correct: false })
    }

    setSession(s => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
      total: s.total + 1,
    }))

    if (currentIdx + 1 >= queue.length) {
      setFinished(true)
    } else {
      setCurrentIdx(currentIdx + 1)
      setShowAnswer(false)
    }
  }

  const restart = () => {
    setCurrentIdx(0)
    setShowAnswer(false)
    setSession({ correct: 0, wrong: 0, total: 0 })
    setFinished(false)
  }

  if (finished) {
    const acc = session.total > 0 ? Math.round((session.correct / session.total) * 100) : 0
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
        <div className="card-elevated p-8 text-center">
          <div className="flex justify-center mb-4">
            <SharkMascot size={140} variant="celebrating" animated />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sessão completa!</h1>
          <p className="text-gray-400 mb-6">Você revisou {session.total} palavra{session.total !== 1 ? 's' : ''}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-4">
              <p className="text-2xl font-bold text-emerald-300">{session.correct}</p>
              <p className="text-xs text-gray-400 mt-1">Acertos</p>
            </div>
            <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-4">
              <p className="text-2xl font-bold text-red-300">{session.wrong}</p>
              <p className="text-xs text-gray-400 mt-1">Erros</p>
            </div>
            <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-4">
              <p className="text-2xl font-bold text-purple-300">{acc}%</p>
              <p className="text-xs text-gray-400 mt-1">Precisão</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={restart} className="btn-primary flex-1">
              <RotateCw size={16} /> Nova sessão
            </button>
            <Link to="/" className="btn-secondary flex-1">
              <ArrowLeft size={16} /> Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!word) {
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
        <div className="card-elevated p-8 text-center">
          <Sparkles size={48} className="text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Nenhuma palavra para revisar!</h2>
          <p className="text-gray-400 mt-2">Volte amanhã ou pratique nos flashcards para adicionar novas palavras.</p>
          <Link to="/flashcards" className="btn-primary mt-6 inline-flex">
            Ir para Flashcards
          </Link>
        </div>
      </div>
    )
  }

  const progress = ((currentIdx) / queue.length) * 100

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-purple-800 flex items-center justify-center shadow-glow-sm">
          <Brain size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Revisão Espaçada</h1>
          <p className="text-gray-400 text-xs">
            {currentIdx + 1} de {queue.length} · {stats.due} palavras vencidas
          </p>
        </div>
      </div>

      {/* Progresso */}
      <div className="progress-bar h-2 mb-6">
        <div className="progress-fill transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Card da palavra */}
      <div className="card-elevated p-8 lg:p-12 min-h-[300px] flex flex-col items-center justify-center text-center">
        {/* Status da palavra */}
        {current.reps > 0 && (
          <div className="mb-4 flex items-center gap-2 text-xs text-purple-300 bg-purple-950/40 px-3 py-1 rounded-full">
            <Clock size={12} />
            <span>Revisão #{current.reps + 1}</span>
          </div>
        )}
        {current.reps === 0 && current.wrong === 0 && (
          <div className="mb-4 flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 px-3 py-1 rounded-full">
            <Sparkles size={12} />
            <span>Nova palavra</span>
          </div>
        )}
        {current.wrong > current.correct && (
          <div className="mb-4 flex items-center gap-2 text-xs text-orange-300 bg-orange-950/40 px-3 py-1 rounded-full">
            <RotateCw size={12} />
            <span>Palavra difícil</span>
          </div>
        )}

        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
          {word.en || word.word}
        </h2>

        <button
          onClick={() => speech.speak(word.en || word.word)}
          className="mt-2 p-2 rounded-lg text-purple-400 hover:bg-purple-950/40 transition-colors"
          title="Ouvir pronúncia"
        >
          <Volume2 size={20} />
        </button>

        {word.phonetic && (
          <p className="text-gray-500 italic mt-2 text-sm">{word.phonetic}</p>
        )}

        {showAnswer ? (
          <>
            <div className="w-full h-px bg-border-subtle my-6" />
            <p className="text-2xl text-purple-300 font-semibold mb-2">
              {word.pt || word.translation}
            </p>
            {word.example && (
              <p className="text-sm text-gray-400 italic mt-3 max-w-md">
                "{word.example}"
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500 mt-6 text-sm">Clique para ver o significado</p>
        )}
      </div>

      {/* Botões */}
      <div className="mt-6">
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="btn-primary w-full py-4"
          >
            Ver resposta
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAnswer(false)}
              className="btn-secondary py-4 bg-red-950/40 border-red-800/40 text-red-300 hover:bg-red-950/60"
            >
              <X size={20} /> Errei
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="btn-primary py-4 bg-gradient-to-r from-emerald-600 to-teal-700 shadow-glow-sm"
            >
              <Check size={20} /> Acertei
            </button>
          </div>
        )}
      </div>

      {/* Stats resumo */}
      <div className="mt-6 grid grid-cols-4 gap-2 text-center">
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-xs text-gray-400">Novas</p>
          <p className="text-lg font-bold text-emerald-300">{stats.new}</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-xs text-gray-400">Aprendendo</p>
          <p className="text-lg font-bold text-purple-300">{stats.learning}</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-xs text-gray-400">Dominadas</p>
          <p className="text-lg font-bold text-yellow-300">{stats.mastered}</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-bold text-white">{stats.total}</p>
        </div>
      </div>
    </div>
  )
}
