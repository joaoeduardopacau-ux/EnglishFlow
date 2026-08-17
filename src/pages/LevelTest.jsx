import { useState, useEffect } from 'react'
import { GraduationCap, ChevronRight, CheckCircle2, XCircle, Award, RotateCw, Target } from 'lucide-react'
import { CEFR_QUESTIONS, LEVEL_INFO, calculateLevel } from '../data/cefrTest'
import { useAuth } from '../contexts/AuthContext'

export default function LevelTest() {
  const { user } = useAuth()
  const uid = user?.uid || 'guest'
  const storageKey = `cefr:${uid}`

  const [started, setStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [savedResult, setSavedResult] = useState(null)

  // Load previous result
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setSavedResult(JSON.parse(raw))
    } catch {}
  }, [storageKey])

  const question = CEFR_QUESTIONS[currentIdx]

  const handleSelect = (optIdx) => {
    setAnswers({ ...answers, [currentIdx]: optIdx })
  }

  const handleNext = () => {
    if (currentIdx + 1 >= CEFR_QUESTIONS.length) {
      finish()
    } else {
      setCurrentIdx(currentIdx + 1)
    }
  }

  const finish = () => {
    const result = calculateLevel(answers)
    result.date = new Date().toISOString()
    setSavedResult(result)
    setFinished(true)
    try {
      localStorage.setItem(storageKey, JSON.stringify(result))
    } catch {}
  }

  const restart = () => {
    setStarted(false)
    setCurrentIdx(0)
    setAnswers({})
    setFinished(false)
  }

  // Result screen
  if (finished || (!started && savedResult)) {
    const result = savedResult
    const info = LEVEL_INFO[result.level]

    return (
      <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
        <div className="card-elevated overflow-hidden">
          <div className={`bg-gradient-to-br ${info.color} p-8 text-center`}>
            <div className="text-6xl mb-3">{info.emoji}</div>
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Seu nível atual</p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mt-2">{result.level}</h1>
            <p className="text-xl text-white/90 mt-2">{info.label}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-bg-elevated rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Acertos</p>
                <p className="text-2xl font-bold text-white">{result.totalCorrect}/{result.totalQuestions}</p>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Precisão</p>
                <p className="text-2xl font-bold text-purple-300">{result.percentage}%</p>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Nível</p>
                <p className="text-2xl font-bold text-white">{result.level}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <Target size={18} className="text-purple-400" /> O que isso significa?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{info.desc}</p>
            </div>

            <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-4">
              <h3 className="text-purple-200 font-bold mb-2 flex items-center gap-2">
                💡 Recomendação
              </h3>
              <p className="text-gray-300 text-sm">{info.tips}</p>
            </div>

            {/* Por nível */}
            <div className="mt-6">
              <h3 className="text-white font-bold mb-3">Desempenho por nível</h3>
              <div className="space-y-2">
                {Object.entries(result.byLevel).map(([lvl, data]) => {
                  const percent = (data.correct / data.total) * 100
                  return (
                    <div key={lvl}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white font-semibold">{lvl} - {LEVEL_INFO[lvl].label}</span>
                        <span className="text-gray-400">{data.correct}/{data.total}</span>
                      </div>
                      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 rounded-full bg-gradient-to-r ${LEVEL_INFO[lvl].color}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button onClick={restart} className="btn-primary mt-6 w-full">
              <RotateCw size={16} /> Refazer teste
            </button>

            {result.date && (
              <p className="text-xs text-gray-500 text-center mt-3">
                Feito em {new Date(result.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Start screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
        <div className="card-elevated p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-700 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Teste de Nível CEFR</h1>
          <p className="text-gray-400 mb-6">
            Descubra seu nível de inglês baseado no padrão europeu CEFR (A1 a C2).
            São 20 questões que vão de fáceis a difíceis. Leva ~5 minutos.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {Object.entries(LEVEL_INFO).map(([lvl, info]) => (
              <div key={lvl} className="bg-bg-elevated rounded-lg p-3">
                <p className="text-xl">{info.emoji}</p>
                <p className="font-bold text-white mt-1">{lvl}</p>
                <p className="text-xs text-gray-500">{info.label}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setStarted(true)} className="btn-primary w-full">
            Começar teste <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  // Test in progress
  const progress = ((currentIdx + 1) / CEFR_QUESTIONS.length) * 100
  const selectedOption = answers[currentIdx]
  const isAnswered = selectedOption !== undefined

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">Questão <strong className="text-white">{currentIdx + 1}</strong> de {CEFR_QUESTIONS.length}</p>
        <span className="text-xs px-2 py-1 bg-purple-950/40 text-purple-300 rounded-md font-mono">{question.level}</span>
      </div>

      <div className="progress-bar h-2 mb-6">
        <div className="progress-fill transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="card-elevated p-6 mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">{question.question}</h2>

        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedOption === i
                  ? 'border-purple-500 bg-purple-950/40 shadow-glow-sm'
                  : 'border-border-subtle bg-bg-elevated hover:border-purple-800/60'
              }`}
            >
              <span className="font-mono text-purple-400 mr-3">{String.fromCharCode(65 + i)}.</span>
              <span className="text-white">{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!isAnswered}
        className={`btn-primary w-full ${!isAnswered ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {currentIdx + 1 >= CEFR_QUESTIONS.length ? 'Ver resultado' : 'Próxima'} <ChevronRight size={16} />
      </button>
    </div>
  )
}
