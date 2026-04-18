// Template-based sentence generator.
// Each pool entry stores aligned EN + PT forms so the generated sentence
// always has a faithful translation. Templates are tagged with a `grammar`
// array so the Learn page's focus can filter which templates fire.

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const chance = (p) => Math.random() < p

// ── Subjects ────────────────────────────────────────────────
// Singular (3rd person → verb adds -s) vs plural, plus i/you specials.
const SUBJECTS = {
  sg: [
    { en: 'he',         pt: 'ele',         level: 'Ini-1' },
    { en: 'she',        pt: 'ela',         level: 'Ini-1' },
    { en: 'my brother', pt: 'meu irmão',   level: 'Ini-1' },
    { en: 'my sister',  pt: 'minha irmã',  level: 'Ini-1' },
    { en: 'my father',  pt: 'meu pai',     level: 'Ini-1' },
    { en: 'my mother',  pt: 'minha mãe',   level: 'Ini-1' },
    { en: 'the teacher',pt: 'o professor', level: 'Ini-1' },
    { en: 'the doctor', pt: 'o médico',    level: 'Ini-1' },
    { en: 'the boy',    pt: 'o menino',    level: 'Ini-1' },
    { en: 'the girl',   pt: 'a menina',    level: 'Ini-1' },
    { en: 'the child',  pt: 'a criança',   level: 'Ini-1' },
    { en: 'my friend',  pt: 'meu amigo',   level: 'Ini-1' },
    { en: 'my neighbor',pt: 'meu vizinho', level: 'Inter-2' },
    { en: 'the student',pt: 'o aluno',     level: 'Inter-2' },
  ],
  pl: [
    { en: 'we',              pt: 'nós',           level: 'Ini-1' },
    { en: 'they',            pt: 'eles',          level: 'Ini-1' },
    { en: 'my parents',      pt: 'meus pais',     level: 'Ini-1' },
    { en: 'my friends',      pt: 'meus amigos',   level: 'Ini-1' },
    { en: 'the children',    pt: 'as crianças',   level: 'Ini-1' },
    { en: 'the students',    pt: 'os alunos',     level: 'Inter-2' },
    { en: 'the neighbors',   pt: 'os vizinhos',   level: 'Inter-2' },
  ],
  i:   [{ en: 'I',   pt: 'eu',    level: 'Ini-1' }],
  you: [{ en: 'you', pt: 'você',  level: 'Ini-1' }],
}

