// 30 prompts variados para o writing diário
export const WRITING_PROMPTS = [
  { id: 1, category: 'daily', emoji: '☀️', prompt: 'Describe your morning routine in detail.', hint: 'Try to use present simple: I wake up, I brush my teeth...' },
  { id: 2, category: 'travel', emoji: '✈️', prompt: 'Write about a place you would love to visit and why.', hint: 'Use "I would like to..." and describe with adjectives.' },
  { id: 3, category: 'food', emoji: '🍕', prompt: 'What is your favorite food? Describe it and explain why you love it.', hint: 'Use sensory words: delicious, crunchy, spicy...' },
  { id: 4, category: 'people', emoji: '👨‍👩‍👧', prompt: 'Describe someone who inspires you.', hint: 'Use adjectives for personality: kind, brave, hardworking...' },
  { id: 5, category: 'memories', emoji: '📸', prompt: 'Write about a happy memory from your childhood.', hint: 'Use past simple: I was, I went, I played...' },
  { id: 6, category: 'dreams', emoji: '💭', prompt: 'What are your goals for the next 5 years?', hint: 'Use future forms: I will, I am going to...' },
  { id: 7, category: 'hobbies', emoji: '🎨', prompt: 'What do you enjoy doing in your free time?', hint: 'Use gerunds: I enjoy reading, I love cooking...' },
  { id: 8, category: 'opinion', emoji: '💬', prompt: 'Do you prefer city life or country life? Why?', hint: 'Use comparatives: more peaceful, less crowded...' },
  { id: 9, category: 'daily', emoji: '🏢', prompt: 'Describe your ideal job.', hint: 'Talk about tasks, environment, and salary expectations.' },
  { id: 10, category: 'travel', emoji: '🗺️', prompt: 'Write about the best trip you have ever taken.', hint: 'Past tense: I traveled to, I visited, I saw...' },
  { id: 11, category: 'food', emoji: '👨‍🍳', prompt: 'Describe how to cook your favorite dish, step by step.', hint: 'Use imperatives: First, add... Then, mix...' },
  { id: 12, category: 'people', emoji: '👫', prompt: 'What makes a good friend?', hint: 'Use "should" and "must": A friend should be...' },
  { id: 13, category: 'memories', emoji: '🎓', prompt: 'Tell about your first day of school.', hint: 'Past continuous: I was feeling, everyone was talking...' },
  { id: 14, category: 'dreams', emoji: '🌟', prompt: 'If you could learn any skill instantly, what would it be?', hint: 'Second conditional: If I could, I would...' },
  { id: 15, category: 'hobbies', emoji: '📚', prompt: 'What is the last book, movie, or series you enjoyed? Why?', hint: 'Present perfect: I have just watched...' },
  { id: 16, category: 'opinion', emoji: '📱', prompt: 'What are the pros and cons of social media?', hint: 'Use linking words: On one hand... On the other hand...' },
  { id: 17, category: 'daily', emoji: '🌙', prompt: 'How do you relax after a long day?', hint: 'Present simple: I usually, I sometimes...' },
  { id: 18, category: 'travel', emoji: '🏝️', prompt: 'Describe your perfect vacation.', hint: 'Use "would" and vivid adjectives.' },
  { id: 19, category: 'people', emoji: '💼', prompt: 'Write about someone you admire in your career field.', hint: 'Talk about their achievements and qualities.' },
  { id: 20, category: 'dreams', emoji: '🏠', prompt: 'Describe your dream house.', hint: 'Use "there is / there are": There is a big garden...' },
  { id: 21, category: 'opinion', emoji: '🌱', prompt: 'How can we take better care of the environment?', hint: 'Use modal verbs: we should, we must, we can...' },
  { id: 22, category: 'hobbies', emoji: '🎵', prompt: 'What kind of music do you like? Describe your favorite artist.', hint: 'Use "I love / I hate / I don\'t mind" + genre.' },
  { id: 23, category: 'memories', emoji: '🎉', prompt: 'Describe the best birthday you have ever had.', hint: 'Past tense: It was, we had, my friends came...' },
  { id: 24, category: 'daily', emoji: '💪', prompt: 'What habit would you like to develop this year?', hint: 'Future forms: I am going to start, I will try to...' },
  { id: 25, category: 'travel', emoji: '🚗', prompt: 'Write about a road trip you would like to take.', hint: 'Use "would like to" and describe places and activities.' },
  { id: 26, category: 'food', emoji: '🥗', prompt: 'Are eating habits in your country healthy? Explain.', hint: 'Present simple + adverbs of frequency: We usually eat...' },
  { id: 27, category: 'dreams', emoji: '🚀', prompt: 'If you could travel to another planet, where would you go?', hint: 'Second conditional + descriptive vocabulary.' },
  { id: 28, category: 'opinion', emoji: '📺', prompt: 'What do you think about working from home?', hint: 'Use "I believe / I think / In my opinion".' },
  { id: 29, category: 'people', emoji: '❤️', prompt: 'Describe your best friend or partner.', hint: 'Use personality adjectives and give examples.' },
  { id: 30, category: 'daily', emoji: '⏰', prompt: 'What would you change about your daily routine?', hint: 'Use "I wish" or "I would like to change".' },
]

export function getPromptOfTheDay() {
  const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
  return WRITING_PROMPTS[day % WRITING_PROMPTS.length]
}

export function getRandomPrompt(excludeId) {
  const available = WRITING_PROMPTS.filter(p => p.id !== excludeId)
  return available[Math.floor(Math.random() * available.length)]
}
