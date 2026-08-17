import { createContext, useContext, useEffect, useState, useCallback } from 'react'

// Múltiplos temas com CSS vars.

const ThemeContext = createContext(null)
const STORAGE_KEY = 'theme'

export const THEMES = [
  { id: 'dark', label: 'Escuro', emoji: '🌙', desc: 'Padrão escuro' },
  { id: 'light', label: 'Claro', emoji: '☀️', desc: 'Luz de dia' },
  { id: 'sunset', label: 'Sunset', emoji: '🌅', desc: 'Laranja quente' },
  { id: 'ocean', label: 'Ocean', emoji: '🌊', desc: 'Azul profundo' },
  { id: 'forest', label: 'Forest', emoji: '🌲', desc: 'Verde natural' },
  { id: 'midnight', label: 'Midnight', emoji: '🌌', desc: 'Roxo místico' },
]

function readInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && THEMES.some(t => t.id === saved)) return saved
  } catch {}
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }, [theme])

  // Toggle mantém compatibilidade com código antigo (dark <-> light)
  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
