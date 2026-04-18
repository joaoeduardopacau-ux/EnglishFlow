// Frases organizadas por nível — geradas a partir do dicionário
// A estrutura `words` quebra a frase em tokens (palavras + pontuação) para o SentenceBuilder.

function tokenize(sentence) {
  // Preserva pontuação como tokens separados
  return sentence.match(/[\w']+|[.,!?;:]/g) || []
}

const raw = [
  // ── Ini-1 ──
  ['I like apples and bananas.', 'Eu gosto de maçãs e bananas.', 'Ini-1', 'food'],
  ['The cat is sleeping on the sofa.', 'O gato está dormindo no sofá.', 'Ini-1', 'animals'],
  ['My dog is very friendly.', 'Meu cachorro é muito amigável.', 'Ini-1', 'animals'],
  ['She has long black hair.', 'Ela tem cabelo longo e preto.', 'Ini-1', 'body'],
  ['I drink coffee every morning.', 'Eu bebo café toda manhã.', 'Ini-1', 'food'],
  ['The sky is blue today.', 'O céu está azul hoje.', 'Ini-1', 'nature'],
  ['He is wearing a red shirt.', 'Ele está usando uma camisa vermelha.', 'Ini-1', 'clothes'],
  ['I go to school every day.', 'Eu vou para a escola todos os dias.', 'Ini-1', 'education'],
  ['My mother is a nurse.', 'Minha mãe é enfermeira.', 'Ini-1', 'family'],
  ['The sun is very hot.', 'O sol está muito quente.', 'Ini-1', 'nature'],
  ['I have two sisters.', 'Eu tenho duas irmãs.', 'Ini-1', 'family'],
  ['She reads a book every night.', 'Ela lê um livro toda noite.', 'Ini-1', 'verbs'],
  ['We eat rice and beans.', 'Nós comemos arroz e feijão.', 'Ini-1', 'food'],
  ['The door is open.', 'A porta está aberta.', 'Ini-1', 'house'],
  ['Please close the window.', 'Por favor, feche a janela.', 'Ini-1', 'house'],
  ['I am very happy today.', 'Eu estou muito feliz hoje.', 'Ini-1', 'adjectives'],
  ['She is a good student.', 'Ela é uma boa estudante.', 'Ini-1', 'education'],
  ['The children play in the park.', 'As crianças brincam no parque.', 'Ini-1', 'places'],
  ['I want to learn English.', 'Eu quero aprender inglês.', 'Ini-1', 'verbs'],
  ['He has a new car.', 'Ele tem um carro novo.', 'Ini-1', 'transport'],
  ['My father works every day.', 'Meu pai trabalha todos os dias.', 'Ini-1', 'family'],
  ['The baby is sleeping.', 'O bebê está dormindo.', 'Ini-1', 'family'],
  ['I love my family.', 'Eu amo minha família.', 'Ini-1', 'family'],
  ['The dog is in the garden.', 'O cachorro está no jardim.', 'Ini-1', 'house'],
  ['I need a glass of water.', 'Eu preciso de um copo de água.', 'Ini-1', 'food'],
  ['She walks to work every day.', 'Ela caminha para o trabalho todo dia.', 'Ini-1', 'verbs'],
  ['The book is on the table.', 'O livro está em cima da mesa.', 'Ini-1', 'house'],
  ['I have three cats at home.', 'Eu tenho três gatos em casa.', 'Ini-1', 'animals'],
  ['Today is Monday.', 'Hoje é segunda-feira.', 'Ini-1', 'time'],
  ['It is raining outside.', 'Está chovendo lá fora.', 'Ini-1', 'nature'],
  ['I am hungry and thirsty.', 'Eu estou com fome e sede.', 'Ini-1', 'adjectives'],
  ['She buys bread at the store.', 'Ela compra pão na loja.', 'Ini-1', 'food'],
  ['The teacher is very kind.', 'O professor é muito gentil.', 'Ini-1', 'education'],
  ['My brother plays football.', 'Meu irmão joga futebol.', 'Ini-1', 'sports'],
  ['I can see the moon tonight.', 'Eu consigo ver a lua hoje à noite.', 'Ini-1', 'nature'],
  ['The flowers are beautiful.', 'As flores são lindas.', 'Ini-1', 'nature'],
  ['I wake up at seven.', 'Eu acordo às sete.', 'Ini-1', 'time'],
  ['She sings very well.', 'Ela canta muito bem.', 'Ini-1', 'verbs'],
  ['He is tall and strong.', 'Ele é alto e forte.', 'Ini-1', 'adjectives'],
  ['We watch TV in the evening.', 'Nós assistimos TV à noite.', 'Ini-1', 'verbs'],

  // ── Inter-2 (ex-A2) ──
  ['I usually wake up at seven in the morning.', 'Eu geralmente acordo às sete da manhã.', 'Inter-2', 'time'],
  ['She is studying English at the university.', 'Ela está estudando inglês na universidade.', 'Inter-2', 'education'],
  ['We went to the beach last weekend.', 'Nós fomos à praia no fim de semana passado.', 'Inter-2', 'places'],
  ['He wants to become a doctor.', 'Ele quer se tornar um médico.', 'Inter-2', 'work'],
  ['The children are playing in the garden.', 'As crianças estão brincando no jardim.', 'Inter-2', 'house'],
  ['I have never been to Paris.', 'Eu nunca estive em Paris.', 'Inter-2', 'places'],
  ['She bought a beautiful dress yesterday.', 'Ela comprou um vestido lindo ontem.', 'Inter-2', 'clothes'],
  ['My brother is better at math than me.', 'Meu irmão é melhor em matemática do que eu.', 'Inter-2', 'education'],
  ['We should exercise every day.', 'Nós deveríamos nos exercitar todos os dias.', 'Inter-2', 'health'],
  ['He is the tallest in his class.', 'Ele é o mais alto da turma.', 'Inter-2', 'adjectives'],
  ['I forgot my keys at the office.', 'Eu esqueci minhas chaves no escritório.', 'Inter-2', 'verbs'],
  ['She loves traveling to new countries.', 'Ela adora viajar para novos países.', 'Inter-2', 'hobbies'],
  ['The movie starts at eight o\'clock.', 'O filme começa às oito horas.', 'Inter-2', 'time'],
  ['We need to leave in five minutes.', 'Nós precisamos sair em cinco minutos.', 'Inter-2', 'time'],
  ['He has been working here for ten years.', 'Ele trabalha aqui há dez anos.', 'Inter-2', 'work'],
  ['Could you help me with this problem?', 'Você poderia me ajudar com este problema?', 'Inter-2', 'verbs'],
  ['The weather is getting colder.', 'O tempo está ficando mais frio.', 'Inter-2', 'nature'],
  ['I prefer tea rather than coffee.', 'Eu prefiro chá ao invés de café.', 'Inter-2', 'food'],
  ['She speaks three languages fluently.', 'Ela fala três idiomas fluentemente.', 'Inter-2', 'education'],
  ['The restaurant was expensive but delicious.', 'O restaurante era caro mas delicioso.', 'Inter-2', 'food'],
  ['I am looking for a new job.', 'Eu estou procurando um novo emprego.', 'Inter-2', 'work'],
  ['We took a lot of photos on our trip.', 'Nós tiramos muitas fotos na nossa viagem.', 'Inter-2', 'verbs'],
  ['She is wearing a pretty necklace.', 'Ela está usando um colar bonito.', 'Inter-2', 'clothes'],
  ['The train is arriving in ten minutes.', 'O trem está chegando em dez minutos.', 'Inter-2', 'transport'],
  ['I have to finish my homework tonight.', 'Eu tenho que terminar meu dever de casa hoje à noite.', 'Inter-2', 'education'],
  ['He used to play the guitar when he was young.', 'Ele costumava tocar violão quando era jovem.', 'Inter-2', 'hobbies'],
  ['We had a great time at the party.', 'Nós nos divertimos muito na festa.', 'Inter-2', 'verbs'],
  ['She is much better at cooking than me.', 'Ela cozinha muito melhor do que eu.', 'Inter-2', 'hobbies'],
  ['The book was interesting but a bit long.', 'O livro era interessante mas um pouco longo.', 'Inter-2', 'adjectives'],
  ['I will call you when I arrive home.', 'Eu vou te ligar quando chegar em casa.', 'Inter-2', 'verbs'],
  ['He goes to the gym three times a week.', 'Ele vai à academia três vezes por semana.', 'Inter-2', 'sports'],
  ['My grandmother makes the best food.', 'Minha avó faz a melhor comida.', 'Inter-2', 'family'],
  ['We should protect the environment.', 'Nós devemos proteger o meio ambiente.', 'Inter-2', 'nature'],
  ['I bought this phone two years ago.', 'Eu comprei este telefone há dois anos.', 'Inter-2', 'technology'],
  ['She is afraid of flying on planes.', 'Ela tem medo de voar de avião.', 'Inter-2', 'transport'],
  ['The test was easier than I expected.', 'O teste foi mais fácil do que eu esperava.', 'Inter-2', 'education'],
  ['Please send me an email with the details.', 'Por favor, envie-me um email com os detalhes.', 'Inter-2', 'technology'],
  ['I enjoy listening to music while working.', 'Eu gosto de ouvir música enquanto trabalho.', 'Inter-2', 'hobbies'],
  ['The hotel was clean and comfortable.', 'O hotel estava limpo e confortável.', 'Inter-2', 'places'],
  ['Don\'t forget to take your umbrella.', 'Não esqueça de pegar o seu guarda-chuva.', 'Inter-2', 'nature'],

  // ── Inter-2 (ex-B1) ──
  ['If I had more time, I would travel around the world.', 'Se eu tivesse mais tempo, viajaria pelo mundo.', 'Inter-2', 'verbs'],
  ['Although it was raining, we decided to go for a walk.', 'Embora estivesse chovendo, decidimos ir caminhar.', 'Inter-2', 'grammar'],
  ['She has been learning English for three years now.', 'Ela está aprendendo inglês há três anos.', 'Inter-2', 'education'],
  ['The meeting was postponed until next Monday.', 'A reunião foi adiada para a próxima segunda-feira.', 'Inter-2', 'work'],
  ['I wish I could speak more languages.', 'Eu queria poder falar mais idiomas.', 'Inter-2', 'education'],
  ['Technology has changed our lives completely.', 'A tecnologia mudou nossas vidas completamente.', 'Inter-2', 'technology'],
  ['He is responsible for the entire project.', 'Ele é responsável pelo projeto inteiro.', 'Inter-2', 'work'],
  ['We should try to reduce pollution in our cities.', 'Nós deveríamos tentar reduzir a poluição nas nossas cidades.', 'Inter-2', 'nature'],
  ['The government announced new rules yesterday.', 'O governo anunciou novas regras ontem.', 'Inter-2', 'society'],
  ['In my opinion, education is the key to success.', 'Na minha opinião, a educação é a chave para o sucesso.', 'Inter-2', 'education'],
  ['She has recently moved to a new apartment.', 'Ela se mudou recentemente para um novo apartamento.', 'Inter-2', 'places'],
  ['The restaurant is famous for its traditional food.', 'O restaurante é famoso pela sua comida tradicional.', 'Inter-2', 'food'],
  ['I find it difficult to wake up early.', 'Eu acho difícil acordar cedo.', 'Inter-2', 'time'],
  ['He finally achieved his dream of becoming a writer.', 'Ele finalmente realizou seu sonho de ser escritor.', 'Inter-2', 'work'],
  ['The weather forecast predicts heavy rain tomorrow.', 'A previsão do tempo indica chuva forte amanhã.', 'Inter-2', 'nature'],
  ['She has decided to study abroad next year.', 'Ela decidiu estudar fora no próximo ano.', 'Inter-2', 'education'],
  ['We were surprised by the unexpected news.', 'Nós ficamos surpresos com as notícias inesperadas.', 'Inter-2', 'adjectives'],
  ['This app helps me practice English every day.', 'Este aplicativo me ajuda a praticar inglês todos os dias.', 'Inter-2', 'technology'],
  ['You should always be honest with your friends.', 'Você deve sempre ser honesto com seus amigos.', 'Inter-2', 'family'],
  ['The children were excited about the trip.', 'As crianças estavam animadas com a viagem.', 'Inter-2', 'family'],
  ['If you practice regularly, you will improve quickly.', 'Se você praticar regularmente, vai melhorar rapidamente.', 'Inter-2', 'education'],
  ['Most people agree that exercise is important.', 'A maioria das pessoas concorda que exercício é importante.', 'Inter-2', 'health'],
  ['She would rather stay home than go out tonight.', 'Ela prefere ficar em casa do que sair hoje à noite.', 'Inter-2', 'verbs'],
  ['The company has hired many new employees this year.', 'A empresa contratou muitos novos funcionários este ano.', 'Inter-2', 'work'],
  ['I think we need to find a better solution.', 'Eu acho que precisamos encontrar uma solução melhor.', 'Inter-2', 'verbs'],
  ['Learning a new language takes time and patience.', 'Aprender um novo idioma leva tempo e paciência.', 'Inter-2', 'education'],
  ['He asked me whether I wanted to join them.', 'Ele me perguntou se eu queria me juntar a eles.', 'Inter-2', 'grammar'],
  ['Despite the difficulties, she never gave up.', 'Apesar das dificuldades, ela nunca desistiu.', 'Inter-2', 'grammar'],
  ['The museum is open every day except Mondays.', 'O museu abre todos os dias, exceto às segundas.', 'Inter-2', 'places'],
  ['They have been married for twenty years.', 'Eles estão casados há vinte anos.', 'Inter-2', 'family'],
  ['It is important to respect different cultures.', 'É importante respeitar culturas diferentes.', 'Inter-2', 'society'],
  ['I would love to visit Japan someday.', 'Eu adoraria visitar o Japão algum dia.', 'Inter-2', 'places'],
  ['He is known for his honesty and hard work.', 'Ele é conhecido pela sua honestidade e trabalho duro.', 'Inter-2', 'adjectives'],
  ['We must take care of our planet.', 'Nós devemos cuidar do nosso planeta.', 'Inter-2', 'nature'],
  ['The presentation was clear and well organized.', 'A apresentação estava clara e bem organizada.', 'Inter-2', 'work'],
  ['I can\'t believe how fast the time passes.', 'Eu não acredito o quão rápido o tempo passa.', 'Inter-2', 'time'],
  ['She has a strong passion for photography.', 'Ela tem uma grande paixão pela fotografia.', 'Inter-2', 'hobbies'],
  ['The traffic was terrible this morning.', 'O trânsito estava terrível esta manhã.', 'Inter-2', 'transport'],
  ['We are planning a surprise party for her birthday.', 'Nós estamos planejando uma festa surpresa para o aniversário dela.', 'Inter-2', 'family'],
  ['Reading books is a great way to relax.', 'Ler livros é uma ótima maneira de relaxar.', 'Inter-2', 'hobbies'],

  // ── Avanc-3 ──
  ['Despite the fact that she was tired, she finished the marathon.', 'Apesar de estar cansada, ela terminou a maratona.', 'Avanc-3', 'sports'],
  ['Had I known about the meeting, I would have attended.', 'Se eu soubesse sobre a reunião, teria comparecido.', 'Avanc-3', 'grammar'],
  ['The research suggests that meditation reduces anxiety.', 'A pesquisa sugere que a meditação reduz a ansiedade.', 'Avanc-3', 'health'],
  ['It is widely believed that exercise improves mental health.', 'É amplamente aceito que o exercício melhora a saúde mental.', 'Avanc-3', 'health'],
  ['She not only speaks English but also writes it fluently.', 'Ela não só fala inglês, como também o escreve fluentemente.', 'Avanc-3', 'grammar'],
  ['The decision was made after careful consideration.', 'A decisão foi tomada após cuidadosa consideração.', 'Avanc-3', 'work'],
  ['By the time we arrived, the party had already ended.', 'Quando chegamos, a festa já havia terminado.', 'Avanc-3', 'time'],
  ['The author, whose books I admire, will visit the city.', 'O autor, cujos livros eu admiro, visitará a cidade.', 'Avanc-3', 'grammar'],
  ['Climate change is one of the greatest challenges of our time.', 'A mudança climática é um dos maiores desafios do nosso tempo.', 'Avanc-3', 'nature'],
  ['If only I had studied harder for the exam.', 'Se ao menos eu tivesse estudado mais para a prova.', 'Avanc-3', 'grammar'],
  ['She is considered one of the most talented artists of her generation.', 'Ela é considerada uma das artistas mais talentosas de sua geração.', 'Avanc-3', 'society'],
  ['The new policy will take effect from next month.', 'A nova política entrará em vigor a partir do próximo mês.', 'Avanc-3', 'society'],
  ['He managed to convince everyone with his argument.', 'Ele conseguiu convencer todos com seu argumento.', 'Avanc-3', 'verbs'],
  ['The novel explores themes of love and loss.', 'O romance explora temas de amor e perda.', 'Avanc-3', 'hobbies'],
  ['Technology is evolving at an unprecedented pace.', 'A tecnologia está evoluindo em um ritmo sem precedentes.', 'Avanc-3', 'technology'],
  ['Whether you like it or not, change is inevitable.', 'Gostando ou não, a mudança é inevitável.', 'Avanc-3', 'grammar'],
  ['She handled the difficult situation with grace and patience.', 'Ela lidou com a situação difícil com graça e paciência.', 'Avanc-3', 'adjectives'],
  ['The project was completed ahead of schedule.', 'O projeto foi concluído antes do prazo.', 'Avanc-3', 'work'],
  ['Our understanding of the universe continues to expand.', 'Nossa compreensão do universo continua a expandir.', 'Avanc-3', 'nature'],
  ['He prefers working independently rather than in a team.', 'Ele prefere trabalhar de forma independente a trabalhar em equipe.', 'Avanc-3', 'work'],
]

// Curated seed sentences — hand-written, reliable for basic FillBlank.
export const sentences = raw.map((r, i) => ({
  id: i + 1,
  english: r[0],
  portuguese: r[1],
  level: r[2],
  topic: r[3],
  words: tokenize(r[0]),
}))

// Dynamic generator — produces unlimited variety from templates + POS-tagged pools.
import { generateSentence, generateSentences, shuffleWords as genShuffle } from '../utils/sentenceGenerator'

// Mix: 30% curated seed sentences, 70% freshly generated.
// Curated sentences are only used when the grammar focus is "any" — when the
// user has picked a specific tense/type, we always go through the generator
// so the structure actually matches what they want to practice.
export function getRandomSentence(level = 'all', topic = 'all', grammar = 'any') {
  const useCurated = grammar === 'any' && Math.random() < 0.3
  if (useCurated) {
    let pool = [...sentences]
    if (level && level !== 'all') pool = pool.filter(s => s.level === level)
    if (topic && topic !== 'all') pool = pool.filter(s => s.topic === topic)
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)]
  }
  return generateSentence({ level, topic, grammar })
}

export function getRandomSentences(n = 5, level = 'all', topic = 'all', grammar = 'any') {
  return generateSentences(n, { level, topic, grammar })
}

export const shuffleWords = genShuffle
