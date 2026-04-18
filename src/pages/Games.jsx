import { useEffect, useState } from 'react'
import { Trophy, RotateCw, ArrowLeft } from 'lucide-react'
import { dictionary, getRandomWords } from '../data/dictionary'
import { getRandomSentence } from '../data/sentences'
import { useProgress } from '../contexts/ProgressContext'
import { useStage, filterByStage } from '../contexts/StageContext'
import StageSelector from '../components/StageSelector'

// Pick n random dictionary words, capped to the stage's maxLevel.
function getStageWords(n, stage) {
  const pool = filterByStage(dictionary, stage).filter(w => /^[a-zA-Z']+$/.test(w.word))
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export default function Games() {
  const { stage } = useStage()
  const [game, setGame] = useState(null)

  if (!game) {
    return (
      <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
        <header className="mb-6">
          <h1 className="section-title">Jogos</h1>
          <p className="section-subtitle">
            Estágio atual: <span className="text-purple-300 font-semibold">{stage.emoji} {stage.label}</span>
          </p>
        </header>

        <div className="card p-4 mb-5">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Dificuldade</p>
          <StageSelector compact />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GameCard
            emoji="🎯"
            title="Múltipla Escolha"
            desc="Qual a tradução correta da palavra?"
            gradient="from-purple-700 to-purple-900"
            onClick={() => setGame('multiple')}
          />
          <GameCard
            emoji="🧩"
            title="Combinar Palavras"
            desc="Conecte cada palavra à sua tradução"
            gradient="from-fuchsia-700 to-purple-800"
            onClick={() => setGame('match')}
          />
          <GameCard
            emoji="✏️"
            title="Complete a Frase"
            desc="Qual palavra falta na frase?"
            gradient="from-violet-700 to-indigo-900"
            onClick={() => setGame('fill')}
          />
          <GameCard
            emoji="⚡"
            title="Tradução Rápida"
            desc="Digite a tradução antes do tempo acabar"
            gradient="from-purple-600 to-purple-950"
            onClick={() => setGame('speed')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <button onClick={() => setGame(null)} className="btn-ghost flex items-center gap-2 mb-4">
        <ArrowLeft size={16} /> Voltar aos jogos
      </button>
      {game === 'multiple' && <MultipleChoiceGame />}
      {game === 'match' && <WordMatchGame />}
      {game === 'fill' && <FillBlankGame />}
      {game === 'speed' && <SpeedGame />}
    </div>
  )
}

function GameCard({ emoji, title, desc, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-5 text-left hover:border-border-bright hover:shadow-glow-sm transition-all group"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
        {emoji}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
      <span className="text-sm text-purple-400 font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        Jogar →
      </span>
    </button>
  )
}

// ────────────────────────────────────────
// Jogo 1: Múltipla Escolha
// ────────────────────────────────────────
function MultipleChoiceGame() {
  const { addXP } = useProgress()
  const { stage } = useStage()
  const [round, setRound] = useState(null)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  function newRound() {
    const [correct, ...wrong] = getStageWords(stage.mcOptions, stage)
    if (!correct) { setRound(null); return }
    const options = [correct, ...wrong].sort(() => Math.random() - 0.5)
    setRound({ correct, options })
    setSelected(null)
  }

  useEffect(() => { newRound() }, [stage.id])

  function pick(w) {
    if (selected) return
    setSelected(w)
    setTotal(t => t + 1)
    const ok = w.id === round.correct.id
    if (ok) setScore(s => s + 1)
    const baseXP = Math.ceil(5 * stage.xpMultiplier)
    addXP(ok ? baseXP : 1, { module: 'games', correct: ok })
    setTimeout(newRound, 1200)
  }

  if (!round) return null

  return (
    <div>
      <ScoreHeader title="Múltipla Escolha" score={score} total={total} />
      <div className="card-elevated p-8 text-center mt-4">
        <p className="text-sm text-purple-300 mb-2">Qual a tradução de:</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{round.correct.word}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {round.options.map(opt => {
          const isSel = selected?.id === opt.id
          const isCorrect = selected && opt.id === round.correct.id
          let cls = 'card p-4 text-left hover:border-purple-600 transition-all'
          if (selected) {
            if (isCorrect) cls = 'card p-4 border-emerald-600 bg-emerald-950/40 text-emerald-200'
            else if (isSel) cls = 'card p-4 border-red-600 bg-red-950/40 text-red-200'
            else cls = 'card p-4 opacity-50'
          }
          return (
            <button key={opt.id} onClick={() => pick(opt)} className={cls}>
              <span className="text-white font-medium">{opt.translation}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ────────────────────────────────────────
// Jogo 2: Combinar (pares)
// ────────────────────────────────────────
function WordMatchGame() {
  const { addXP } = useProgress()
  const { stage } = useStage()
  const [pairs, setPairs] = useState([])
  const [selLeft, setSelLeft] = useState(null)
  const [selRight, setSelRight] = useState(null)
  const [matched, setMatched] = useState([])
  const [wrong, setWrong] = useState([])
  const [left, setLeft] = useState([])
  const [right, setRight] = useState([])

  function newGame() {
    const ws = getStageWords(stage.matchPairs, stage)
    setPairs(ws)
    setLeft(ws.map(w => ({ id: w.id, label: w.word })))
    setRight([...ws].sort(() => Math.random() - 0.5).map(w => ({ id: w.id, label: w.translation })))
    setMatched([])
    setWrong([])
    setSelLeft(null)
    setSelRight(null)
  }

  useEffect(() => { newGame() }, [stage.id])

  useEffect(() => {
    if (selLeft != null && selRight != null) {
      if (selLeft === selRight) {
        setMatched(m => [...m, selLeft])
        addXP(Math.ceil(3 * stage.xpMultiplier), { module: 'games', correct: true })
        setTimeout(() => { setSelLeft(null); setSelRight(null) }, 350)
      } else {
        setWrong([selLeft, selRight])
        addXP(0, { module: 'games', correct: false })
        setTimeout(() => { setWrong([]); setSelLeft(null); setSelRight(null) }, 700)
      }
    }
  }, [selLeft, selRight])

  const done = matched.length === pairs.length && pairs.length > 0

  return (
    <div>
      <ScoreHeader title="Combinar Palavras" score={matched.length} total={pairs.length} />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="space-y-2">
          {left.map(item => {
            const isMatched = matched.includes(item.id)
            const isSel = selLeft === item.id
            const isWrong = wrong.includes(item.id) && selLeft === item.id
            let cls = 'word-chip-idle'
            if (isMatched) cls = 'word-chip-correct'
            else if (isWrong) cls = 'word-chip-wrong'
            else if (isSel) cls = 'word-chip-active'
            return (
              <button
                key={`l-${item.id}`}
                disabled={isMatched}
                onClick={() => setSelLeft(item.id)}
                className={`${cls} w-full !py-3`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          {right.map(item => {
            const isMatched = matched.includes(item.id)
            const isSel = selRight === item.id
            const isWrong = wrong.includes(item.id) && selRight === item.id
            let cls = 'word-chip-idle'
            if (isMatched) cls = 'word-chip-correct'
            else if (isWrong) cls = 'word-chip-wrong'
            else if (isSel) cls = 'word-chip-active'
            return (
              <button
                key={`r-${item.id}`}
                disabled={isMatched}
                onClick={() => setSelRight(item.id)}
                className={`${cls} w-full !py-3`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
      {done && (
        <div className="mt-6 card-elevated p-6 text-center">
          <Trophy size={40} className="text-yellow-400 mx-auto" />
          <h3 className="text-xl font-bold text-white mt-2">Perfeito!</h3>
          <button onClick={newGame} className="btn-primary mt-4 flex items-center gap-2 mx-auto">
            <RotateCw size={16} /> Jogar de novo
          </button>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────
// Jogo 3: Complete a frase
// ────────────────────────────────────────
function FillBlankGame() {
  const { addXP } = useProgress()
  const { stage } = useStage()
  const [round, setRound] = useState(null)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  function newRound() {
    const sent = getRandomSentence(stage.maxLevel)
    const contentTokens = sent.words
      .map((w, i) => ({ w, i }))
      .filter(({ w }) => /^[a-zA-Z']+$/.test(w) && w.length > 2)
    if (contentTokens.length === 0) { setRound(null); return }
    const target = contentTokens[Math.floor(Math.random() * contentTokens.length)]
    const numOptions = stage.mcOptions // 2 for beginner, 4 otherwise
    const distractors = getStageWords(numOptions + 2, stage)
      .map(x => x.word)
      .filter(x => x.toLowerCase() !== target.w.toLowerCase())
      .slice(0, numOptions - 1)
    const options = [target.w, ...distractors].sort(() => Math.random() - 0.5)
    setRound({ sent, target, options })
    setSelected(null)
  }

  useEffect(() => { newRound() }, [stage.id])

  function pick(opt) {
    if (selected) return
    setSelected(opt)
    setTotal(t => t + 1)
    const ok = opt.toLowerCase() === round.target.w.toLowerCase()
    if (ok) setScore(s => s + 1)
    const baseXP = Math.ceil(6 * stage.xpMultiplier)
    addXP(ok ? baseXP : 1, { module: 'games', correct: ok })
    setTimeout(newRound, 1500)
  }

  if (!round) return null

  const display = round.sent.words.map((w, i) => {
    if (i === round.target.i) return selected ? round.target.w : '____'
    return w
  }).join(' ').replace(/\s([.,!?;:])/g, '$1')

  return (
    <div>
      <ScoreHeader title="Complete a Frase" score={score} total={total} />
      <div className="card-elevated p-8 mt-4">
        <span className="badge-purple">{round.sent.level}</span>
        <p className="text-2xl font-medium text-white mt-4 leading-relaxed">{display}</p>
        <p className="text-sm text-gray-400 mt-4 italic">{round.sent.portuguese}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {round.options.map(opt => {
          const isCorrect = selected && opt.toLowerCase() === round.target.w.toLowerCase()
          const isSel = selected === opt
          let cls = 'card p-4 text-center hover:border-purple-600 transition-all'
          if (selected) {
            if (isCorrect) cls = 'card p-4 text-center border-emerald-600 bg-emerald-950/40'
            else if (isSel) cls = 'card p-4 text-center border-red-600 bg-red-950/40'
            else cls = 'card p-4 text-center opacity-50'
          }
          return (
            <button key={opt} onClick={() => pick(opt)} className={cls}>
              <span className="text-white font-medium">{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ────────────────────────────────────────
// Jogo 4: Tradução rápida (escrita)
// ────────────────────────────────────────
function SpeedGame() {
  const { addXP } = useProgress()
  const { stage } = useStage()
  const maxTime = stage.speedSeconds
  const [current, setCurrent] = useState(null)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [time, setTime] = useState(maxTime)

  function newRound() {
    const [w] = getStageWords(1, stage)
    setCurrent(w)
    setInput('')
    setFeedback(null)
    setTime(maxTime)
  }

  useEffect(() => { newRound() }, [stage.id])

  useEffect(() => {
    if (feedback) return
    const id = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          setFeedback('timeout')
          setTotal(x => x + 1)
          addXP(0, { module: 'games', correct: false })
          setTimeout(newRound, 1500)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [feedback, current, addXP])

  function submit(e) {
    e.preventDefault()
    if (!input.trim() || feedback) return
    const correct = current.translation.toLowerCase().split('/').map(s => s.trim())
    const ok = correct.some(c => c === input.trim().toLowerCase())
    setFeedback(ok ? 'ok' : 'wrong')
    setTotal(t => t + 1)
    if (ok) setScore(s => s + 1)
    // Faster answer → more XP
    const speedBonus = Math.max(1, Math.round(time / 5))
    const baseXP = Math.ceil((4 + speedBonus) * stage.xpMultiplier)
    addXP(ok ? baseXP : 1, { module: 'games', correct: ok })
    setTimeout(newRound, 1500)
  }

  if (!current) return null

  return (
    <div>
      <ScoreHeader title="Tradução Rápida" score={score} total={total} />
      <div className="card-elevated p-8 text-center mt-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="progress-bar flex-1 max-w-xs">
            <div className="progress-fill" style={{ width: `${(time / maxTime) * 100}%` }} />
          </div>
          <span className="text-sm font-mono text-gray-400 w-10">{time}s</span>
        </div>
        <p className="text-sm text-purple-300 mb-1">Traduza para português:</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{current.word}</h2>
        <form onSubmit={submit} className="mt-6 flex gap-2 max-w-md mx-auto">
          <input
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite a tradução..."
            className="input"
            disabled={!!feedback}
          />
          <button type="submit" className="btn-primary" disabled={!!feedback}>OK</button>
        </form>
        {feedback === 'ok' && <p className="text-emerald-400 font-medium mt-4">✓ Correto!</p>}
        {feedback === 'wrong' && <p className="text-red-400 font-medium mt-4">✗ Era "{current.translation}"</p>}
        {feedback === 'timeout' && <p className="text-yellow-400 font-medium mt-4">⏰ Tempo esgotado! Era "{current.translation}"</p>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────
// Shared
// ────────────────────────────────────────
function ScoreHeader({ title, score, total }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="flex items-center gap-2 text-sm">
        <Trophy size={16} className="text-yellow-400" />
        <span className="font-mono font-semibold text-white">{score}</span>
        <span className="text-gray-500">/ {total}</span>
      </div>
    </div>
  )
}
