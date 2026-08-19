import { useState, useMemo, useEffect } from 'react'
import { Volume2, Play, Check, ArrowLeft, RefreshCw, Plus, Trash2, Youtube, Music2, Search, Star } from 'lucide-react'
import { SONGS, buildUserSong, extractYouTubeId } from '../data/songs'
import { useProgress } from '../contexts/ProgressContext'
import { useAuth } from '../contexts/AuthContext'
import { useSpeech } from '../hooks/useSpeech'

const USER_SONGS_KEY_PREFIX = 'user-songs:'
const LEVELS = ['Todos', 'A1', 'A2', 'B1', 'B2', 'C1']

function useUserSongs() {
  const { user } = useAuth()
  const key = `${USER_SONGS_KEY_PREFIX}${user?.uid || 'guest'}`
  const [songs, setSongs] = useState([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      setSongs(raw ? JSON.parse(raw) : [])
    } catch { setSongs([]) }
  }, [key])
  const persist = (next) => {
    setSongs(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
  }
  return {
    songs,
    add: (s) => persist([s, ...songs]),
    remove: (id) => persist(songs.filter(x => x.id !== id)),
  }
}

function ytThumb(id) {
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export default function Songs() {
  const [selectedSong, setSelectedSong] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('Todos')
  const userLib = useUserSongs()

  if (selectedSong) {
    return (
      <SongPractice
        song={selectedSong}
        onBack={() => setSelectedSong(null)}
        onDelete={selectedSong.userCreated ? () => {
          userLib.remove(selectedSong.id)
          setSelectedSong(null)
        } : null}
      />
    )
  }

  const allSongs = [...userLib.songs, ...SONGS]
  const filtered = allSongs.filter(s => {
    if (level !== 'Todos' && s.level !== level) return false
    if (q && !s.title.toLowerCase().includes(q.toLowerCase()) && !s.artist.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  // Featured = song of the day (rotates by day)
  const featured = SONGS[Math.floor(Date.now() / 86400000) % SONGS.length]

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-10 pt-6 pb-10 lg:pt-8 lg:pb-16 space-y-6">
      {/* Hero header */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="kbd">Aprenda com música</p>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight mt-1">
            Suas músicas em inglês
          </h1>
          <p className="text-sm text-gray-500 mt-1">Toque, complete lacunas e ganhe XP</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Nova música
        </button>
      </header>

      {/* Featured song of the day */}
      {featured && (
        <button
          onClick={() => setSelectedSong(featured)}
          className="relative w-full overflow-hidden rounded-2xl border border-border-subtle text-left group hover:border-blue-500/40 transition-all"
          style={{ minHeight: 220 }}
        >
          {featured.youtubeId && (
            <img
              src={ytThumb(featured.youtubeId)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
          <div className="relative p-6 lg:p-10 flex items-end justify-between h-full min-h-[220px]">
            <div className="max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 mb-3">
                <Star size={12} className="text-amber-400" fill="currentColor" />
                <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">Música do dia</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white leading-tight">{featured.title}</h2>
              <p className="text-sm text-gray-300 mt-1">{featured.artist}{featured.year ? ` · ${featured.year}` : ''} · {featured.genre}</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="badge-purple">{featured.level}</span>
                <span className="text-xs text-gray-400">{featured.lyrics.length} frases</span>
              </div>
            </div>
            <div className="hidden sm:flex w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white text-slate-950 items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
              <Play size={22} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
        </button>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar título ou artista..."
            className="input !pl-10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors ${
                level === l ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'bg-bg-elevated border-border-subtle text-gray-400 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de músicas */}
      {userLib.songs.length > 0 && (
        <section>
          <h2 className="kbd mb-3">Suas músicas ({userLib.songs.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userLib.songs.map(song => (
              <SongCard key={song.id} song={song} onClick={() => setSelectedSong(song)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="kbd mb-3">
          {q || level !== 'Todos' ? `Resultados (${filtered.length})` : 'Biblioteca'}
        </h2>
        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-gray-500 text-sm">
            <Music2 size={32} className="mx-auto mb-3 opacity-40" />
            Nenhuma música encontrada. Ajuste os filtros ou adicione a sua.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.filter(s => !s.userCreated).map(song => (
              <SongCard key={song.id} song={song} onClick={() => setSelectedSong(song)} />
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <NewSongModal
          onClose={() => setShowForm(false)}
          onSave={(song) => {
            userLib.add(song)
            setShowForm(false)
            setSelectedSong(song)
          }}
        />
      )}
    </div>
  )
}

function SongCard({ song, onClick }) {
  const thumb = ytThumb(song.youtubeId)
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-border-subtle text-left hover:border-blue-500/40 hover:-translate-y-0.5 transition-all"
      style={{ aspectRatio: '4/3' }}
    >
      {thumb ? (
        <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${song.color || 'from-slate-800 to-slate-900'}`}>
          <div className="absolute top-3 left-3 text-4xl">{song.emoji || '🎵'}</div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/10" />

      {/* Level chip top-right */}
      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-[10px] font-bold text-white">
        {song.level}
      </span>
      {song.userCreated && (
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-500/80 backdrop-blur text-[10px] font-bold text-white">
          Minha
        </span>
      )}

      {/* Play button center */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl">
          <Play size={16} fill="currentColor" className="ml-0.5" />
        </div>
      </div>

      {/* Info bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-semibold text-sm leading-tight truncate">{song.title}</h3>
        <p className="text-xs text-gray-300 truncate mt-0.5">{song.artist}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-gray-400">{song.genre}</span>
          <span className="text-[10px] text-gray-500">·</span>
          <span className="text-[10px] text-blue-300">{song.lyrics.length} frases</span>
        </div>
      </div>
    </button>
  )
}

function NewSongModal({ onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [level, setLevel] = useState('A2')
  const [youtube, setYoutube] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [error, setError] = useState('')

  const ytId = extractYouTubeId(youtube)

  function handleSave() {
    setError('')
    if (!title.trim()) return setError('Coloca um título.')
    if (!ytId) return setError('Link do YouTube inválido. Cola o URL completo ou o ID.')
    if (!lyrics.trim()) return setError('Cola pelo menos uma linha da letra com {palavra} marcando lacunas.')
    const song = buildUserSong({ title, artist, level, youtube, lyrics })
    if (song.lyrics.length === 0) return setError('Nenhuma linha válida. Verifica o formato.')
    if (song.lyrics.every(l => l.gaps.length === 0)) return setError('Marca pelo menos uma lacuna com {palavra}.')
    onSave(song)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div className="card-elevated w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music2 size={20} className="text-blue-400" /> Nova música
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Título</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="input mt-1" placeholder="Ex: Shape of You" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Artista</label>
              <input value={artist} onChange={e => setArtist(e.target.value)} className="input mt-1" placeholder="Ex: Ed Sheeran" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Nível</label>
            <div className="flex gap-2 mt-2">
              {['A1', 'A2', 'B1', 'B2', 'C1'].map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    level === l ? 'bg-blue-500/15 border-blue-500 text-blue-300' : 'bg-bg-elevated border-border-subtle text-gray-400'
                  }`}
                >{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Youtube size={14} className="text-red-500" /> Link do YouTube
            </label>
            <input value={youtube} onChange={e => setYoutube(e.target.value)} className="input mt-1" placeholder="https://youtu.be/..." />
            {youtube && !ytId && (
              <p className="text-xs text-red-400 mt-1">Link não reconhecido — cola o URL completo ou o ID de 11 caracteres.</p>
            )}
            {ytId && (
              <p className="text-xs text-emerald-400 mt-1">✓ ID reconhecido: <code>{ytId}</code></p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Letra (com <code className="text-blue-300">{'{palavra}'}</code> nas lacunas)
            </label>
            <textarea
              value={lyrics}
              onChange={e => setLyrics(e.target.value)}
              rows={8}
              className="input mt-1 font-mono text-sm"
              placeholder={`I'm in {love} with the {shape} of you | Estou apaixonado pela sua forma
Push and pull like a {magnet} do | Puxa e empurra como um ímã
...`}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Uma linha por frase. Use <code className="text-blue-300">{'{palavra}'}</code> pra marcar
              o que vira lacuna. Depois de <code className="text-blue-300">|</code> vai a tradução (opcional).
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-xl p-3">{error}</div>
          )}
        </div>

        <div className="p-5 border-t border-border-subtle flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary">Salvar música</button>
        </div>
      </div>
    </div>
  )
}

function SongPractice({ song, onBack, onDelete }) {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})
  const [session, setSession] = useState({ correct: 0, wrong: 0 })
  const { addXP } = useProgress()
  const speech = useSpeech()

  const totalGaps = useMemo(() =>
    song.lyrics.reduce((sum, line) => sum + line.gaps.length, 0)
  , [song])

  const handleCheck = (lineIdx, gapIdx) => {
    const key = `${lineIdx}-${gapIdx}`
    const user = (answers[key] || '').trim().toLowerCase()
    const correct = song.lyrics[lineIdx].gaps[gapIdx].toLowerCase()
    const isCorrect = user === correct
    setRevealed(r => ({ ...r, [key]: true }))
    setSession(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1),
    }))
    addXP(isCorrect ? 8 : 2, { module: 'listening', correct: isCorrect })
  }

  const handleReset = () => {
    setAnswers({}); setRevealed({}); setSession({ correct: 0, wrong: 0 })
  }

  const progress = totalGaps > 0 ? (Object.keys(revealed).length / totalGaps) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-6 pb-10 lg:pt-8 lg:pb-16">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-blue-300 hover:text-blue-200 text-sm">
          <ArrowLeft size={16} /> Voltar
        </button>
        {onDelete && (
          <button onClick={() => confirm(`Remover "${song.title}"?`) && onDelete()}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-400 text-xs">
            <Trash2 size={14} /> Remover
          </button>
        )}
      </div>

      <div className="card-elevated overflow-hidden mb-6">
        {song.youtubeId ? (
          <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${song.youtubeId}?rel=0&modestbranding=1`}
              title={`${song.title} — ${song.artist}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className={`bg-gradient-to-br ${song.color} p-8 text-center`}>
            <div className="text-6xl mb-2">{song.emoji}</div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + ' ' + song.title)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-white/80 hover:text-white inline-flex items-center gap-1"
            >
              <Youtube size={14} /> Buscar no YouTube
            </a>
          </div>
        )}

        <div className="p-4 border-t border-border-subtle">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-white truncate">{song.title}</h1>
              <p className="text-sm text-gray-400 truncate">{song.artist}{song.year ? ` · ${song.year}` : ''}</p>
            </div>
            <button onClick={handleReset} className="p-2 rounded-lg bg-bg-elevated hover:bg-bg-hover text-white transition-colors shrink-0" title="Reiniciar">
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Progresso: {Object.keys(revealed).length}/{totalGaps}</span>
            <span className="text-emerald-400">✓ {session.correct} · <span className="text-red-400">✗ {session.wrong}</span></span>
          </div>
          <div className="progress-bar h-1.5">
            <div className="progress-fill transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {song.lyrics.map((line, lineIdx) => (
          <div key={lineIdx} className="card p-4">
            <div className="flex items-start gap-3 mb-2">
              <button
                onClick={() => speech.speak(line.line.replace(/\{(\w+)\}/g, '$1'))}
                className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors shrink-0"
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
                              ? isCorrect ? 'border-emerald-500 text-emerald-300' : 'border-red-500 text-red-300 line-through'
                              : 'border-blue-500 text-white focus:border-blue-300'
                          }`}
                        />
                        {isRevealed && !isCorrect && (
                          <span className="text-emerald-400 font-semibold text-sm">({gapWord})</span>
                        )}
                        {isRevealed && isCorrect && <Check size={16} className="text-emerald-400" />}
                        {!isRevealed && (
                          <button
                            onClick={() => handleCheck(lineIdx, gapIdx)}
                            disabled={!answers[key]?.trim()}
                            className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-2 py-1 rounded transition-colors"
                          >✓</button>
                        )}
                      </span>
                    )
                  }
                  return <span key={i}>{part}</span>
                })}
              </div>
            </div>
            {line.translation && (
              <p className="text-sm text-gray-500 italic ml-11">{line.translation}</p>
            )}
          </div>
        ))}
      </div>

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
          <button onClick={handleReset} className="btn-primary mt-4 inline-flex items-center gap-2">
            <RefreshCw size={16} /> Tentar novamente
          </button>
        </div>
      )}
    </div>
  )
}
