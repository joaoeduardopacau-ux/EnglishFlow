import { NavLink } from 'react-router-dom'

export default function BottomNav({ items }) {
  // Limita a 5 itens para mobile
  const mobileItems = items.slice(0, 5)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 safe-pb">
      <div className="mx-3 mb-3 bg-bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-glow-lg">
        <div className="grid grid-cols-5 gap-1 p-1.5">
          {mobileItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-purple-300 bg-purple-950/50'
                    : 'text-gray-500 active:bg-bg-elevated'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{label}</span>
                  {isActive && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-purple-400" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
