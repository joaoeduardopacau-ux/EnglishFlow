import { useState, useRef, useEffect } from 'react'
import { Video, Play, Pause, RotateCcw, Volume2, ExternalLink, ChevronLeft } from 'lucide-react'

// Curadoria: vídeos educacionais no YouTube (embed)
// Nota: usando embed do YouTube que permite reprodução sem baixar
const VIDEOS = [
  {
    id: 'daily-english',
    youtubeId: 'juKd26qkNAw',
    title: 'Daily English Conversation',
    channel: 'Learn English with Bob',
    duration: '5:30',
    level: 'A2',
    topic: 'Cotidiano',
    emoji: '💬',
    color: 'from-blue-500 to-indigo-800',
    description: 'Conversas do dia a dia em inglês simples.',
    transcript: [
      { time: 0, en: 'Hi, how are you today?', pt: 'Oi, como você está hoje?' },
      { time: 3, en: 'I\'m doing great, thanks for asking!', pt: 'Estou ótimo, obrigado por perguntar!' },
      { time: 6, en: 'What did you do yesterday?', pt: 'O que você fez ontem?' },
      { time: 9, en: 'I went to the park with my family.', pt: 'Fui ao parque com minha família.' },
      { time: 12, en: 'That sounds like a lot of fun!', pt: 'Isso parece muito divertido!' },
      { time: 15, en: 'Yes, we had a great time.', pt: 'Sim, nos divertimos muito.' },
    ],
  },
  {
    id: 'business-english',
    youtubeId: 'kaMTB2CGgnA',
    title: 'Business English Basics',
    channel: 'BBC Learning English',
    duration: '4:15',
    level: 'B1',
    topic: 'Negócios',
    emoji: '💼',
    color: 'from-slate-600 to-gray-900',
    description: 'Frases essenciais para o ambiente corporativo.',
    transcript: [
      { time: 0, en: 'Good morning, thank you for coming.', pt: 'Bom dia, obrigado por virem.' },
      { time: 3, en: 'Let\'s get started with the meeting.', pt: 'Vamos começar a reunião.' },
      { time: 6, en: 'First, I\'d like to discuss the quarterly report.', pt: 'Primeiro, gostaria de discutir o relatório trimestral.' },
      { time: 10, en: 'The results show significant growth.', pt: 'Os resultados mostram crescimento significativo.' },
      { time: 14, en: 'Do you have any questions?', pt: 'Vocês têm alguma pergunta?' },
    ],
  },
  {
    id: 'travel-phrases',
    youtubeId: 'YQHsXMglC9A',
    title: 'Essential Travel Phrases',
    channel: 'Learn English Kids',
    duration: '3:45',
    level: 'A1',
    topic: 'Viagem',
    emoji: '✈️',
    color: 'from-cyan-500 to-blue-800',
    description: 'Frases essenciais para viajar em qualquer lugar do mundo.',
    transcript: [
      { time: 0, en: 'Where is the airport, please?', pt: 'Onde fica o aeroporto, por favor?' },
      { time: 3, en: 'How much does this cost?', pt: 'Quanto custa isso?' },
      { time: 6, en: 'Can I have the menu, please?', pt: 'Posso ver o cardápio, por favor?' },
      { time: 9, en: 'I would like to book a room.', pt: 'Gostaria de reservar um quarto.' },
      { time: 12, en: 'Thank you very much!', pt: 'Muito obrigado!' },
    ],
  },
  {
    id: 'food-vocab',
    youtubeId: 'guWQ_x5oyEE',
    title: 'Food Vocabulary in English',
    channel: 'English with Lucy',
    duration: '4:00',
    level: 'A2',
    topic: 'Comida',
    emoji: '🍽️',
    color: 'from-orange-500 to-red-800',
    description: 'Aprenda vocabulário de comida em inglês.',
    transcript: [
      { time: 0, en: 'I love pizza and pasta.', pt: 'Eu amo pizza e macarrão.' },
      { time: 3, en: 'What is your favorite food?', pt: 'Qual é sua comida favorita?' },
      { time: 6, en: 'I usually eat breakfast at 7am.', pt: 'Eu geralmente tomo café às 7h.' },
      { time: 9, en: 'This restaurant is delicious!', pt: 'Este restaurante é delicioso!' },
      { time: 12, en: 'Can I have some water, please?', pt: 'Posso beber um pouco de água, por favor?' },
    ],
  },
  {
    id: 'grammar-tenses',
    youtubeId: 'AT5CO9j8SQI',
    title: 'English Tenses Explained',
    channel: 'mmmEnglish',
    duration: '6:00',
    level: 'B1',
    topic: 'Gramática',
    emoji: '📚',
    color: 'from-purple-500 to-fuchsia-800',
    description: 'Entenda os tempos verbais em inglês.',
    transcript: [
      { time: 0, en: 'I work in an office every day.', pt: 'Eu trabalho num escritório todos os dias.' },
      { time: 3, en: 'She is reading a book right now.', pt: 'Ela está lendo um livro agora.' },
      { time: 6, en: 'We visited Paris last summer.', pt: 'Nós visitamos Paris no verão passado.' },
      { time: 9, en: 'They will travel to Japan next month.', pt: 'Eles viajarão para o Japão no próximo mês.' },
      { time: 12, en: 'I have been learning English for 2 years.', pt: 'Estou aprendendo inglês há 2 anos.' },
    ],
  },
  {
    id: 'pronunciation',
    youtubeId: 'Wgw1MpF07R8',
    title: 'English Pronunciation Practice',
    channel: 'Rachel\'s English',
    duration: '5:15',
    level: 'B2',
    topic: 'Pronúncia',
    emoji: '🎤',
    color: 'from-pink-500 to-rose-800',
    description: 'Melhore sua pronúncia em inglês.',
    transcript: [
      { time: 0, en: 'The quick brown fox jumps over the lazy dog.', pt: 'A rápida raposa marrom pula sobre o cachorro preguiçoso.' },
      { time: 4, en: 'She sells seashells by the seashore.', pt: 'Ela vende conchas na beira do mar.' },
      { time: 8, en: 'How much wood would a woodchuck chuck?', pt: 'Quanta madeira uma marmota jogaria?' },
      { time: 12, en: 'Peter Piper picked a peck of pickled peppers.', pt: 'Pedro Piper escolheu um punhado de pimentas em conserva.' },
    ],
  },
]

