import { db } from "../firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const JOGOS = [
    { id: "valorant", nome: "Valorant", urlDaImagemCapa: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Valorant" },
    { id: "lol", nome: "League of Legends", urlDaImagemCapa: "https://via.placeholder.com/150/33A2FF/FFFFFF?text=LoL" },
    { id: "minecraft", nome: "Minecraft", urlDaImagemCapa: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Minecraft" },
    { id: "csgo", nome: "Counter-Strike 2", urlDaImagemCapa: "https://via.placeholder.com/150/F0FF33/FFFFFF?text=CS2" }
];

const USUARIOS = [
    {
        uid: "COLE_O_UID_DO_USUARIO_1_AQUI",
        nickname: "PlayerZero",
        bio: "Focado em FPS competitivo.",
        plataformas: ["PC"],
        jogosFavoritos: ["valorant", "csgo"]
    },
    {
        uid: "COLE_O_UID_DO_USUARIO_2_AQUI",
        nickname: "CraftyGirl",
        bio: "Construindo mundos e relaxando.",
        plataformas: ["PC", "Nintendo Switch"],
        jogosFavoritos: ["minecraft"]
    },
    {
        uid: "COLE_O_UID_DO_USUARIO_3_AQUI",
        nickname: "MobaMaster",
        bio: "Apenas mais uma partida de LoL.",
        plataformas: ["PC"],
        jogosFavoritos: ["lol", "valorant"]
    }
];

export async function seedDatabase() {
    console.log("Iniciando o seeding do banco de dados...");
    try {
        for (const jogo of JOGOS) {
            const docRef = doc(db, "games", jogo.id);
            await setDoc(docRef, { nome: jogo.nome, urlDaImagemCapa: jogo.urlDaImagemCapa });
        }
        console.log("Coleção `games` alimentada com sucesso!");

        for (const usuario of USUARIOS) {
            if (usuario.uid.startsWith("COLE_O_UID")) {
                console.warn(`AVISO: Preencha o UID para o usuário ${usuario.nickname} no arquivo seeder.js`);
                continue;
            }
            const docRef = doc(db, "users", usuario.uid);
            await setDoc(docRef, { 
                nickname: usuario.nickname, 
                bio: usuario.bio,
                plataformas: usuario.plataformas,
                jogosFavoritos: usuario.jogosFavoritos
            });
        }
        console.log("Coleção `users` alimentada com sucesso!");
        alert("Banco de dados populado com dados de teste!");

    } catch (error) {
        console.error("Erro ao popular o banco de dados:", error);
        alert("Erro ao popular o banco de dados. Veja o console.");
    }
}
