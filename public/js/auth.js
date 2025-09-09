// Importa as ferramentas de autenticação do Firebase
import { auth } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/**
 * Cadastra um novo utilizador com e-mail e senha.
 * @param {string} email - O e-mail do utilizador.
 * @param {string} password - A senha do utilizador.
 * @returns {Promise<UserCredential>}
 */
export function signupUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Autentica um utilizador existente.
 * @param {string} email - O e-mail do utilizador.
 * @param {string} password - A senha do utilizador.
 * @returns {Promise<UserCredential>}
 */
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Desconecta o utilizador atualmente logado.
 * @returns {Promise<void>}
 */
export function logoutUser() {
    return signOut(auth);
}

/**
 * Observa e reage a mudanças no estado de autenticação do utilizador (login/logout).
 * @param {function} callback - A função a ser executada quando o estado muda.
 */
export function addAuthObserver(callback) {
    onAuthStateChanged(auth, callback);
}
