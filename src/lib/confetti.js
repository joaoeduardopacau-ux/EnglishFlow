// Confetti simples sem dependências
// Cria elementos DOM que caem com CSS animation

const COLORS = ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e']

export function fireConfetti({ count = 60, spread = 90, origin = { x: 0.5, y: 0.5 } } = {}) {
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `
  document.body.appendChild(container)

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const size = 8 + Math.random() * 6
    const startX = origin.x * 100 + (Math.random() - 0.5) * spread
    const startY = origin.y * 100
    const endX = startX + (Math.random() - 0.5) * 80
    const endY = 105 + Math.random() * 20
    const rotate = Math.random() * 720
    const duration = 1500 + Math.random() * 1500

    el.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      left: ${startX}%;
      top: ${startY}%;
      transform: translate(-50%, -50%);
      opacity: 1;
      transition: transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  opacity ${duration}ms ease-out,
                  top ${duration}ms cubic-bezier(0.55, 0.055, 0.675, 0.19),
                  left ${duration}ms ease-out;
    `

    container.appendChild(el)

    requestAnimationFrame(() => {
      el.style.top = `${endY}%`
      el.style.left = `${endX}%`
      el.style.opacity = '0'
      el.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`
    })
  }

  setTimeout(() => container.remove(), 3500)
}

export function fireBigConfetti() {
  fireConfetti({ count: 100, origin: { x: 0.3, y: 0.6 } })
  setTimeout(() => fireConfetti({ count: 100, origin: { x: 0.7, y: 0.6 } }), 200)
  setTimeout(() => fireConfetti({ count: 80, origin: { x: 0.5, y: 0.5 } }), 400)
}
