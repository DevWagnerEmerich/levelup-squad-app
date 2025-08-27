// Importa as funções que precisamos dos módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage, connectStorageEmulator } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

// Sua configuração do app da web do Firebase (com seus dados)
const firebaseConfig = {
  apiKey: "AIzaSyDANITBccGRC5VOmklrxgQBejX1VwQKrDY",
  authDomain: "levelup-squad-app.firebaseapp.com",
  projectId: "levelup-squad-app",
  storageBucket: "levelup-squad-app.appspot.com",
  messagingSenderId: "202795334727",
  appId: "1:202795334727:web:f1dc02e3b48211e2a90562",
  measurementId: "G-0H63VWYMC8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Pega as instâncias dos serviços que vamos usar
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Conecta aos emuladores locais SE a aplicação estiver rodando em 'localhost'
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  console.log("Ambiente de desenvolvimento local detectado. Conectando aos emuladores do Firebase...");
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

// Exporta as instâncias para serem usadas em outros arquivos do projeto
export { auth, db, storage };