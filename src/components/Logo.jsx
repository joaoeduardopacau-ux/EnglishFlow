// Logo EnglishFlow - Onda estilizada com gradient
// Uso: <Logo size={40} /> ou <Logo size={40} animated />

export default function Logo({ size = 40, animated = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="wave1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="wave2" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Fundo circular com gradient */}
      <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#logoBg)" />

      {/* Onda de fundo (mais suave) */}
      <path
        d="M 5 65 Q 25 55, 45 62 T 85 60 Q 92 60, 95 62 L 95 100 L 5 100 Z"
        fill="url(#wave2)"
      >
        {animated && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; -3 -1; 0 0; 3 1; 0 0"
            dur="4s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Onda principal (destaque) */}
      <path
        d="M 5 55 Q 20 40, 40 50 T 75 48 Q 88 46, 95 52 L 95 100 L 5 100 Z"
        fill="url(#wave1)"
        filter="url(#glow)"
      >
        {animated && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 4 -2; 0 0; -4 2; 0 0"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Bolhas decorativas */}
      <circle cx="25" cy="30" r="3" fill="#ffffff" opacity="0.7">
        {animated && (
          <animate attributeName="cy" values="30;25;30" dur="2s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="70" cy="25" r="2" fill="#ffffff" opacity="0.6">
        {animated && (
          <animate attributeName="cy" values="25;20;25" dur="2.5s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="55" cy="18" r="1.5" fill="#ffffff" opacity="0.8">
        {animated && (
          <animate attributeName="cy" values="18;13;18" dur="3s" repeatCount="indefinite" />
        )}
      </circle>
    </svg>
  )
}
