// Badge hexagonal com estrela e barra de progresso.
export default function HexagonBadge({ size = 96, level, progress = 0 }) {
  const w = size, h = size * 1.15
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 100 115" width={w} height={h}>
        <defs>
          <linearGradient id="hex-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0066ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <polygon
          points="50,4 92,28 92,86 50,110 8,86 8,28"
          fill="url(#hex-fill)"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Estrela no centro */}
        <path
          d="M50 30 L57 48 L76 48 L61 60 L67 79 L50 68 L33 79 L39 60 L24 48 L43 48 Z"
          fill="#60a5fa"
        />
        {level != null && (
          <text x="50" y="102" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dbeafe" opacity="0.85">
            NÍVEL {level}
          </text>
        )}
      </svg>
      {progress != null && (
        <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
               style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
      )}
    </div>
  )
}
