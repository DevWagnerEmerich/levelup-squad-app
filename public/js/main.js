// O caminho para o config deve voltar um nível para a raiz do projeto
import { auth, db, storage } from "../firebase-config.js";

console.log("Aplicação iniciada com sucesso!");
console.log("Firebase Auth:", auth);
console.log("Firestore DB:", db);
console.log("Firebase Storage:", storage);

// O código principal da aplicação começará aqui