// Sync de progresso entre cliente e Firestore.
// Estratégia:
//   - localStorage continua sendo cache rápido (funciona offline e em modo demo)
//   - Quando o usuário loga: fetch do Firestore → merge com local (soma XP/contadores
//     e união de achievements) → escreve o resultado de volta
//   - Durante a sessão: debounced save a cada 800ms pra não martelar o Firestore
//
// Se Firestore falhar por qualquer motivo (rede, regras), o app continua funcionando
// com localStorage — a falha só é logada no console.

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isConfigured } from '../firebase'

const DOC_PATH = (uid) => ['users', uid, 'meta', 'progress']

// ── Load ────────────────────────────────────────────────────
export async function loadCloudProgress(uid) {
  if (!isConfigured || !db || !uid) return null
  try {
    const ref = doc(db, ...DOC_PATH(uid))
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
  } catch (e) {
    console.warn('[cloudProgress] load failed:', e?.message || e)
    return null
  }
}

// ── Save ────────────────────────────────────────────────────
// Debounced save — múltiplas chamadas em sequência viram uma única escrita.
const timers = new Map()
const SAVE_DEBOUNCE_MS = 800

export function saveCloudProgress(uid, state) {
  if (!isConfigured || !db || !uid) return
  if (timers.has(uid)) clearTimeout(timers.get(uid))
  const t = setTimeout(async () => {
    timers.delete(uid)
    try {
      const ref = doc(db, ...DOC_PATH(uid))
      // merge:true pra preservar campos que este cliente não conhece
      await setDoc(ref, { ...state, _updatedAt: Date.now() }, { merge: true })
    } catch (e) {
      console.warn('[cloudProgress] save failed:', e?.message || e)
    }
  }, SAVE_DEBOUNCE_MS)
  timers.set(uid, t)
}

// ── Merge local vs cloud ────────────────────────────────────
// Quando o usuário loga, queremos preservar qualquer progresso já feito como
// convidado (no localStorage `progress:guest`). Estratégia: pegar o MÁXIMO de
// cada contador, união de achievements, XP somado (mas limitado a max+guest pra
// não inflar indefinidamente entre logins).
export function mergeProgress(local, cloud) {
  if (!local && !cloud) return null
  if (!local) return cloud
  if (!cloud) return local

  const max = (a, b) => Math.max(a || 0, b || 0)
  const modules = ['flashcards', 'games', 'listening', 'builder', 'speaking']
  const perModule = {}
  for (const m of modules) {
    const a = local.perModule?.[m] || { correct: 0, attempts: 0 }
    const b = cloud.perModule?.[m] || { correct: 0, attempts: 0 }
    perModule[m] = { correct: max(a.correct, b.correct), attempts: max(a.attempts, b.attempts) }
  }

  // Achievements: união (sem duplicatas)
  const achievements = Array.from(new Set([
    ...(local.achievements || []),
    ...(cloud.achievements || []),
  ]))

  // Streak: pega o maior, lastActiveDate: o mais recente
  const lastActiveDate = (() => {
    if (!local.lastActiveDate) return cloud.lastActiveDate || null
    if (!cloud.lastActiveDate) return local.lastActiveDate
    return local.lastActiveDate > cloud.lastActiveDate ? local.lastActiveDate : cloud.lastActiveDate
  })()

  return {
    xp: max(local.xp, cloud.xp),
    totalCorrect: max(local.totalCorrect, cloud.totalCorrect),
    totalAttempts: max(local.totalAttempts, cloud.totalAttempts),
    streak: max(local.streak, cloud.streak),
    lastActiveDate,
    perModule,
    achievements,
  }
}
