// Mascote oficial do EnglishFlow - "Snow Leopard EF"
// Mantém o nome do componente (SharkMascot) só pra não quebrar imports antigos.
// Uso: <SharkMascot size={120} /> — variant/animated são aceitos mas não alteram a imagem.

export default function SharkMascot({
  size = 120,
  variant = 'happy',
  animated = true,
  className = ''
}) {
  return (
    <img
      src="/mascot.png"
      alt="Mascote EnglishFlow"
      width={size}
      height={size}
      className={`object-contain drop-shadow-xl ${animated ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
