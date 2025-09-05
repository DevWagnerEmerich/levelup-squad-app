
import { db } from './firebase-config.js';

import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const addGameForm = document.getElementById("add-game-form");

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