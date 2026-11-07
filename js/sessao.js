// Quem está usando o sistema.
// Com Firebase: login com usuário e senha (Firebase Authentication) e perfil na coleção "usuarios".
// Modo teste: a pessoa escolhe o nome numa lista, só neste aparelho.
import { firebase, modoTeste } from "./firebase.js";
import { pessoa } from "./equipe.js";

const CHAVE = "madalenas.usuario";
const DOMINIO = "madalenas.app"; // o usuário "jessica" vira jessica@madalenas.app no Firebase

function lerTeste() { try { return localStorage.getItem(CHAVE); } catch { return null; } }

export async function entrar(usuarioOuNome, senha) {
  if (modoTeste) { try { localStorage.setItem(CHAVE, usuarioOuNome); } catch {} return; }
  const f = await firebase();
  const email = `${usuarioOuNome.trim().toLowerCase()}@${DOMINIO}`;
  await f.auth.signInWithEmailAndPassword(f.conta, email, senha);
}

export async function sair() {
  if (modoTeste) { try { localStorage.removeItem(CHAVE); } catch {} }
  else { const f = await firebase(); await f.auth.signOut(f.conta); }
  location.href = "index.html";
}

// Devolve { uid, nome, setor, papel } ou null.
export async function usuarioAtual() {
  if (modoTeste) {
    const nome = lerTeste();
    const p = nome && pessoa(nome);
    return p ? { uid: `teste-${p.usuario}`, ...p } : null;
  }
  const f = await firebase();
  const user = await new Promise((ok) => {
    const parar = f.auth.onAuthStateChanged(f.conta, (u) => { parar(); ok(u); });
  });
  if (!user) return null;
  const perfil = await f.fs.getDoc(f.fs.doc(f.db, "usuarios", user.uid));
  if (!perfil.exists() || perfil.data().ativo === false) return null;
  return { uid: user.uid, ...perfil.data() };
}

// Manda para a entrada se ninguém entrou. Use: const eu = await exigirUsuario();
export async function exigirUsuario() {
  const u = await usuarioAtual();
  if (!u) { location.href = "index.html"; await new Promise(() => {}); }
  return u;
}

export function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function dataBR(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}
