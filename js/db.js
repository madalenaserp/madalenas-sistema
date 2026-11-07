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

// Lista os documentos em que campo == valor (e, opcionalmente, campo2 está na lista valores2).
export async function listar(colecao, campo, valor, campo2, valores2) {
  const f = await firebase();
  if (f) {
    const filtros = [f.fs.where(campo, "==", valor)];
    if (campo2) filtros.push(f.fs.where(campo2, "in", valores2));
    const q = f.fs.query(f.fs.collection(f.db, colecao), ...filtros);
    const snap = await f.fs.getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return Object.entries(lerLocal(colecao))
    .filter(([, d]) => d[campo] === valor && (!campo2 || valores2.includes(d[campo2])))
    .map(([id, d]) => ({ id, ...d }));
}

// Acrescenta um registro novo (para livros em que nada se altera nem se apaga).
export async function acrescentar(colecao, dados) {
  const f = await firebase();
  if (f) return (await f.fs.addDoc(f.fs.collection(f.db, colecao), { ...dados, gravadoEm: f.fs.serverTimestamp() })).id;
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const tudo = lerLocal(colecao); tudo[id] = dados; gravarLocal(colecao, tudo);
  return id;
}

// Lista os documentos em que campo está entre "de" e "ate" (inclusive). Ex.: datas de entrega da semana.
export async function listarEntre(colecao, campo, de, ate) {
  const f = await firebase();
  if (f) {
    const q = f.fs.query(f.fs.collection(f.db, colecao), f.fs.where(campo, ">=", de), f.fs.where(campo, "<=", ate));
    const snap = await f.fs.getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return Object.entries(lerLocal(colecao))
    .filter(([, d]) => d[campo] >= de && d[campo] <= ate)
    .map(([id, d]) => ({ id, ...d }));
}

// Lê um documento pelo id (ou null).
export async function ler(colecao, id) {
  const f = await firebase();
  if (f) { const d = await f.fs.getDoc(f.fs.doc(f.db, colecao, id)); return d.exists() ? { id: d.id, ...d.data() } : null; }
  const d = lerLocal(colecao)[id]; return d ? { id, ...d } : null;
}
