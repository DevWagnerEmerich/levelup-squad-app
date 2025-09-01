// O caminho para o config deve voltar um nível para a raiz do projeto
import { auth, db, storage } from "../firebase-config.js";

console.log("Aplicação iniciada com sucesso!");
console.log("Firebase Auth:", auth);
console.log("Firestore DB:", db);
console.log("Firebase Storage:", storage);

// O código principal da aplicação começará aqui
// --- CÓDIGO PARA O BOTÃO DE SEEDING ---
import { seedDatabase } from "./seeder.js";

const seedButton = document.getElementById("seed-button");
if (seedButton) {
    seedButton.addEventListener("click", () => {
        if (confirm("Isso irá sobrescrever os dados de teste no Firestore. Deseja continuar?")) {
            seedDatabase();
        }
    });
}
