import { useMemo, useState } from 'react'
import { Search, Volume2, ArrowDownAZ, ArrowUpAZ, Shuffle, Layers } from 'lucide-react'
import { dictionary, categories, levels } from '../data/dictionary'
import { useSpeech } from '../hooks/useSpeech'

const SORT_OPTIONS = [
  { id: 'default', label: 'Padrão',  icon: Shuffle },
  { id: 'az',      label: 'A → Z',   icon: ArrowDownAZ },
  { id: 'za',      label: 'Z → A',   icon: ArrowUpAZ },
  { id: 'level',   label: 'Por nível', icon: Layers },
]

const LEVEL_ORDER = { 'Ini-1': 1, 'Inter-2': 2, 'Avanc-3': 3 }
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Dictionary() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [lvl, setLvl] = useState('all')
  const [sort, setSort] = useState('default')
  const [letter, setLetter] = useState('all') // 'all' | 'A' | 'B' | ...
  const { speak, supported } = useSpeech()

  // Letters that actually exist in the (level+category)-filtered set — so we
  // can dim letters that would return zero results.
  const availableLetters = useMemo(() => {
    const set = new Set()
    for (const w of dictionary) {
      if (cat !== 'all' && w.category !== cat) continue
      if (lvl !== 'all' && w.level !== lvl) continue
      set.add(w.word[0].toUpperCase())
    }
    return set
  }, [cat, lvl])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = dictionary.filter(w => {
      if (cat !== 'all' && w.category !== cat) return false
      if (lvl !== 'all' && w.level !== lvl) return false
      if (letter !== 'all' && w.word[0].toUpperCase() !== letter) return false
      if (!term) return true
      return w.word.toLowerCase().includes(term) || w.translation.toLowerCase().includes(term)
    })

    if (sort === 'az') {
      list = [...list].sort((a, b) => a.word.localeCompare(b.word, 'en', { sensitivity: 'base' }))
    } else if (sort === 'za') {
      list = [...list].sort((a, b) => b.word.localeCompare(a.word, 'en', { sensitivity: 'base' }))
    } else if (sort === 'level') {
      list = [...list].sort((a, b) => {
        const la = LEVEL_ORDER[a.level] || 99
        const lb = LEVEL_ORDER[b.level] || 99
        if (la !== lb) return la - lb
        return a.word.localeCompare(b.word, 'en', { sensitivity: 'base' })
      })
    }
    return list
  }, [q, cat, lvl, letter, sort])

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <header className="mb-5">
        <h1 className="section-title">Dicionário</h1>
        <p className="section-subtitle">{dictionary.length} palavras · {filtered.length} filtradas</p>
      </header>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar palavra ou tradução..."
          className="input !pl-11"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        <Pill active={lvl === 'all'} onClick={() => setLvl('all')}>Todos os níveis</Pill>
        {levels.map(l => (
          <Pill key={l} active={lvl === l} onClick={() => setLvl(l)}>{l}</Pill>
        ))}
      </div>
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(c => (
          <Pill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            <span className="mr-1">{c.emoji}</span>{c.label}
          </Pill>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mr-1">Ordenar:</span>
        {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
          <Pill key={id} active={sort === id} onClick={() => setSort(id)}>
            <Icon size={13} className="inline mr-1 -mt-0.5" />{label}
          </Pill>
        ))}
      </div>

      {/* A-Z letter jumper */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setLetter('all')}
          className={`w-8 h-8 shrink-0 rounded-lg text-xs font-bold transition-all border ${
            letter === 'all'
              ? 'bg-purple-900/40 border-purple-600 text-white'
              : 'bg-bg-elevated border-border-subtle text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        {ALPHABET.map(L => {
          const available = availableLetters.has(L)
          const active = letter === L
          return (
            <button
              key={L}
              disabled={!available}
              onClick={() => setLetter(L)}
              className={`w-8 h-8 shrink-0 rounded-lg text-xs font-bold transition-all border ${
                active
                  ? 'bg-purple-900/40 border-purple-600 text-white'
                  : available
                    ? 'bg-bg-elevated border-border-subtle text-gray-300 hover:text-white hover:border-purple-600'
                    : 'bg-bg-elevated border-border-subtle text-gray-700 cursor-not-allowed opacity-40'
              }`}
            >
              {L}
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          Nenhuma palavra encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(w => (
            <div key={w.id} className="card p-4 hover:border-border-bright transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white truncate">{w.word}</h3>
                    <span className="badge-purple text-[10px]">{w.level}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5 truncate">{w.translation}</p>
                  {w.example && (
                    <p className="text-xs text-gray-500 italic mt-2 line-clamp-2">"{w.example}"</p>
                  )}
                </div>
                {supported && (
                  <button
                    onClick={() => speak(w.word)}
                    className="p-2 rounded-lg hover:bg-bg-elevated text-purple-400 shrink-0"
                    title="Ouvir"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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
