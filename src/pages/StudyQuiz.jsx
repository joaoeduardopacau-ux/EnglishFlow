import { useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react'

const questions = [
  // Valor absoluto e valor posicional
  {
    subject: 'Matemática',
    topic: 'Valor absoluto e posicional',
    question: 'No número 4.523, qual é o valor posicional do algarismo 5?',
    options: ['5 unidades', '5 dezenas', '5 centenas', '5 milhares'],
    correct: 2,
  },
  {
    subject: 'Matemática',
    topic: 'Valor absoluto e posicional',
    question: 'Qual é o valor absoluto do algarismo 7 no número 3.712?',
    options: ['700', '70', '7', '7.000'],
    correct: 2,
  },
  // Operações com números naturais
  {
    subject: 'Matemática',
    topic: 'Operações com números naturais',
    question: 'Uma escola tem 320 alunos. Se 45 faltaram hoje, quantos alunos compareceram?',
    options: ['265', '275', '285', '365'],
    correct: 1,
  },
  {
    subject: 'Matemática',
    topic: 'Operações com números naturais',
    question: 'Pedro comprou 4 caixas com 12 lápis cada. Quantos lápis ele tem ao todo?',
    options: ['16', '40', '48', '52'],
    correct: 2,
  },
  {
    subject: 'Matemática',
    topic: 'Operações com números naturais',
    question: 'Uma mercearia recebeu 250 laranjas e vendeu 180. Quantas laranjas sobraram?',
    options: ['430', '80', '70', '60'],
    correct: 2,
  },
  // Expressão numérica
  {
    subject: 'Matemática',
    topic: 'Expressão numérica',
    question: 'Qual é o resultado de: 4 + 3 × 2?',
    options: ['14', '10', '11', '12'],
    correct: 1,
  },
  {
    subject: 'Matemática',
    topic: 'Expressão numérica',
    question: 'Calcule: (8 + 2) × 3 − 5',
    options: ['25', '30', '23', '20'],
    correct: 0,
  },
  {
    subject: 'Matemática',
    topic: 'Expressão numérica',
    question: 'Qual é o resultado de: 20 ÷ 4 + 6 × 2?',
    options: ['17', '14', '13', '19'],
    correct: 0,
  },
  // Sólidos geométricos
  {
    subject: 'Matemática',
    topic: 'Sólidos geométricos',
    question: 'Quantas faces tem um cubo?',
    options: ['4', '5', '6', '8'],
    correct: 2,
  },
  {
    subject: 'Matemática',
    topic: 'Sólidos geométricos',
    question: 'Qual sólido geométrico tem apenas uma face curva e dois círculos como base?',
    options: ['Esfera', 'Cone', 'Cubo', 'Cilindro'],
    correct: 3,
  },
  {
    subject: 'Matemática',
    topic: 'Sólidos geométricos',
    question: 'A pirâmide de base quadrada possui quantas faces triangulares?',
    options: ['3', '4', '5', '6'],
    correct: 1,
  },
  // Literatura e Redação — Fábula
  {
    subject: 'Literatura e Redação',
    topic: 'Gênero fábula',
    question: 'O que é uma fábula?',
    options: [
      'Um poema que fala sobre a natureza',
      'Uma narrativa curta com animais que ensinam uma lição moral',
      'Um texto jornalístico sobre acontecimentos reais',
      'Uma peça teatral com personagens históricos',
    ],
    correct: 1,
  },
  {
    subject: 'Literatura e Redação',
    topic: 'Gênero fábula',
    question: 'Como se chama a lição de moral encontrada no final de uma fábula?',
    options: ['Epílogo', 'Prólogo', 'Moral da história', 'Clímax'],
    correct: 2,
  },
  {
    subject: 'Literatura e Redação',
    topic: 'Gênero fábula',
    question: 'Na fábula "A Cigarra e a Formiga", qual é a principal lição ensinada?',
    options: [
      'Devemos cantar e ser felizes',
      'É importante trabalhar e se preparar para o futuro',
      'Formatos são mais inteligentes que cigarras',
      'O inverno é a melhor estação do ano',
    ],
    correct: 1,
  },
  {
    subject: 'Literatura e Redação',
    topic: 'Gênero fábula',
    question: 'Quem é o autor mais famoso de fábulas da Antiguidade?',
    options: ['Monteiro Lobato', 'Esopo', 'Shakespeare', 'Machado de Assis'],
    correct: 1,
  },
  {
    subject: 'Literatura e Redação',
    topic: 'Gênero fábula',
    question: 'Em uma redação de fábula, qual elemento é essencial e não pode faltar?',
    options: [
      'Personagens humanos reais',
      'Datas históricas',
      'Uma moral ao final do texto',
      'Diálogos em inglês',
    ],
    correct: 2,
  },
]

const subjectColors = {
  'Matemática': 'from-blue-600 to-blue-800',
  'Literatura e Redação': 'from-emerald-600 to-emerald-800',
}

const subjectBadge = {
  'Matemática': 'bg-blue-950/50 text-blue-300 border-blue-800/40',
  'Literatura e Redação': 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40',
}

export default function StudyQuiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState([])

  const q = questions[current]
  const isAnswered = selected !== null

  function handleSelect(idx) {
    if (isAnswered) return
    const correct = idx === q.correct
    setSelected(idx)
    setAnswers(prev => [...prev, { correct }])
    if (correct) setScore(s => s + 1)
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  function handleRestart() {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setAnswers([])
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const medal = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 50 ? '👍' : '📚'
    const msg =
      pct === 100
        ? 'Perfeito! Você dominou toda a matéria!'
        : pct >= 70
        ? 'Muito bem! Continue estudando!'
        : pct >= 50
        ? 'Bom esforço! Revise os erros.'
        : 'Não desista! Revise o conteúdo e tente de novo.'

    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="card p-8 flex flex-col items-center gap-5 text-center">
          <span className="text-6xl">{medal}</span>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Quiz finalizado!</h2>
            <p className="text-gray-400">{msg}</p>
          </div>

          <div className="w-full bg-bg-elevated rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="text-3xl font-bold text-white">
            {score}{' '}
            <span className="text-gray-500 text-xl font-normal">/ {questions.length}</span>
          </p>
          <p className="text-purple-300 font-semibold">{pct}% de acerto</p>

          <button
            onClick={handleRestart}
            className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-semibold transition-colors"
          >
            <RotateCcw size={18} />
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Quiz de Estudos</h1>
        <p className="text-gray-500 text-sm">Simulado Geral — FTD</p>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Questão {current + 1} de {questions.length}</span>
          <span>{score} acerto{score !== 1 ? 's' : ''}</span>
        </div>
        <div className="w-full bg-bg-elevated rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${((current) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card da questão */}
      <div className="card p-6 mb-4">
        {/* Badge de matéria e tópico */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${subjectBadge[q.subject]}`}>
            {q.subject}
          </span>
          <span className="text-xs text-gray-500 px-2.5 py-1 rounded-full border border-border bg-bg-elevated">
            {q.topic}
          </span>
        </div>

        {/* Enunciado */}
        <p className="text-white font-medium text-base leading-relaxed mb-6">{q.question}</p>

        {/* Alternativas */}
        <div className="flex flex-col gap-3">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correct
            const isSelected = idx === selected

            let style = 'border border-border bg-bg-elevated text-gray-300 hover:border-purple-600 hover:text-white'

            if (isAnswered) {
              if (isCorrect) {
                style = 'border border-green-500 bg-green-950/40 text-green-300'
              } else if (isSelected && !isCorrect) {
                style = 'border border-red-500 bg-red-950/40 text-red-300'
              } else {
                style = 'border border-border bg-bg-elevated text-gray-500 opacity-50'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${style}`}
              >
                <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full border border-current text-xs font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-red-400 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div
          className={`rounded-xl px-5 py-4 mb-4 flex items-center gap-3 ${
            selected === q.correct
              ? 'bg-green-950/50 border border-green-700/50'
              : 'bg-red-950/50 border border-red-700/50'
          }`}
        >
          {selected === q.correct ? (
            <>
              <CheckCircle2 size={22} className="text-green-400 flex-shrink-0" />
              <div>
                <p className="text-green-300 font-semibold">Correto!</p>
                <p className="text-green-400/70 text-sm">Muito bem, continue assim!</p>
              </div>
            </>
          ) : (
            <>
              <XCircle size={22} className="text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-semibold">Incorreto</p>
                <p className="text-red-400/70 text-sm">
                  A resposta correta era: <strong className="text-red-300">{q.options[q.correct]}</strong>
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Botão próxima */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-semibold transition-colors"
        >
          {current + 1 >= questions.length ? 'Ver resultado' : 'Próxima questão →'}
        </button>
      )}
    </div>
  )
}
