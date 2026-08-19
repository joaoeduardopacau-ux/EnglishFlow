// Simple SVG line chart — não usa lib externa.
// Props: data = [{ label, value }], color = 'hex' (linha), height, showGrid
export default function LineChart({
  data = [],
  color = '#3b82f6',
  height = 140,
  padding = 20,
}) {
  if (!data.length) return null

  const width = 360
  const w = width - padding * 2
  const h = height - padding * 2

  const values = data.map(d => d.value)
  const max = Math.max(...values, 1)
  const min = 0
  const range = max - min || 1

  const step = data.length > 1 ? w / (data.length - 1) : 0
  const points = data.map((d, i) => ({
    x: padding + i * step,
    y: padding + h - ((d.value - min) / range) * h,
    ...d,
  }))

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // area fill path (closed at bottom)
  const areaPath = `${path} L ${points[points.length - 1].x} ${padding + h} L ${points[0].x} ${padding + h} Z`

  // 4 gridlines
  const gridY = [0, 0.25, 0.5, 0.75, 1].map(t => padding + h * t)

  // Y labels — nice rounded numbers
  const yLabels = [0, 20, 40, 60].filter(v => v <= max * 1.1)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-hidden="true">
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y grid + labels */}
      {yLabels.map((v, i) => {
        const y = padding + h - (v / max) * h
        return (
          <g key={v}>
            <line x1={padding + 22} x2={width - padding} y1={y} y2={y}
                  stroke="currentColor" strokeOpacity="0.08" />
            <text x={padding + 18} y={y + 4} fontSize="10" fill="currentColor" opacity="0.5" textAnchor="end">
              {v}
            </text>
          </g>
        )
      })}

      {/* Area */}
      <path d={areaPath} fill="url(#lineFill)" />

      {/* Line */}
      <path d={path} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4"
                fill="var(--bg-card, #0a0f2c)"
                stroke={color} strokeWidth="2" />
      ))}

      {/* X labels */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={height - 4} fontSize="10" fill="currentColor" opacity="0.5" textAnchor="middle">
          {p.label}
        </text>
      ))}
    </svg>
  )
}
