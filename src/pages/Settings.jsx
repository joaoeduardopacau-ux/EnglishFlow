import { useState, useEffect, useRef } from 'react'
import { Check, Download, Upload, Trash2, Volume2, Play } from 'lucide-react'
import { useTheme, THEMES } from '../contexts/ThemeContext'
import { useProgress } from '../contexts/ProgressContext'
import { useReview } from '../contexts/ReviewContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useSpeech, getSpeechPrefs, setSpeechPrefs } from '../hooks/useSpeech'
import { dictionary } from '../data/dictionary'
import { SONGS } from '../data/songs'

const GOAL_PRESETS = [
  { xp: 20,  label: 'Casual',  desc: '~5 min',  emoji: '☕' },
  { xp: 50,  label: 'Regular', desc: '~10 min', emoji: '📚' },
  { xp: 100, label: 'Sério',   desc: '~20 min', emoji: '🔥' },
  { xp: 200, label: 'Intenso', desc: '~40 min', emoji: '⚡' },
]

const APP_VERSION = '2.1.0'

export default function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { resetProgress, dailyGoal, setDailyGoal } = useProgress()
  const { resetReview } = useReview()
  const { supported, voices, speak } = useSpeech()
  const toast = useToast()

  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('soundEnabled') !== 'false' } catch { return true }
  })
  const [ttsRate, setTtsRate] = useState(() => getSpeechPrefs().rate ?? 0.9)
  const [ttsVoice, setTtsVoice] = useState(() => getSpeechPrefs().voiceName ?? '')
  const fileInputRef = useRef(null)

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    try { localStorage.setItem('soundEnabled', next ? 'true' : 'false') } catch {}
  }

  useEffect(() => { setSpeechPrefs({ rate: ttsRate }) }, [ttsRate])
  useEffect(() => { setSpeechPrefs({ voiceName: ttsVoice || undefined }) }, [ttsVoice])

  function handleExport() {
    const data = {}
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (!k) continue
        data[k] = localStorage.getItem(k)
      }
    } catch {}
    const blob = new Blob([JSON.stringify({
      exportedAt: new Date().toISOString(),
      version: APP_VERSION,
      data,
    }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `englishflow-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    toast.success('Backup baixado com sucesso.')
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (!parsed?.data) throw new Error('Formato inválido')
        if (!confirm('Substituir seu progresso pelo backup importado? Isso sobrescreve os dados atuais.')) return
        for (const [k, v] of Object.entries(parsed.data)) {
          try { localStorage.setItem(k, v) } catch {}
        }
        toast.success('Backup importado! Recarregando…')
        setTimeout(() => window.location.reload(), 900)
      } catch (err) {
        toast.error('Arquivo inválido: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  const handleResetAll = () => {
    if (!confirm('⚠️ Isso apaga TODO o progresso, revisões, favoritas, músicas do usuário e conquistas. Tem certeza?')) return
    resetProgress()
    resetReview()
    try {
      const themeKeep = localStorage.getItem('theme')
      const soundKeep = localStorage.getItem('soundEnabled')
      const speechKeep = localStorage.getItem('speech-prefs')
      localStorage.clear()
      if (themeKeep) localStorage.setItem('theme', themeKeep)
      if (soundKeep) localStorage.setItem('soundEnabled', soundKeep)
      if (speechKeep) localStorage.setItem('speech-prefs', speechKeep)
    } catch {}
    toast.success('Progresso resetado. Recarregando…')
    setTimeout(() => window.location.reload(), 900)
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-10 lg:py-16 space-y-10">
      <header>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
          Configurações
        </h1>
        <p className="text-sm text-gray-500 mt-1">Personalize sua experiência</p>
      </header>

      {/* Perfil */}
      <Section title="Perfil">
        <div className="flex items-center gap-4">
          <Avatar user={user} />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-white truncate">{user?.displayName || 'Usuário'}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email || '—'}</p>
          </div>
        </div>
      </Section>

      {/* Aparência */}
      <Section title="Aparência" subtitle="Tema visual do app">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                theme === t.id
                  ? 'border-purple-500 shadow-glow-sm'
                  : 'border-border-subtle hover:border-purple-800/60'
              }`}
              style={{
                background: t.id === 'dark' ? '#0a0f2c' :
                           t.id === 'light' ? '#ffffff' :
                           t.id === 'sunset' ? '#2a0f2a' :
                           t.id === 'ocean' ? '#0a1428' :
                           t.id === 'forest' ? '#10201a' :
                           t.id === 'midnight' ? '#14142a' : 'transparent',
                color: t.id === 'light' ? '#0a0f2c' : '#f1f4ff',
              }}
            >
              {theme === t.id && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}
              <div className="text-xl">{t.emoji}</div>
              <p className="text-xs font-semibold mt-1">{t.label}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Meta diária */}
      <Section title="Meta diária" subtitle={`Meta atual: ${dailyGoal} XP por dia`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {GOAL_PRESETS.map(p => (
            <button
              key={p.xp}
              onClick={() => setDailyGoal(p.xp)}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                dailyGoal === p.xp
                  ? 'border-purple-500 bg-purple-950/40'
                  : 'border-border-subtle hover:border-purple-800/60'
              }`}
            >
              <div className="text-xl">{p.emoji}</div>
              <p className="text-xs font-semibold text-white mt-1">{p.label}</p>
              <p className="text-[10px] text-gray-500">{p.desc}</p>
              <p className="text-xs font-mono text-purple-300 mt-1">{p.xp} XP</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Voz */}
      {supported && (
        <Section title="Voz do inglês" subtitle="Usada em Listening, Flashcards, Dicionário e Músicas">
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between text-xs mb-2">
                <label className="text-gray-400">Velocidade da fala</label>
                <span className="font-mono text-purple-300">{ttsRate.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.6"
                step="0.05"
                value={ttsRate}
                onChange={e => setTtsRate(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>Lento</span><span>Normal</span><span>Rápido</span>
              </div>
            </div>

            {voices.length > 0 && (
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Voz preferida</label>
                <select
                  value={ttsVoice}
                  onChange={e => setTtsVoice(e.target.value)}
                  className="input"
                >
                  <option value="">Automática (padrão do sistema)</option>
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} — {v.lang}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => speak('The quick brown fox jumps over the lazy dog.')}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <Play size={14} /> Testar voz
            </button>
          </div>
        </Section>
      )}

      {/* Sons */}
      <Section title="Sons" subtitle="Feedback ao acertar ou errar">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 size={18} className="text-gray-500" />
            <span className="text-sm text-white">Efeitos sonoros</span>
          </div>
          <button
            onClick={toggleSound}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              soundOn ? 'bg-purple-600' : 'bg-bg-elevated border border-border-subtle'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
              soundOn ? 'left-6' : 'left-1'
            }`} />
          </button>
        </div>
      </Section>

      {/* Dados */}
      <Section title="Dados" subtitle="Backup e restauração do seu progresso">
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-2">
            <Download size={14} /> Exportar
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-sm flex items-center gap-2">
            <Upload size={14} /> Importar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500 mt-3">
          O arquivo exportado inclui XP, streak, favoritas do dicionário, músicas adicionadas,
          revisões e conquistas.
        </p>
      </Section>

      {/* Sobre */}
      <Section title="Sobre">
        <div className="space-y-1.5 text-sm">
          <Row label="Versão" value={APP_VERSION} />
          <Row label="Palavras no dicionário" value={dictionary.length} />
          <Row label="Músicas na biblioteca" value={SONGS.length} />
        </div>
      </Section>

      {/* Zona de perigo */}
      <Section title="Zona de perigo" danger>
        <p className="text-sm text-gray-400 mb-3">
          Apaga XP, streak, revisões, favoritas, músicas adicionadas e conquistas.
          Tema, sons e voz são mantidos. Não pode ser desfeito.
        </p>
        <button
          onClick={handleResetAll}
          className="flex items-center gap-2 bg-red-600/90 hover:bg-red-500 text-white text-sm font-semibold rounded-xl px-4 py-2 transition-colors"
        >
          <Trash2 size={14} /> Resetar todo o progresso
        </button>
      </Section>
    </div>
  )
}

function Section({ title, subtitle, danger, children }) {
  return (
    <section>
      <div className="mb-3">
        <h2 className={`text-xs uppercase tracking-widest font-semibold ${
          danger ? 'text-red-400' : 'text-gray-500'
        }`}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`card p-5 ${danger ? 'border-red-900/40' : ''}`}>
        {children}
      </div>
    </section>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border-subtle last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  )
}

function Avatar({ user }) {
  if (user?.photoURL) {
    return <img src={user.photoURL} alt="" className="w-14 h-14 rounded-full object-cover" />
  }
  const letter = (user?.displayName || user?.email || '?')[0].toUpperCase()
  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-xl">
      {letter}
    </div>
  )
}
