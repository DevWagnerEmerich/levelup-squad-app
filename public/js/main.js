// O caminho para o config agora está na mesma pasta, então usamos "./"
import { auth, db, storage } from "./firebase-config.js";

// Importa a função do seeder
import { seedDatabase } from "./seeder.js";

console.log("Aplicação iniciada com sucesso!");
console.log("Firebase Auth:", auth);
console.log("Firestore DB:", db);
console.log("Firebase Storage:", storage);

// --- CÓDIGO PARA O BOTÃO DE SEEDING ---
const seedButton = document.getElementById("seed-button");
if (seedButton) {
    seedButton.addEventListener("click", () => {
        if (confirm("Isso irá sobrescrever os dados de teste no Firestore. Deseja continuar?")) {
            seedDatabase();
        }
    });
}