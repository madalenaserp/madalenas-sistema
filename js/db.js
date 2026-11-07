// Acesso aos dados. Usa o Firestore quando há firebaseConfig; senão guarda neste aparelho (modo teste).
import { firebaseConfig } from "./config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
let fs = null;

async function firestore() {
  if (!firebaseConfig) return null;
  if (fs) return fs;
  const { initializeApp } = await import(`${SDK}/firebase-app.js`);
  const m = await import(`${SDK}/firebase-firestore.js`);
  fs = { m, db: m.getFirestore(initializeApp(firebaseConfig)) };
  return fs;
}

export const modoTeste = !firebaseConfig;

function lerLocal(colecao) {
  try { return JSON.parse(localStorage.getItem(`madalenas.${colecao}`) || "{}"); } catch { return {}; }
}
function gravarLocal(colecao, tudo) {
  try { localStorage.setItem(`madalenas.${colecao}`, JSON.stringify(tudo)); } catch {}
}

// Grava (ou substitui) um documento.
export async function salvar(colecao, id, dados) {
  const f = await firestore();
  if (f) return f.m.setDoc(f.m.doc(f.db, colecao, id), dados);
  const tudo = lerLocal(colecao);
  tudo[id] = dados;
  gravarLocal(colecao, tudo);
}

// Lista os documentos em que campo == valor.
export async function listar(colecao, campo, valor) {
  const f = await firestore();
  if (f) {
    const q = f.m.query(f.m.collection(f.db, colecao), f.m.where(campo, "==", valor));
    const snap = await f.m.getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return Object.entries(lerLocal(colecao))
    .filter(([, d]) => d[campo] === valor)
    .map(([id, d]) => ({ id, ...d }));
}
