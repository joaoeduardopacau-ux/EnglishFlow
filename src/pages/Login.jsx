import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Sparkles, Headphones, Mic, Blocks, BookOpen, Trophy, Music2, MessageCircle, PenLine, Bookmark, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { user, signInWithGoogle, demoMode, loading } = useAuth()
  const [signing, setSigning] = useState(false)
  const [err, setErr] = useState('')

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  async function handleGoogle() {
    setErr(''); setSigning(true)
    try { await signInWithGoogle() } catch (e) { setErr(e?.message || 'Erro ao entrar') } finally { setSigning(false) }
  }

  return (
    <div className="min-h-screen bg-bg-base text-white flex flex-col">
      {/* NAV */}
      <nav className="sticky top-0 z-30 backdrop-blur-xl bg-bg-base/80 border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/mascot.png" alt="" className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
            <p className="font-display font-black text-base tracking-tight">
              English<span className="text-blue-400">Flow</span>
            </p>
          </div>
          <button
            onClick={handleGoogle}
            disabled={signing}
            className="btn-primary text-sm px-4 py-2"
          >
            {signing ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 lg:px-10 pt-14 lg:pt-24 pb-16 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="kbd text-blue-400">Sinceramente EnglishFlow</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.05] mt-3">
              Aprenda inglês do jeito <span className="text-blue-400">que faz sentido</span>.
            </h1>
            <p className="text-lg text-gray-400 mt-5 max-w-xl leading-relaxed">
              Vocabulário, escuta, fala, gramática e músicas — tudo em um app minimalista,
              com metas diárias e gamificação. Grátis pra começar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGoogle}
                disabled={signing}
                className="btn-primary text-base px-6 py-3 flex items-center justify-center gap-2"
              >
                {signing ? 'Entrando...' : (
                  <>
                    <GoogleIcon /> Começar grátis com Google
                  </>
                )}
              </button>
              <a
                href="#features"
                className="btn-secondary text-base px-6 py-3 flex items-center justify-center gap-2"
              >
                Ver funcionalidades <ArrowRight size={16} />
              </a>
            </div>
            {err && <p className="text-sm text-red-400 mt-3">{err}</p>}
            {demoMode && (
              <p className="text-xs text-gray-500 mt-3">
                Modo demo: seu progresso fica salvo neste navegador até o login real ser configurado.
              </p>
            )}
            <div className="flex items-center gap-4 mt-6 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Check size={12} className="text-emerald-400" /> Sem cartão</span>
              <span className="flex items-center gap-1"><Check size={12} className="text-emerald-400" /> Funciona offline</span>
              <span className="flex items-center gap-1"><Check size={12} className="text-emerald-400" /> Português brasileiro</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Círculos concêntricos + lobo */}
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-blue-500/25" />
              <div className="absolute inset-6 rounded-full border border-blue-500/20" />
              <div className="absolute inset-12 rounded-full border border-blue-500/15" />
              <img
                src="/mascot.png"
                alt="Lobo-guará"
                className="relative w-2/3 h-2/3 object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.35)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS strip */}
      <section className="border-y border-border-subtle bg-bg-card/40">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 py-6 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl lg:text-3xl font-display font-bold text-white">2.400+</p>
            <p className="text-xs text-gray-500 mt-1">palavras no dicionário</p>
          </div>
          <div>
            <p className="text-2xl lg:text-3xl font-display font-bold text-white">10</p>
            <p className="text-xs text-gray-500 mt-1">módulos de prática</p>
          </div>
          <div>
            <p className="text-2xl lg:text-3xl font-display font-bold text-white">100%</p>
            <p className="text-xs text-gray-500 mt-1">grátis pra começar</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="kbd text-blue-400">O que você vai encontrar</p>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight mt-3">
            Um app completo, sem enrolação
          </h2>
          <p className="text-gray-400 mt-4">
            Tudo o que precisa pra praticar inglês todo dia — desde vocabulário básico até
            conversação avançada.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          <Feature icon={<Bookmark size={20} />} title="Flashcards inteligentes" desc="Repetição espaçada baseada no que você acerta e erra" color="text-blue-400" />
          <Feature icon={<Headphones size={20} />} title="Listening real" desc="Áudios com Web Speech API — treine seu ouvido em qualquer palavra" color="text-cyan-400" />
          <Feature icon={<Mic size={20} />} title="Speaking com voz" desc="Fale em inglês e receba feedback instantâneo" color="text-orange-400" />
          <Feature icon={<Blocks size={20} />} title="Montar frase" desc="Construa frases em inglês a partir do português" color="text-purple-400" />
          <Feature icon={<BookOpen size={20} />} title="Dicionário 2400+" desc="Buscável por letra, categoria, nível — com favoritos" color="text-emerald-400" />
          <Feature icon={<Music2 size={20} />} title="Aprender com música" desc="Complete lacunas ouvindo música direto do YouTube" color="text-pink-400" />
          <Feature icon={<MessageCircle size={20} />} title="Chat de conversação" desc="Pratique diálogos reais em cenários do dia a dia" color="text-amber-400" />
          <Feature icon={<PenLine size={20} />} title="Writing Journal" desc="Prompt diferente todo dia + contador de palavras" color="text-rose-400" />
          <Feature icon={<Trophy size={20} />} title="Gamificação" desc="XP, streaks, conquistas e níveis pra manter você motivado" color="text-yellow-400" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-5 lg:px-10 py-16 lg:py-24 border-t border-border-subtle">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="kbd text-blue-400">Como funciona</p>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight mt-3">
            Do zero à fluência em 3 passos
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Step num="1" title="Entre com o Google" desc="Sem cartão, sem cadastro chato. Seu progresso salva automático." />
          <Step num="2" title="Escolha seu foco" desc="Selecione a gramática e o tema. O app adapta as práticas." />
          <Step num="3" title="Pratique 15 min/dia" desc="Meta diária, streak, e você vê seu inglês evoluir semana a semana." />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-4xl mx-auto px-5 lg:px-10 py-16 lg:py-20">
        <div className="card-elevated p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-blue-500 blur-3xl" />
          </div>
          <div className="relative">
            <Sparkles size={28} className="text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-white tracking-tight">
              Pronto pra fazer o seu inglês fluir?
            </h2>
            <p className="text-gray-400 mt-3 max-w-md mx-auto">
              Grátis, sem compromisso. Comece agora e veja a diferença em 7 dias.
            </p>
            <button
              onClick={handleGoogle}
              disabled={signing}
              className="btn-primary text-base px-6 py-3 mt-6 inline-flex items-center gap-2"
            >
              <GoogleIcon /> {signing ? 'Entrando...' : 'Começar grátis'}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border-subtle bg-bg-card/40">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <img src="/mascot.png" alt="" className="w-6 h-6 object-contain" />
            <span>© 2026 EnglishFlow · <span className="italic">Flow your English</span></span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Termos</Link>
            <a href="mailto:contato@englishflow.app" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Feature({ icon, title, desc, color }) {
  return (
    <div className="card p-5 hover:border-border-bright transition-colors">
      <div className={`w-10 h-10 rounded-lg bg-white/[0.03] border border-border-subtle flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-500 mt-1.5 leading-snug">{desc}</p>
    </div>
  )
}

function Step({ num, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-300 font-display font-bold text-lg mb-4">
        {num}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">{desc}</p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
