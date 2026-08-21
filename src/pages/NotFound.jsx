import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base text-white flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <img
          src="/mascot.png"
          alt="Lobo perdido"
          className="w-40 h-40 mx-auto mb-6 object-contain opacity-80 drop-shadow-[0_0_30px_rgba(59,130,246,0.25)]"
        />
        <p className="kbd text-blue-400">Erro 404</p>
        <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tight mt-2">
          Página não encontrada
        </h1>
        <p className="text-gray-400 mt-4 leading-relaxed">
          O lobo procurou em todo canto, mas essa página não existe.
          Talvez o link esteja errado ou a página foi movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <Home size={16} /> Voltar pra home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Página anterior
          </button>
        </div>
      </div>
    </div>
  )
}