// ── Verbs ───────────────────────────────────────────────────
// Each verb ships with: base / 3rd-singular-s / past / ing (English)
// and PT conjugations { i, sg, pl, past, ger }.
const VERBS = [
  // Transitives (need object)
  { base: 'like',   s: 'likes',   past: 'liked',    ing: 'liking',   pt: { i: 'gosto de',   sg: 'gosta de',   pl: 'gostam de',    past: 'gostou de',   ger: 'gostando de'  }, needsObj: true, level: 'Ini-1' },
  { base: 'love',   s: 'loves',   past: 'loved',    ing: 'loving',   pt: { i: 'amo',        sg: 'ama',        pl: 'amam',         past: 'amou',        ger: 'amando'       }, needsObj: true, level: 'Ini-1' },
  { base: 'want',   s: 'wants',   past: 'wanted',   ing: 'wanting',  pt: { i: 'quero',      sg: 'quer',       pl: 'querem',       past: 'quis',        ger: 'querendo',    inf: 'querer'    }, needsObj: true, level: 'Ini-1' },
  { base: 'need',   s: 'needs',   past: 'needed',   ing: 'needing',  pt: { i: 'preciso de', sg: 'precisa de', pl: 'precisam de',  past: 'precisou de', ger: 'precisando de'}, needsObj: true, level: 'Ini-1' },
  { base: 'eat',    s: 'eats',    past: 'ate',      ing: 'eating',   pt: { i: 'como',       sg: 'come',       pl: 'comem',        past: 'comeu',       ger: 'comendo'      }, needsObj: true, level: 'Ini-1' },
  { base: 'buy',    s: 'buys',    past: 'bought',   ing: 'buying',   pt: { i: 'compro',     sg: 'compra',     pl: 'compram',      past: 'comprou',     ger: 'comprando'    }, needsObj: true, level: 'Ini-1' },
  { base: 'see',    s: 'sees',    past: 'saw',      ing: 'seeing',   pt: { i: 'vejo',       sg: 'vê',         pl: 'veem',         past: 'viu',         ger: 'vendo',       inf: 'ver'       }, needsObj: true, level: 'Ini-1' },
  { base: 'read',   s: 'reads',   past: 'read',     ing: 'reading',  pt: { i: 'leio',       sg: 'lê',         pl: 'leem',         past: 'leu',         ger: 'lendo',       inf: 'ler'       }, needsObj: true, level: 'Ini-1' },
  { base: 'write',  s: 'writes',  past: 'wrote',    ing: 'writing',  pt: { i: 'escrevo',    sg: 'escreve',    pl: 'escrevem',     past: 'escreveu',    ger: 'escrevendo'   }, needsObj: true, level: 'Ini-1' },
  { base: 'drink',  s: 'drinks',  past: 'drank',    ing: 'drinking', pt: { i: 'bebo',       sg: 'bebe',       pl: 'bebem',        past: 'bebeu',       ger: 'bebendo'      }, needsObj: true, level: 'Ini-1' },
  { base: 'watch',  s: 'watches', past: 'watched',  ing: 'watching', pt: { i: 'assisto',    sg: 'assiste',    pl: 'assistem',     past: 'assistiu',    ger: 'assistindo'   }, needsObj: true, level: 'Ini-1' },
  { base: 'play',   s: 'plays',   past: 'played',   ing: 'playing',  pt: { i: 'jogo',       sg: 'joga',       pl: 'jogam',        past: 'jogou',       ger: 'jogando'      }, needsObj: true, level: 'Ini-1' },
  { base: 'make',   s: 'makes',   past: 'made',     ing: 'making',   pt: { i: 'faço',       sg: 'faz',        pl: 'fazem',        past: 'fez',         ger: 'fazendo',     inf: 'fazer'     }, needsObj: true, level: 'Ini-1' },
  { base: 'cook',   s: 'cooks',   past: 'cooked',   ing: 'cooking',  pt: { i: 'cozinho',    sg: 'cozinha',    pl: 'cozinham',     past: 'cozinhou',    ger: 'cozinhando'   }, needsObj: true, level: 'Ini-1' },
  { base: 'use',    s: 'uses',    past: 'used',     ing: 'using',    pt: { i: 'uso',        sg: 'usa',        pl: 'usam',         past: 'usou',        ger: 'usando'       }, needsObj: true, level: 'Inter-2' },
  { base: 'bring',  s: 'brings',  past: 'brought',  ing: 'bringing', pt: { i: 'trago',      sg: 'traz',       pl: 'trazem',       past: 'trouxe',      ger: 'trazendo',    inf: 'trazer'    }, needsObj: true, level: 'Inter-2' },
  { base: 'open',   s: 'opens',   past: 'opened',   ing: 'opening',  pt: { i: 'abro',       sg: 'abre',       pl: 'abrem',        past: 'abriu',       ger: 'abrindo'      }, needsObj: true, level: 'Ini-1' },
  { base: 'close',  s: 'closes',  past: 'closed',   ing: 'closing',  pt: { i: 'fecho',      sg: 'fecha',      pl: 'fecham',       past: 'fechou',      ger: 'fechando'     }, needsObj: true, level: 'Ini-1' },
  { base: 'find',   s: 'finds',   past: 'found',    ing: 'finding',  pt: { i: 'encontro',   sg: 'encontra',   pl: 'encontram',    past: 'encontrou',   ger: 'encontrando'  }, needsObj: true, level: 'Inter-2' },
  { base: 'know',   s: 'knows',   past: 'knew',     ing: 'knowing',  pt: { i: 'conheço',    sg: 'conhece',    pl: 'conhecem',     past: 'conheceu',    ger: 'conhecendo',  inf: 'conhecer'  }, needsObj: true, level: 'Inter-2' },

  // Intransitives (no object)
  { base: 'sleep',  s: 'sleeps',  past: 'slept',    ing: 'sleeping', pt: { i: 'durmo',      sg: 'dorme',      pl: 'dormem',       past: 'dormiu',      ger: 'dormindo',    inf: 'dormir'    }, needsObj: false, level: 'Ini-1' },
  { base: 'run',    s: 'runs',    past: 'ran',      ing: 'running',  pt: { i: 'corro',      sg: 'corre',      pl: 'correm',       past: 'correu',      ger: 'correndo'     }, needsObj: false, level: 'Ini-1' },
  { base: 'walk',   s: 'walks',   past: 'walked',   ing: 'walking',  pt: { i: 'caminho',    sg: 'caminha',    pl: 'caminham',     past: 'caminhou',    ger: 'caminhando'   }, needsObj: false, level: 'Ini-1' },
  { base: 'work',   s: 'works',   past: 'worked',   ing: 'working',  pt: { i: 'trabalho',   sg: 'trabalha',   pl: 'trabalham',    past: 'trabalhou',   ger: 'trabalhando'  }, needsObj: false, level: 'Ini-1' },
  { base: 'study',  s: 'studies', past: 'studied',  ing: 'studying', pt: { i: 'estudo',     sg: 'estuda',     pl: 'estudam',      past: 'estudou',     ger: 'estudando'    }, needsObj: false, level: 'Ini-1' },
  { base: 'sing',   s: 'sings',   past: 'sang',     ing: 'singing',  pt: { i: 'canto',      sg: 'canta',      pl: 'cantam',       past: 'cantou',      ger: 'cantando'     }, needsObj: false, level: 'Ini-1' },
  { base: 'dance',  s: 'dances',  past: 'danced',   ing: 'dancing',  pt: { i: 'danço',      sg: 'dança',      pl: 'dançam',       past: 'dançou',      ger: 'dançando'     }, needsObj: false, level: 'Ini-1' },
  { base: 'travel', s: 'travels', past: 'traveled', ing: 'traveling',pt: { i: 'viajo',      sg: 'viaja',      pl: 'viajam',       past: 'viajou',      ger: 'viajando'     }, needsObj: false, level: 'Inter-2' },
  { base: 'arrive', s: 'arrives', past: 'arrived',  ing: 'arriving', pt: { i: 'chego',      sg: 'chega',      pl: 'chegam',       past: 'chegou',      ger: 'chegando'     }, needsObj: false, level: 'Inter-2' },
  { base: 'wait',   s: 'waits',   past: 'waited',   ing: 'waiting',  pt: { i: 'espero',     sg: 'espera',     pl: 'esperam',      past: 'esperou',     ger: 'esperando'    }, needsObj: false, level: 'Inter-2' },
]

