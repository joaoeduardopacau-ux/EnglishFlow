import { useState, useEffect, useRef } from 'react'
import { Bot, Send, RotateCw, ChevronLeft, Volume2, Lightbulb, User, Search } from 'lucide-react'
import { SCENARIOS, findResponse } from '../data/chatScenarios'
import { useSpeech } from '../hooks/useSpeech'
import { useProgress } from '../contexts/ProgressContext'

const LEVELS = ['Todos', 'A1', 'A2', 'B1', 'B2', 'C1']

export default function Chatbot() {
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('Todos')

  if (selected) {
    return <ChatSession scenario={selected} onBack={() => setSelected(null)} />
  }

  const filtered = SCENARIOS.filter(s => {
    if (level !== 'Todos' && s.level !== level) return false
    if (q && !s.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-6 pb-10 lg:pt-8 lg:pb-16 space-y-6">
      {/* Header */}
      <header>
        <p className="kbd">Conversation Practice</p>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight mt-1">
          Converse em inglês
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Escolha um cenário e pratique diálogos reais com seu AI Trainer
        </p>
      </header>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cenário..."
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
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Scenarios grid */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-500 text-sm">
          <Bot size={32} className="mx-auto mb-3 opacity-40" />
          Nenhum cenário encontrado. Ajuste os filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => setSelected(scenario)}
              className="group card p-5 text-left hover:border-blue-500/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{scenario.emoji}</div>
                <span className="px-2 py-0.5 rounded-md bg-bg-elevated border border-border-subtle text-[10px] font-bold text-gray-300">
                  {scenario.level}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">{scenario.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{scenario.description}</p>
              <p className="text-xs text-blue-400 mt-3 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Começar conversa →
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ChatSession({ scenario, onBack }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesRef = useRef(null)
  const speech = useSpeech()
  const { addXP } = useProgress()

  // Mensagem inicial
  useEffect(() => {
    setMessages([{
      id: Date.now(),
      role: 'bot',
      text: scenario.intro,
    }])
  }, [scenario])

  // Auto scroll
  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }])
    setInput('')
    setTyping(true)

    // Bot "pensa" e responde
    setTimeout(() => {
      const reply = findResponse(text, scenario)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }])
      setTyping(false)

      // XP por mensagem (2 XP por mensagem enviada)
      addXP(2, { module: 'speaking', correct: true })
    }, 800 + Math.random() * 800)
  }

  const handleReset = () => {
    setMessages([{
      id: Date.now(),
      role: 'bot',
      text: scenario.intro,
    }])
    setInput('')
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10 flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-blue-300 hover:text-blue-200 mb-4 text-sm shrink-0"
      >
        <ChevronLeft size={16} /> Voltar aos cenários
      </button>

      {/* Header do chat */}
      <div className="card overflow-hidden shrink-0">
        <div className="p-4 flex items-center gap-3 border-b border-border-subtle">
          <div className="text-3xl shrink-0">{scenario.emoji}</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-white truncate">{scenario.title}</h2>
            <p className="text-xs text-gray-500 truncate">{scenario.context}</p>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-bg-elevated border border-border-subtle text-[10px] font-bold text-gray-300">
            {scenario.level}
          </span>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-bg-elevated transition-colors"
            title="Reiniciar conversa"
          >
            <RotateCw size={16} />
          </button>
        </div>

        {/* Tips */}
        <div className="p-3">
          <div className="flex items-start gap-2">
            <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-400 space-y-1">
              {scenario.tips.map((tip, i) => (
                <p key={i}>💡 {tip}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onSpeak={() => speech.speak(msg.text)} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="card-elevated p-3 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message in English..."
            className="flex-1 bg-bg-base border border-border-subtle rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors"
            spellCheck="true"
            lang="en"
            disabled={typing}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || typing}
            className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg, onSpeak }) {
  const isBot = msg.role === 'bot'
  return (
    <div className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
        isBot
          ? 'bg-bg-elevated border border-border-subtle rounded-bl-sm'
          : 'bg-blue-600 rounded-br-sm'
      }`}>
        <p className="text-white leading-relaxed">{msg.text}</p>
        {isBot && (
          <button
            onClick={onSpeak}
            className="mt-1 text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1"
          >
            <Volume2 size={10} /> Ouvir
          </button>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shrink-0">
          <User size={14} className="text-white" />
        </div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-bg-elevated border border-border-subtle rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
