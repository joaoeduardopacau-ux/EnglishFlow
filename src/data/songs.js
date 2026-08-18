// Trechos de músicas famosas para prática (fair use — educacional).
// youtubeId aponta pro vídeo oficial no YouTube (embed player na página da música).
export const SONGS = [
  {
    id: 'imagine',
    title: 'Imagine',
    artist: 'John Lennon',
    year: 1971,
    level: 'A2',
    genre: 'Rock',
    emoji: '☮️',
    color: 'from-amber-500 to-orange-700',
    youtubeId: 'YkgkThdzX-8',
    lyrics: [
      { line: 'Imagine there\'s no {heaven}', translation: 'Imagine que não há paraíso', gaps: ['heaven'] },
      { line: 'It\'s easy if you {try}', translation: 'É fácil se você tentar', gaps: ['try'] },
      { line: 'No hell {below} us', translation: 'Sem inferno abaixo de nós', gaps: ['below'] },
      { line: 'Above us only {sky}', translation: 'Acima de nós apenas o céu', gaps: ['sky'] },
      { line: 'Imagine all the {people}', translation: 'Imagine todas as pessoas', gaps: ['people'] },
      { line: 'Living for {today}', translation: 'Vivendo para o hoje', gaps: ['today'] },
    ],
  },
  {
    id: 'let-it-be',
    title: 'Let It Be',
    artist: 'The Beatles',
    year: 1970,
    level: 'A2',
    genre: 'Rock',
    emoji: '🎸',
    color: 'from-blue-500 to-indigo-800',
    youtubeId: 'QDYfEBY9NM4',
    lyrics: [
      { line: 'When I find myself in times of {trouble}', translation: 'Quando me encontro em tempos difíceis', gaps: ['trouble'] },
      { line: 'Mother Mary comes to {me}', translation: 'A mãe Maria vem até mim', gaps: ['me'] },
      { line: 'Speaking words of {wisdom}', translation: 'Falando palavras de sabedoria', gaps: ['wisdom'] },
      { line: 'Let it {be}', translation: 'Deixe estar', gaps: ['be'] },
      { line: 'And in my {hour} of darkness', translation: 'E na minha hora de escuridão', gaps: ['hour'] },
      { line: 'She is standing right in front of {me}', translation: 'Ela está bem em frente a mim', gaps: ['me'] },
    ],
  },
  {
    id: 'wonderful-world',
    title: 'What a Wonderful World',
    artist: 'Louis Armstrong',
    year: 1967,
    level: 'A2',
    genre: 'Jazz',
    emoji: '🌍',
    color: 'from-emerald-500 to-teal-800',
    youtubeId: 'VqhCQZaH4Vs',
    lyrics: [
      { line: 'I see trees of {green}', translation: 'Vejo árvores verdes', gaps: ['green'] },
      { line: 'Red roses {too}', translation: 'Rosas vermelhas também', gaps: ['too'] },
      { line: 'I see them {bloom}', translation: 'Eu as vejo florescer', gaps: ['bloom'] },
      { line: 'For me and {you}', translation: 'Para mim e para você', gaps: ['you'] },
      { line: 'And I think to {myself}', translation: 'E eu penso comigo mesmo', gaps: ['myself'] },
      { line: 'What a wonderful {world}', translation: 'Que mundo maravilhoso', gaps: ['world'] },
    ],
  },
  {
    id: 'hey-jude',
    title: 'Hey Jude',
    artist: 'The Beatles',
    year: 1968,
    level: 'B1',
    genre: 'Rock',
    emoji: '💫',
    color: 'from-purple-500 to-pink-700',
    youtubeId: 'A_MjCqQoLLA',
    lyrics: [
      { line: 'Hey Jude, don\'t make it {bad}', translation: 'Ei Jude, não piore as coisas', gaps: ['bad'] },
      { line: 'Take a sad {song} and make it better', translation: 'Pegue uma canção triste e melhore-a', gaps: ['song'] },
      { line: 'Remember to let her into your {heart}', translation: 'Lembre-se de deixá-la entrar em seu coração', gaps: ['heart'] },
      { line: 'Then you can start to make it {better}', translation: 'Aí você pode começar a melhorar', gaps: ['better'] },
      { line: 'Hey Jude, don\'t be {afraid}', translation: 'Ei Jude, não tenha medo', gaps: ['afraid'] },
      { line: 'You were made to go out and {get} her', translation: 'Você foi feito para sair e conquistá-la', gaps: ['get'] },
    ],
  },
  {
    id: 'yesterday',
    title: 'Yesterday',
    artist: 'The Beatles',
    year: 1965,
    level: 'B1',
    genre: 'Rock',
    emoji: '📅',
    color: 'from-slate-600 to-slate-900',
    youtubeId: 'NrgmdOz227I',
    lyrics: [
      { line: 'Yesterday, all my troubles seemed so far {away}', translation: 'Ontem, todos os meus problemas pareciam tão distantes', gaps: ['away'] },
      { line: 'Now it looks as though they\'re here to {stay}', translation: 'Agora parece que vieram para ficar', gaps: ['stay'] },
      { line: 'Oh, I believe in {yesterday}', translation: 'Oh, eu acredito no ontem', gaps: ['yesterday'] },
      { line: 'Suddenly, I\'m not half the man I used to {be}', translation: 'De repente, não sou nem metade do homem que eu era', gaps: ['be'] },
      { line: 'There\'s a shadow hanging over {me}', translation: 'Há uma sombra pairando sobre mim', gaps: ['me'] },
    ],
  },
  {
    id: 'stand-by-me',
    title: 'Stand By Me',
    artist: 'Ben E. King',
    year: 1961,
    level: 'A2',
    genre: 'Soul',
    emoji: '🤝',
    color: 'from-red-500 to-rose-800',
    youtubeId: 'hwZNL7QVJjE',
    lyrics: [
      { line: 'When the {night} has come', translation: 'Quando a noite chegar', gaps: ['night'] },
      { line: 'And the land is {dark}', translation: 'E a terra estiver escura', gaps: ['dark'] },
      { line: 'And the moon is the only {light} we\'ll see', translation: 'E a lua for a única luz que veremos', gaps: ['light'] },
      { line: 'No, I won\'t be {afraid}', translation: 'Não, eu não terei medo', gaps: ['afraid'] },
      { line: 'Just as long as you {stand} by me', translation: 'Enquanto você estiver ao meu lado', gaps: ['stand'] },
    ],
  },
]

