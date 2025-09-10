// Importa as ferramentas necessárias do Firebase
import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Captura os elementos do HTML
const profileForm = document.getElementById('profile-form');
const nicknameInput = document.getElementById('nickname');
const bioTextarea = document.getElementById('bio');
const platformCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const gamesCheckboxesContainer = document.getElementById('games-checkboxes');
const hamburgerButton = document.getElementById('hamburger-button'); // Novo seletor
const gamesMenu = document.getElementById('games-menu'); // Novo seletor

/**
 * Escuta por mudanças na coleção 'games' e atualiza os checkboxes em tempo real.
 */
function listenForGamesChanges() {
    const gamesCollection = collection(db, 'games');

    onSnapshot(gamesCollection, (snapshot) => {
        gamesCheckboxesContainer.innerHTML = '';
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

        if (auth.currentUser) {
            loadProfileData(auth.currentUser);
        }

    }, (error) => {
        console.error("Erro ao ouvir as mudanças nos jogos:", error);
        gamesCheckboxesContainer.innerHTML = '<li>Erro ao carregar jogos.</li>';
    });
}

/**
 * Carrega os dados do perfil do usuário logado e marca os checkboxes correspondentes.
 * @param {import("firebase/auth").User} user
 */
async function loadProfileData(user) {
    if (user) {
        try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                nicknameInput.value = data.nickname || '';
                bioTextarea.value = data.bio || '';

                if (data.plataformas) {
                    platformCheckboxes.forEach(checkbox => {
                        if (checkbox.id.startsWith('platform-')) { // Garante que estamos selecionando os checkboxes de plataforma
                            checkbox.checked = data.plataformas.includes(checkbox.value);
                        }
                    });
                }

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
}

// --- OUVINTES DE EVENTOS (EVENT LISTENERS) ---

// Nova lógica para controlar a exibição do menu de jogos
hamburgerButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Impede que o clique feche o menu imediatamente
    gamesMenu.classList.toggle('active');
});

// Adiciona um ouvinte para fechar o menu se o usuário clicar fora dele
window.addEventListener('click', (event) => {
    if (!gamesMenu.contains(event.target) && !hamburgerButton.contains(event.target)) {
        gamesMenu.classList.remove('active');
    }
});


// Salva os dados do formulário (sem alterações aqui)
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
        const selectedPlatforms = Array.from(document.querySelectorAll('input[id^="platform-"]:checked'))
            .map(checkbox => checkbox.value);

        const selectedGames = Array.from(gamesCheckboxesContainer.querySelectorAll('input:checked'))
            .map(checkbox => checkbox.value);

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
            console.error("Erro ao salvar o perfil:", error);
            alert("Erro ao salvar o perfil. Tente novamente.");
        }
    } else {
        alert("Você precisa estar logado para salvar seu perfil.");
    }
});

// --- INICIALIZAÇÃO ---

listenForGamesChanges();

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadProfileData(user);
    } else {
        console.log("Nenhum usuário logado.");
    }
});