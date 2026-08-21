// Estado vazio reutilizável: ilustração + título + descrição + CTA opcional.
export default function EmptyState({ icon, illustration, title, desc, action, className = '' }) {
  return (
    <div className={`card p-8 lg:p-12 text-center ${className}`}>
      {illustration || (icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
          {icon}
        </div>
      ))}
      <h3 className="text-lg lg:text-xl font-display font-bold text-white">{title}</h3>
      {desc && <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">{desc}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
