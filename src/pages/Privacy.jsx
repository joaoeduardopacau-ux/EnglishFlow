import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout title="Política de Privacidade" updated="19 de agosto de 2026">
      <p>
        O <strong>EnglishFlow</strong> respeita sua privacidade. Este documento explica
        de forma direta quais dados coletamos e como os usamos. Ao utilizar o app, você
        concorda com o que está descrito abaixo.
      </p>

      <h2>1. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Autenticação (Google Sign-in):</strong> nome, e-mail e foto de perfil
          fornecidos pelo Google quando você faz login. Usamos apenas para identificar
          sua conta e exibir seu perfil no app.
        </li>
        <li>
          <strong>Progresso de estudo:</strong> XP, streaks, palavras aprendidas,
          respostas em atividades, meta diária e conquistas. Ficam salvos no seu
          navegador (localStorage) e, se logado com Google, sincronizados no Firestore
          associados ao seu ID do Google.
        </li>
        <li>
          <strong>Preferências:</strong> tema visual, velocidade e voz do TTS, sons
          ligados/desligados. Salvos localmente no navegador.
        </li>
      </ul>

      <h2>2. O que <em>não</em> coletamos</h2>
      <ul>
        <li>Não coletamos áudio ou gravações de voz — o reconhecimento de fala roda
           100% no seu navegador via Web Speech API.</li>
        <li>Não usamos rastreadores publicitários.</li>
        <li>Não vendemos, alugamos ou compartilhamos seus dados com terceiros.</li>
      </ul>

      <h2>3. Serviços de terceiros</h2>
      <ul>
        <li><strong>Firebase (Google):</strong> autenticação e sincronização opcional
          do progresso. Sujeito à <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política do Google</a>.</li>
        <li><strong>YouTube:</strong> embed dos vídeos das músicas via <code>youtube-nocookie.com</code>,
          que só carrega cookies após você iniciar o vídeo.</li>
        <li><strong>Google Fonts:</strong> carrega as fontes Orbitron, Poppins e Permanent Marker.</li>
        <li><strong>Vercel:</strong> hospedagem do site.</li>
      </ul>

      <h2>4. Seus direitos (LGPD)</h2>
      <p>Você tem direito a, a qualquer momento:</p>
      <ul>
        <li>Exportar todo seu progresso (Configurações → Dados → Exportar).</li>
        <li>Apagar todos os seus dados (Configurações → Zona de perigo → Resetar).</li>
        <li>Fazer logout, que remove os dados de autenticação deste navegador.</li>
        <li>Pedir remoção da conta e dados sincronizados escrevendo pra
          <a href="mailto:contato@englishflow.app"> contato@englishflow.app</a>.</li>
      </ul>

      <h2>5. Cookies</h2>
      <p>
        Não usamos cookies próprios de tracking. As únicas coisas que ficam salvas
        no seu navegador são: (a) preferências e progresso em <code>localStorage</code>,
        e (b) cookies próprios do Google se você fizer login (necessários pra autenticação).
      </p>

      <h2>6. Menores de idade</h2>
      <p>
        O EnglishFlow é indicado para maiores de 13 anos. Menores devem usar o app
        com supervisão de um responsável.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Podemos atualizar esta política. Mudanças significativas serão avisadas na
        Home do app. A data no topo indica a última atualização.
      </p>

      <h2>8. Contato</h2>
      <p>
        Dúvidas ou solicitações: <a href="mailto:contato@englishflow.app">contato@englishflow.app</a>.
      </p>
    </LegalLayout>
  )
}
