// Quem está usando o sistema.
// Com Firebase: login com usuário e senha (Firebase Authentication) e perfil na coleção "usuarios".
// Modo teste: a pessoa escolhe o nome numa lista, só neste aparelho.
import { firebase, modoTeste } from "./firebase.js";
import { pessoa } from "./equipe.js";

const CHAVE = "madalenas.usuario";
export const DOMINIO = "madalenas.app"; // o usuário "jessica" vira jessica@madalenas.app no Firebase

function lerTeste() { try { return localStorage.getItem(CHAVE); } catch { return null; } }

export async function entrar(usuarioOuNome, senha) {
  if (modoTeste) { try { localStorage.setItem(CHAVE, usuarioOuNome); } catch {} return; }
  const f = await firebase();
  const u = usuarioOuNome.trim().toLowerCase();
  const email = u.includes("@") ? u : `${u}@${DOMINIO}`; // aceita "daiane" ou "daiane@madalenas.app"
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
  const ref = f.fs.doc(f.db, "usuarios", user.uid);
  // Internet fraca: se o perfil demorar, usa o que ficou guardado neste aparelho (só para mostrar a tela;
  // o que cada um pode gravar continua sendo conferido pelo servidor).
  const chavePerfil = `madalenas.perfil.${user.uid}`;
  let guardado = null;
  try { guardado = JSON.parse(localStorage.getItem(chavePerfil) || "null"); } catch {}
  let perfil;
  try {
    perfil = await Promise.race([f.fs.getDoc(ref), new Promise((_, n) => setTimeout(() => n(new Error("lento")), guardado ? 6000 : 15000))]);
  } catch (e) {
    if (guardado && guardado.ativo !== false) return { uid: user.uid, ...guardado };
    throw e;
  }
  // Primeiro acesso da Daiane: cria o perfil de dona (as regras só permitem isso para este e-mail).
  if (!perfil.exists() && user.email === `daiane@${DOMINIO}`) {
    await f.fs.setDoc(ref, { nome: "Daiane", usuario: "daiane", setor: "Gestão", papel: "dona", ativo: true });
    perfil = await f.fs.getDoc(ref);
  }
  if (!perfil.exists() || perfil.data().ativo === false) { try { localStorage.removeItem(chavePerfil); } catch {} return null; }
  try { localStorage.setItem(chavePerfil, JSON.stringify(perfil.data())); } catch {}
  return { uid: user.uid, ...perfil.data() };
}

// Manda para a entrada se ninguém entrou. Use: const eu = await exigirUsuario();
export async function exigirUsuario() {
  // Se a internet estiver fraca e a tela demorar, avisa e oferece tentar de novo (em vez de ficar em branco).
  let aviso = null;
  const mostrar = (texto) => {
    aviso ??= Object.assign(document.createElement("div"), { className: "aviso" });
    aviso.style.cssText = "position:fixed;left:12px;right:12px;bottom:16px;z-index:50;text-align:center";
    aviso.innerHTML = `${texto}<br><button type="button" style="margin-top:8px">Tentar de novo</button>`;
    aviso.querySelector("button").onclick = () => location.reload();
    document.body.append(aviso);
  };
  const timer = setTimeout(() => mostrar("A internet está fraca e a tela está demorando para abrir."), 7000);
  let u;
  try { u = await usuarioAtual(); }
  catch (e) { clearTimeout(timer); mostrar("Não consegui abrir a tela: a internet está fraca ou caiu."); await new Promise(() => {}); }
  clearTimeout(timer); aviso?.remove();
  if (!u) {
    // Guarda a página (e o # dela) para voltar depois do login.
    try { sessionStorage.setItem("madalenas.voltar", location.pathname.split("/").pop() + location.search + location.hash); } catch {}
    location.href = "index.html"; await new Promise(() => {});
  }
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

// Para onde ir depois do login: a página que pediu o login, ou o menu.
export function destinoDepoisDoLogin() {
  let v = null;
  try { v = sessionStorage.getItem("madalenas.voltar"); sessionStorage.removeItem("madalenas.voltar"); } catch {}
  return v && /^[a-z0-9-]+\.html([?#].*)?$/i.test(v) && !v.startsWith("index.html") ? v : "turno.html";
}
