import { useState, useEffect, useMemo } from 'react'
import { PenLine, Sparkles, Save, Trash2, RefreshCw, Calendar, TrendingUp, BookOpen, Lightbulb } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { WRITING_PROMPTS, getPromptOfTheDay, getRandomPrompt } from '../data/writingPrompts'

const CATEGORY_COLORS = {
  daily: 'from-blue-600 to-indigo-800',
  travel: 'from-cyan-600 to-blue-800',
  food: 'from-orange-500 to-red-700',
  people: 'from-pink-500 to-fuchsia-800',
  memories: 'from-yellow-500 to-orange-700',
  dreams: 'from-purple-500 to-violet-800',
  hobbies: 'from-emerald-500 to-teal-700',
  opinion: 'from-rose-500 to-red-700',
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Writing() {
  const { user } = useAuth()
  const { addXP } = useProgress()
  const uid = user?.uid || 'guest'
  const storageKey = `writing:${uid}`

  const [entries, setEntries] = useState({})
  const [currentPromptId, setCurrentPromptId] = useState(getPromptOfTheDay().id)
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [viewMode, setViewMode] = useState('write') // write | history

  const currentPrompt = WRITING_PROMPTS.find(p => p.id === currentPromptId) || WRITING_PROMPTS[0]
  const todayEntry = entries[todayISO()]

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      const data = raw ? JSON.parse(raw) : {}
      setEntries(data)
      if (data[todayISO()]) {
        setText(data[todayISO()].text || '')
        setCurrentPromptId(data[todayISO()].promptId || currentPromptId)
      }
    } catch {}
  }, [storageKey])

  const wordCount = useMemo(() => {
    return text.trim().split(/\s+/).filter(Boolean).length
  }, [text])

  const charCount = text.length

  const totalWords = useMemo(() => {
    return Object.values(entries).reduce((sum, e) => {
      const w = (e.text || '').trim().split(/\s+/).filter(Boolean).length
      return sum + w
    }, 0)
  }, [entries])

  const totalEntries = Object.keys(entries).length

  const handleSave = () => {
    if (!text.trim()) return

    const wordsBefore = todayEntry ? (todayEntry.text || '').trim().split(/\s+/).filter(Boolean).length : 0
    const wordsNow = wordCount
    const wordsAdded = Math.max(0, wordsNow - wordsBefore)

    const newEntries = {
      ...entries,
      [todayISO()]: {
        text,
        promptId: currentPromptId,
        wordCount: wordCount,
        updatedAt: new Date().toISOString(),
      }
    }
    setEntries(newEntries)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newEntries))
    } catch {}

    // XP: 1 XP a cada 10 palavras novas (máx 20 XP por save)
    if (wordsAdded > 0) {
      const xp = Math.min(20, Math.floor(wordsAdded / 10) + 1)
      addXP(xp, { module: 'flashcards', correct: true })
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleNewPrompt = () => {
    const next = getRandomPrompt(currentPromptId)
    setCurrentPromptId(next.id)
    setText('')
  }

  const handleDelete = () => {
    if (!confirm('Excluir a entrada de hoje?')) return
    const newEntries = { ...entries }
    delete newEntries[todayISO()]
    setEntries(newEntries)
    setText('')
    try {
      localStorage.setItem(storageKey, JSON.stringify(newEntries))
    } catch {}
  }

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center shadow-glow-sm">
            <PenLine size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Writing Journal</h1>
            <p className="text-gray-400 text-sm">Pratique escrita em inglês todos os dias</p>
          </div>
        </div>

        <div className="flex gap-1 bg-bg-elevated rounded-lg p-1">
          <button
            onClick={() => setViewMode('write')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'write' ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
          >
            Escrever
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'history' ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
          >
            Histórico ({totalEntries})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox icon={Calendar} label="Entradas" value={totalEntries} gradient="from-indigo-500 to-purple-700" />
        <StatBox icon={BookOpen} label="Palavras escritas" value={totalWords} gradient="from-purple-500 to-fuchsia-700" />
        <StatBox icon={TrendingUp} label="Média por dia" value={totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0} gradient="from-fuchsia-500 to-pink-700" />
      </div>

      {viewMode === 'write' ? (
        <>
          {/* Prompt do dia */}
          <div className="card-elevated overflow-hidden">
            <div className={`bg-gradient-to-br ${CATEGORY_COLORS[currentPrompt.category]} p-5`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{currentPrompt.emoji}</div>
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Prompt de hoje</p>
                    <h2 className="text-lg lg:text-xl font-bold text-white">{currentPrompt.prompt}</h2>
                  </div>
                </div>
                <button
                  onClick={handleNewPrompt}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                  title="Novo prompt"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Hint */}
            <div className="p-4 border-b border-border-subtle">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1"
              >
                <Lightbulb size={14} />
                {showHint ? 'Esconder dica' : 'Ver dica'}
              </button>
              {showHint && (
                <p className="text-sm text-gray-400 mt-2 italic">💡 {currentPrompt.hint}</p>
              )}
            </div>

            {/* Editor */}
            <div className="p-4">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Comece a escrever em inglês..."
                className="w-full min-h-[300px] bg-bg-base border border-border-subtle rounded-xl p-4 text-white placeholder-gray-500 resize-y focus:outline-none focus:border-purple-600 transition-colors"
                spellCheck="true"
                lang="en"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span><strong className="text-white">{wordCount}</strong> palavra{wordCount !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span><strong className="text-white">{charCount}</strong> caractere{charCount !== 1 ? 's' : ''}</span>
                {wordCount >= 50 && <span className="text-emerald-400 flex items-center gap-1"><Sparkles size={12} /> Ótimo!</span>}
              </div>
              <div className="flex gap-2">
                {todayEntry && (
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Excluir entrada"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={!text.trim() || saved}
                  className={`btn-primary flex items-center gap-2 ${
                    saved ? 'bg-emerald-600' : ''
                  } ${!text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save size={16} />
                  {saved ? '✓ Salvo!' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>

          {/* Metas de escrita */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <GoalBox target={20} current={wordCount} label="Iniciante" emoji="🌱" />
            <GoalBox target={50} current={wordCount} label="Bom" emoji="⭐" />
            <GoalBox target={100} current={wordCount} label="Excelente" emoji="🏆" />
          </div>
        </>
      ) : (
        /* HISTÓRICO */
        <div className="space-y-3">
          {totalEntries === 0 ? (
            <div className="card-elevated p-8 text-center">
              <BookOpen size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">Você ainda não tem entradas. Comece a escrever!</p>
            </div>
          ) : (
            Object.entries(entries)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, entry]) => {
                const prompt = WRITING_PROMPTS.find(p => p.id === entry.promptId) || WRITING_PROMPTS[0]
                return (
                  <div key={date} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{prompt.emoji}</span>
                        <div>
                          <p className="text-xs text-purple-300 font-semibold">{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
                          <p className="text-sm text-gray-400 mt-0.5">{prompt.prompt}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{entry.wordCount || 0} palavras</span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{entry.text}</p>
                  </div>
                )
              })
          )}
        </div>
      )}
    </div>
  )
}

function StatBox({ icon: Icon, label, value, gradient }) {
  return (
    <div className={`card-elevated p-3 bg-gradient-to-br ${gradient} border-white/10`}>
      <Icon size={16} className="text-white/90" />
      <p className="text-xs text-white/70 mt-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  )
}

function GoalBox({ target, current, label, emoji }) {
  const percent = Math.min(100, (current / target) * 100)
  const done = current >= target
  return (
    <div className={`card p-3 ${done ? 'border-emerald-800/40' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white">{emoji} {label}</span>
        <span className={`text-xs font-mono ${done ? 'text-emerald-400' : 'text-gray-400'}`}>
          {current}/{target}
        </span>
      </div>
      <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            done ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-fuchsia-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
