import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-bg-base text-white">
      <nav className="sticky top-0 z-20 backdrop-blur-xl bg-bg-base/80 border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-5 lg:px-10 py-4 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={16} /> Voltar
          </Link>
          <Link to="/login" className="flex items-center gap-2">
            <img src="/mascot.png" alt="" className="w-8 h-8 object-contain" />
            <p className="font-display font-black text-sm tracking-tight">
              English<span className="text-blue-400">Flow</span>
            </p>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 lg:px-10 py-10 lg:py-16">
        <header className="mb-8">
          <p className="kbd text-blue-400">Documento legal</p>
          <h1 className="text-3xl lg:text-4xl font-display font-bold tracking-tight mt-2">{title}</h1>
          {updated && <p className="text-xs text-gray-500 mt-2">Última atualização: {updated}</p>}
        </header>

        <article className="prose-legal">
          {children}
        </article>
      </main>

      <footer className="border-t border-border-subtle bg-bg-card/40 mt-16">
        <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2026 EnglishFlow</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white">Privacidade</Link>
            <Link to="/terms" className="hover:text-white">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
