import { useState } from 'react'
import { Settings as SettingsIcon, Palette, Volume2, Bell, Trash2, Info, Check } from 'lucide-react'
import { useTheme, THEMES } from '../contexts/ThemeContext'
import { useProgress } from '../contexts/ProgressContext'
import { useReview } from '../contexts/ReviewContext'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { resetProgress } = useProgress()
  const { resetReview } = useReview()
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('soundEnabled') !== 'false' } catch { return true }
  })

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    try { localStorage.setItem('soundEnabled', next ? 'true' : 'false') } catch {}
  }

  const handleResetAll = () => {
    if (!confirm('⚠️ Isso vai apagar TODO o seu progresso, revisões e conquistas. Tem certeza?')) return
    resetProgress()
    resetReview()
    try {
      // Manter tema e configs
      const themeKeep = localStorage.getItem('theme')
      const soundKeep = localStorage.getItem('soundEnabled')
      localStorage.clear()
      if (themeKeep) localStorage.setItem('theme', themeKeep)
      if (soundKeep) localStorage.setItem('soundEnabled', soundKeep)
    } catch {}
    alert('✅ Progresso resetado! Recarregando...')
    window.location.reload()
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-600 to-slate-900 flex items-center justify-center shadow-glow-sm">
          <SettingsIcon size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 text-sm">Personalize sua experiência</p>
        </div>
      </div>

      {/* Temas */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette size={20} className="text-purple-400" />
          <h2 className="text-lg font-bold text-white">Tema visual</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">Escolha um tema para o app</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                theme === t.id
                  ? 'border-purple-500 shadow-glow-sm'
                  : 'border-border-subtle hover:border-purple-800/60'
              }`}
              style={{
                background: t.id === 'dark' ? '#0f1418' :
                           t.id === 'light' ? '#ffffff' :
                           t.id === 'sunset' ? '#2a0f2a' :
                           t.id === 'ocean' ? '#0a1428' :
                           t.id === 'forest' ? '#10201a' :
                           t.id === 'midnight' ? '#14142a' : 'transparent',
                color: t.id === 'light' ? '#0e1a1d' : '#f1f1f5',
              }}
            >
              {theme === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <div className="text-3xl mb-2">{t.emoji}</div>
              <p className="font-bold text-sm">{t.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sons */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-700 flex items-center justify-center">
              <Volume2 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Sons de feedback</h2>
              <p className="text-xs text-gray-400 mt-0.5">Toca sons ao acertar/errar</p>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`w-14 h-7 rounded-full transition-colors relative ${
              soundOn ? 'bg-purple-600' : 'bg-bg-elevated border border-border-subtle'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${
              soundOn ? 'left-8' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Sobre */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info size={20} className="text-purple-400" />
          <h2 className="text-lg font-bold text-white">Sobre o app</h2>
        </div>
        <div className="space-y-2 text-sm">
          <Row label="Versão" value="2.0.0" />
          <Row label="Palavras no dicionário" value="500+" />
          <Row label="Prompts de escrita" value="30" />
          <Row label="Músicas disponíveis" value="6" />
          <Row label="Vídeos disponíveis" value="6" />
        </div>
      </div>

      {/* Danger zone */}
      <div className="card-elevated p-6 border-red-800/40">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 size={20} className="text-red-400" />
          <h2 className="text-lg font-bold text-red-300">Zona de Perigo</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Isso vai apagar TODO o seu progresso, revisões, escrita, testes e conquistas.
          Esta ação NÃO pode ser desfeita!
        </p>
        <button
          onClick={handleResetAll}
          className="btn-primary bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700"
        >
          <Trash2 size={16} /> Resetar todo o progresso
        </button>
      </div>
    </div>
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
