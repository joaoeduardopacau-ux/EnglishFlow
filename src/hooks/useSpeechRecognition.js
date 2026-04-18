import { useCallback, useEffect, useRef, useState } from 'react'

// Wraps the Web Speech Recognition API (webkitSpeechRecognition).
// `start()` begins listening; transcripts accumulate in `transcript`.
// `stop()` ends the session.

export function useSpeechRecognition({ lang = 'en-US', interim = true } = {}) {
  const SR = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  const supported = Boolean(SR)

  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!supported) return
    const rec = new SR()
    rec.lang = lang
    rec.interimResults = interim
    rec.continuous = false
    rec.maxAlternatives = 3

    rec.onstart = () => { setListening(true); setError(null) }
    rec.onend = () => setListening(false)
    rec.onerror = (e) => { setError(e.error || 'unknown'); setListening(false) }
    rec.onresult = (e) => {
      let finalT = ''
      let interimT = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        if (result.isFinal) finalT += result[0].transcript
        else interimT += result[0].transcript
      }
      if (finalT) setTranscript(prev => (prev ? prev + ' ' : '') + finalT.trim())
      setInterimTranscript(interimT)
    }

    recognitionRef.current = rec
    return () => {
      try { rec.abort() } catch {}
      recognitionRef.current = null
    }
  }, [SR, supported, lang, interim])

  const start = useCallback(() => {
    if (!supported || !recognitionRef.current) return
    setTranscript('')
    setInterimTranscript('')
    setError(null)
    try { recognitionRef.current.start() }
    catch (e) { /* already started */ }
  }, [supported])

  const stop = useCallback(() => {
    if (!supported || !recognitionRef.current) return
    try { recognitionRef.current.stop() } catch {}
  }, [supported])

  const reset = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return { supported, listening, transcript, interimTranscript, error, start, stop, reset }
}
