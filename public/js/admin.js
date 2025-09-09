import { db } from './firebase-config.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { seedDatabase } from './seeder.js'; // 1. Importar a função

const addGameForm = document.getElementById("add-game-form");
const seedButton = document.getElementById("seed-button"); // 2. Capturar o botão

addGameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const gameNameInput = document.getElementById("game-name");
    const gameImageUrlInput = document.getElementById("game-image-url");

    const gameName = gameNameInput.value;
    const gameImageUrl = gameImageUrlInput.value;

 
    if (!gameName || !gameImageUrl) {
        alert("Por favor, preencha todos os campos.");
        return; 
    }

    addDoc(collection(db, 'games'), {
        nome: gameName,
        urlDaImagemCapa: gameImageUrl,
    })
    .then(() => {
        alert("Jogo adicionado com sucesso!");
        gameNameInput.value = "";
        gameImageUrlInput.value = "";
    })
    .catch((error) => {
        
        alert("Erro ao adicionar o jogo: " + error.message);
        console.error("Erro ao adicionar o documento: ", error);
    });
});

// 3. Adicionar o ouvinte de evento
seedButton.addEventListener('click', () => {
    console.log("Iniciando processo para popular o banco de dados a partir da página de admin...");
    seedDatabase(db);
});
