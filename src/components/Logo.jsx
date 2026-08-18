// Wordmark oficial "SINCERAMENTE EnglishFlow"
// Uso: <Logo size={40} /> ou <Logo variant="wordmark" />
//  - variant="icon" (padrão): quadrado com carinha do leopardo
//  - variant="wordmark": lockup horizontal completo

export default function Logo({ size = 40, variant = 'icon', className = '' }) {
  if (variant === 'wordmark') {
    return (
      <img
        src="/wordmark.png"
        alt="Sinceramente EnglishFlow"
        className={`h-auto w-auto ${className}`}
        style={{ height: size }}
      />
    )
  }
  return (
    <img
      src="/icon-source.png"
      alt="EnglishFlow"
      width={size}
      height={size}
      className={`rounded-2xl object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
