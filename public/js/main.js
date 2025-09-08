// Etapa 1: Importa as funções de autenticação do nosso módulo auth.js
import {
    signupUser,
    loginUser,
    logoutUser,
    addAuthObserver
} from './auth.js'; // CAMINHO CORRIGIDO

// Importa a função para popular o banco de dados
import { seedDatabase } from './seeder.js';

// --- Seleção dos Elementos do DOM ---
const authContainer = document.getElementById('auth-container');
const userDashboard = document.getElementById('user-dashboard');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const logoutButton = document.getElementById('logout-button');
const seedButton = document.getElementById('seed-button'); // Seleciona o botão de popular
// Novos elementos para exibir mensagens de erro
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

// --- Lógica de UI (Interface do Usuário) ---

/**
 * Atualiza a interface com base no estado de autenticação do usuário.
 * @param {import("firebase/auth").User | null} user - O objeto de usuário do Firebase, ou null se não estiver logado.
 */
function updateUI(user) {
    if (user) {
        authContainer.style.display = 'none';
        userDashboard.style.display = 'block';
        userDashboard.querySelector('h2').textContent = `Bem-vindo, ${user.email}!`;
    } else {
        authContainer.style.display = 'block';
        userDashboard.style.display = 'none';
    }
}

/**
 * Traduz códigos de erro do Firebase para mensagens amigáveis em português.
 * @param {string} errorCode - O código de erro retornado pelo Firebase Auth.
 * @returns {string} - A mensagem de erro para o usuário.
 */
function getFriendlyErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'O e-mail fornecido não é válido.';
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
             return 'E-mail ou senha incorretos.';
        case 'auth/wrong-password':
            return 'E-mail ou senha incorretos.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso.';
        case 'auth/weak-password':
            return 'A senha deve ter pelo menos 6 caracteres.';
        default:
            return 'Ocorreu um erro inesperado. Tente novamente.';
    }
}

// --- Event Listeners (Ouvintes de Eventos) ---

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    loginError.textContent = ''; // Limpa erros ao trocar de formulário
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    signupError.textContent = ''; // Limpa erros ao trocar de formulário
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = ''; // Limpa erros anteriores
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await loginUser(email, password);
        loginForm.reset();
    } catch (error) {
        console.error('Erro no login:', error.code);
        loginError.textContent = getFriendlyErrorMessage(error.code);
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupError.textContent = ''; // Limpa erros anteriores
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Verificação extra, embora o `minlength` já ajude
    if (password.length < 6) {
        signupError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        return; 
    }

    try {
        await signupUser(email, password);
        signupForm.reset();
    } catch (error) {
        console.error('Erro no cadastro:', error.code);
        signupError.textContent = getFriendlyErrorMessage(error.code);
    }
});

logoutButton.addEventListener('click', async () => {
    try {
        await logoutUser();
    } catch (error) {
        console.error('Erro no logout:', error);
        // Em um app real, poderíamos mostrar uma mensagem de erro em um local apropriado
    }
});

// Adiciona o evento de clique para o botão de popular o banco
if (seedButton) {
    seedButton.addEventListener('click', () => {
        console.log("Botão 'Popular Banco de Dados' clicado.");
        seedDatabase();
    });
}


// --- Ponto de Entrada da Aplicação ---
addAuthObserver(updateUI);
