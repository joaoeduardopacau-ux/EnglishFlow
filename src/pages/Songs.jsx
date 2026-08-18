import { useState, useMemo, useEffect } from 'react'
import { Music2, Volume2, Play, Check, ArrowLeft, RefreshCw, Plus, Trash2, Youtube } from 'lucide-react'
import { SONGS, buildUserSong, extractYouTubeId } from '../data/songs'
import { useProgress } from '../contexts/ProgressContext'
import { useAuth } from '../contexts/AuthContext'
import { useSpeech } from '../hooks/useSpeech'

const USER_SONGS_KEY_PREFIX = 'user-songs:'

function useUserSongs() {
  const { user } = useAuth()
  const key = `${USER_SONGS_KEY_PREFIX}${user?.uid || 'guest'}`
  const [songs, setSongs] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      setSongs(raw ? JSON.parse(raw) : [])
    } catch {
      setSongs([])
    }
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

export default function Songs() {
  const [selectedSong, setSelectedSong] = useState(null)
  const [showForm, setShowForm] = useState(false)
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

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-purple-800 flex items-center justify-center shadow-glow-sm">
            <Music2 size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Aprenda com Músicas</h1>
            <p className="text-gray-400 text-sm">Toque a música, complete as lacunas e ganhe XP</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Nova música
        </button>
      </div>

      {/* User songs section */}
      {userLib.songs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">
            Suas músicas ({userLib.songs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userLib.songs.map(song => (
              <SongCard key={song.id} song={song} onClick={() => setSelectedSong(song)} />
            ))}
          </div>
        </section>
      )}

      {/* Built-in songs */}
      <section>
        {userLib.songs.length > 0 && (
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Biblioteca EnglishFlow
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SONGS.map(song => (
            <SongCard key={song.id} song={song} onClick={() => setSelectedSong(song)} />
          ))}
        </div>
      </section>

      {/* Info */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <p className="text-white font-semibold">Como funciona?</p>
            <p className="text-sm text-gray-400 mt-1">
              Cada música vem com o vídeo do YouTube pra você tocar de verdade. Complete as lacunas
              da letra ouvindo a música — ganhe XP a cada acerto. Você também pode adicionar suas
              próprias músicas no botão <span className="badge-purple">Nova música</span>.
            </p>
          </div>
        </div>
      </div>

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
  return (
    <button
      onClick={onClick}
      className="group card-elevated overflow-hidden text-left hover:border-purple-500 transition-all"
    >
      <div className={`bg-gradient-to-br ${song.color} p-6 relative`}>
        <div className="flex items-start justify-between">
          <div className="text-5xl">{song.emoji}</div>
          <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-bold text-white">
            {song.level}
          </span>
        </div>
        {song.userCreated && (
          <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded-full">
            Minha
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artist}{song.year ? ` · ${song.year}` : ''}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">{song.genre}</span>
          <span className="text-xs text-purple-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            {song.lyrics.length} frases <Play size={12} />
          </span>
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
      <div
        className="card-elevated w-full max-w-2xl my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music2 size={20} className="text-purple-400" /> Nova música
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
                    level === l ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-bg-elevated border-border-subtle text-gray-400'
                  }`}
                >{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Youtube size={14} className="text-red-500" /> Link do YouTube
            </label>
            <input
              value={youtube}
              onChange={e => setYoutube(e.target.value)}
              className="input mt-1"
              placeholder="https://youtu.be/..."
            />
            {youtube && !ytId && (
              <p className="text-xs text-red-400 mt-1">Link não reconhecido — cola o URL completo ou o ID de 11 caracteres.</p>
            )}
            {ytId && (
              <p className="text-xs text-emerald-400 mt-1">✓ ID reconhecido: <code>{ytId}</code></p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Letra (com <code className="text-purple-300">{'{palavra}'}</code> nas lacunas)
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
              Uma linha por frase. Use <code className="text-purple-300">{'{palavra}'}</code> pra marcar
              o que vira lacuna. Depois de <code className="text-purple-300">|</code> vai a tradução (opcional).
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
    setAnswers({})
    setRevealed({})
    setSession({ correct: 0, wrong: 0 })
  }

  const progress = totalGaps > 0 ? (Object.keys(revealed).length / totalGaps) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-purple-300 hover:text-purple-200 text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        {onDelete && (
          <button
            onClick={() => confirm(`Remover "${song.title}" da sua biblioteca?`) && onDelete()}
            className="flex items-center gap-1 text-gray-500 hover:text-red-400 text-xs"
          >
            <Trash2 size={14} /> Remover
          </button>
        )}
      </div>

      <div className="card-elevated overflow-hidden mb-6">
        <div className={`bg-gradient-to-br ${song.color} p-6`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{song.emoji}</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-white truncate">{song.title}</h1>
              <p className="text-white/80 truncate">{song.artist}{song.year ? ` · ${song.year}` : ''}</p>
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

        {/* YouTube player */}
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
          <div className="p-3 bg-bg-elevated text-center">
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + ' ' + song.title)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-purple-300 hover:text-purple-200 inline-flex items-center gap-1"
            >
              <Youtube size={14} className="text-red-500" /> Buscar no YouTube
            </a>
          </div>
        )}

        {/* Progress */}
        <div className="p-4 bg-bg-elevated border-t border-border-subtle">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Progresso: {Object.keys(revealed).length}/{totalGaps}</span>
            <span className="text-emerald-400">✓ {session.correct} · <span className="text-red-400">✗ {session.wrong}</span></span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Fallback link when embed present too */}
      {song.youtubeId && (
        <div className="text-center mb-4">
          <a
            href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
            target="_blank" rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-purple-300 inline-flex items-center gap-1"
          >
            <Youtube size={12} className="text-red-500" /> Abrir no YouTube
          </a>
        </div>
      )}

      {/* Letra */}
      <div className="space-y-4">
        {song.lyrics.map((line, lineIdx) => (
          <div key={lineIdx} className="card p-4">
            <div className="flex items-start gap-3 mb-2">
              <button
                onClick={() => speech.speak(line.line.replace(/\{(\w+)\}/g, '$1'))}
                className="p-2 rounded-lg text-purple-400 hover:bg-purple-950/40 transition-colors shrink-0"
                title="Ouvir esta linha (TTS)"
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
          <button onClick={handleReset} className="btn-primary mt-4 inline-flex items-center gap-2">
            <RefreshCw size={16} /> Tentar novamente
          </button>
        </div>
      )}
    </div>
  )
}
