// Junta telas parecidas num "módulo" com abas no alto (ex.: Caixa = Saídas + Consumo), para a equipe
// não precisar voltar ao menu. Cada aba continua sendo a mesma tela de antes (nada muda nos dados).
import { usuarioAtual } from "./sessao.js";
import { pode } from "./equipe.js";
import { PESSOAS_BALCAO } from "./rodizio.js";

export const GRUPOS = {
  dia: { titulo: "Meu dia", abas: [
    { titulo: "Presença", link: "presenca.html", mostrar: (u) => pode.marcarPresenca(u) },
    { titulo: "Checklist", link: "checklists.html" },
    { titulo: "Minhas tarefas", link: "tarefas.html", mostrar: (u) => pode.verLivroCompleto(u) || PESSOAS_BALCAO.includes(u.nome) },
  ] },
  caixa: { titulo: "Caixa", abas: [
    { titulo: "Saídas do caixa", link: "caixa.html", mostrar: (u) => pode.verCaixa(u) },
    { titulo: "Consumo da equipe", link: "consumo.html", mostrar: (u) => pode.verConsumo(u) },
  ] },
  pedidos: { titulo: "Pedidos", abas: [
    { titulo: "Balcão", link: "balcao.html" },
    { titulo: "Encomendas", link: "encomendas.html" },
    { titulo: "Empresas", link: "notas.html", mostrar: (u) => pode.notasEmpresas(u) },
  ] },
  estoque: { titulo: "Estoque e perdas", abas: [
    { titulo: "Perdas e sobras", link: "perdas.html" },
    { titulo: "Estoque", link: "estoque.html" },
  ] },
};

export const abasVisiveis = (g, u) => GRUPOS[g].abas.filter((a) => !a.mostrar || a.mostrar(u));

const pagina = location.pathname.split("/").pop() || "index.html";
const grupo = Object.keys(GRUPOS).find((g) => GRUPOS[g].abas.some((a) => a.link === pagina));
if (grupo) {
  const u = await usuarioAtual().catch(() => null);
  const abas = u ? abasVisiveis(grupo, u) : [];
  const header = document.querySelector("header");
  if (abas.length > 1 && header) {
    const nav = document.createElement("nav");
    nav.className = "abas-grupo";
    nav.setAttribute("aria-label", GRUPOS[grupo].titulo);
    nav.innerHTML = abas.map((a) => `<a href="${a.link}"${a.link === pagina ? ' aria-current="page"' : ""}>${a.titulo}</a>`).join("");
    header.after(nav);
  }
}
