// Identidade principal: rosto minimalista de lobo-guará.
export default function Logo({ size = 40, variant = 'icon', className = '' }) {
  if (variant === 'wordmark') {
    return (
      <div className={`flex items-center gap-2 ${className}`} style={{ height: size }}>
        <WolfMark size={size} />
        <div className="leading-none">
          <span className="block text-[10px] font-semibold tracking-[0.24em] text-white/80">SINCERAMENTE</span>
          <span className="block text-[17px] font-black tracking-tight text-white">English<span className="text-[#FF7A18]">Flow</span></span>
        </div>
      </div>
    )
  }
  return <WolfMark size={size} className={className} />
}

function WolfMark({ size = 40, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="EnglishFlow">
      <circle cx="50" cy="50" r="47" fill="#050B18" stroke="#0066FF" strokeWidth="2" strokeOpacity="0.55"/>
      <path d="M25 39 22 13l22 18c4-2 8-3 13-3s9 1 13 3l22-18-3 26c5 7 7 14 7 22 0 20-16 34-39 34S18 81 18 61c0-8 2-15 7-22Z" fill="#F5F8FF"/>
      <path d="M25 39 22 13l22 18-6 11-13 2Zm50 0 3-26-22 18 6 11 13 2Z" fill="#0A0F18"/>
      <path d="M35 39c5-4 10-6 15-6s10 2 15 6l-4 18c-2 9-6 15-11 21-5-6-9-12-11-21l-4-18Z" fill="#171D27"/>
      <path d="M38 58c3-7 7-10 12-10s9 3 12 10l-4 18c-2 5-5 9-8 12-3-3-6-7-8-12l-4-18Z" fill="#F5F8FF"/>
      <circle cx="38" cy="50" r="3.5" fill="#0A0F18"/><circle cx="62" cy="50" r="3.5" fill="#0A0F18"/>
      <circle cx="39" cy="49" r="1" fill="#2997FF"/><circle cx="61" cy="49" r="1" fill="#2997FF"/>
      <path d="M43 61c2-2 5-3 7-3s5 1 7 3l-2 5h-10l-2-5Z" fill="#0A0F18"/>
      <path d="M45 70c2 2 3 3 5 3s3-1 5-3" stroke="#0A0F18" strokeWidth="2" strokeLinecap="round"/>
      <path d="M31 39 27 32M69 39l4-7" stroke="#FF7A18" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
