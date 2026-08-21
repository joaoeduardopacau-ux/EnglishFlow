import LegalLayout from './LegalLayout'

export default function Terms() {
  return (
    <LegalLayout title="Termos de Uso" updated="19 de agosto de 2026">
      <p>
        Bem-vindo ao <strong>EnglishFlow</strong>. Ao usar o app, você concorda com
        os termos abaixo. Leitura direta e sem letras miúdas.
      </p>

      <h2>1. O que é o EnglishFlow</h2>
      <p>
        Um app gratuito de prática de inglês com vocabulário, gramática, escuta, fala,
        escrita e músicas. Todo o conteúdo é meramente educativo e complementar — não
        substitui aulas com um professor.
      </p>

      <h2>2. Sua conta</h2>
      <ul>
        <li>Você é responsável por manter sua conta segura.</li>
        <li>Só uma pessoa por conta. Compartilhar conta não é permitido.</li>
        <li>Você pode encerrar sua conta a qualquer momento nas Configurações.</li>
      </ul>

      <h2>3. Uso adequado</h2>
      <p>Você concorda em <strong>não</strong>:</p>
      <ul>
        <li>Tentar burlar o sistema de progresso, XP ou conquistas.</li>
        <li>Fazer engenharia reversa, copiar ou distribuir o código do app.</li>
        <li>Enviar músicas com conteúdo protegido por direitos autorais que você
           não tenha permissão de compartilhar (o vídeo do YouTube é público, mas o
           link deve ser de conteúdo lícito).</li>
        <li>Usar o app para qualquer finalidade ilegal ou abusiva.</li>
      </ul>

      <h2>4. Conteúdo do usuário</h2>
      <p>
        Quando você adiciona uma música pessoal (Nova música), a letra e o link do
        YouTube ficam salvos apenas no seu navegador — nós não vemos nem armazenamos
        no servidor. Você é responsável pelo conteúdo que adicionar.
      </p>

      <h2>5. Propriedade intelectual</h2>
      <ul>
        <li>Marca, logo (lobo-guará) e design são de propriedade do EnglishFlow.</li>
        <li>Trechos de letras de músicas usadas para prática são citados sob
           uso educacional (fair use). Os direitos das letras pertencem aos autores.</li>
        <li>Traduções, exemplos e categorização do dicionário foram construídos pela
           equipe do EnglishFlow.</li>
      </ul>

      <h2>6. Serviço "como está"</h2>
      <p>
        Fazemos o melhor pra manter o app funcionando bem, mas ele é oferecido
        <em> "como está"</em>, sem garantias de disponibilidade contínua ou
        ausência de erros. Não somos responsáveis por perdas indiretas decorrentes
        do uso do app.
      </p>

      <h2>7. Modificações</h2>
      <p>
        Podemos alterar funcionalidades, remover ou adicionar recursos. Mudanças
        significativas serão anunciadas no app. A data no topo indica a última
        atualização destes termos.
      </p>

      <h2>8. Rescisão</h2>
      <p>
        Podemos suspender contas que violem estes termos. Você pode encerrar sua
        conta a qualquer momento.
      </p>

      <h2>9. Foro</h2>
      <p>
        Estes termos são regidos pelas leis do Brasil. Qualquer disputa deve
        ser resolvida no foro da comarca do domicílio do usuário.
      </p>

      <h2>10. Contato</h2>
      <p>
        Dúvidas: <a href="mailto:contato@englishflow.app">contato@englishflow.app</a>.
      </p>
    </LegalLayout>
  )
}