// ── Objects, adjectives, places, times, adverbs ────────────
const OBJECTS = [
  { en: 'an apple',       pt: 'uma maçã',      level: 'Ini-1',   topic: 'food' },
  { en: 'a banana',       pt: 'uma banana',    level: 'Ini-1',   topic: 'food' },
  { en: 'bread',          pt: 'pão',           level: 'Ini-1',   topic: 'food' },
  { en: 'coffee',         pt: 'café',          level: 'Ini-1',   topic: 'food' },
  { en: 'water',          pt: 'água',          level: 'Ini-1',   topic: 'food' },
  { en: 'juice',          pt: 'suco',          level: 'Ini-1',   topic: 'food' },
  { en: 'pizza',          pt: 'pizza',         level: 'Ini-1',   topic: 'food' },
  { en: 'a book',         pt: 'um livro',      level: 'Ini-1',   topic: 'education' },
  { en: 'the newspaper',  pt: 'o jornal',      level: 'Inter-2', topic: 'education' },
  { en: 'a movie',        pt: 'um filme',      level: 'Ini-1',   topic: 'tech' },
  { en: 'the television', pt: 'a televisão',   level: 'Ini-1',   topic: 'tech' },
  { en: 'music',          pt: 'música',        level: 'Ini-1',   topic: 'abstract' },
  { en: 'the guitar',     pt: 'o violão',      level: 'Inter-2', topic: 'abstract' },
  { en: 'football',       pt: 'futebol',       level: 'Ini-1',   topic: 'sports' },
  { en: 'a letter',       pt: 'uma carta',     level: 'Inter-2', topic: 'education' },
  { en: 'the door',       pt: 'a porta',       level: 'Ini-1',   topic: 'house' },
  { en: 'the window',     pt: 'a janela',      level: 'Ini-1',   topic: 'house' },
  { en: 'the keys',       pt: 'as chaves',     level: 'Inter-2', topic: 'house' },
  { en: 'my dog',         pt: 'meu cachorro',  level: 'Ini-1',   topic: 'animals' },
  { en: 'the cat',        pt: 'o gato',        level: 'Ini-1',   topic: 'animals' },
  { en: 'the answer',     pt: 'a resposta',    level: 'Inter-2', topic: 'abstract' },
  { en: 'English',        pt: 'inglês',        level: 'Ini-1',   topic: 'education' },
  { en: 'the truth',      pt: 'a verdade',     level: 'Inter-2', topic: 'abstract' },
]

