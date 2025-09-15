import { auth, db, storage } from './firebase-config.js';
import { doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- CAPTURA DE ELEMENTOS DO HTML ---
const profileForm = document.getElementById('profile-form');
const nicknameInput = document.getElementById('nickname');
const bioTextarea = document.getElementById('bio');
const platformCheckboxes = document.querySelectorAll('input[id^="platform-"]');
const gamesCheckboxesContainer = document.getElementById('games-checkboxes');
const profileImagePreview = document.getElementById('profile-image-preview');
const profileImageInput = document.getElementById('profile-image-input');
const uploadImageButton = document.getElementById('upload-image-button');

// --- FUNÇÕES ---

/**
 * Carrega os jogos do Firestore e cria os checkboxes.
 */
async function loadGamesForSelection() {
    try {
        const gamesCollection = collection(db, 'games');
        const snapshot = await getDocs(gamesCollection);
        
        gamesCheckboxesContainer.innerHTML = ''; // Limpa a lista
        snapshot.forEach(doc => {
            const game = doc.data();
            const gameId = doc.id;

            const checkboxDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `game-${gameId}`;
            checkbox.value = gameId;

            const label = document.createElement('label');
            label.htmlFor = `game-${gameId}`;
            label.textContent = game.nome;

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            gamesCheckboxesContainer.appendChild(checkboxDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar jogos:", error);
        gamesCheckboxesContainer.innerHTML = '<p>Erro ao carregar jogos.</p>';
    }
}

/**
 * Carrega os dados do perfil do usuário e preenche o formulário.
 */
async function loadProfileData(user) {
    if (!user) return;

    try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            nicknameInput.value = data.nickname || '';
            bioTextarea.value = data.bio || '';
            profileImagePreview.src = data.fotoURL || 'https://via.placeholder.com/150';

            if (data.plataformas) {
                platformCheckboxes.forEach(cb => {
                    cb.checked = data.plataformas.includes(cb.value);
                });
            }
            if (data.jogosFavoritos) {
                const gameCheckboxes = gamesCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
                gameCheckboxes.forEach(cb => {
                    cb.checked = data.jogosFavoritos.includes(cb.value);
                });
            }
        }
    } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
    }
}

// --- OUVINTES DE EVENTOS (EVENT LISTENERS) ---

// Salva os dados do formulário de texto
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        alert("Você precisa estar logado!");
        return;
    }

    const selectedPlatforms = Array.from(platformCheckboxes)
        .filter(cb => cb.checked).map(cb => cb.value);

    const selectedGames = Array.from(gamesCheckboxesContainer.querySelectorAll('input:checked'))
        .map(cb => cb.value);

    const profileData = {
        nickname: nicknameInput.value,
        bio: bioTextarea.value,
        plataformas: selectedPlatforms,
        jogosFavoritos: selectedGames
    };

    try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, profileData, { merge: true });
        alert("Perfil salvo com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        alert("Erro ao salvar o perfil.");
    }
});

// Lógica de upload de imagem (Aluno 4)
uploadImageButton.addEventListener('click', async () => {
    const user = auth.currentUser;
    const file = profileImageInput.files[0];

    if (!user) {
        alert("Você precisa estar logado para enviar uma foto.");
        return;
    }
    if (!file) {
        alert("Por favor, selecione uma imagem primeiro.");
        return;
    }

    const storageRef = ref(storage, `profile-pictures/${user.uid}`);
    
    try {
        alert("Enviando imagem...");
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { fotoURL: downloadURL }, { merge: true });

        profileImagePreview.src = downloadURL;
        alert("Foto de perfil atualizada com sucesso!");
    } catch (error) {
        console.error("Erro no upload da imagem:", error);
        alert("Ocorreu um erro ao enviar a imagem.");
    }
});

// --- INICIALIZAÇÃO ---

onAuthStateChanged(auth, async (user) => {
    if (user) {
        await loadGamesForSelection(); // Carrega os jogos
        await loadProfileData(user);   // Em seguida, carrega o perfil (para marcar os checkboxes)
    } else {
        // Redireciona para a página de login se não estiver logado
        alert("Você precisa estar logado para ver seu perfil.");
        window.location.href = 'index.html';
    }
});
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