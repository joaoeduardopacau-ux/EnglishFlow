// Phonetic similarity for picking "tricky" listening distractors.
// Combines a simplified Soundex-ish code (first letter + 3 consonant digits)
// with a character-level Levenshtein distance on the full sentence.

// ── Levenshtein ──────────────────────────────────────────────
export function levenshtein(a, b) {
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  const prev = new Array(n + 1)
  const curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(
        curr[j - 1] + 1,    // insertion
        prev[j] + 1,        // deletion
        prev[j - 1] + cost, // substitution
      )
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j]
  }
  return prev[n]
}

// ── Soundex-ish encoding (compact) ──────────────────────────
// Approximates English pronunciation by stripping vowels/duplicates
// and mapping consonants to digits.
const SOUNDEX_MAP = {
  b: '1', f: '1', p: '1', v: '1',
  c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
  d: '3', t: '3',
  l: '4',
  m: '5', n: '5',
  r: '6',
}

export function soundex(word) {
  if (!word) return ''
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return ''
  let out = w[0]
  let last = SOUNDEX_MAP[w[0]] || ''
  for (let i = 1; i < w.length && out.length < 4; i++) {
    const code = SOUNDEX_MAP[w[i]]
    if (code && code !== last) out += code
    if (code !== undefined) last = code
    else last = ''
  }
  return out.padEnd(4, '0').slice(0, 4)
}

// Encode a full sentence as a sequence of soundex codes (one per word).
function encodeSentence(sentence) {
  return sentence
    .toLowerCase()
    .match(/[a-z']+/g)
    ?.map(soundex) || []
}

// ── Sentence-level similarity score ─────────────────────────
// Higher = more similar. Combines word-level soundex overlap + char-level edit distance.
export function phoneticSimilarity(a, b) {
  if (a === b) return 0 // identical — excluded from "similar but different"

  const normA = a.toLowerCase().replace(/[.,!?;:]/g, '').trim()
  const normB = b.toLowerCase().replace(/[.,!?;:]/g, '').trim()

  // Char distance, normalized by length
  const maxLen = Math.max(normA.length, normB.length)
  const charScore = 1 - levenshtein(normA, normB) / maxLen

  // Word-level soundex overlap
  const sxA = encodeSentence(normA)
  const sxB = encodeSentence(normB)
  const setB = new Set(sxB)
  let overlap = 0
  for (const code of sxA) if (setB.has(code)) overlap++
  const sxScore = sxA.length && sxB.length
    ? overlap / Math.max(sxA.length, sxB.length)
    : 0

  // Length proximity bonus (rewards matching syllable counts)
  const lenDiff = Math.abs(sxA.length - sxB.length)
  const lenScore = 1 / (1 + lenDiff)

  // Weighted: phonetic overlap dominates, char distance fine-tunes.
  return sxScore * 0.55 + charScore * 0.30 + lenScore * 0.15
}

// Pick the N most phonetically similar sentences from a pool, excluding the target.
export function pickSimilar(target, pool, n = 3) {
  const targetText = typeof target === 'string' ? target : target.english
  const scored = pool
    .filter(s => (typeof s === 'string' ? s : s.english) !== targetText)
    .map(s => ({
      item: s,
      score: phoneticSimilarity(targetText, typeof s === 'string' ? s : s.english),
    }))
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, n).map(x => x.item)
}