const ADJECTIVES = [
  { en: 'happy',    pt: 'feliz',       level: 'Ini-1' },
  { en: 'tired',    pt: 'cansado',     level: 'Ini-1' },
  { en: 'hungry',   pt: 'com fome',    level: 'Ini-1' },
  { en: 'thirsty',  pt: 'com sede',    level: 'Ini-1' },
  { en: 'busy',     pt: 'ocupado',     level: 'Ini-1' },
  { en: 'ready',    pt: 'pronto',      level: 'Ini-1' },
  { en: 'sick',     pt: 'doente',      level: 'Ini-1' },
  { en: 'cold',     pt: 'com frio',    level: 'Ini-1' },
  { en: 'bored',    pt: 'entediado',   level: 'Inter-2' },
  { en: 'nervous',  pt: 'nervoso',     level: 'Inter-2' },
  { en: 'excited',  pt: 'animado',     level: 'Inter-2' },
  { en: 'afraid',   pt: 'com medo',    level: 'Inter-2' },
  { en: 'proud',    pt: 'orgulhoso',   level: 'Inter-2' },
]

const PLACES = [
  { en: 'at home',          pt: 'em casa',       level: 'Ini-1',   topic: 'house' },
  { en: 'at school',        pt: 'na escola',     level: 'Ini-1',   topic: 'education' },
  { en: 'at work',          pt: 'no trabalho',   level: 'Ini-1',   topic: 'work' },
  { en: 'in the park',      pt: 'no parque',     level: 'Ini-1',   topic: 'places' },
  { en: 'in the kitchen',   pt: 'na cozinha',    level: 'Ini-1',   topic: 'house' },
  { en: 'at the office',    pt: 'no escritório', level: 'Inter-2', topic: 'work' },
  { en: 'in the garden',    pt: 'no jardim',     level: 'Inter-2', topic: 'house' },
  { en: 'at the restaurant',pt: 'no restaurante',level: 'Inter-2', topic: 'food' },
  { en: 'downtown',         pt: 'no centro',     level: 'Inter-2', topic: 'places' },
]

const TIMES = [
  { en: 'every day',    pt: 'todos os dias',     level: 'Ini-1',   when: 'present' },
  { en: 'every morning',pt: 'toda manhã',        level: 'Ini-1',   when: 'present' },
  { en: 'every night',  pt: 'toda noite',        level: 'Ini-1',   when: 'present' },
  { en: 'on weekends',  pt: 'nos fins de semana',level: 'Ini-1',   when: 'present' },
  { en: 'today',        pt: 'hoje',              level: 'Ini-1',   when: 'any' },
  { en: 'now',          pt: 'agora',             level: 'Ini-1',   when: 'present' },
  { en: 'yesterday',    pt: 'ontem',             level: 'Ini-1',   when: 'past' },
  { en: 'last night',   pt: 'ontem à noite',     level: 'Inter-2', when: 'past' },
  { en: 'this week',    pt: 'esta semana',       level: 'Inter-2', when: 'any' },
  { en: 'tomorrow',     pt: 'amanhã',            level: 'Ini-1',   when: 'future' },
  { en: 'next week',    pt: 'semana que vem',    level: 'Ini-1',   when: 'future' },
  { en: 'next year',    pt: 'ano que vem',       level: 'Inter-2', when: 'future' },
]