export default function Videos() {
  const [selected, setSelected] = useState(null)

  if (selected) {
    return <VideoPlayer video={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-pink-800 flex items-center justify-center shadow-glow-sm">
          <Video size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Vídeos</h1>
          <p className="text-gray-400 text-sm">Aprenda inglês com vídeos curtos + legendas interativas</p>
        </div>
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VIDEOS.map(video => (
          <button
            key={video.id}
            onClick={() => setSelected(video)}
            className="group card-elevated overflow-hidden text-left hover:border-purple-500 transition-all"
          >
            <div className={`bg-gradient-to-br ${video.color} p-6 relative`}>
              <div className="text-5xl">{video.emoji}</div>
              <div className="absolute top-3 right-3 flex gap-1">
                <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-bold text-white">{video.level}</span>
                <span className="px-2 py-1 bg-black/40 rounded-md text-xs font-mono text-white">{video.duration}</span>
              </div>
              <div className="absolute bottom-3 right-3 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={16} className="text-white ml-0.5" />
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-purple-300 font-semibold">{video.topic}</p>
              <h3 className="text-base font-bold text-white mt-1">{video.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{video.channel}</p>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{video.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎬</div>
          <div>
            <p className="text-white font-semibold">Como usar?</p>
            <p className="text-sm text-gray-400 mt-1">
              Assista aos vídeos e veja as legendas em inglês e português lado a lado.
              Clique em qualquer palavra para ouvir a pronúncia!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoPlayer({ video, onBack }) {
  const [selectedWord, setSelectedWord] = useState(null)
  const [showTranslation, setShowTranslation] = useState(true)

  const handleWordClick = (word) => {
    const clean = word.replace(/[^a-zA-Z']/g, '').toLowerCase()
    if (!clean) return
    setSelectedWord(clean)
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(clean)
      utter.lang = 'en-US'
      window.speechSynthesis.speak(utter)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-purple-300 hover:text-purple-200 mb-4 text-sm"
      >
        <ChevronLeft size={16} /> Voltar
      </button>

      {/* Video info */}
      <div className={`card-elevated overflow-hidden mb-6`}>
        <div className={`bg-gradient-to-br ${video.color} p-6`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{video.emoji}</div>
            <div className="flex-1">
              <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">{video.topic} · {video.level}</p>
              <h1 className="text-xl lg:text-2xl font-bold text-white mt-1">{video.title}</h1>
              <p className="text-sm text-white/80 mt-1">{video.channel} · {video.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Embed */}
      <div className="card-elevated overflow-hidden mb-6">
        <div className="relative bg-black" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-3 flex items-center justify-between bg-bg-elevated">
          <p className="text-xs text-gray-400">
            🎧 Recomendado usar fone de ouvido para melhor experiência
          </p>
          <a
            href={`https://youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1"
          >
            Ver no YouTube <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Transcript interativo */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Transcrição Interativa</h2>
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={e => setShowTranslation(e.target.checked)}
              className="rounded"
            />
            Mostrar tradução
          </label>
        </div>

        <div className="space-y-3">
          {video.transcript.map((line, i) => (
            <div key={i} className="border-l-2 border-purple-800/40 pl-3">
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono text-purple-400 mt-1 shrink-0 min-w-[3rem]">
                  {Math.floor(line.time / 60)}:{String(line.time % 60).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <p className="text-white leading-relaxed">
                    {line.en.split(' ').map((word, wi) => {
                      const clean = word.replace(/[^a-zA-Z']/g, '').toLowerCase()
                      const isSelected = selectedWord === clean
                      return (
                        <span key={wi}>
                          <span
                            onClick={() => handleWordClick(word)}
                            className={`cursor-pointer inline-block px-0.5 rounded hover:bg-purple-950/40 transition-colors ${
                              isSelected ? 'bg-purple-800/60 text-purple-200' : ''
                            }`}
                          >
                            {word}
                          </span>
                          {' '}
                        </span>
                      )
                    })}
                  </p>
                  {showTranslation && (
                    <p className="text-sm text-gray-500 italic mt-1">{line.pt}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 italic mt-4 text-center">
          💡 Clique em qualquer palavra para ouvir a pronúncia
        </p>
      </div>
    </div>
  )
}
