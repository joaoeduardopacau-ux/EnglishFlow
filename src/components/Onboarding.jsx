import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import NavIcon from './NavIcon'

const STEPS = [
  {
    icon: 'target',
    kicker: 'Passo 1',
    title: 'Escolha um foco',
    desc: 'Selecione uma gramática (presente, passado, perguntas…) e um tema. Todo o app se adapta pra treinar aquilo.',
    cta: 'Definir foco →',
    ctaTo: '/learn',
  },
  {
    icon: 'bookmark',
    kicker: 'Passo 2',
    title: 'Pratique 15 min por dia',
    desc: 'Flashcards, Listening, Speaking, Jogos… escolha o módulo que mais te motiva hoje. XP e streak sobem juntos.',
    cta: 'Ver módulos →',
    ctaTo: '/',
  },
  {
    icon: 'flame',
    kicker: 'Passo 3',
    title: 'Volte todo dia',
    desc: 'Consistência é tudo. O app te lembra da meta diária, celebra suas conquistas e mostra sua evolução em gráficos.',
    cta: 'Bora começar!',
    ctaTo: '/',
  },
]

const KEY_PREFIX = 'onboarded:'

export default function Onboarding() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  const key = user ? `${KEY_PREFIX}${user.uid}` : null

  useEffect(() => {
    if (!key) return
    try {
      if (!localStorage.getItem(key)) setOpen(true)
    } catch {}
  }, [key])

  const done = () => {
    if (key) try { localStorage.setItem(key, '1') } catch {}
    setOpen(false)
  }

  if (!open) return null

  const s = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[slideIn_.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onb-title"
    >
      <div className="relative w-full max-w-md card-elevated p-6 lg:p-8">
        <button
          onClick={done}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-bg-elevated"
          aria-label="Fechar tutorial"
        >
          <X size={16} />
        </button>

        <div className="flex justify-center mb-5">
          <NavIcon name={s.icon} size={64} />
        </div>

        <p className="kbd text-center text-blue-400">{s.kicker} de {STEPS.length}</p>
        <h2 id="onb-title" className="text-2xl font-display font-bold text-white text-center mt-2 tracking-tight">
          {s.title}
        </h2>
        <p className="text-sm text-gray-400 text-center mt-3 leading-relaxed">
          {s.desc}
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Passo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            onClick={done}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Pular tutorial
          </button>
          <button
            onClick={() => {
              if (isLast) {
                done()
                nav(s.ctaTo)
              } else {
                setStep(step + 1)
              }
            }}
            className="btn-primary flex items-center gap-1.5 text-sm"
          >
            {isLast ? s.cta : 'Próximo'}
            {!isLast && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
