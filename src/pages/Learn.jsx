import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Check, Headphones, Mic, Blocks, Layers, ArrowRight, Sparkles, RotateCw } from 'lucide-react'
import { useFocus } from '../contexts/FocusContext'
import { generateSentence } from '../utils/sentenceGenerator'

// Landing hub for picking what aspect of English to drill.
// Two independent axes — Gramática (structural) + Tema (vocabulary) —
// persisted globally so practice modules inherit the choice automatically.

export default function Learn() {
  const { focus, grammar, theme, setGrammar, setTheme, reset, grammars, themes } = useFocus()

  // Live preview: a sample sentence built with the current focus
  // regenerated whenever the grammar/theme changes.
  const preview = useMemo(() => {
    try {
      return generateSentence({ grammar: focus.grammar, topic: focus.theme })
    } catch {
      return null
    }
  }, [focus.grammar, focus.theme])

  const anyFilterActive = focus.grammar !== 'any' || focus.theme !== 'all'

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-8">
      {/* Header */}
      <header>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold uppercase tracking-wider">
              <Sparkles size={14} /> Foco de estudo
            </div>
            <h1 className="section-title mt-1">O que você quer treinar?</h1>
            <p className="section-subtitle">
              Escolha uma área de gramática e, se quiser, um tema. Todos os módulos
              (Listening, Speaking, Montar Frase) vão usar essa escolha.
            </p>
          </div>
          {anyFilterActive && (
            <button
              onClick={reset}
              className="btn-ghost !px-3 !py-2 text-sm flex items-center gap-1.5 shrink-0"
              title="Limpar seleção"
            >
              <RotateCw size={14} /> Limpar
            </button>
          )}
        </div>
      </header>

      {/* Current selection summary */}
      <section className="card-elevated p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Atual:</span>
          <span className="badge-purple !text-sm">
            <span className="mr-1">{grammar.emoji}</span>{grammar.label}
          </span>
          <span className="text-gray-600">·</span>
          <span className="badge-purple !text-sm">
            <span className="mr-1">{theme.emoji}</span>{theme.label}
          </span>
        </div>
        {preview && (
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Exemplo ao vivo</p>
            <p className="text-lg text-white">{preview.english}</p>
            <p className="text-sm text-gray-400 italic mt-1">{preview.portuguese}</p>
          </div>
        )}
      </section>

      {/* Grammar grid */}
      <section>
        <h2 className="text-base font-semibold text-white mb-1">Gramática</h2>
        <p className="text-sm text-gray-400 mb-4">Que estrutura de frase você quer praticar?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {grammars.map(g => {
            const active = g.id === focus.grammar
            return (
              <button
                key={g.id}
                onClick={() => setGrammar(g.id)}
                className={`card p-4 text-left transition-all relative hover:border-border-bright ${
                  active ? 'border-purple-600 bg-purple-950/30 shadow-glow-sm' : ''
                }`}
              >
                {active && (
                  <Check size={14} className="absolute top-2.5 right-2.5 text-purple-300" />
                )}
                <div className="text-2xl mb-2">{g.emoji}</div>
                <p className="font-semibold text-white text-sm leading-tight">{g.label}</p>
                <p className="text-xs text-gray-400 mt-1 leading-snug">{g.description}</p>
                <p className="text-[11px] text-purple-300/70 italic mt-2 font-mono truncate">
                  {g.example}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Theme grid */}
      <section>
        <h2 className="text-base font-semibold text-white mb-1">Tema</h2>
        <p className="text-sm text-gray-400 mb-4">Que vocabulário aparece com mais frequência?</p>
        <div className="flex flex-wrap gap-2">
          {themes.map(t => {
            const active = t.id === focus.theme
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                  active
                    ? 'bg-purple-900/40 border-purple-600 text-white shadow-glow-sm'
                    : 'bg-bg-elevated border-border-subtle text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-1.5">{t.emoji}</span>{t.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Jump into practice */}
      <section>
        <h2 className="text-base font-semibold text-white mb-1">Começar a praticar</h2>
        <p className="text-sm text-gray-400 mb-4">Com esse foco aplicado, escolha um módulo:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <PracticeCard to="/listening" icon={Headphones} title="Listening"    subtitle="Ouvir frases" color="from-violet-600 to-purple-800" />
          <PracticeCard to="/speaking"  icon={Mic}        title="Speaking"     subtitle="Falar em voz alta" color="from-fuchsia-600 to-pink-800" />
          <PracticeCard to="/builder"   icon={Blocks}     title="Montar Frase" subtitle="Traduzir do PT" color="from-fuchsia-700 to-purple-900" />
          <PracticeCard to="/flashcards" icon={Layers}    title="Flashcards"   subtitle="Vocabulário do tema" color="from-purple-700 to-purple-900" />
        </div>
      </section>
    </div>
  )
}

function PracticeCard({ to, icon: Icon, title, subtitle, color }) {
  return (
    <Link to={to} className="group card p-4 hover:border-border-bright hover:shadow-glow-sm transition-all">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="font-semibold text-white text-sm">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      <div className="flex items-center gap-1 mt-3 text-purple-400 text-xs font-medium">
        Começar <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