// Extract a YouTube video ID from any common URL/ID input.
// Accepts: bare ID, youtu.be/xxx, youtube.com/watch?v=xxx, youtube.com/embed/xxx, m.youtube.com, shorts/xxx
export function extractYouTubeId(input) {
  if (!input) return null
  const s = String(input).trim()
  // Bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s
  const patterns = [
    /(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = s.match(re)
    if (m) return m[1]
  }
  return null
}

// Parse a user-pasted lyrics block into { line, gaps, translation } items.
// Format:
//   English line with {palavra} marking a gap  |  tradução opcional em português
//   Second line…                               |  Segunda tradução…
// The " | " (pipe with spaces) separates English from Portuguese.
// Multiple gaps per line are supported. Empty lines are skipped.
export function parseLyrics(raw) {
  if (!raw) return []
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(row => {
      const [enRaw, ptRaw = ''] = row.split(/\s*\|\s*/)
      const gaps = [...enRaw.matchAll(/\{([^}]+)\}/g)].map(m => m[1])
      return { line: enRaw, gaps, translation: ptRaw }
    })
    .filter(l => l.line.length > 0)
}

// Build a full song object ready to plug into <SongPractice>.
export function buildUserSong({ title, artist, level, youtube, lyrics }) {
  const youtubeId = extractYouTubeId(youtube)
  const parsedLyrics = parseLyrics(lyrics)
  return {
    id: `user-${Date.now()}`,
    title: (title || 'Sem título').trim(),
    artist: (artist || 'Desconhecido').trim(),
    year: null,
    level: (level || 'A2').toUpperCase(),
    genre: 'Minha música',
    emoji: '🎵',
    color: 'from-purple-600 to-blue-800',
    youtubeId,
    userCreated: true,
    lyrics: parsedLyrics,
  }
}
