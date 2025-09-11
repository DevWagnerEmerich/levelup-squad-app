// --- IMPORTAÇÕES ---
// Importa as ferramentas necessárias do Firebase (sem duplicatas)
import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// --- CAPTURA DE ELEMENTOS DO HTML ---
const profileForm = document.getElementById('profile-form');
const nicknameInput = document.getElementById('nickname');
const bioTextarea = document.getElementById('bio');
const platformCheckboxes = document.querySelectorAll('input[id^="platform-"]');
const gamesCheckboxesContainer = document.getElementById('games-checkboxes');
const hamburgerButton = document.getElementById('hamburger-button');
const gamesMenu = document.getElementById('games-menu');


// --- FUNÇÕES ---

/**
 * Escuta por mudanças na coleção 'games' e atualiza os checkboxes em tempo real.
 */
function listenForGamesChanges() {
    const gamesCollection = collection(db, 'games');

    onSnapshot(gamesCollection, (snapshot) => {
        gamesCheckboxesContainer.innerHTML = ''; // Limpa a lista para recriá-la
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

        // Após criar os checkboxes de jogos, carrega os dados do perfil do usuário
        // para marcar os que já foram salvos.
        if (auth.currentUser) {
            loadProfileData(auth.currentUser);
        }

    }, (error) => {
        console.error("Erro ao ouvir as mudanças nos jogos:", error);
        gamesCheckboxesContainer.innerHTML = '<li>Erro ao carregar jogos.</li>';
    });
}

/**
 * Carrega os dados do perfil do usuário logado e preenche o formulário.
 * @param {import("firebase/auth").User} user
 */
async function loadProfileData(user) {
    if (!user) return; // Se não houver usuário, não faz nada

    try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            nicknameInput.value = data.nickname || '';
            bioTextarea.value = data.bio || '';

            // Marca as plataformas salvas
            if (data.plataformas) {
                platformCheckboxes.forEach(checkbox => {
                    checkbox.checked = data.plataformas.includes(checkbox.value);
                });
            }

            // Marca os jogos favoritos salvos
            if (data.jogosFavoritos) {
                const gameCheckboxes = gamesCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
                gameCheckboxes.forEach(checkbox => {
                    checkbox.checked = data.jogosFavoritos.includes(checkbox.value);
                });
            }
        } else {
            console.log("Nenhum perfil encontrado para este usuário.");
        }
    } catch (error) {
        console.error("Erro ao carregar os dados do perfil:", error);
    }
}


// --- OUVINTES DE EVENTOS (EVENT LISTENERS) ---

// Controla a exibição do menu de jogos (sanduíche)
hamburgerButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Impede que o clique se propague e feche o menu
    gamesMenu.classList.toggle('active');
});

// Fecha o menu de jogos se o usuário clicar fora dele
window.addEventListener('click', () => {
    if (gamesMenu.classList.contains('active')) {
        gamesMenu.classList.remove('active');
    }
});

// Salva os dados do formulário no Firestore
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    const user = auth.currentUser;
    if (user) {
        // Coleta as plataformas selecionadas
        const selectedPlatforms = Array.from(platformCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Coleta os jogos selecionados
        const selectedGames = Array.from(gamesCheckboxesContainer.querySelectorAll('input:checked'))
            .map(checkbox => checkbox.value);

        // Monta o objeto com os dados do perfil
        const profileData = {
            nickname: nicknameInput.value,
            bio: bioTextarea.value,
            plataformas: selectedPlatforms,
            jogosFavoritos: selectedGames
        };

        try {
            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, profileData, { merge: true }); // 'merge: true' evita sobrescrever outros campos
            alert("Perfil salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar o perfil:", error);
            alert("Erro ao salvar o perfil. Tente novamente.");
        }
    } else {
        alert("Você precisa estar logado para salvar seu perfil.");
    }
});


// --- INICIALIZAÇÃO ---

// Inicia o monitoramento dos jogos no banco de dados
listenForGamesChanges();

// Verifica o estado de autenticação do usuário para carregar os dados
onAuthStateChanged(auth, (user) => {
    if (user) {
        // A função loadProfileData já é chamada dentro de listenForGamesChanges,
        // mas podemos chamar aqui também para garantir que os outros campos (nick, bio) carreguem rápido.
        loadProfileData(user);
    } else {
        console.log("Nenhum usuário logado. Formulário desabilitado.");
        // Opcional: você pode limpar o formulário ou desabilitar os campos aqui
    }
});