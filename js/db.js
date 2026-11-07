// Acesso aos dados. Firestore quando ligado; senão guarda neste aparelho (modo teste).
import { firebase, modoTeste } from "./firebase.js";
export { modoTeste };

function lerLocal(colecao) {
  try { return JSON.parse(localStorage.getItem(`madalenas.${colecao}`) || "{}"); } catch { return {}; }
}
function gravarLocal(colecao, tudo) {
  try { localStorage.setItem(`madalenas.${colecao}`, JSON.stringify(tudo)); } catch {}
}

// Grava um documento e guarda uma cópia no histórico (que ninguém pode alterar nem apagar).
export async function salvarComHistorico(colecao, id, dados) {
  const f = await firebase();
  if (f) {
    const lote = f.fs.writeBatch(f.db);
    lote.set(f.fs.doc(f.db, colecao, id), dados);
    lote.set(f.fs.doc(f.fs.collection(f.db, `${colecao}_historico`)), { ...dados, docId: id, gravadoEm: f.fs.serverTimestamp() });
    return lote.commit();
  }
  const tudo = lerLocal(colecao); tudo[id] = dados; gravarLocal(colecao, tudo);
  const hist = lerLocal(`${colecao}_historico`); hist[`${id}_${Date.now()}`] = { ...dados, docId: id }; gravarLocal(`${colecao}_historico`, hist);
}

// Lista os documentos em que campo == valor.
export async function listar(colecao, campo, valor) {
  const f = await firebase();
  if (f) {
    const q = f.fs.query(f.fs.collection(f.db, colecao), f.fs.where(campo, "==", valor));
    const snap = await f.fs.getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return Object.entries(lerLocal(colecao)).filter(([, d]) => d[campo] === valor).map(([id, d]) => ({ id, ...d }));
}
