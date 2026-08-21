import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

const KINDS = {
  success: { icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/40' },
  error:   { icon: XCircle,      color: 'text-red-400',     border: 'border-red-500/40' },
  info:    { icon: Info,         color: 'text-blue-400',    border: 'border-blue-500/40' },
  warn:    { icon: AlertTriangle,color: 'text-amber-400',   border: 'border-amber-500/40' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(list => list.filter(t => t.id !== id))
  }, [])

  const push = useCallback((kind, message, opts = {}) => {
    const id = Math.random().toString(36).slice(2)
    const duration = opts.duration ?? 4000
    setToasts(list => [...list, { id, kind, message }])
    if (duration > 0) setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  const value = {
    success: (m, o) => push('success', m, o),
    error:   (m, o) => push('error',   m, o),
    info:    (m, o) => push('info',    m, o),
    warn:    (m, o) => push('warn',    m, o),
    dismiss,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 safe-pb"
        role="region"
        aria-label="Notificações"
        aria-live="polite"
      >
        {toasts.map(t => <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }) {
  const spec = KINDS[toast.kind] || KINDS.info
  const Icon = spec.icon
  return (
    <div
      className={`pointer-events-auto max-w-sm w-full bg-bg-card border ${spec.border} shadow-2xl rounded-xl px-4 py-3 flex items-start gap-3 animate-[slideIn_.2s_ease-out]`}
      role="status"
    >
      <Icon size={18} className={`${spec.color} shrink-0 mt-0.5`} />
      <p className="text-sm text-white flex-1">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-gray-500 hover:text-white shrink-0"
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
