// Quem está usando o aparelho. Por enquanto só o nome; o login de verdade vem depois.
const CHAVE = "madalenas.usuario";

export function usuario() {
  try { return localStorage.getItem(CHAVE); } catch { return null; }
}
export function entrar(nome) {
  try { localStorage.setItem(CHAVE, nome); } catch {}
}
export function sair() {
  try { localStorage.removeItem(CHAVE); } catch {}
}
// Manda para a entrada se ninguém escolheu o nome.
export function exigirUsuario() {
  const u = usuario();
  if (!u) location.href = "index.html";
  return u;
}
// Data de hoje no formato 2026-11-07, no horário do aparelho.
export function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function dataBR(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}
