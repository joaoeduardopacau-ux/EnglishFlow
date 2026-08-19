import { useState, useEffect, useMemo } from 'react'
import { Sparkles, Save, Trash2, RefreshCw, BookOpen, Lightbulb } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { WRITING_PROMPTS, getPromptOfTheDay, getRandomPrompt } from '../data/writingPrompts'

const CATEGORY_ACCENTS = {
  daily:    'text-blue-300',
  travel:   'text-cyan-300',
  food:     'text-orange-300',
  people:   'text-pink-300',
  memories: 'text-amber-300',
  dreams:   'text-violet-300',
  hobbies:  'text-emerald-300',
  opinion:  'text-rose-300',
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
    <div className="max-w-4xl mx-auto px-5 lg:px-10 pt-6 pb-10 lg:pt-8 lg:pb-16 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="kbd">Writing Journal</p>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight mt-1">
            Escreva em inglês
          </h1>
          <p className="text-sm text-gray-500 mt-1">Pratique todos os dias e melhore sua fluência escrita</p>
        </div>

        <div className="flex gap-1 bg-bg-elevated rounded-lg p-1">
          <button
            onClick={() => setViewMode('write')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              viewMode === 'write' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Escrever
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              viewMode === 'history' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Histórico ({totalEntries})
          </button>
        </div>
      </header>

      {/* Stats — clean grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Entradas" value={totalEntries} accent="text-blue-400" />
        <StatCard label="Palavras escritas" value={totalWords.toLocaleString('pt-BR')} accent="text-cyan-400" />
        <StatCard label="Média por dia" value={totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0} accent="text-emerald-400" />
      </div>

      {viewMode === 'write' ? (
        <>
          {/* Prompt do dia — minimalista */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-border-subtle flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="text-3xl shrink-0">{currentPrompt.emoji}</div>
                <div className="min-w-0">
                  <p className={`kbd ${CATEGORY_ACCENTS[currentPrompt.category] || 'text-blue-400/80'}`}>
                    Prompt de hoje
                  </p>
                  <h2 className="text-base lg:text-lg font-semibold text-white leading-snug mt-1">
                    {currentPrompt.prompt}
                  </h2>
                </div>
              </div>
              <button
                onClick={handleNewPrompt}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-bg-elevated transition-colors shrink-0"
                title="Novo prompt"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Hint */}
            <div className="px-5 py-3 border-b border-border-subtle">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
              >
                <Lightbulb size={12} />
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
                className="w-full min-h-[280px] bg-bg-base border border-border-subtle rounded-xl p-4 text-white placeholder-gray-500 resize-y focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors leading-relaxed"
                spellCheck="true"
                lang="en"
              />
              {/* Word count progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span>
                    <strong className="text-white tabular-nums">{wordCount}</strong> palavras · {charCount} caracteres
                  </span>
                  {wordCount >= 100 && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Sparkles size={12} /> Excelente!
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden flex">
                  {[20, 50, 100].map((t, i) => {
                    const seg = wordCount >= t
                    const prev = i === 0 ? 0 : [20, 50][i - 1]
                    const localFill = Math.max(0, Math.min(1, (wordCount - prev) / (t - prev)))
                    return (
                      <div key={t} className="flex-1 relative">
                        <div
                          className={`h-full transition-all duration-300 ${
                            i === 0 ? 'bg-blue-500/70' : i === 1 ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${localFill * 100}%` }}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                  <span>🌱 20</span>
                  <span>⭐ 50</span>
                  <span>🏆 100</span>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-2 px-4 pb-4">
              {todayEntry && (
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Excluir entrada"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!text.trim() || saved}
                className={`btn-primary flex items-center gap-2 ${saved ? '!bg-emerald-600' : ''} ${!text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Save size={16} />
                {saved ? '✓ Salvo!' : 'Salvar'}
              </button>
            </div>
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

function StatCard({ label, value, accent }) {
  return (
    <div className="card p-4">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{label}</p>
      <p className={`text-2xl lg:text-3xl font-display font-bold mt-1 ${accent || 'text-white'}`}>{value}</p>
    </div>
  )
}