const ADVERBS = [
  { en: 'quickly',   pt: 'rapidamente',   level: 'Inter-2' },
  { en: 'slowly',    pt: 'devagar',       level: 'Inter-2' },
  { en: 'carefully', pt: 'com cuidado',   level: 'Inter-2' },
  { en: 'often',     pt: 'com frequência',level: 'Inter-2' },
  { en: 'always',    pt: 'sempre',        level: 'Ini-1' },
  { en: 'never',     pt: 'nunca',         level: 'Ini-1' },
  { en: 'sometimes', pt: 'às vezes',      level: 'Ini-1' },
]

// ── Helpers ─────────────────────────────────────────────────
const LEVEL_ORDER = { 'Ini-1': 1, 'Inter-2': 2, 'Avanc-3': 3 }

function filterLevel(arr, maxLevel) {
  if (!maxLevel || maxLevel === 'all') return arr
  const max = LEVEL_ORDER[maxLevel] || 3
  return arr.filter(x => (LEVEL_ORDER[x.level] || 1) <= max)
}

function pickSubject(maxLevel) {
  const kinds = ['i', 'you', 'sg', 'sg', 'pl'] // bias toward 3rd person
  const kind = pick(kinds)
  const pool = filterLevel(SUBJECTS[kind], maxLevel)
  return { subj: pick(pool.length ? pool : SUBJECTS[kind]), kind }
}

// Subject-aware conjugations
function beEn(kind) {
  if (kind === 'i') return 'am'
  if (kind === 'sg') return 'is'
  return 'are' // you, pl
}
function bePt(kind) {
  if (kind === 'i') return 'estou'
  if (kind === 'sg') return 'está'
  if (kind === 'you') return 'está'
  return 'estão' // pl
}

