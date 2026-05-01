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
// Each verb ships with: base / 3rd-singular-s / past / pp (past participle) / ing (English)
// and PT conjugations { i, sg, pl, past, pp, ger }.
//
// The pp (past participle) is required for Present Perfect templates
// (have/has + pp). Denilso Lima Ch. 17-18 covers its formation for
// regular (-ed) and irregular verbs.
//
// Semantic compatibility:
//   - accepts: [classes] — which object classes (cls) this verb makes sense with.
//     Use ['*'] for verbs that accept almost anything (like, love, want, need).
//   - stative: true — don't use in present continuous ("I am knowing" → nope).
const VERBS = [
  // Transitives (need object)
  { base: 'like',   s: 'likes',   past: 'liked',    pp: 'liked',     ing: 'liking',   pt: { i: 'gosto de',   sg: 'gosta de',   pl: 'gostam de',    past: 'gostou de',   pp: 'gostado de',  ger: 'gostando de'  }, needsObj: true, level: 'Ini-1', accepts: ['*'], stative: true },
  { base: 'love',   s: 'loves',   past: 'loved',    pp: 'loved',     ing: 'loving',   pt: { i: 'amo',        sg: 'ama',        pl: 'amam',         past: 'amou',        pp: 'amado',       ger: 'amando'       }, needsObj: true, level: 'Ini-1', accepts: ['*'], stative: true },
  { base: 'want',   s: 'wants',   past: 'wanted',   pp: 'wanted',    ing: 'wanting',  pt: { i: 'quero',      sg: 'quer',       pl: 'querem',       past: 'quis',        pp: 'querido',     ger: 'querendo',    inf: 'querer'    }, needsObj: true, level: 'Ini-1', accepts: ['food','drink','text','media','instr','tool','pet','info','language','sport','music'], stative: true },
  { base: 'need',   s: 'needs',   past: 'needed',   pp: 'needed',    ing: 'needing',  pt: { i: 'preciso de', sg: 'precisa de', pl: 'precisam de',  past: 'precisou de', pp: 'precisado de',ger: 'precisando de'}, needsObj: true, level: 'Ini-1', accepts: ['food','drink','text','media','instr','tool','info','language'], stative: true },
  { base: 'eat',    s: 'eats',    past: 'ate',      pp: 'eaten',     ing: 'eating',   pt: { i: 'como',       sg: 'come',       pl: 'comem',        past: 'comeu',       pp: 'comido',      ger: 'comendo'      }, needsObj: true, level: 'Ini-1', accepts: ['food'] },
  { base: 'buy',    s: 'buys',    past: 'bought',   pp: 'bought',    ing: 'buying',   pt: { i: 'compro',     sg: 'compra',     pl: 'compram',      past: 'comprou',     pp: 'comprado',    ger: 'comprando'    }, needsObj: true, level: 'Ini-1', accepts: ['food','drink','text','media','instr','tool','pet'] },
  { base: 'see',    s: 'sees',    past: 'saw',      pp: 'seen',      ing: 'seeing',   pt: { i: 'vejo',       sg: 'vê',         pl: 'veem',         past: 'viu',         pp: 'visto',       ger: 'vendo',       inf: 'ver'       }, needsObj: true, level: 'Ini-1', accepts: ['food','drink','text','media','instr','opening','tool','pet','sport'], stative: true },
  { base: 'read',   s: 'reads',   past: 'read',     pp: 'read',      ing: 'reading',  pt: { i: 'leio',       sg: 'lê',         pl: 'leem',         past: 'leu',         pp: 'lido',        ger: 'lendo',       inf: 'ler'       }, needsObj: true, level: 'Ini-1', accepts: ['text'] },
  { base: 'write',  s: 'writes',  past: 'wrote',    pp: 'written',   ing: 'writing',  pt: { i: 'escrevo',    sg: 'escreve',    pl: 'escrevem',     past: 'escreveu',    pp: 'escrito',     ger: 'escrevendo'   }, needsObj: true, level: 'Ini-1', accepts: ['text'] },
  { base: 'drink',  s: 'drinks',  past: 'drank',    pp: 'drunk',     ing: 'drinking', pt: { i: 'bebo',       sg: 'bebe',       pl: 'bebem',        past: 'bebeu',       pp: 'bebido',      ger: 'bebendo'      }, needsObj: true, level: 'Ini-1', accepts: ['drink'] },
  { base: 'watch',  s: 'watches', past: 'watched',  pp: 'watched',   ing: 'watching', pt: { i: 'assisto',    sg: 'assiste',    pl: 'assistem',     past: 'assistiu',    pp: 'assistido',   ger: 'assistindo'   }, needsObj: true, level: 'Ini-1', accepts: ['media','sport','pet'] },
  { base: 'play',   s: 'plays',   past: 'played',   pp: 'played',    ing: 'playing',  pt: { i: 'jogo',       sg: 'joga',       pl: 'jogam',        past: 'jogou',       pp: 'jogado',      ger: 'jogando'      }, needsObj: true, level: 'Ini-1', accepts: ['sport','music','instr'] },
  { base: 'make',   s: 'makes',   past: 'made',     pp: 'made',      ing: 'making',   pt: { i: 'faço',       sg: 'faz',        pl: 'fazem',        past: 'fez',         pp: 'feito',       ger: 'fazendo',     inf: 'fazer'     }, needsObj: true, level: 'Ini-1', accepts: ['food','drink','music'] },
  { base: 'cook',   s: 'cooks',   past: 'cooked',   pp: 'cooked',    ing: 'cooking',  pt: { i: 'cozinho',    sg: 'cozinha',    pl: 'cozinham',     past: 'cozinhou',    pp: 'cozinhado',   ger: 'cozinhando'   }, needsObj: true, level: 'Ini-1', accepts: ['food'] },
  { base: 'use',    s: 'uses',    past: 'used',     pp: 'used',      ing: 'using',    pt: { i: 'uso',        sg: 'usa',        pl: 'usam',         past: 'usou',        pp: 'usado',       ger: 'usando'       }, needsObj: true, level: 'Inter-2', accepts: ['tool','instr','language','text'] },
  { base: 'bring',  s: 'brings',  past: 'brought',  pp: 'brought',   ing: 'bringing', pt: { i: 'trago',      sg: 'traz',       pl: 'trazem',       past: 'trouxe',      pp: 'trazido',     ger: 'trazendo',    inf: 'trazer'    }, needsObj: true, level: 'Inter-2', accepts: ['food','drink','text','media','instr','tool','sport','pet'] },
  { base: 'open',   s: 'opens',   past: 'opened',   pp: 'opened',    ing: 'opening',  pt: { i: 'abro',       sg: 'abre',       pl: 'abrem',        past: 'abriu',       pp: 'aberto',      ger: 'abrindo'      }, needsObj: true, level: 'Ini-1', accepts: ['opening','text'] },
  { base: 'close',  s: 'closes',  past: 'closed',   pp: 'closed',    ing: 'closing',  pt: { i: 'fecho',      sg: 'fecha',      pl: 'fecham',       past: 'fechou',      pp: 'fechado',     ger: 'fechando'     }, needsObj: true, level: 'Ini-1', accepts: ['opening','text'] },
  { base: 'find',   s: 'finds',   past: 'found',    pp: 'found',     ing: 'finding',  pt: { i: 'encontro',   sg: 'encontra',   pl: 'encontram',    past: 'encontrou',   pp: 'encontrado',  ger: 'encontrando'  }, needsObj: true, level: 'Inter-2', accepts: ['food','drink','text','media','instr','opening','tool','pet','info'] },
  { base: 'know',   s: 'knows',   past: 'knew',     pp: 'known',     ing: 'knowing',  pt: { i: 'conheço',    sg: 'conhece',    pl: 'conhecem',     past: 'conheceu',    pp: 'conhecido',   ger: 'conhecendo',  inf: 'conhecer'  }, needsObj: true, level: 'Inter-2', accepts: ['info','language','media','music','pet'], stative: true },

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
// `cls` — semantic class. Used by pickObjAndVerb to only pair objects with
// verbs whose `accepts` list includes this class. Keeps us from generating
// nonsense like "I know a banana" or "he watches water."
const OBJECTS = [
  { en: 'an apple',       pt: 'uma maçã',      level: 'Ini-1',   topic: 'food',      cls: 'food' },
  { en: 'a banana',       pt: 'uma banana',    level: 'Ini-1',   topic: 'food',      cls: 'food' },
  { en: 'bread',          pt: 'pão',           level: 'Ini-1',   topic: 'food',      cls: 'food' },
  { en: 'coffee',         pt: 'café',          level: 'Ini-1',   topic: 'food',      cls: 'drink' },
  { en: 'water',          pt: 'água',          level: 'Ini-1',   topic: 'food',      cls: 'drink' },
  { en: 'juice',          pt: 'suco',          level: 'Ini-1',   topic: 'food',      cls: 'drink' },
  { en: 'pizza',          pt: 'pizza',         level: 'Ini-1',   topic: 'food',      cls: 'food' },
  { en: 'a book',         pt: 'um livro',      level: 'Ini-1',   topic: 'education', cls: 'text' },
  { en: 'the newspaper',  pt: 'o jornal',      level: 'Inter-2', topic: 'education', cls: 'text' },
  { en: 'a movie',        pt: 'um filme',      level: 'Ini-1',   topic: 'tech',      cls: 'media' },
  { en: 'the television', pt: 'a televisão',   level: 'Ini-1',   topic: 'tech',      cls: 'media' },
  { en: 'music',          pt: 'música',        level: 'Ini-1',   topic: 'abstract',  cls: 'music' },
  { en: 'the guitar',     pt: 'o violão',      level: 'Inter-2', topic: 'abstract',  cls: 'instr' },
  { en: 'football',       pt: 'futebol',       level: 'Ini-1',   topic: 'sports',    cls: 'sport' },
  { en: 'a letter',       pt: 'uma carta',     level: 'Inter-2', topic: 'education', cls: 'text' },
  { en: 'the door',       pt: 'a porta',       level: 'Ini-1',   topic: 'house',     cls: 'opening' },
  { en: 'the window',     pt: 'a janela',      level: 'Ini-1',   topic: 'house',     cls: 'opening' },
  { en: 'the keys',       pt: 'as chaves',     level: 'Inter-2', topic: 'house',     cls: 'tool' },
  { en: 'my dog',         pt: 'meu cachorro',  level: 'Ini-1',   topic: 'animals',   cls: 'pet' },
  { en: 'the cat',        pt: 'o gato',        level: 'Ini-1',   topic: 'animals',   cls: 'pet' },
  { en: 'the answer',     pt: 'a resposta',    level: 'Inter-2', topic: 'abstract',  cls: 'info' },
  { en: 'English',        pt: 'inglês',        level: 'Ini-1',   topic: 'education', cls: 'language' },
  { en: 'the truth',      pt: 'a verdade',     level: 'Inter-2', topic: 'abstract',  cls: 'info' },
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

// Gradable adjectives for comparatives/superlatives (Denilso Lima Ch. on
// comparativo — "bigger than", "the tallest", etc.). Kept separate from the
// predicate-only ADJECTIVES pool above because not every feeling-adjective
// compares naturally ("happier than" works; "more hungry than" less so).
const COMP_ADJECTIVES = [
  { en: 'tall',   comp: 'taller',          sup: 'tallest',          pt: 'alto',       ptComp: 'mais alto que',       ptSup: 'o mais alto',       level: 'Ini-1' },
  { en: 'short',  comp: 'shorter',         sup: 'shortest',         pt: 'baixo',      ptComp: 'mais baixo que',      ptSup: 'o mais baixo',      level: 'Ini-1' },
  { en: 'big',    comp: 'bigger',          sup: 'biggest',          pt: 'grande',     ptComp: 'maior que',           ptSup: 'o maior',           level: 'Ini-1' },
  { en: 'small',  comp: 'smaller',         sup: 'smallest',         pt: 'pequeno',    ptComp: 'menor que',           ptSup: 'o menor',           level: 'Ini-1' },
  { en: 'fast',   comp: 'faster',          sup: 'fastest',          pt: 'rápido',     ptComp: 'mais rápido que',     ptSup: 'o mais rápido',     level: 'Ini-1' },
  { en: 'slow',   comp: 'slower',          sup: 'slowest',          pt: 'lento',      ptComp: 'mais lento que',      ptSup: 'o mais lento',      level: 'Ini-1' },
  { en: 'young',  comp: 'younger',         sup: 'youngest',         pt: 'jovem',      ptComp: 'mais jovem que',      ptSup: 'o mais jovem',      level: 'Ini-1' },
  { en: 'old',    comp: 'older',           sup: 'oldest',           pt: 'velho',      ptComp: 'mais velho que',      ptSup: 'o mais velho',      level: 'Ini-1' },
  { en: 'good',   comp: 'better',          sup: 'best',             pt: 'bom',        ptComp: 'melhor que',          ptSup: 'o melhor',          level: 'Ini-1' },
  { en: 'bad',    comp: 'worse',           sup: 'worst',            pt: 'ruim',       ptComp: 'pior que',            ptSup: 'o pior',            level: 'Ini-1' },
  { en: 'smart',  comp: 'smarter',         sup: 'smartest',         pt: 'inteligente',ptComp: 'mais inteligente que',ptSup: 'o mais inteligente',level: 'Inter-2' },
  { en: 'beautiful', comp: 'more beautiful', sup: 'most beautiful', pt: 'bonito',     ptComp: 'mais bonito que',     ptSup: 'o mais bonito',     level: 'Inter-2' },
  { en: 'expensive', comp: 'more expensive', sup: 'most expensive', pt: 'caro',       ptComp: 'mais caro que',       ptSup: 'o mais caro',       level: 'Inter-2' },
  { en: 'cheap',  comp: 'cheaper',         sup: 'cheapest',         pt: 'barato',     ptComp: 'mais barato que',     ptSup: 'o mais barato',     level: 'Inter-2' },
  { en: 'easy',   comp: 'easier',          sup: 'easiest',          pt: 'fácil',      ptComp: 'mais fácil que',      ptSup: 'o mais fácil',      level: 'Inter-2' },
  { en: 'difficult', comp: 'more difficult', sup: 'most difficult', pt: 'difícil',    ptComp: 'mais difícil que',    ptSup: 'o mais difícil',    level: 'Inter-2' },
]

// Modal verbs (Denilso Lima Ch. 19-23: can/could, may/might, should, must, will/would).
// Modals in English are invariant (no -s for 3rd person singular) and take
// the bare infinitive: "she can swim", not "she cans swims".
// PT rendering uses a matching auxiliary per subject.
const MODALS = [
  {
    en: 'can',
    pt: { i: 'posso', sg: 'pode', you: 'pode', pl: 'podem', pl_nos: 'podemos' },
    meaning: 'ability',
    level: 'Ini-1',
  },
  {
    en: 'should',
    pt: { i: 'deveria', sg: 'deveria', you: 'deveria', pl: 'deveriam', pl_nos: 'deveríamos' },
    meaning: 'advice',
    level: 'Inter-2',
  },
  {
    en: 'must',
    pt: { i: 'devo', sg: 'deve', you: 'deve', pl: 'devem', pl_nos: 'devemos' },
    meaning: 'obligation',
    level: 'Inter-2',
  },
  {
    en: 'could',
    pt: { i: 'poderia', sg: 'poderia', you: 'poderia', pl: 'poderiam', pl_nos: 'poderíamos' },
    meaning: 'polite-ability',
    level: 'Inter-2',
  },
  {
    en: 'may',
    pt: { i: 'posso', sg: 'pode', you: 'pode', pl: 'podem', pl_nos: 'podemos' },
    meaning: 'possibility',
    level: 'Inter-2',
  },
]

// Linking words / conjunctions (from Gramatica_inglesa_O_Guia_Completo — "linking words"):
// and, but, because, so, or. Each links two clauses; the second clause inherits
// a fresh subject+verb+object or a predicate adjective.
const CONJUNCTIONS = [
  { en: 'and',      pt: 'e',         level: 'Ini-1' },
  { en: 'but',      pt: 'mas',       level: 'Ini-1' },
  { en: 'because',  pt: 'porque',    level: 'Ini-1' },
  { en: 'so',       pt: 'então',     level: 'Inter-2' },
  { en: 'or',       pt: 'ou',        level: 'Inter-2' },
]

// Markers for Present Perfect (Denilso Lima Ch. Present Perfect I & II):
// "have you ever ...?", "I've never ...", "she has already ...", "we've just ...".
// Each marker slots between the auxiliary (have/has) and the past participle.
const PP_MARKERS = [
  { en: 'already', pt: 'já',                level: 'Ini-1', polarity: 'affirmative' },
  { en: 'just',    pt: 'acabou de',         level: 'Inter-2', polarity: 'affirmative' }, // "she has just eaten" → "ela acabou de comer"
  { en: 'never',   pt: 'nunca',             level: 'Ini-1', polarity: 'negative' },
  { en: 'ever',    pt: 'alguma vez',        level: 'Inter-2', polarity: 'question' },
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

// Present Perfect auxiliary: has for 3rd-sg, have for everyone else.
function haveEn(kind) {
  return kind === 'sg' ? 'has' : 'have'
}

// Past Continuous auxiliary: was for I/he/she/it, were for you/we/they.
function wasEn(kind) {
  return kind === 'i' || kind === 'sg' ? 'was' : 'were'
}
function wasPt(kind) {
  if (kind === 'i') return 'estava'
  if (kind === 'sg') return 'estava'
  if (kind === 'you') return 'estava'
  return 'estavam' // pl
}

// Modal EN is invariant; pick the matching PT conjugation by subject kind.
function modalPt(modal, kind, subj) {
  if (kind === 'i') return modal.pt.i
  if (kind === 'sg') return modal.pt.sg
  if (kind === 'you') return modal.pt.you
  // plural: "nós" → 1pp, else 3pp
  if (subj && subj.pt === 'nós') return modal.pt.pl_nos
  return modal.pt.pl
}

// Portuguese past participle auxiliary for perfect tenses: "tenho / tem / tem / têm / temos".
// NB: Portuguese present perfect has a narrower meaning than English — it implies
// ongoing/repeated action up to now. For generator simplicity we pair with markers
// that make the translation natural ("já", "nunca", etc.), and for "just" we use
// a different idiom ("acabou de + inf").
function haveAuxPt(kind, subj) {
  if (kind === 'i') return 'tenho'
  if (kind === 'sg') return 'tem'
  if (kind === 'you') return 'tem'
  if (subj && subj.pt === 'nós') return 'temos'
  return 'têm' // pl
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

// Pick a semantically compatible (object, verb) pair.
//
// Strategy: pick the object first (respecting topic), then pick a transitive
// verb whose `accepts` list covers that object's class. Verbs with
// `accepts: ['*']` (like, love) match anything. If `excludeStative` is true,
// stative verbs are filtered out — use this for present continuous templates
// so we never emit "I am knowing the answer."
//
// Returns { obj, verb } or null if no compatible pair exists at this level.
function pickObjAndVerb(maxLevel, topic, { excludeStative = false } = {}) {
  const objs = filterLevel(OBJECTS, maxLevel)
  const topical = topic && topic !== 'all'
    ? objs.filter(o => o.topic === topic)
    : objs
  const objPool = topical.length ? topical : objs
  if (!objPool.length) return null

  const verbPool = filterLevel(
    VERBS.filter(v => v.needsObj && (!excludeStative || !v.stative)),
    maxLevel,
  )
  if (!verbPool.length) return null

  // Try a handful of object picks — find one with at least one compatible verb.
  for (let i = 0; i < 10; i++) {
    const obj = pick(objPool)
    const compatible = verbPool.filter(
      v => v.accepts && (v.accepts.includes('*') || v.accepts.includes(obj.cls)),
    )
    if (compatible.length) {
      return { obj, verb: pick(compatible) }
    }
  }
  // Fallback: scan all objects for any that has a compatible verb.
  for (const obj of objPool) {
    const compatible = verbPool.filter(
      v => v.accepts && (v.accepts.includes('*') || v.accepts.includes(obj.cls)),
    )
    if (compatible.length) {
      return { obj, verb: pick(compatible) }
    }
  }
  return null
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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
      // excludeStative: English doesn't allow "I am knowing / wanting / liking ..."
      const pair = pickObjAndVerb(maxLevel, topic, { excludeStative: true })
      if (!pair) return null
      const { obj, verb } = pair
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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
      const pair = pickObjAndVerb(maxLevel, topic)
      if (!pair) return null
      const { obj, verb } = pair
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

  // ── Present Perfect (Denilso Lima Ch. 17-18) ───────────
  // have/has + past participle, typically with markers "already", "never", "ever", "just".
  // PT rendering uses past simple + adverb, which is how Brazilians naturally translate
  // these — Portuguese present perfect ("tenho comido") carries a different meaning.
  {
    id: 'pp-already',
    grammar: ['present-perfect', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      // Stative verbs sound odd with "already" in perfect ("she has already known the answer")
      const pair = pickObjAndVerb(maxLevel, topic, { excludeStative: true })
      if (!pair) return null
      const { obj, verb } = pair
      const en = `${capitalize(subj.en)} ${haveEn(kind)} already ${verb.pp} ${obj.en}.`
      const pt = `${ptPrefix(kind, subj)}já ${verb.pt.past} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'pp-never',
    grammar: ['present-perfect', 'negatives', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const pair = pickObjAndVerb(maxLevel, topic, { excludeStative: true })
      if (!pair) return null
      const { obj, verb } = pair
      const en = `${capitalize(subj.en)} ${haveEn(kind)} never ${verb.pp} ${obj.en}.`
      const pt = `${ptPrefix(kind, subj)}nunca ${verb.pt.past} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'pp-ever-q',
    grammar: ['present-perfect', 'questions', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const pair = pickObjAndVerb(maxLevel, topic, { excludeStative: true })
      if (!pair) return null
      const { obj, verb } = pair
      const en = `${capitalize(haveEn(kind))} ${subj.en} ever ${verb.pp} ${obj.en}?`
      const ptSubj = ptSubjectDisplay(kind, subj) || subj.pt
      const pt = `${capitalize(ptSubj)} já ${verb.pt.past} ${obj.pt} alguma vez?`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'pp-just',
    grammar: ['present-perfect', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const pair = pickObjAndVerb(maxLevel, topic, { excludeStative: true })
      if (!pair) return null
      const { obj, verb } = pair
      const en = `${capitalize(subj.en)} ${haveEn(kind)} just ${verb.pp} ${obj.en}.`
      // "She has just eaten" → "Ela acabou de comer" (idiomatic PT)
      const acabou = kind === 'i' ? 'acabei' : (kind === 'pl' && subj.pt === 'nós') ? 'acabamos' : kind === 'pl' ? 'acabaram' : 'acabou'
      const pt = `${ptPrefix(kind, subj)}${acabou} de ${ptInfinitive(verb)} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },

  // ── Modal verbs (Denilso Lima Ch. 19-23) ───────────────
  // can / could / should / must / may — bare infinitive after the modal.
  {
    id: 'modal-svo',
    grammar: ['modal-verbs', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const modal = pick(filterLevel(MODALS, maxLevel))
      const pair = pickObjAndVerb(maxLevel, topic, { excludeStative: true })
      if (!pair) return null
      const { obj, verb } = pair
      const en = `${capitalize(subj.en)} ${modal.en} ${verb.base} ${obj.en}.`
      const pt = `${ptPrefix(kind, subj)}${modalPt(modal, kind, subj)} ${ptInfinitive(verb)} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj, modal), topic: obj.topic }
    },
  },
  {
    id: 'modal-can-q',
    grammar: ['modal-verbs', 'questions', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      // "Can you open the door?" — use can/could for questions (natural request pattern)
      const modal = pick([MODALS[0], MODALS[3]]) // can, could
      const pair = pickObjAndVerb(maxLevel, topic, { excludeStative: true })
      if (!pair) return null
      const { obj, verb } = pair
      const en = `${capitalize(modal.en)} ${subj.en} ${verb.base} ${obj.en}?`
      const ptSubj = ptSubjectDisplay(kind, subj) || subj.pt
      const pt = `${capitalize(ptSubj)} ${modalPt(modal, kind, subj)} ${ptInfinitive(verb)} ${obj.pt}?`
      return { en, pt, level: maxOf(subj, verb, obj, modal), topic: obj.topic }
    },
  },

  // ── Comparatives & Superlatives ────────────────────────
  {
    id: 'comp-adj',
    grammar: ['comparatives', 'any'],
    build: (maxLevel) => {
      // Two different subjects to compare. Bias toward 3rd-person singular on both sides.
      const a = pick(filterLevel(SUBJECTS.sg, maxLevel))
      let b = pick(filterLevel(SUBJECTS.sg, maxLevel))
      // Try to avoid comparing a subject with itself.
      for (let i = 0; i < 5 && b.en === a.en; i++) b = pick(filterLevel(SUBJECTS.sg, maxLevel))
      if (b.en === a.en) return null
      const adj = pick(filterLevel(COMP_ADJECTIVES, maxLevel))
      const en = `${capitalize(a.en)} is ${adj.comp} than ${b.en}.`
      const pt = `${capitalize(a.pt)} é ${adj.ptComp} ${b.pt}.`
      return { en, pt, level: maxOf(a, b, adj), topic: 'adjectives' }
    },
  },
  {
    id: 'sup-adj',
    grammar: ['comparatives', 'any'],
    build: (maxLevel) => {
      const subj = pick(filterLevel(SUBJECTS.sg, maxLevel))
      const adj = pick(filterLevel(COMP_ADJECTIVES, maxLevel))
      const en = `${capitalize(subj.en)} is the ${adj.sup}.`
      const pt = `${capitalize(subj.pt)} é ${adj.ptSup}.`
      return { en, pt, level: maxOf(subj, adj), topic: 'adjectives' }
    },
  },

  // ── Linking words / conjunctions ───────────────────────
  // Chains two independent clauses with a conjunction (Gramatica Completo § linking words).
  {
    id: 'conj-because-adj',
    grammar: ['linking-words', 'any'],
    build: (maxLevel) => {
      // "She is tired because she works every day."
      const { subj, kind } = pickSubject(maxLevel)
      const adj = pick(filterLevel(ADJECTIVES, maxLevel))
      // Second clause: same subject, different action
      const verb = pick(filterLevel(VERBS.filter(v => !v.needsObj), maxLevel))
      const time = pickTime(maxLevel, 'present')
      const timeEn = time ? ' ' + time.en : ''
      const timePt = time ? ' ' + time.pt : ''
      const en = `${capitalize(subj.en)} ${beEn(kind)} ${adj.en} because ${subj.en} ${enVerbPresent(verb, kind)}${timeEn}.`
      const ptSubj2 = ptSubjectDisplay(kind, subj) || subj.pt
      const pt = `${ptPrefix(kind, subj)}${bePt(kind)} ${adj.pt} porque ${ptSubj2} ${ptVerbPresent(verb, kind)}${timePt}.`
      return { en, pt, level: maxOf(subj, adj, verb), topic: 'adjectives' }
    },
  },
  {
    id: 'conj-but',
    grammar: ['linking-words', 'any'],
    build: (maxLevel, topic) => {
      // "I like pizza but I don't eat bread."
      const { subj, kind } = pickSubject(maxLevel)
      const pair1 = pickObjAndVerb(maxLevel, topic)
      const pair2 = pickObjAndVerb(maxLevel, topic)
      if (!pair1 || !pair2) return null
      if (pair1.obj.en === pair2.obj.en) return null
      const en = `${capitalize(subj.en)} ${enVerbPresent(pair1.verb, kind)} ${pair1.obj.en} but ${subj.en} ${didntDoes(kind)} ${pair2.verb.base} ${pair2.obj.en}.`
      const ptSubj2 = ptSubjectDisplay(kind, subj) || subj.pt
      const pt = `${ptPrefix(kind, subj)}${ptVerbPresent(pair1.verb, kind)} ${pair1.obj.pt} mas ${ptSubj2} não ${ptVerbPresent(pair2.verb, kind)} ${pair2.obj.pt}.`
      return { en, pt, level: maxOf(subj, pair1.verb, pair1.obj, pair2.verb, pair2.obj), topic: pair1.obj.topic }
    },
  },
  {
    id: 'conj-and',
    grammar: ['linking-words', 'any'],
    build: (maxLevel, topic) => {
      // "She reads a book and drinks coffee."
      const { subj, kind } = pickSubject(maxLevel)
      const pair1 = pickObjAndVerb(maxLevel, topic)
      const pair2 = pickObjAndVerb(maxLevel, topic)
      if (!pair1 || !pair2) return null
      if (pair1.verb.base === pair2.verb.base && pair1.obj.en === pair2.obj.en) return null
      const en = `${capitalize(subj.en)} ${enVerbPresent(pair1.verb, kind)} ${pair1.obj.en} and ${enVerbPresent(pair2.verb, kind)} ${pair2.obj.en}.`
      const pt = `${ptPrefix(kind, subj)}${ptVerbPresent(pair1.verb, kind)} ${pair1.obj.pt} e ${ptVerbPresent(pair2.verb, kind)} ${pair2.obj.pt}.`
      return { en, pt, level: maxOf(subj, pair1.verb, pair1.obj, pair2.verb, pair2.obj), topic: pair1.obj.topic }
    },
  },
  {
    id: 'conj-so',
    grammar: ['linking-words', 'any'],
    build: (maxLevel) => {
      // "I am hungry so I eat bread."
      const { subj, kind } = pickSubject(maxLevel)
      const adj = pick(filterLevel(ADJECTIVES, maxLevel))
      const pair = pickObjAndVerb(maxLevel)
      if (!pair) return null
      const { obj, verb } = pair
      const en = `${capitalize(subj.en)} ${beEn(kind)} ${adj.en} so ${subj.en} ${enVerbPresent(verb, kind)} ${obj.en}.`
      const ptSubj2 = ptSubjectDisplay(kind, subj) || subj.pt
      const pt = `${ptPrefix(kind, subj)}${bePt(kind)} ${adj.pt} então ${ptSubj2} ${ptVerbPresent(verb, kind)} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, adj, verb, obj), topic: obj.topic }
    },
  },

  // ── Past Continuous ────────────────────────────────────
  {
    id: 'pastcont-svo',
    grammar: ['past-continuous', 'any'],
    build: (maxLevel, topic) => {
      const { subj, kind } = pickSubject(maxLevel)
      const pair = pickObjAndVerb(maxLevel, topic, { excludeStative: true })
      if (!pair) return null
      const { obj, verb } = pair
      const en = `${capitalize(subj.en)} ${wasEn(kind)} ${verb.ing} ${obj.en}.`
      const pt = `${ptPrefix(kind, subj)}${wasPt(kind)} ${verb.pt.ger} ${obj.pt}.`
      return { en, pt, level: maxOf(subj, verb, obj), topic: obj.topic }
    },
  },
  {
    id: 'pastcont-intr',
    grammar: ['past-continuous', 'any'],
    build: (maxLevel) => {
      const { subj, kind } = pickSubject(maxLevel)
      const verb = pick(filterLevel(VERBS.filter(v => !v.needsObj), maxLevel))
      const place = pick(filterLevel(PLACES, maxLevel))
      const en = `${capitalize(subj.en)} ${wasEn(kind)} ${verb.ing} ${place.en}.`
      const pt = `${ptPrefix(kind, subj)}${wasPt(kind)} ${verb.pt.ger} ${place.pt}.`
      return { en, pt, level: maxOf(subj, verb, place), topic: place.topic || 'places' }
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
