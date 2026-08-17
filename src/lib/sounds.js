// Sons gerados via Web Audio API - sem arquivos externos
// Respeitando preferência do usuário (settings > soundEnabled)

function isSoundEnabled() {
  try { return localStorage.getItem('soundEnabled') !== 'false' } catch { return true }
}

let audioContext = null
function getAudioContext() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    audioContext = new AudioContext()
  }
  return audioContext
}

function playTone(frequency, duration, type = 'sine', volume = 0.15) {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.value = frequency

  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start()
  oscillator.stop(ctx.currentTime + duration)
}

// Sons pré-definidos
export function playCorrect() {
  if (!isSoundEnabled()) return
  playTone(660, 0.1, 'sine')
  setTimeout(() => playTone(880, 0.15, 'sine'), 80)
}

export function playWrong() {
  if (!isSoundEnabled()) return
  playTone(220, 0.15, 'square', 0.1)
  setTimeout(() => playTone(180, 0.2, 'square', 0.1), 100)
}

export function playLevelUp() {
  if (!isSoundEnabled()) return
  const notes = [523, 659, 784, 1047] // C E G C
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine'), i * 100)
  })
}

export function playAchievement() {
  if (!isSoundEnabled()) return
  const notes = [523, 659, 784]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'triangle', 0.2), i * 80)
  })
}

export function playClick() {
  if (!isSoundEnabled()) return
  playTone(440, 0.05, 'sine', 0.05)
}
