import { useMemo, useState, useEffect } from 'react'
import { Search, Volume2, ArrowDownAZ, ArrowUpAZ, Shuffle, Layers, Star, Sparkles } from 'lucide-react'
import { dictionary, categories, levels } from '../data/dictionary'
import { useSpeech } from '../hooks/useSpeech'
import { useAuth } from '../contexts/AuthContext'

const SORT_OPTIONS = [
  { id: 'default', label: 'Padrão',    icon: Shuffle },
  { id: 'az',      label: 'A → Z',     icon: ArrowDownAZ },
  { id: 'za',      label: 'Z → A',     icon: ArrowUpAZ },
  { id: 'level',   label: 'Por nível', icon: Layers },
]

const LEVEL_ORDER = { 'Ini-1': 1, 'Inter-2': 2, 'Avanc-3': 3 }
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const POS_LABEL = {
  n: 'subst.',    adj: 'adj.',    v: 'verbo',
  adv: 'advérbio', prep: 'prep.',  det: 'det.',
  pron: 'pron.',  conj: 'conj.',  interj: 'interj.',
  aux: 'aux.',    num: 'num.',    phrase: 'expr.',
}
const POS_COLOR = {
  n: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  adj: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  v: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  adv: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  prep: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  det: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  pron: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  conj: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  interj: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  aux: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  num: 'bg-lime-500/15 text-lime-300 border-lime-500/30',
  phrase: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
}

// Determinístico por dia — mesma palavra por 24h.
function pickWordOfDay() {
  const day = Math.floor(Date.now() / 86400000)
  // Prefer common Ini-1 verbs and nouns for daily study
  const pool = dictionary.filter(w => w.level === 'Ini-1' && (w.pos === 'v' || w.pos === 'n'))
  return pool[day % pool.length] || dictionary[day % dictionary.length]
}

function useFavorites() {
  const { user } = useAuth()
  const key = `dict-favs:${user?.uid || 'guest'}`
  const [favs, setFavs] = useState(new Set())

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      setFavs(new Set(raw ? JSON.parse(raw) : []))
    } catch { setFavs(new Set()) }
  }, [key])

  const persist = (next) => {
    setFavs(next)
    try { localStorage.setItem(key, JSON.stringify([...next])) } catch {}
  }

  return {
    has: (id) => favs.has(id),
    toggle: (id) => {
      const next = new Set(favs)
      next.has(id) ? next.delete(id) : next.add(id)
      persist(next)
    },
    size: favs.size,
  }
}

export default function Dictionary() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [lvl, setLvl] = useState('all')
  const [sort, setSort] = useState('default')
  const [letter, setLetter] = useState('all')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const { speak, supported } = useSpeech()
  const favs = useFavorites()

  const wordOfDay = useMemo(pickWordOfDay, [])

  const availableLetters = useMemo(() => {
    const set = new Set()
    for (const w of dictionary) {
      if (cat !== 'all' && w.category !== cat) continue
      if (lvl !== 'all' && w.level !== lvl) continue
      if (onlyFavs && !favs.has(w.id)) continue
      set.add(w.word[0].toUpperCase())
    }
    return set
  }, [cat, lvl, onlyFavs, favs])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = dictionary.filter(w => {
      if (cat !== 'all' && w.category !== cat) return false
      if (lvl !== 'all' && w.level !== lvl) return false
      if (letter !== 'all' && w.word[0].toUpperCase() !== letter) return false
      if (onlyFavs && !favs.has(w.id)) return false
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
  }, [q, cat, lvl, letter, sort, onlyFavs, favs])

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <header className="mb-5">
        <h1 className="section-title">Dicionário</h1>
        <p className="section-subtitle">
          {dictionary.length} palavras · {filtered.length} filtradas
          {favs.size > 0 && <> · <span className="text-purple-300">{favs.size} favoritas</span></>}
        </p>
      </header>

      {/* Word of the day */}
      {wordOfDay && (
        <div className="card-elevated p-4 mb-5 border-l-4 border-purple-500">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-800 flex items-center justify-center shadow-glow-sm shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs uppercase tracking-wider text-purple-300 font-semibold">Palavra do dia</p>
                <PosBadge pos={wordOfDay.pos} />
              </div>
              <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{wordOfDay.word}</h2>
                <p className="text-lg text-gray-300">— {wordOfDay.translation}</p>
              </div>
              {wordOfDay.example && (
                <p className="text-sm text-gray-400 italic mt-1">"{wordOfDay.example}"</p>
              )}
            </div>
            {supported && (
              <button
                onClick={() => speak(wordOfDay.word)}
                className="p-2 rounded-lg hover:bg-bg-elevated text-purple-400 shrink-0"
                title="Ouvir"
              >
                <Volume2 size={18} />
              </button>
            )}
          </div>
        </div>
      )}

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
        <Pill active={onlyFavs} onClick={() => setOnlyFavs(v => !v)}>
          <Star size={13} className={`inline mr-1 -mt-0.5 ${onlyFavs ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          Favoritas {favs.size > 0 && `(${favs.size})`}
        </Pill>
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
        >All</button>
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
            >{L}</button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          {onlyFavs
            ? 'Nenhuma palavra favorita ainda. Clica na estrela ⭐ pra adicionar.'
            : 'Nenhuma palavra encontrada.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(w => (
            <WordCard
              key={w.id}
              word={w}
              isFav={favs.has(w.id)}
              onToggleFav={() => favs.toggle(w.id)}
              onSpeak={supported ? () => speak(w.word) : null}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function WordCard({ word, isFav, onToggleFav, onSpeak }) {
  return (
    <div className="card p-4 hover:border-border-bright transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-white truncate">{word.word}</h3>
            <PosBadge pos={word.pos} />
            <span className="badge-purple text-[10px]">{word.level}</span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{word.translation}</p>
          {word.example && (
            <p className="text-xs text-gray-500 italic mt-2 line-clamp-2">"{word.example}"</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            onClick={onToggleFav}
            className={`p-1.5 rounded-lg hover:bg-bg-elevated transition-colors ${
              isFav ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'
            }`}
            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star size={16} className={isFav ? 'fill-yellow-400' : ''} />
          </button>
          {onSpeak && (
            <button
              onClick={onSpeak}
              className="p-1.5 rounded-lg hover:bg-bg-elevated text-purple-400"
              title="Ouvir"
            >
              <Volume2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PosBadge({ pos }) {
  if (!pos || !POS_LABEL[pos]) return null
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${POS_COLOR[pos] || 'bg-gray-500/15 text-gray-300 border-gray-500/30'}`}>
      {POS_LABEL[pos]}
    </span>
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
