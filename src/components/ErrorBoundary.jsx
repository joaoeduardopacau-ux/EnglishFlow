import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
    window.location.href = '/'
  }

  handleReload = () => window.location.reload()

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-screen bg-bg-base text-white flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🐺💥</div>
          <p className="text-xs uppercase tracking-widest text-red-400 font-semibold">Algo quebrou</p>
          <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-tight mt-2">
            Deu ruim por aqui
          </h1>
          <p className="text-gray-400 mt-4 leading-relaxed text-sm">
            Encontramos um erro inesperado. Você pode recarregar a página ou voltar
            pra home. Se persistir, escreve pra
            {' '}<a className="text-blue-400 underline" href="mailto:contato@englishflow.app">contato@englishflow.app</a>.
          </p>
          {import.meta.env.DEV && (
            <pre className="mt-4 p-3 bg-red-950/30 border border-red-800/40 rounded-lg text-[11px] text-red-300 text-left overflow-x-auto">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button onClick={this.handleReload} className="btn-primary">Recarregar</button>
            <button onClick={this.handleReset} className="btn-secondary">Ir pra home</button>
          </div>
        </div>
      </div>
    )
  }
}
