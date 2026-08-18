// Serve os ícones do brand kit (public/nav/*.png)
// Uso: <NavIcon name="home" size={22} />
export default function NavIcon({ name, size = 22, className = '' }) {
  return (
    <img
      src={`/nav/${name}.png`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
