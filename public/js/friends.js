// Importando Firebase
import { auth, db } from './firebase-config.js';
import { collection, addDoc } from 'firebase/firestore';

// Função para enviar pedido de amizade
export async function sendFriendRequest(userIdDoAmigo) {
  try {
    // Verifica se o usuário está logado
    const usuarioAtual = auth.currentUser;
    if (!usuarioAtual) {
      alert("Você precisa estar logado para enviar pedidos de amizade.");
      return;
    }

    const uidLogado = usuarioAtual.uid;

    // Cria objeto do pedido de amizade
    const pedido = {
      from: uidLogado,           // Quem envia
      to: userIdDoAmigo,         // Quem recebe
      status: 'pendente',        // Status inicial
      criadoEm: new Date()       // Para referência
    };

    // Adiciona na coleção "pedidosAmizade"
    await addDoc(collection(db, "pedidosAmizade"), pedido);

    alert("Pedido de amizade enviado!");
  } catch (error) {
    console.error("Erro ao enviar pedido:", error);
    alert("Erro ao enviar pedido. Tente novamente.");
  }
}
