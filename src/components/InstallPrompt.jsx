import { useEffect, useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Já instalado? Não mostra
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Dispensado recentemente? Não mostra por 7 dias
    try {
      const dismissed = localStorage.getItem('installPromptDismissed')
      if (dismissed) {
        const dismissedDate = new Date(dismissed)
        const days = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
        if (days < 7) return
      }
    } catch {}

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Mostra o banner depois de 3s (não incomodar de cara)
      setTimeout(() => setShowBanner(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowBanner(false)
    if (outcome === 'accepted') {
      console.log('✅ App instalado')
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    try {
      localStorage.setItem('installPromptDismissed', new Date().toISOString())
    } catch {}
  }

  if (!showBanner || !deferredPrompt) return null

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:max-w-sm z-40 animate-[slideIn_0.4s_ease-out]">
      <div className="card-elevated p-4 shadow-glow-lg border-purple-700/40">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-800 flex items-center justify-center shrink-0">
            <Smartphone size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-white">Instalar EnglishFlow</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Adicione ao seu celular como um app!
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-white shrink-0"
              >
                <X size={16} />
              </button>
            </div>
            <button
              onClick={handleInstall}
              className="btn-primary w-full mt-3 py-2 text-sm"
            >
              <Download size={14} /> Instalar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
