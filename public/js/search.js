// Etapa 3: Criando a Lógica (JavaScript)

// Importe as Ferramentas do Firebase
import { auth, db, storage } from './firebase-config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Importa a função para enviar pedido de amizade
import { sendFriendRequest } from './friends.js';

// --- ELEMENTOS DO DOM ---
const gameSelect = document.getElementById('game-select');
const searchButton = document.getElementById('search-button');
const searchResultsContainer = document.getElementById('search-results');

/**
 * Carrega o catálogo de jogos do Firestore e preenche o menu <select>.
 */
async function loadGames() {
    try {
        const gamesCollection = collection(db, 'games');
        const gamesSnapshot = await getDocs(gamesCollection);

        // Limpa a opção de "carregando"
        gameSelect.innerHTML = '<option value="">-- Selecione um jogo --</option>';

        // Para cada jogo no banco de dados, cria uma nova <option>
        gamesSnapshot.forEach(doc => {
            const game = doc.data();
            const option = document.createElement('option');
            option.value = doc.id; // O valor será o ID do documento do jogo
            option.textContent = game.nome; // O texto visível será o nome do jogo
            gameSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar os jogos:", error);
        gameSelect.innerHTML = '<option value="">-- Erro ao carregar jogos --</option>';
    }
}

/**
 * Busca por jogadores que tenham o jogo selecionado em seus 'jogosFavoritos'.
 */
async function searchPlayers() {
    // 1. Pegue o Jogo Selecionado
    const selectedGameId = gameSelect.value;

    // Limpa a área de resultados para remover buscas antigas
    searchResultsContainer.innerHTML = 'Buscando...';

    if (!selectedGameId) {
        searchResultsContainer.innerHTML = 'Por favor, selecione um jogo para buscar.';
        return;
    }

    try {
        // 2. Crie a Consulta (Query)
        const usersCollection = collection(db, 'users');
        const searchQuery = query(
            usersCollection,
            where('jogosFavoritos', 'array-contains', selectedGameId)
        );

        // 3. Execute a Busca
        const querySnapshot = await getDocs(searchQuery);

        // 4. Mostre os Resultados
        // Limpa novamente para exibir os novos resultados
        searchResultsContainer.innerHTML = '';

        if (querySnapshot.empty) {
            searchResultsContainer.innerHTML = '<p>Nenhum jogador encontrado para este jogo.</p>';
        } else {
            querySnapshot.forEach(doc => {
                const userData = doc.data();
                const userId = doc.id; // ID do usuário encontrado

                // Cria elementos HTML dinamicamente (um "card" para o jogador)
                const playerCard = document.createElement('div');
                playerCard.className = 'player-card'; // Adicione uma classe para estilização (CSS)

                const nicknameElement = document.createElement('h4');
                nicknameElement.textContent = userData.nickname;

                const bioElement = document.createElement('p');
                bioElement.textContent = userData.bio;

                // Cria o botão "Adicionar Amigo"
                const addFriendButton = document.createElement('button');
                addFriendButton.textContent = 'Adicionar Amigo';
                addFriendButton.dataset.userId = userId; // Armazena o ID do jogador no botão

                // Adiciona o evento de clique ao botão
                addFriendButton.addEventListener('click', () => {
                    sendFriendRequest(userId);
                });

                playerCard.appendChild(nicknameElement);
                playerCard.appendChild(bioElement);
                playerCard.appendChild(addFriendButton); // Adiciona o botão ao card

                // Adiciona o card na área de resultados
                searchResultsContainer.appendChild(playerCard);
            });
        }
    } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
        searchResultsContainer.innerHTML = '<p>Ocorreu um erro ao realizar a busca. Tente novamente.</p>';
    }
}


// --- INICIALIZAÇÃO E EVENTOS ---

// Adiciona o 'ouvinte' de evento para o botão de busca
searchButton.addEventListener('click', searchPlayers);

// Chama a função para carregar os jogos assim que a página carregar
document.addEventListener('DOMContentLoaded', loadGames);