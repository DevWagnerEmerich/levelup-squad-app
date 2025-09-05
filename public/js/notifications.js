import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadFriendRequests() {
    const requestsListDiv = document.getElementById('requests-list');
    const currentUser = auth.currentUser;

    if (!currentUser) {
        requestsListDiv.innerHTML = "<p>Faça login para ver as suas notificações.</p>";
        return;
    }

    requestsListDiv.innerHTML = "A carregar...";

    // Consulta para buscar pedidos onde 'to' é o nosso ID e 'status' é 'pendente'
    const q = query(
        collection(db, "pedidosAmizade"),
        where("to", "==", currentUser.uid),
        where("status", "==", "pendente")
    );

    const querySnapshot = await getDocs(q);
    requestsListDiv.innerHTML = ''; // Limpa a mensagem "A carregar..."

    if (querySnapshot.empty) {
        requestsListDiv.innerHTML = "<p>Nenhum pedido de amizade pendente.</p>";
    } else {
        querySnapshot.forEach(doc => {
            const request = doc.data();
            const card = document.createElement('div');
            card.innerHTML = `
                <p>Pedido recebido de: <strong>${request.from}</strong></p>
                <button>Aceitar</button>
                <button>Rejeitar</button>
            `;
            requestsListDiv.appendChild(card);
        });
    }
}

// Garante que o código só corre depois da autenticação ser verificada
auth.onAuthStateChanged(user => {
    if (user) {
        loadFriendRequests();
    }
});