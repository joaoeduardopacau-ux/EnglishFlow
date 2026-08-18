import { useState, useEffect, useRef } from 'react'
import { Bot, Send, RotateCw, ChevronLeft, Volume2, Lightbulb, User } from 'lucide-react'
import { SCENARIOS, findResponse } from '../data/chatScenarios'
import { useSpeech } from '../hooks/useSpeech'
import { useProgress } from '../contexts/ProgressContext'
import SharkMascot from '../components/SharkMascot'

export default function Chatbot() {
  const [selected, setSelected] = useState(null)

  if (selected) {
    return <ChatSession scenario={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header com Sharky */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center shadow-glow-sm">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Conversation Practice</h1>
            <p className="text-gray-400 text-sm">Pratique conversação com seu AI Trainer do EnglishFlow</p>
          </div>
        </div>
        <div className="hidden md:block">
          <SharkMascot size={90} variant="thinking" animated />
        </div>
      </div>

      {/* Scenarios grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => setSelected(scenario)}
            className="group card-elevated overflow-hidden text-left hover:border-purple-500 transition-all"
          >
            <div className={`bg-gradient-to-br ${scenario.color} p-6 relative`}>
              <div className="text-5xl">{scenario.emoji}</div>
              <span className="absolute top-3 right-3 px-2 py-1 bg-white/20 rounded-md text-xs font-bold text-white">
                {scenario.level}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">{scenario.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{scenario.description}</p>
              <p className="text-xs text-purple-300 mt-3 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Começar conversa →
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🤖</div>
          <div>
            <p className="text-white font-semibold">Como funciona?</p>
            <p className="text-sm text-gray-400 mt-1">
              Escolha um cenário e converse em inglês. O bot vai responder de forma natural,
              te ajudando a praticar conversação em situações reais!
            </p>
          </div>
        </div>
      </div>
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
        className="flex items-center gap-1 text-purple-300 hover:text-purple-200 mb-4 text-sm shrink-0"
      >
        <ChevronLeft size={16} /> Voltar aos cenários
      </button>

      {/* Header do chat */}
      <div className={`card-elevated overflow-hidden shrink-0`}>
        <div className={`bg-gradient-to-br ${scenario.color} p-4`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{scenario.emoji}</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">{scenario.title}</h2>
              <p className="text-xs text-white/80">{scenario.context}</p>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Reiniciar conversa"
            >
              <RotateCw size={16} />
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="p-3 border-b border-border-subtle">
          <div className="flex items-start gap-2">
            <Lightbulb size={14} className="text-yellow-400 shrink-0 mt-0.5" />
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
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center shrink-0">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
        isBot
          ? 'bg-bg-elevated border border-border-subtle rounded-bl-sm'
          : 'bg-gradient-to-br from-purple-600 to-fuchsia-800 rounded-br-sm shadow-glow-sm'
      }`}>
        <p className="text-white leading-relaxed">{msg.text}</p>
        {isBot && (
          <button
            onClick={onSpeak}
            className="mt-1 text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1"
          >
            <Volume2 size={10} /> Ouvir
          </button>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shrink-0">
          <User size={14} className="text-white" />
        </div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center shrink-0">
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
