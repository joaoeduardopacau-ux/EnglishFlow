import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { user, signInWithGoogle, demoMode, loading } = useAuth()
  const [signing, setSigning] = useState(false)
  const [err, setErr] = useState('')

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  async function handleGoogle() {
    setErr('')
    setSigning(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setErr(e?.message || 'Erro ao entrar')
    } finally {
      setSigning(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden flex items-center justify-center px-5 safe-pt safe-pb">
      {/* background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-purple-700 to-purple-900 flex items-center justify-center shadow-glow-lg mb-6 animate-float">
            <span className="text-white text-4xl font-bold tracking-tighter">L</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient tracking-tight">LinguaFlow</h1>
          <p className="text-gray-400 mt-2 text-center">Aprenda inglês do seu jeito.</p>
        </div>

        {/* Card */}
        <div className="card-elevated p-7 space-y-5">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="text-sm text-gray-400 mt-1">Entre para continuar sua jornada</p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={signing}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-900 font-semibold rounded-xl py-3.5 transition-all duration-200 disabled:opacity-60 active:scale-[0.98] shadow-lg"
          >
            <GoogleIcon />
            <span>{signing ? 'Entrando...' : 'Continuar com Google'}</span>
          </button>

          {demoMode && (
            <div className="text-xs text-center text-purple-300/80 bg-purple-950/30 border border-purple-800/30 rounded-xl px-4 py-3">
              <span className="font-semibold">Modo demo ativo.</span><br/>
              Configure o Firebase em <code className="text-purple-200">.env</code> para autenticação real.
            </div>
          )}

          {err && (
            <p className="text-sm text-red-400 text-center">{err}</p>
          )}

          <div className="pt-2 border-t border-border-subtle text-center">
            <p className="text-xs text-gray-500">
              Ao entrar você concorda com nossos termos de uso
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: '📚', label: '500+ palavras' },
            { icon: '🎧', label: 'Listening' },
            { icon: '🎮', label: 'Jogos' },
          ].map((f) => (
            <div key={f.label} className="card p-3 text-center">
              <div className="text-2xl">{f.icon}</div>
              <p className="text-xs text-gray-400 mt-1">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
