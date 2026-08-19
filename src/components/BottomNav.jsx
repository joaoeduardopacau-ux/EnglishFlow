import { NavLink } from 'react-router-dom'
import NavIcon from './NavIcon'

export default function BottomNav({ items }) {
  const mobileItems = items.slice(0, 5)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-base/95 backdrop-blur-xl border-t border-border-subtle safe-pb">
      <div className="grid grid-cols-5 px-2 pt-1">
        {mobileItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 py-2.5 rounded-lg transition-colors ${
                isActive ? 'text-purple-400' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <NavIcon name={icon} size={26} />
                <span className={`text-[11px] leading-none tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute -top-px h-0.5 w-8 rounded-full bg-purple-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
