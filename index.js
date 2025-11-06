// Array de cartões do jogo
const cards = [
  {
    imageUrl: "./assets/img01.png",
    isMalicious: true,
    feedbackMessage:
      "Sites de phishing tentam imitar páginas oficiais para roubar seus dados e dinheiro. Nunca confie em ofertas boas demais para serem verdade. URLs estranhas, erros de português ou preços irreais são alertas de golpe. Fechar o site é a melhor defesa.",
  },
  {
    imageUrl: "./assets/img02.png",
    isMalicious: false,
    feedbackMessage: "Esta é uma fonte legítima e verificada. Você pode entrar com suas credenciais com segurança. Recusar o login no site oficial e seguro do seu banco impede que você acesse suas finanças. Verifique sempre a URL antes de recusar.",
  },
  {
    imageUrl: "./assets/img03.png",
    isMalicious: true,
    feedbackMessage: "Exibir códigos de barras ou QR Codes de documentos de viagem (mesmo após usados) pode ser usado para adquirir informações pessoais. Postá-los pode expor seu nome, detalhes de voo e até possibilitar a clonagem do seu bilhete. Guarde para si!",
  },
  {
    imageUrl: "./assets/img04.png",
    isMalicious: true,
    feedbackMessage: "Divulgar que sua casa estará vazia por um longo período é um convite para roubos. O ideal é postar a foto das férias apenas ao voltar para casa.",
  },
  {
    imageUrl: "./assets/img05.png",
    isMalicious: true,
    feedbackMessage: "Nunca compartilhe dados sensíveis (celular, endereço) em comentários públicos. Isso previne assédio, golpes, stalking e riscos de privacidade. Use sempre a mensagem privada (DM).",
  },
  {
    imageUrl: "./assets/img06.png",
    isMalicious: true,
    feedbackMessage: "Publicar o print sem borrar o número de telefone viola a privacidade da pessoa. Sempre oculte informações pessoais (números, fotos e nomes) de terceiros antes de postar. Exposição de dados pessoais alheios pode gerar problemas de assédio, spam ou até processos.",
  },
  {
    imageUrl: "./assets/img07.png",
    isMalicious: true,
    feedbackMessage: "Senhas que usam nome, datas de aniversário ou sequências são facilmente quebradas. Recusar e criar uma senha complexa é fundamental para proteger sua conta e seus jogos. Continuar com essa senha fraca compromete sua conta na Steam. Se um hacker descobrir essa senha, ele pode tentar usá-la em seu e-mail ou outras redes sociais.",
  },
];

// Variáveis de Estado
let score = 0;
let currentCardIndex = 0;
let isProcessing = false;
let shuffledCards = [];

// Referências DOM
const introScreen = document.getElementById("introScreen");
const gameContainer = document.getElementById("gameContainer");
const startGameButton = document.getElementById("startGameButton");
const scoreDisplay = document.getElementById("scoreDisplay");
const cardImage = document.getElementById("cardImage");
const cardTitle = document.getElementById("cardTitle");
const feedbackMessage = document.getElementById("feedbackMessage");
const denyButton = document.getElementById("denyButton");
const confirmButton = document.getElementById("confirmButton");

// Referências do Modal de Imagem
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

// NOVAS REFERÊNCIAS DO MODAL DE FEEDBACK
const feedbackModal = document.getElementById("feedbackModal");
const feedbackContent = document.getElementById("feedbackContent");
const modalMessage = document.getElementById("modalMessage");
const advanceButton = document.getElementById("advanceButton");

// --- Funções Auxiliares ---

// Função auxiliar para embaralhar um array (Algoritmo Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Gera um índice aleatório entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    // Troca o elemento atual com o elemento aleatório
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// FUNÇÕES DO MODAL DE IMAGEM (abrir/fechar a imagem expandida)
function openModal() {
  // Usa o src da imagem atual do cartão
  modalImage.src = cardImage.src;
  imageModal.classList.remove("hidden");
}

function closeModal() {
  imageModal.classList.add("hidden");
}

// --- Funções do Jogo ---

function updateScore(points = 0) {
  score += points;
  scoreDisplay.textContent = `Pontuação: ${score}`;
}

// NOVO: Função para avançar para o próximo cartão
function advanceToNextCard() {
  feedbackModal.classList.add("hidden");
  currentCardIndex++;
  renderCard(currentCardIndex);
}

function renderCard(index) {
  if (index < shuffledCards.length) {
    // Usa o array embaralhado para obter o cartão atual
    const card = shuffledCards[index];

    cardImage.src = card.imageUrl;
    // Garante que os botões de ação estejam ativos
    denyButton.disabled = false;
    confirmButton.disabled = false;
    isProcessing = false;
  } else {
    // Fim do Jogo
    gameContainer.classList.add("hidden");
    introScreen.classList.remove("hidden");
    introScreen.innerHTML = `
            <h2 class="text-3xl font-bold mb-4 text-green-400">Fim do Teste!</h2>
            <p class="mb-6 text-2xl text-gray-300">Sua pontuação final é: <span class="font-extrabold text-white">${score}</span>/${cards.length}</p>
            <p class="mb-8 text-gray-400">Você conseguiu identificar a segurança dos conteúdos digitais? Tente novamente para melhorar!</p>
            <button id="restartGameButton" class="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                Jogar Novamente
            </button>
        `;
    document
      .getElementById("restartGameButton")
      .addEventListener("click", startGame);
  }
}

function handleChoice(isMalicious) {
  if (isProcessing) return; // Impede cliques múltiplos
  isProcessing = true;

  denyButton.disabled = true;
  confirmButton.disabled = true;

  const card = shuffledCards[currentCardIndex];
  const isCorrect = card.isMalicious === isMalicious;

  // 1. Exibir Feedback
  modalMessage.textContent = isCorrect ? "✅ ACERTOU! " : "❌ ERROU! ";
  modalMessage.textContent += card.feedbackMessage;
  modalMessage.classList.add("show");
  modalMessage.classList.remove("bg-yellow-500", "bg-red-500", "bg-green-500");

  if (isCorrect) {
    updateScore(1);
    modalMessage.classList.add("bg-green-500");
  } else {
    modalMessage.classList.add("bg-red-500");
  }

  // Mostra o Modal de Feedback
  feedbackModal.classList.remove("hidden");
  advanceButton.classList.add("hidden"); // Esconde o botão inicialmente
  advanceButton.disabled = true; // Desabilita para prevenir clique rápido

  // 2. Temporizador para Mostrar o Botão "Avançar"
  setTimeout(() => {
    advanceButton.classList.remove("hidden");
    advanceButton.disabled = false;
  }, 2500); // 2.5 segundos para o jogador ler o feedback
}

function startGame() {
  score = 0;
  currentCardIndex = 0;
  shuffledCards = shuffleArray(cards.slice());
  updateScore(0); // Reinicia a pontuação no display
  introScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  renderCard(currentCardIndex);
}

// --- Event Listeners ---
startGameButton.addEventListener("click", startGame);
denyButton.addEventListener("click", () => handleChoice(true));
confirmButton.addEventListener("click", () => handleChoice(false));
cardImage.addEventListener("click", openModal);

// NOVO EVENT LISTENER: Botão de Avançar no Modal
advanceButton.addEventListener("click", advanceToNextCard);

// Configuração inicial: garante que a tela inicial é visível ao carregar
window.onload = () => {
  introScreen.classList.remove("hidden");
  gameContainer.classList.add("hidden");
};
