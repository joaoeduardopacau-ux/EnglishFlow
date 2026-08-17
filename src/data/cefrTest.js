// Teste de nível CEFR - questões variadas de A1 a C2
// 20 questões (3-4 de cada nível)
export const CEFR_QUESTIONS = [
  // A1
  { level: 'A1', type: 'multiple', question: 'What ___ your name?', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { level: 'A1', type: 'multiple', question: 'She ___ from Brazil.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { level: 'A1', type: 'multiple', question: 'I have ___ apple.', options: ['a', 'an', 'the', '—'], correct: 1 },
  { level: 'A1', type: 'multiple', question: 'They ___ students.', options: ['is', 'are', 'am', 'be'], correct: 1 },

  // A2
  { level: 'A2', type: 'multiple', question: 'Yesterday I ___ to the beach.', options: ['go', 'goes', 'went', 'going'], correct: 2 },
  { level: 'A2', type: 'multiple', question: 'She ___ TV every evening.', options: ['watch', 'watches', 'watching', 'watched'], correct: 1 },
  { level: 'A2', type: 'multiple', question: 'There ___ some milk in the fridge.', options: ['is', 'are', 'have', 'has'], correct: 0 },
  { level: 'A2', type: 'multiple', question: 'How ___ apples do you want?', options: ['much', 'many', 'lot', 'few'], correct: 1 },

  // B1
  { level: 'B1', type: 'multiple', question: 'If I ___ more time, I would exercise.', options: ['have', 'had', 'will have', 'have had'], correct: 1 },
  { level: 'B1', type: 'multiple', question: 'She has been ___ for two hours.', options: ['study', 'studies', 'studying', 'studied'], correct: 2 },
  { level: 'B1', type: 'multiple', question: 'I ___ never been to Japan.', options: ['have', 'has', 'had', 'am'], correct: 0 },
  { level: 'B1', type: 'multiple', question: 'She said she ___ come to the party.', options: ['will', 'would', 'is', 'was'], correct: 1 },

  // B2
  { level: 'B2', type: 'multiple', question: 'By 2030, humans ___ on Mars.', options: ['will live', 'will be living', 'live', 'are living'], correct: 1 },
  { level: 'B2', type: 'multiple', question: 'The book ___ by millions of people.', options: ['read', 'is read', 'has read', 'was reading'], correct: 1 },
  { level: 'B2', type: 'multiple', question: 'I wish I ___ speak French fluently.', options: ['can', 'could', 'will', 'would'], correct: 1 },
  { level: 'B2', type: 'multiple', question: 'She insisted ___ paying for lunch.', options: ['at', 'in', 'on', 'for'], correct: 2 },

  // C1
  { level: 'C1', type: 'multiple', question: 'Had I ___ his advice, I wouldn\'t be in trouble.', options: ['take', 'took', 'taken', 'taking'], correct: 2 },
  { level: 'C1', type: 'multiple', question: 'Not only ___ he apologize, but he also paid for the damage.', options: ['did', 'has', 'was', 'is'], correct: 0 },

  // C2
  { level: 'C2', type: 'multiple', question: 'Were it not ___ your help, we wouldn\'t have succeeded.', options: ['by', 'for', 'to', 'with'], correct: 1 },
  { level: 'C2', type: 'multiple', question: 'The report needs ___ before submission.', options: ['proofread', 'proofreading', 'to proofread', 'proofreads'], correct: 1 },
]

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export const LEVEL_INFO = {
  A1: {
    label: 'Iniciante',
    color: 'from-emerald-500 to-teal-700',
    desc: 'Você pode entender e usar expressões familiares e frases básicas.',
    tips: 'Comece pelos Flashcards e pratique cumprimentos, números e cores.',
    emoji: '🌱',
  },
  A2: {
    label: 'Básico',
    color: 'from-teal-500 to-cyan-700',
    desc: 'Você consegue se comunicar em tarefas simples do dia a dia.',
    tips: 'Foque em passado simples, presente contínuo e vocabulário de rotina.',
    emoji: '🌿',
  },
  B1: {
    label: 'Intermediário',
    color: 'from-blue-500 to-indigo-700',
    desc: 'Você compreende textos claros sobre assuntos familiares.',
    tips: 'Pratique condicionais, present perfect e opinie sobre assuntos variados.',
    emoji: '🌳',
  },
  B2: {
    label: 'Intermediário Avançado',
    color: 'from-purple-500 to-fuchsia-700',
    desc: 'Você compreende ideias principais de textos complexos.',
    tips: 'Trabalhe com voz passiva, discurso indireto e vídeos autênticos.',
    emoji: '🎓',
  },
  C1: {
    label: 'Avançado',
    color: 'from-fuchsia-500 to-pink-700',
    desc: 'Você se expressa de forma fluente e espontânea.',
    tips: 'Assista séries sem legendas, leia livros, pratique escrita acadêmica.',
    emoji: '⭐',
  },
  C2: {
    label: 'Proficiente',
    color: 'from-yellow-500 to-orange-700',
    desc: 'Você entende praticamente tudo com facilidade.',
    tips: 'Você domina o inglês! Pratique nuances, dialetos e slang avançado.',
    emoji: '👑',
  },
}

export function calculateLevel(answers) {
  // Conta acertos por nível
  const byLevel = {}
  CEFR_QUESTIONS.forEach((q, i) => {
    if (!byLevel[q.level]) byLevel[q.level] = { total: 0, correct: 0 }
    byLevel[q.level].total++
    if (answers[i] === q.correct) byLevel[q.level].correct++
  })

  // Encontra o nível mais alto onde o usuário acertou pelo menos 60%
  let userLevel = 'A1'
  for (const level of LEVEL_ORDER) {
    if (!byLevel[level]) continue
    const rate = byLevel[level].correct / byLevel[level].total
    if (rate >= 0.6) {
      userLevel = level
    } else {
      break // não passou neste nível, para aqui
    }
  }

  const totalCorrect = Object.values(byLevel).reduce((s, l) => s + l.correct, 0)
  const totalQuestions = CEFR_QUESTIONS.length

  return {
    level: userLevel,
    byLevel,
    totalCorrect,
    totalQuestions,
    percentage: Math.round((totalCorrect / totalQuestions) * 100),
  }
}
