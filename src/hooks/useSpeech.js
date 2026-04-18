import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeech() {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState([])
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setSupported(true)

    function loadVoices() {
      const all = window.speechSynthesis.getVoices()
      const en = all.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'))
      setVoices(en.length ? en : all)
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const speak = useCallback((text, { rate = 0.9, pitch = 1, voiceName } = {}) => {
    if (!supported) return
    window.speechSynthesis.cancel()

    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = rate
    u.pitch = pitch

    const preferred =
      (voiceName && voices.find(v => v.name === voiceName)) ||
      voices.find(v => /en[-_]US/i.test(v.lang)) ||
      voices.find(v => /en/i.test(v.lang)) ||
      voices[0]
    if (preferred) u.voice = preferred

    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)

    utteranceRef.current = u
    window.speechSynthesis.speak(u)
  }, [supported, voices])

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return { supported, speaking, speak, stop, voices }
}
