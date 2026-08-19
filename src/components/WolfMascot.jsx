export default function WolfMascot({ size = 140, className = '' }) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="86" fill="#071323" stroke="#0066FF" strokeOpacity="0.45" strokeWidth="2"/>
        <path d="M48 76 42 28l38 30c13-6 27-6 40 0l38-30-6 48c8 12 12 25 12 39 0 35-28 61-64 61s-64-26-64-61c0-14 4-27 12-39Z" fill="#F4F7FC"/>
        <path d="M48 76 42 28l38 30-10 16-22 2Zm104 0 6-48-38 30 10 16 22 2Z" fill="#0A0F18"/>
        <path d="M70 68c8-7 18-10 30-10s22 3 30 10l-7 29c-4 16-13 30-23 40-10-10-19-24-23-40l-7-29Z" fill="#171D27"/>
        <path d="M74 102c5-12 14-18 26-18s21 6 26 18l-9 35c-4 10-10 18-17 24-7-6-13-14-17-24l-9-35Z" fill="#F4F7FC"/>
        <path d="M81 105c5-5 11-7 19-7s14 2 19 7l-4 11c-4 6-9 10-15 13-6-3-11-7-15-13l-4-11Z" fill="#0A0F18"/>
        <path d="M84 78c6-5 11-7 16-7s10 2 16 7l-5 5H89l-5-5Z" fill="#0A0F18"/>
        <circle cx="79" cy="91" r="5" fill="#0A0F18"/>
        <circle cx="121" cy="91" r="5" fill="#0A0F18"/>
        <circle cx="80" cy="90" r="1.7" fill="#2997FF"/>
        <circle cx="120" cy="90" r="1.7" fill="#2997FF"/>
        <path d="M91 116c3-4 6-6 9-6s6 2 9 6l-4 7h-10l-4-7Z" fill="#0A0F18"/>
        <path d="M91 126c3 4 6 6 9 6s6-2 9-6" stroke="#0A0F18" strokeWidth="3" strokeLinecap="round"/>
        <path d="M62 68 51 52M138 68l11-16" stroke="#FF7A18" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
      </svg>
    </div>
  )
}
