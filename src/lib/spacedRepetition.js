// Algoritmo SM-2 simplificado (SuperMemo)
// Cada palavra tem: ease (dificuldade), interval (dias até próxima revisão), reps

const MIN_EASE = 1.3
const DEFAULT_EASE = 2.5
const NEW_CARD_INTERVAL = 1

export function createCard(wordKey) {
  return {
    wordKey,
    ease: DEFAULT_EASE,
    interval: 0,          // dias até próxima revisão (0 = novo)
    reps: 0,              // vezes que revisou consecutivamente sem erro
    lastReviewed: null,   // ISO date
    nextReview: null,     // ISO date (quando aparecer de novo)
    correct: 0,
    wrong: 0,
    lapses: 0,            // quantas vezes esqueceu (errou depois de acertar)
  }
}

// grade: 0=errou, 3=difícil, 4=bom, 5=fácil
export function reviewCard(card, grade) {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const updated = { ...card, lastReviewed: today }

  if (grade < 3) {
    // Errou - recomeça
    updated.reps = 0
    updated.interval = 1
    updated.wrong += 1
    if (card.reps > 0) updated.lapses += 1
    updated.ease = Math.max(MIN_EASE, card.ease - 0.2)
  } else {
    // Acertou
    updated.correct += 1
    updated.reps = card.reps + 1

    if (updated.reps === 1) {
      updated.interval = 1
    } else if (updated.reps === 2) {
      updated.interval = 3
    } else {
      updated.interval = Math.round(card.interval * updated.ease)
    }

    // Ajusta ease baseado na qualidade
    const easeDelta = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)
    updated.ease = Math.max(MIN_EASE, card.ease + easeDelta)
  }

  // Calcula data da próxima revisão
  const next = new Date(now)
  next.setDate(next.getDate() + updated.interval)
  updated.nextReview = next.toISOString().slice(0, 10)

  return updated
}

// Retorna palavras que precisam ser revisadas hoje
export function getDueCards(cards, today = new Date().toISOString().slice(0, 10)) {
  return Object.values(cards).filter(card => {
    if (!card.nextReview) return true // nova
    return card.nextReview <= today
  })
}

// Retorna estatísticas do deck
export function getReviewStats(cards) {
  const all = Object.values(cards)
  const today = new Date().toISOString().slice(0, 10)

  return {
    total: all.length,
    new: all.filter(c => c.reps === 0 && !c.lastReviewed).length,
    learning: all.filter(c => c.reps > 0 && c.reps < 3).length,
    mastered: all.filter(c => c.reps >= 3).length,
    due: all.filter(c => c.nextReview && c.nextReview <= today).length,
    dueToday: all.filter(c => c.nextReview === today).length,
  }
}

// Prioridade: erradas primeiro > vencidas > novas
export function sortByPriority(cards) {
  const today = new Date().toISOString().slice(0, 10)
  return [...cards].sort((a, b) => {
    // Erradas recentemente têm prioridade máxima
    if (a.reps === 0 && a.wrong > 0) return -1
    if (b.reps === 0 && b.wrong > 0) return 1
    // Vencidas depois
    const aDue = a.nextReview && a.nextReview < today
    const bDue = b.nextReview && b.nextReview < today
    if (aDue && !bDue) return -1
    if (bDue && !aDue) return 1
    // Depois por ease (mais difíceis primeiro)
    return a.ease - b.ease
  })
}
