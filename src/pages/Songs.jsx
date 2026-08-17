import { useState, useMemo } from 'react'
import { Music2, Volume2, Play, Check, X, ArrowLeft, Star, RefreshCw } from 'lucide-react'
import { SONGS } from '../data/songs'
import { useProgress } from '../contexts/ProgressContext'
import { useSpeech } from '../hooks/useSpeech'

export default function Songs() {
  const [selectedSong, setSelectedSong] = useState(null)

  if (selectedSong) {
    return <SongPractice song={selectedSong} onBack={() => setSelectedSong(null)} />
  }

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-purple-800 flex items-center justify-center shadow-glow-sm">
          <Music2 size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Aprenda com Músicas</h1>
          <p className="text-gray-400 text-sm">Complete as lacunas ouvindo trechos famosos</p>
        </div>
      </div>

      {/* Songs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SONGS.map(song => (
          <button
            key={song.id}
            onClick={() => setSelectedSong(song)}
            className="group card-elevated overflow-hidden text-left hover:border-purple-500 transition-all"
          >
            <div className={`bg-gradient-to-br ${song.color} p-6`}>
              <div className="flex items-start justify-between">
                <div className="text-5xl">{song.emoji}</div>
                <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-bold text-white">
                  {song.level}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">{song.title}</h3>
              <p className="text-sm text-gray-400">{song.artist} · {song.year}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{song.genre}</span>
                <span className="text-xs text-purple-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {song.lyrics.length} frases <Play size={12} />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <p className="text-white font-semibold">Como funciona?</p>
            <p className="text-sm text-gray-400 mt-1">
              Escolha uma música e complete as lacunas. Você pode ouvir cada linha clicando no botão de áudio.
              Ganhe XP a cada resposta correta!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SongPractice({ song, onBack }) {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})
  const [session, setSession] = useState({ correct: 0, wrong: 0 })
  const { addXP } = useProgress()
  const speech = useSpeech()

  const totalGaps = useMemo(() =>
    song.lyrics.reduce((sum, line) => sum + line.gaps.length, 0)
  , [song])

  const totalAnswered = Object.keys(answers).length
  const totalCorrect = Object.entries(answers).filter(([key, val]) => {
    const [lineIdx, gapIdx] = key.split('-').map(Number)
    return val.trim().toLowerCase() === song.lyrics[lineIdx].gaps[gapIdx].toLowerCase()
  }).length

  const handleCheck = (lineIdx, gapIdx) => {
    const key = `${lineIdx}-${gapIdx}`
    const user = (answers[key] || '').trim().toLowerCase()
    const correct = song.lyrics[lineIdx].gaps[gapIdx].toLowerCase()
    const isCorrect = user === correct

    setRevealed({ ...revealed, [key]: true })
    setSession(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1),
    }))

    addXP(isCorrect ? 8 : 2, { module: 'listening', correct: isCorrect })
  }

  const handleReset = () => {
    setAnswers({})
    setRevealed({})
    setSession({ correct: 0, wrong: 0 })
  }

  const progress = totalGaps > 0 ? (Object.keys(revealed).length / totalGaps) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-purple-300 hover:text-purple-200 mb-4 text-sm"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className={`card-elevated overflow-hidden mb-6`}>
        <div className={`bg-gradient-to-br ${song.color} p-6`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{song.emoji}</div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{song.title}</h1>
              <p className="text-white/80">{song.artist} · {song.year}</p>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Reiniciar"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="p-4 bg-bg-elevated">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Progresso: {Object.keys(revealed).length}/{totalGaps}</span>
            <span className="text-emerald-400">✓ {session.correct} · <span className="text-red-400">✗ {session.wrong}</span></span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Letra */}
      <div className="space-y-4">
        {song.lyrics.map((line, lineIdx) => (
          <div key={lineIdx} className="card p-4">
            <div className="flex items-start gap-3 mb-2">
              <button
                onClick={() => speech.speak(line.line.replace(/\{(\w+)\}/g, '$1'))}
                className="p-2 rounded-lg text-purple-400 hover:bg-purple-950/40 transition-colors shrink-0"
                title="Ouvir esta linha"
              >
                <Volume2 size={18} />
              </button>
              <div className="flex-1 flex flex-wrap items-center gap-1.5 text-lg text-white">
                {line.line.split(/(\{[^}]+\})/g).map((part, i) => {
                  const gapMatch = part.match(/^\{(.+)\}$/)
                  if (gapMatch) {
                    const gapWord = gapMatch[1]
                    const gapIdx = line.gaps.indexOf(gapWord)
                    const key = `${lineIdx}-${gapIdx}`
                    const isRevealed = revealed[key]
                    const isCorrect = isRevealed && (answers[key] || '').trim().toLowerCase() === gapWord.toLowerCase()
                    return (
                      <span key={i} className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={answers[key] || ''}
                          onChange={e => setAnswers({ ...answers, [key]: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && handleCheck(lineIdx, gapIdx)}
                          disabled={isRevealed}
                          placeholder="___"
                          className={`inline-block w-24 px-2 py-1 border-b-2 bg-transparent focus:outline-none text-center font-semibold ${
                            isRevealed
                              ? isCorrect
                                ? 'border-emerald-500 text-emerald-300'
                                : 'border-red-500 text-red-300 line-through'
                              : 'border-purple-500 text-white focus:border-purple-300'
                          }`}
                        />
                        {isRevealed && !isCorrect && (
                          <span className="text-emerald-400 font-semibold text-sm">
                            ({gapWord})
                          </span>
                        )}
                        {isRevealed && isCorrect && <Check size={16} className="text-emerald-400" />}
                        {!isRevealed && (
                          <button
                            onClick={() => handleCheck(lineIdx, gapIdx)}
                            disabled={!answers[key]?.trim()}
                            className="text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white px-2 py-1 rounded transition-colors"
                          >
                            ✓
                          </button>
                        )}
                      </span>
                    )
                  }
                  return <span key={i}>{part}</span>
                })}
              </div>
            </div>
            <p className="text-sm text-gray-500 italic ml-11">{line.translation}</p>
          </div>
        ))}
      </div>

      {/* Resultado */}
      {Object.keys(revealed).length === totalGaps && totalGaps > 0 && (
        <div className="card-elevated p-6 mt-6 text-center">
          <div className="text-5xl mb-2">
            {session.correct === totalGaps ? '🎉' : session.correct >= totalGaps / 2 ? '👏' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {session.correct === totalGaps ? 'Perfeito!' : 'Você completou!'}
          </h2>
          <p className="text-gray-400">
            {session.correct} de {totalGaps} corretas ({Math.round((session.correct / totalGaps) * 100)}%)
          </p>
          <button onClick={handleReset} className="btn-primary mt-4">
            <RefreshCw size={16} /> Tentar novamente
          </button>
        </div>
      )}
    </div>
  )
}
