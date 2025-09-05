// Importa as funções de autenticação que precisamos do SDK do Firebase
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Importa a instância de autenticação configurada em firebase-config.js
import { auth } from './js/firebase-config.js'; // CORRIGIDO: O caminho agora aponta para a pasta js

/**
 * Registra um novo usuário com e-mail e senha.
 * @param {string} email - O e-mail do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<UserCredential>} A promessa que resolve com as credenciais do usuário.
 */
export function signupUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Autentica um usuário existente com e-mail e senha.
 * @param {string} email - O e-mail do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<UserCredential>} A promessa que resolve com as credenciais do usuário.
 */
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Desconecta o usuário atualmente logado.
 * @returns {Promise<void>} A promessa que resolve quando o logout é concluído.
 */
export function logoutUser() {
    return signOut(auth);
}

/**
 * Adiciona um observador para mudanças no estado de autenticação.
 * A função de callback será executada sempre que o estado de login do usuário mudar.
 * @param {function(import("firebase/auth").User|null): void} callback - A função a ser chamada com o objeto do usuário (ou null se deslogado).
 * @returns {import("firebase/auth").Unsubscribe} Uma função para remover o observador.
 */
export function addAuthObserver(callback) {
    return onAuthStateChanged(auth, callback);
}
