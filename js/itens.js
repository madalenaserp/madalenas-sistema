// Lista de itens (quantidade + produto), um embaixo do outro, com botão "+ item".
// Usado em Encomendas e em Pedidos de balcão. Devolve { el, ler() } — ler() dá [{ qtd, produto }].
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export function campoItens(iniciais = [], exemplo = "Ex.: mini salgados fritos") {
  const el = document.createElement("div");
  el.className = "itens-campo";
  el.style.cssText = "display:flex;flex-direction:column;gap:6px";
  const linhas = document.createElement("div");
  linhas.style.cssText = "display:flex;flex-direction:column;gap:6px";
  const mais = document.createElement("button");
  mais.type = "button";
  mais.className = "botao";
  mais.style.cssText = "text-align:center;font-size:15px;padding:8px";
  mais.textContent = "+ item";
  el.append(linhas, mais);

  function linha(qtd = "", produto = "") {
    const l = document.createElement("div");
    l.style.cssText = "display:grid;grid-template-columns:70px 1fr 40px;gap:6px;align-items:center";
    l.innerHTML = `<input class="i-qtd" inputmode="decimal" placeholder="Qtd" value="${esc(qtd)}" aria-label="Quantidade">
      <input class="i-prod" placeholder="${esc(exemplo)}" value="${esc(produto)}" aria-label="Produto" autocomplete="off">
      <button type="button" aria-label="Tirar este item" style="border:1px solid var(--linha);background:#fff;border-radius:8px;height:40px;font-size:18px;cursor:pointer">✕</button>`;
    l.querySelector("button").onclick = () => { l.remove(); if (!linhas.children.length) linha(); };
    linhas.append(l);
    return l;
  }
  mais.onclick = () => linha().querySelector(".i-qtd").focus();
  if (iniciais.length) for (const i of iniciais) linha(i.qtd, i.produto); else linha();

  return {
    el,
    ler() {
      return [...linhas.children].map((l) => ({
        qtd: l.querySelector(".i-qtd").value.trim(),
        produto: l.querySelector(".i-prod").value.trim(),
      })).filter((i) => i.produto);
    },
  };
}

// Texto de uma linha só (para quem lê o pedido antigo, o painel e a Aurora).
export const itensEmTexto = (itens) => itens.map((i) => `${i.qtd ? i.qtd + " " : ""}${i.produto}`).join("; ");

// Lista em HTML, um item por linha. Pedidos antigos (só texto) quebram no ";".
export function itensEmHtml(r) {
  const lista = r.itens?.length ? r.itens.map((i) => `${i.qtd ? `<b>${esc(i.qtd)}</b> ` : ""}${esc(i.produto)}`)
    : String(r.pedido || "").split(/;\s*/).filter(Boolean).map(esc);
  return `<ul style="margin:0;padding-left:18px">${lista.map((t) => `<li>${t}</li>`).join("")}</ul>`;
}