function doesEn(kind) {
  return kind === 'sg' ? 'does' : 'do' // i, you, pl → do; sg → does
}
function didntDoes(kind) {
  return kind === 'sg' ? "doesn't" : "don't"
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// PT: subject-pronoun dropping (eu, nós usually implicit)
function ptSubjectDisplay(kind, subj) {
  if (kind === 'i') return ''
  if (kind === 'pl' && subj.pt === 'nós') return ''
  return subj.pt
}

// Build "Ela " or "" prefix, applying capitalization to whatever follows
function ptPrefix(kind, subj) {
  const disp = ptSubjectDisplay(kind, subj)
  return disp ? capitalize(disp) + ' ' : ''
}

// Returns the 3rd-person conjugation (she/he → verbs with -s);
// otherwise base form. Past tense is uniform across persons in English.
function enVerbPresent(verb, kind) {
  return kind === 'sg' ? verb.s : verb.base
}
function ptVerbPresent(verb, kind) {
  if (kind === 'i') return verb.pt.i
  if (kind === 'pl') return verb.pt.pl
  return verb.pt.sg // you / sg
}

function maxOf(...items) {
  let max = 1
  for (const it of items) {
    const n = LEVEL_ORDER[it.level] || 1
    if (n > max) max = n
  }
  return Object.keys(LEVEL_ORDER).find(k => LEVEL_ORDER[k] === max) || 'Ini-1'
}

function pickTime(maxLevel, when) {
  const pool = filterLevel(TIMES.filter(t => t.when === when || t.when === 'any'), maxLevel)
  return pool.length ? pick(pool) : null
}

// ── Templates (tagged with grammar focus ids) ──────────────
// Each returns { en, pt, level, topic, grammar }. The generator picks from
// templates whose `grammar` tags include the requested focus (or any).
const templates = [
  // ── Present simple ─────────────────────────────────────
  {
    id: 'ps-svo',
    grammar: ['present-simple', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const en = `${capitalize(subj.en)} ${enVerbPresent(verb, kind)} ${obj.en}.`
      const pt = `${ptPrefix(kind, subj)}${ptVerbPresent(verb, kind)} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'ps-svo-time',
    grammar: ['present-simple', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const time = pickTime(maxLevel, 'present')
      if (!time) return null
      const en = `${capitalize(subj.en)} ${enVerbPresent(verb, kind)} ${obj.en} ${time.en}.`
      const pt = `${ptPrefix(kind, subj)}${ptVerbPresent(verb, kind)} ${obj.pt} ${time.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj, time), topic: obj.topic }
    },
  },
  {
    id: 'ps-intr-place',
    grammar: ['present-simple', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => !v.needsObj), maxLevel))
      const places = filterLevel(PLACES, maxLevel)
      const place = pick(topic && topic !== 'all' ? (places.filter(p => p.topic === topic).length ? places.filter(p => p.topic === topic) : places) : places)
      const en = `${capitalize(subj.en)} ${enVerbPresent(verb, kind)} ${place.en}.`
      const pt = `${ptPrefix(kind, subj)}${ptVerbPresent(verb, kind)} ${place.pt}.`
      return { en, pt, level: maxOf(subj, verb, place), topic: place.topic || 'places' }
    },
  },
  {
    id: 'ps-intr-adv',
    grammar: ['present-simple', 'any'],
    build: (maxLevel) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => !v.needsObj), maxLevel))
      const adv = pick(filterLevel(ADVERBS, maxLevel))
      const en = `${capitalize(subj.en)} ${enVerbPresent(verb, kind)} ${adv.en}.`
      const pt = `${ptPrefix(kind, subj)}${ptVerbPresent(verb, kind)} ${adv.pt}.`
      return { en, pt, level: maxOf(subj, verb, adv), topic: 'verbs' }
    },
  },

  // ── Past simple ────────────────────────────────────────
  {
    id: 'past-svo',
    grammar: ['past-simple', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const time = chance(0.6) ? pickTime(maxLevel, 'past') : null
      const en = `${capitalize(subj.en)} ${verb.past} ${obj.en}${time ? ' ' + time.en : ''}.`
      const pt = `${ptPrefix(kind, subj)}${verb.pt.past} ${obj.pt}${time ? ' ' + time.pt : ''}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'past-intr-place',
    grammar: ['past-simple', 'any'],
    build: (maxLevel) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => !v.needsObj), maxLevel))
      const place = pick(filterLevel(PLACES, maxLevel))
      const time = chance(0.7) ? pickTime(maxLevel, 'past') : null
      const en = `${capitalize(subj.en)} ${verb.past} ${place.en}${time ? ' ' + time.en : ''}.`
      const pt = `${ptPrefix(kind, subj)}${verb.pt.past} ${place.pt}${time ? ' ' + time.pt : ''}.`
      return { en, pt, level: maxOf(subj, verb, place), topic: place.topic || 'places' }
    },
  },

  // ── Future (will) ──────────────────────────────────────
  {
    id: 'will-svo',
    grammar: ['future-will', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const time = chance(0.7) ? pickTime(maxLevel, 'future') : null
      const en = `${capitalize(subj.en)} will ${verb.base} ${obj.en}${time ? ' ' + time.en : ''}.`
      // PT: "vai + infinitivo" aproximação usando base en→pt via pt.i sem conjugação — fallback simples
      const willPt = kind === 'pl' && subj.pt !== 'nós' ? 'vão' : kind === 'pl' ? 'vamos' : kind === 'i' ? 'vou' : 'vai'
      const pt = `${ptPrefix(kind, subj)}${willPt} ${ptInfinitive(verb)} ${obj.pt}${time ? ' ' + time.pt : ''}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },

  // ── Future (going to) ──────────────────────────────────
  {
    id: 'gt-svo',
    grammar: ['future-going-to', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const time = chance(0.7) ? pickTime(maxLevel, 'future') : null
      const en = `${capitalize(subj.en)} ${beEn(kind)} going to ${verb.base} ${obj.en}${time ? ' ' + time.en : ''}.`
      const willPt = kind === 'pl' && subj.pt !== 'nós' ? 'vão' : kind === 'pl' ? 'vamos' : kind === 'i' ? 'vou' : 'vai'
      const pt = `${ptPrefix(kind, subj)}${willPt} ${ptInfinitive(verb)} ${obj.pt}${time ? ' ' + time.pt : ''}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },

  // ── Present continuous ─────────────────────────────────
  {
    id: 'pc-svo',
    grammar: ['present-continuous', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const en = `${capitalize(subj.en)} ${beEn(kind)} ${verb.ing} ${obj.en}.`
      const pt = `${ptPrefix(kind, subj)}${bePt(kind)} ${verb.pt.ger} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'pc-intr',
    grammar: ['present-continuous', 'any'],
    build: (maxLevel) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => !v.needsObj), maxLevel))
      const place = pick(filterLevel(PLACES, maxLevel))
      const en = `${capitalize(subj.en)} ${beEn(kind)} ${verb.ing} ${place.en}.`
      const pt = `${ptPrefix(kind, subj)}${bePt(kind)} ${verb.pt.ger} ${place.pt}.`
      return { en, pt, level: maxOf(subj, verb, place), topic: place.topic || 'places' }
    },
  },

  // ── To be + adjective / place ──────────────────────────
  {
    id: 'tobe-adj',
    grammar: ['to-be', 'adjectives', 'any'],
    build: (maxLevel) => {
      const { subj, kind } = pickSubject(maxLevel)
      const adj = pick(filterLevel(ADJECTIVES, maxLevel))
      const en = `${capitalize(subj.en)} ${beEn(kind)} ${adj.en}.`
      const pt = `${ptPrefix(kind, subj)}${bePt(kind)} ${adj.pt}.`
      return { en, pt, level: maxOf(subj, adj), topic: 'adjectives' }
    },
  },
  {
    id: 'tobe-place',
    grammar: ['to-be', 'any'],
    build: (maxLevel) => {
      const { subj, kind } = pickSubject(maxLevel)
      const place = pick(filterLevel(PLACES, maxLevel))
      const en = `${capitalize(subj.en)} ${beEn(kind)} ${place.en}.`
      const pt = `${ptPrefix(kind, subj)}${bePt(kind)} ${place.pt}.`
      return { en, pt, level: maxOf(subj, place), topic: place.topic || 'places' }
    },
  },

  // ── Questions ──────────────────────────────────────────
  {
    id: 'q-ps',
    grammar: ['questions', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const en = `${capitalize(doesEn(kind))} ${subj.en} ${verb.base} ${obj.en}?`
      // PT question marker: just add ? and keep declarative order
      const ptSubj = ptSubjectDisplay(kind, subj) || subj.pt
      const pt = `${capitalize(ptSubj)} ${ptVerbPresent(verb, kind)} ${obj.pt}?`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'q-past',
    grammar: ['questions', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const en = `Did ${subj.en} ${verb.base} ${obj.en}?`
      const ptSubj = ptSubjectDisplay(kind, subj) || subj.pt
      const pt = `${capitalize(ptSubj)} ${verb.pt.past} ${obj.pt}?`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'q-tobe',
    grammar: ['questions', 'to-be', 'any'],
    build: (maxLevel) => {
      const { subj, kind } = pickSubject(maxLevel)
      const adj = pick(filterLevel(ADJECTIVES, maxLevel))
      const en = `${capitalize(beEn(kind))} ${subj.en} ${adj.en}?`
      const ptSubj = ptSubjectDisplay(kind, subj) || subj.pt
      const pt = `${capitalize(ptSubj)} ${bePt(kind)} ${adj.pt}?`
      return { en, pt, level: maxOf(subj, adj), topic: 'adjectives' }
    },
  },

  // ── Negatives ──────────────────────────────────────────
  {
    id: 'n-ps',
    grammar: ['negatives', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const en = `${capitalize(subj.en)} ${didntDoes(kind)} ${verb.base} ${obj.en}.`
      const pt = `${ptPrefix(kind, subj)}não ${ptVerbPresent(verb, kind)} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'n-past',
    grammar: ['negatives', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => v.needsObj), maxLevel))
      const objs = filterLevel(OBJECTS, maxLevel)
      const obj = pick(topic && topic !== 'all' ? (objs.filter(o => o.topic === topic).length ? objs.filter(o => o.topic === topic) : objs) : objs)
      const en = `${capitalize(subj.en)} didn't ${verb.base} ${obj.en}.`
      const pt = `${ptPrefix(kind, subj)}não ${verb.pt.past} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'n-tobe',
    grammar: ['negatives', 'to-be', 'any'],
    build: (maxLevel) => {
      const { subj, kind } = pickSubject(maxLevel)
      const adj = pick(filterLevel(ADJECTIVES, maxLevel))
      const notEn = kind === 'i' ? "am not" : beEn(kind) + " not"
      const en = `${capitalize(subj.en)} ${notEn} ${adj.en}.`
      const pt = `${ptPrefix(kind, subj)}não ${bePt(kind)} ${adj.pt}.`
      return { en, pt, level: maxOf(subj, adj), topic: 'adjectives' }
    },
  },
]

// Rough PT infinitive from conjugations — used for periphrastic future
// ("vou trabalhar"). Maps "trabalho" → "trabalhar", "como" → "comer",
// "assisto" → "assistir", etc. Uses past ending as a hint.
function ptInfinitive(verb) {
  // Explicit override — for irregular verbs where the heuristic fails (e.g. "ler").
  if (verb.pt.inf) return verb.pt.inf
  const i = verb.pt.i
  const past = verb.pt.past
  // Strip trailing "de" (for "gosto de" / "preciso de" / ...)
  const stripDe = (s) => s.replace(/\s+de$/, '')
  const core = stripDe(i).trim()
  const pastCore = stripDe(past).trim()
  const de = /\sde$/.test(i) ? ' de' : ''
  // Heuristic by past-participle ending (checked against the stripped form):
  if (/iu$/.test(pastCore)) return core.replace(/o$/, 'ir') + de   // dormiu → dormir
  if (/ou$/.test(pastCore)) return core.replace(/o$/, 'ar') + de   // cantou → cantar
  if (/eu$/.test(pastCore)) return core.replace(/o$/, 'er') + de   // comeu → comer
  return core + de
}

// Capitalize the first letter of a PT sentence even when the subject was dropped
// (e.g. "estou feliz." → "Estou feliz.", "não estou feliz." → "Não estou feliz.").
function capFirst(s) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ── Finalize & export ──────────────────────────────────────
function tokenize(sentence) {
  return sentence.match(/[\w']+|[.,!?;:]/g) || []
}

function finalize(s, grammar) {
  return {
    id: Math.floor(Math.random() * 1e9),
    english: s.en,
    portuguese: capFirst(s.pt),
    level: s.level,
    topic: s.topic,
    grammar: grammar || 'any',
    words: tokenize(s.en),
  }
}

function templatesForGrammar(grammar) {
  if (!grammar || grammar === 'any') return templates
  return templates.filter(t => t.grammar.includes(grammar))
}

export function generateSentence({ level = 'all', topic = 'all', grammar = 'any' } = {}) {
  const maxLevel = level === 'all' ? 'Avanc-3' : level
  const pool = templatesForGrammar(grammar)
  if (!pool.length) return generateSentence({ level, topic, grammar: 'any' })
  // Try up to N times to match the topic filter. Templates may return null
  // (e.g. no matching time word available) — skip those and retry.
  for (let attempt = 0; attempt < 30; attempt++) {
    const tpl = pick(pool)
    const s = tpl.build(maxLevel, topic)
    if (!s) continue
    if (topic && topic !== 'all' && s.topic !== topic) {
      // Accept anyway on final attempts so we always return something
      if (attempt < 20) continue
    }
    return finalize(s, grammar)
  }
  // Fallback ignoring topic
  for (let attempt = 0; attempt < 10; attempt++) {
    const tpl = pick(pool)
    const s = tpl.build(maxLevel, 'all')
    if (s) return finalize(s, grammar)
  }
  // Last resort: any template at all
  const s = pick(templates).build(maxLevel, 'all') || { en: 'I like English.', pt: 'Eu gosto de inglês.', level: 'Ini-1', topic: 'education' }
  return finalize(s, grammar)
}

export function generateSentences(n = 5, opts = {}) {
  return Array.from({ length: n }, () => generateSentence(opts))
}

// Shuffle helper — moved here so sentences.js can re-export it.
export function shuffleWords(words) {
  const copy = [...words]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
