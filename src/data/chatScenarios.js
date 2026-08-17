// Cenários de conversação com respostas pré-definidas
// Simula um chatbot funcional sem depender de API externa

export const SCENARIOS = [
  {
    id: 'restaurant',
    title: 'No Restaurante',
    emoji: '🍽️',
    color: 'from-orange-500 to-red-700',
    description: 'Praticar pedidos, dúvidas sobre o menu e pagamento',
    level: 'A2',
    intro: 'Welcome to our restaurant! I\'m your waiter. How may I help you today?',
    context: 'Você chegou a um restaurante inglês. Um garçom vai te atender.',
    tips: ['Use "I would like..." para pedir', 'Pergunte "Could I have the bill, please?"', 'Diga "Thank you" ao final'],
    responses: [
      { keywords: ['menu', 'see menu', 'read menu'], reply: 'Of course! Here you go. Our specials today are the grilled salmon and the vegetarian pasta. Would you like something to drink first?' },
      { keywords: ['drink', 'water', 'juice', 'coffee', 'tea'], reply: 'Great choice! Would you like still or sparkling water? We also have fresh orange juice.' },
      { keywords: ['order', 'want', 'like', 'take'], reply: 'Excellent! Would you like anything else? Maybe a starter or a dessert?' },
      { keywords: ['bill', 'check', 'pay'], reply: 'Certainly! Your total is $35. How would you like to pay? Cash or card?' },
      { keywords: ['card', 'credit'], reply: 'Perfect, I\'ll bring the card machine right away. Was everything to your satisfaction?' },
      { keywords: ['thank', 'thanks'], reply: 'You\'re very welcome! Have a wonderful day and we hope to see you again soon!' },
      { keywords: ['good', 'great', 'delicious', 'nice'], reply: 'I\'m so glad you enjoyed it! I\'ll let the chef know.' },
      { keywords: ['pizza', 'pasta', 'salmon', 'chicken', 'steak'], reply: 'Excellent choice! Would you like anything to drink with that?' },
      { keywords: ['recommend', 'suggestion'], reply: 'I highly recommend our chef\'s special today - it\'s a grilled salmon with lemon butter sauce. Very popular!' },
    ],
    defaultReply: 'I\'m sorry, could you repeat that please? Maybe try phrases like "I would like...", "Can I have...", or "The bill, please".',
  },
  {
    id: 'airport',
    title: 'No Aeroporto',
    emoji: '✈️',
    color: 'from-cyan-500 to-blue-800',
    description: 'Check-in, imigração, achar seu portão',
    level: 'A2',
    intro: 'Hello! Welcome to the airport. May I see your passport and ticket, please?',
    context: 'Você está fazendo check-in no aeroporto para uma viagem internacional.',
    tips: ['"Here you go" ao entregar algo', 'Pergunte "Where is gate...?" para o portão', 'Diga "Aisle" ou "Window" para o assento'],
    responses: [
      { keywords: ['passport', 'here', 'ticket'], reply: 'Thank you! Are you checking any bags today?' },
      { keywords: ['bag', 'luggage', 'yes'], reply: 'Please place your bag on the scale. How many bags in total?' },
      { keywords: ['no', 'carry on', 'only'], reply: 'Perfect, just carry-on then. Would you prefer an aisle or window seat?' },
      { keywords: ['window', 'aisle', 'middle'], reply: 'Great choice! Your seat is 15A. Boarding starts at gate 42 at 3:30 PM.' },
      { keywords: ['gate', 'where'], reply: 'Your boarding gate is 42. Just follow the signs after security. It\'s about a 10-minute walk.' },
      { keywords: ['security', 'check'], reply: 'Security is straight ahead. Please have your boarding pass and ID ready. Remove electronics from your bag.' },
      { keywords: ['time', 'when', 'flight'], reply: 'Your flight departs at 4:15 PM. Boarding begins 45 minutes before, so around 3:30.' },
      { keywords: ['thank', 'thanks'], reply: 'You\'re welcome! Have a safe flight!' },
      { keywords: ['delay', 'late'], reply: 'Yes, unfortunately your flight is delayed by 30 minutes due to weather. New departure time is 4:45 PM.' },
    ],
    defaultReply: 'Sorry, I didn\'t catch that. You can ask about your gate, seat, luggage, or flight time.',
  },
  {
    id: 'interview',
    title: 'Entrevista de Emprego',
    emoji: '💼',
    color: 'from-slate-600 to-gray-900',
    description: 'Praticar entrevistas profissionais em inglês',
    level: 'B1',
    intro: 'Good morning! Thank you for coming in today. Please, have a seat. So, tell me a little about yourself.',
    context: 'Você está numa entrevista de emprego. Seja formal e profissional.',
    tips: ['Use tempos verbais corretos', 'Fale sobre suas experiências', 'Faça perguntas ao final'],
    responses: [
      { keywords: ['my name', 'i am', 'i\'m'], reply: 'Nice to meet you! Can you tell me about your professional background?' },
      { keywords: ['work', 'job', 'company', 'experience'], reply: 'Interesting! What are your main responsibilities in your current role?' },
      { keywords: ['responsib', 'manage', 'lead', 'do'], reply: 'That sounds impressive. What would you say is your greatest professional achievement?' },
      { keywords: ['achieve', 'success', 'proud', 'won'], reply: 'Wonderful! And why are you interested in this position specifically?' },
      { keywords: ['interested', 'because', 'want', 'looking'], reply: 'Great! What are your salary expectations?' },
      { keywords: ['salary', 'expect', 'pay', 'money'], reply: 'Understood. Do you have any questions for us?' },
      { keywords: ['question', 'ask', 'wonder', 'curious'], reply: 'That\'s a great question! We offer flexible hours, remote work options, and continuous training. Is there anything else?' },
      { keywords: ['thank', 'thanks'], reply: 'You\'re welcome! We\'ll be in touch within a week. Have a great day!' },
      { keywords: ['strength', 'good at'], reply: 'Those are excellent strengths. What about areas you\'d like to improve?' },
      { keywords: ['weakness', 'improve'], reply: 'Self-awareness is a great trait. How do you handle challenges or stress at work?' },
    ],
    defaultReply: 'Could you elaborate on that? Feel free to talk about your experience, skills, or goals.',
  },
  {
    id: 'shopping',
    title: 'Fazendo Compras',
    emoji: '🛍️',
    color: 'from-pink-500 to-fuchsia-800',
    description: 'Comprar roupas, pedir tamanhos, pagar',
    level: 'A2',
    intro: 'Hi there! Welcome to our store. Can I help you find anything today?',
    context: 'Você está numa loja de roupas e precisa comprar algo.',
    tips: ['Peça tamanho: "small/medium/large"', 'Use "How much is this?"', 'Diga "I\'ll take it" para comprar'],
    responses: [
      { keywords: ['look', 'looking', 'need'], reply: 'What are you looking for? We have great deals on jackets, shirts, and jeans today!' },
      { keywords: ['shirt', 'jacket', 'jeans', 'dress', 'pants'], reply: 'Excellent! What size do you wear?' },
      { keywords: ['small', 'medium', 'large', 'xl', 'size'], reply: 'Perfect! What color would you like? We have black, white, blue, and red.' },
      { keywords: ['color', 'black', 'white', 'blue', 'red', 'green'], reply: 'Great choice! Would you like to try it on? The fitting room is right there.' },
      { keywords: ['try', 'fitting'], reply: 'Take your time! Let me know if you need a different size or color.' },
      { keywords: ['take it', 'buy', 'this one'], reply: 'Wonderful! Would you like anything else? We\'re having a 20% off sale on accessories.' },
      { keywords: ['how much', 'price', 'cost'], reply: 'That will be $49.99. Would you like to pay in cash or card?' },
      { keywords: ['card', 'credit', 'debit'], reply: 'Perfect! Please insert your card here. Would you like a receipt?' },
      { keywords: ['thank', 'thanks'], reply: 'Thank you for shopping with us! Have a wonderful day!' },
      { keywords: ['discount', 'cheaper', 'sale'], reply: 'This item is already 15% off! We also have a buy-one-get-one deal on t-shirts.' },
    ],
    defaultReply: 'Sorry, I\'m not sure I understand. Try asking about sizes, colors, prices, or the fitting room.',
  },
  {
    id: 'hotel',
    title: 'Check-in Hotel',
    emoji: '🏨',
    color: 'from-purple-500 to-violet-800',
    description: 'Fazer check-in, pedir serviços do quarto',
    level: 'A2',
    intro: 'Good evening! Welcome to Grand Hotel. Do you have a reservation?',
    context: 'Você chegou num hotel e precisa fazer check-in.',
    tips: ['Diga "I have a reservation under..."', 'Peça "wifi password" para internet', 'Use "What time is breakfast?"'],
    responses: [
      { keywords: ['reservation', 'booked', 'have', 'yes'], reply: 'Great! Could I have your name and ID, please?' },
      { keywords: ['my name', 'i am', 'here'], reply: 'Thank you! I found your reservation. You\'ll be in room 305 for 3 nights. Here\'s your key card.' },
      { keywords: ['wifi', 'internet', 'password'], reply: 'Of course! The password is "welcome2024". You\'ll find it in the room information binder as well.' },
      { keywords: ['breakfast', 'restaurant', 'eat'], reply: 'Breakfast is served from 7 AM to 10 AM in the main restaurant on the ground floor. It\'s included in your rate.' },
      { keywords: ['pool', 'gym', 'spa'], reply: 'Our pool is on the 5th floor, open from 6 AM to 10 PM. The gym is 24/7 with your key card.' },
      { keywords: ['check out', 'checkout', 'leave'], reply: 'Check-out is at 11 AM. If you need late check-out, please let us know 24 hours in advance.' },
      { keywords: ['room service', 'food', 'order'], reply: 'Room service is available 24 hours. You can order from the menu in your room or dial 5 from your phone.' },
      { keywords: ['thank', 'thanks'], reply: 'You\'re very welcome! Enjoy your stay and let us know if you need anything!' },
      { keywords: ['taxi', 'airport', 'transport'], reply: 'We can arrange a taxi for you. It\'s $30 to the airport. Would you like to schedule one?' },
    ],
    defaultReply: 'I\'m sorry, could you clarify? You can ask about your room, breakfast, wifi, or hotel facilities.',
  },
]

// Encontra a melhor resposta baseada em keywords
export function findResponse(userMessage, scenario) {
  const lower = userMessage.toLowerCase()

  // Procura por match de keywords
  const matches = scenario.responses.map(r => ({
    ...r,
    matchCount: r.keywords.filter(k => lower.includes(k)).length,
  })).filter(r => r.matchCount > 0)

  if (matches.length > 0) {
    // Ordena por número de matches (mais matches = mais relevante)
    matches.sort((a, b) => b.matchCount - a.matchCount)
    return matches[0].reply
  }

  return scenario.defaultReply
}
