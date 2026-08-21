import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

const DISMISS_KEY = 'installPromptDismissed'
const DISMISS_DAYS = 7

function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function isIOS() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream
}

function wasDismissedRecently() {
  try {
    const ts = localStorage.getItem(DISMISS_KEY)
    if (!ts) return false
    const days = (Date.now() - new Date(ts).getTime()) / (1000 * 60 * 60 * 24)
    return days < DISMISS_DAYS
  } catch { return false }
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [iosVisible, setIosVisible] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (wasDismissedRecently()) return

    // iOS não dispara beforeinstallprompt — usa flag pra mostrar instruções
    if (isIOS()) {
      const t = setTimeout(() => setIosVisible(true), 4000)
      return () => clearTimeout(t)
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowBanner(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowBanner(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setIosVisible(false)
    try { localStorage.setItem(DISMISS_KEY, new Date().toISOString()) } catch {}
  }

  if (!showBanner && !iosVisible) return null

  return (
    <div
      className="fixed bottom-28 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:max-w-sm z-40 animate-[slideIn_.3s_ease-out]"
      role="dialog"
      aria-labelledby="install-title"
    >
      <div className="card-elevated p-4 border-blue-500/40 shadow-2xl">
        <div className="flex items-start gap-3">
          <img
            src="/mascot.png"
            alt=""
            className="w-11 h-11 shrink-0 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p id="install-title" className="text-sm font-semibold text-white">
                Instale o EnglishFlow
              </p>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-white shrink-0"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            {iosVisible ? (
              <div className="mt-2">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Toque em <Share size={12} className="inline mx-1 text-blue-400" /> e depois
                  {' '}<strong className="text-white">Adicionar à Tela de Início</strong>.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 mt-0.5">
                  Adicione ao celular pra usar offline e receber atalhos.
                </p>
                <button
                  onClick={handleInstall}
                  className="btn-primary w-full mt-3 py-2 text-sm inline-flex items-center justify-center gap-1.5"
                >
                  <Download size={14} /> Instalar app
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
