// Circular progress ring com % no centro.
export default function CircularProgress({
  value = 0,       // 0-100
  size = 160,
  strokeWidth = 12,
  color = '#3b82f6',
  trackColor = 'rgba(255,255,255,0.08)',
  label,
  sublabel,
}) {
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (value / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius}
                fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius}
                fill="none" stroke={color} strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 800ms ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label != null && (
          <span className="text-3xl font-display font-bold text-white leading-none">{label}</span>
        )}
        {sublabel && (
          <span className="text-[11px] text-gray-400 mt-1">{sublabel}</span>
        )}
      </div>
    </div>
  )
}
