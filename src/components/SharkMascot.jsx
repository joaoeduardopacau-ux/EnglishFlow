// Mascote tubarão do EnglishFlow - "Sharky"
// Variantes: happy | winking | thinking | celebrating | sleeping
// Uso: <SharkMascot size={120} variant="happy" />

export default function SharkMascot({
  size = 120,
  variant = 'happy',
  animated = true,
  className = ''
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradient do corpo */}
        <linearGradient id="sharkBody" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="sharkBelly" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f1e6ff" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </linearGradient>
        <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g>
        {animated && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -4; 0 0; 0 4; 0 0"
            dur="4s"
            repeatCount="indefinite"
          />
        )}

        {/* Cauda */}
        <path
          d="M 30 100 L 10 75 L 15 100 L 10 125 Z"
          fill="url(#sharkBody)"
        >
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 30 100; -8 30 100; 0 30 100; 8 30 100; 0 30 100"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Corpo (formato de tubarão fofo) */}
        <ellipse cx="110" cy="100" rx="70" ry="45" fill="url(#sharkBody)" />

        {/* Barriga (branco/roxo claro) */}
        <ellipse cx="115" cy="115" rx="55" ry="25" fill="url(#sharkBelly)" />

        {/* Barbatana dorsal */}
        <path
          d="M 90 60 L 100 35 L 115 60 Z"
          fill="url(#sharkBody)"
        />

        {/* Barbatana lateral */}
        <path
          d="M 90 130 L 75 150 L 105 135 Z"
          fill="#6d28d9"
        />

        {/* Bochecha rosa */}
        <ellipse cx="140" cy="115" rx="15" ry="10" fill="url(#cheek)" />
        <ellipse cx="80" cy="115" rx="12" ry="8" fill="url(#cheek)" />

        {/* Guelras (3 linhas pequenas) */}
        <line x1="70" y1="95" x2="70" y2="110" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="75" y1="93" x2="75" y2="112" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="80" y1="95" x2="80" y2="110" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

        {/* Olho */}
        {variant === 'winking' ? (
          <path d="M 140 90 Q 148 88, 156 90" stroke="#0f0f0f" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : variant === 'sleeping' ? (
          <>
            <path d="M 135 90 Q 143 88, 151 90" stroke="#0f0f0f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="160" y="70" fontSize="20" fill="#a78bfa" fontWeight="bold">z</text>
            <text x="170" y="55" fontSize="14" fill="#a78bfa" fontWeight="bold">z</text>
          </>
        ) : (
          <>
            <circle cx="145" cy="90" r="10" fill="white" />
            <circle cx="147" cy="92" r="6" fill="#0f0f0f">
              {variant === 'celebrating' && animated && (
                <animate attributeName="cy" values="92;89;92" dur="0.8s" repeatCount="indefinite" />
              )}
            </circle>
            <circle cx="149" cy="90" r="2" fill="white" />
          </>
        )}

        {/* Sobrancelha (para thinking) */}
        {variant === 'thinking' && (
          <path d="M 138 75 L 152 78" stroke="#4c1d95" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Boca */}
        {variant === 'celebrating' ? (
          // Boca aberta sorrindo
          <>
            <ellipse cx="150" cy="115" rx="12" ry="8" fill="#4c1d95" />
            <path d="M 140 115 L 145 111 L 148 115 L 152 111 L 155 115 L 158 111 L 161 115" stroke="white" strokeWidth="1.5" fill="none" />
          </>
        ) : variant === 'thinking' ? (
          // Boca pequena e neutra
          <path d="M 145 118 L 158 118" stroke="#4c1d95" strokeWidth="2.5" strokeLinecap="round" />
        ) : variant === 'sleeping' ? (
          // Boca fechada relaxada
          <path d="M 145 118 Q 152 122, 158 118" stroke="#4c1d95" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : (
          // Sorriso padrão
          <>
            <path d="M 138 113 Q 150 128, 165 113" stroke="#4c1d95" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Dente pequeno */}
            <path d="M 150 117 L 148 122 L 152 122 Z" fill="white" />
          </>
        )}

        {/* Detalhes extras por variant */}
        {variant === 'celebrating' && (
          <>
            {/* Estrelinhas ao redor */}
            <text x="30" y="60" fontSize="20">✨</text>
            <text x="170" y="50" fontSize="16">⭐</text>
            <text x="20" y="150" fontSize="14">✨</text>
          </>
        )}

        {variant === 'thinking' && (
          // Balão de pensamento
          <>
            <circle cx="175" cy="55" r="4" fill="white" opacity="0.9" />
            <circle cx="185" cy="45" r="6" fill="white" opacity="0.9" />
            <circle cx="195" cy="30" r="10" fill="white" opacity="0.95" />
            <text x="192" y="35" fontSize="12" fill="#6d28d9" fontWeight="bold">?</text>
          </>
        )}
      </g>
    </svg>
  )
}
