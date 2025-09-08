// Importa as ferramentas necessárias do Firebase
import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Captura o formulário e os campos do HTML
const profileForm = document.getElementById('profile-form');
const nicknameInput = document.getElementById('nickname');
const bioTextarea = document.getElementById('bio');
const platformCheckboxes = document.querySelectorAll('input[type="checkbox"]');

// Função para carregar os dados do perfil quando a página é acessada
async function loadProfileData(user) {
    if (user) {
        try {
            // Cria a referência ao documento do usuário
            const docRef = doc(db, 'users', user.uid);
            // Lê o documento do Firestore
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Preenche os campos do formulário com os dados salvos
                nicknameInput.value = data.nickname || '';
                bioTextarea.value = data.bio || '';

                // Preenche as checkboxes
                if (data.platforms) {
                    platformCheckboxes.forEach(checkbox => {
                        checkbox.checked = data.platforms.includes(checkbox.value);
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

// Ouve o estado de autenticação para carregar os dados do usuário logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadProfileData(user);
    } else {
        // Se não houver usuário logado, você pode redirecioná-lo ou mostrar uma mensagem
        console.log("Nenhum usuário logado.");
    }
});

// Adiciona o ouvinte de evento para salvar o formulário
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    // Pega o usuário logado
    const user = auth.currentUser;

    if (user) {
        // Pega os valores dos campos
        const nickname = nicknameInput.value;
        const bio = bioTextarea.value;

        // Pega as plataformas selecionadas
        const selectedPlatforms = Array.from(platformCheckboxes)
                                     .filter(checkbox => checkbox.checked)
                                     .map(checkbox => checkbox.value);

        // Cria o objeto de dados a ser salvo
        const profileData = {
            nickname: nickname,
            bio: bio,
            platforms: selectedPlatforms
        };

        try {
            // Cria a referência ao documento do usuário (usa o UID como ID do documento)
            const docRef = doc(db, 'users', user.uid);
            
            // Salva os dados no Firestore
            await setDoc(docRef, profileData);
            alert("Perfil salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar o perfil:", error);
            alert("Erro ao salvar o perfil. Tente novamente.");
        }
    } else {
        alert("Você precisa estar logado para salvar seu perfil.");
    }
});