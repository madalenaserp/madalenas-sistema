// Logo da Madalena's desenhado em código (fica nítido em qualquer tela).
// Use <div data-logo></div> (grande) ou <div data-logo="pequeno"></div> no topo das páginas.
const TRIGO = `
<svg viewBox="0 -5 66 34" aria-hidden="true" class="trigo">
  <path d="M6 22 C 22 18, 40 12, 58 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  ${[[14,19.5],[24,16.5],[34,12.8],[44,9]].map(([x,y]) =>
    `<ellipse cx="${x}" cy="${y-5}" rx="3" ry="6.2" transform="rotate(38 ${x} ${y-5})" fill="currentColor"/>
     <ellipse cx="${x+3}" cy="${y+4}" rx="3" ry="6.2" transform="rotate(118 ${x+3} ${y+4})" fill="currentColor"/>`).join("")}
  <ellipse cx="57" cy="3.5" rx="3" ry="6" transform="rotate(68 57 3.5)" fill="currentColor"/>
</svg>`;

export function logo(tamanho = "grande") {
  return `<div class="logo logo-${tamanho}" role="img" aria-label="Madalena's Coffee Shop">
    ${TRIGO}
    <span class="logo-nome">Madalena’s</span>
    <span class="logo-sub">Coffee Shop</span>
  </div>`;
}

for (const el of document.querySelectorAll("[data-logo]")) el.innerHTML = logo(el.dataset.logo || "grande");

// "Seu dia + saboroso", copiado da estampa da camisa (sem os trigos).
export function slogan() {
  return `<svg class="slogan2" viewBox="0 60 760 580" role="img" aria-label="Seu dia mais saboroso">
  <g stroke="#e2732b" stroke-linecap="round" fill="none">
    <g stroke-width="9"><path d="M62 150 L88 172"/><path d="M30 190 L74 200"/><path d="M30 236 L72 240"/><path d="M46 286 L80 266"/></g>
    <g stroke-width="7"><path d="M702 134 L722 122"/><path d="M714 240 L734 254"/></g>
    <path d="M662 172 V224 M636 198 H688" stroke-width="14"/>
  </g>
  <g transform="rotate(-6 380 330)" font-family="'Amaranth', cursive" font-style="italic" font-weight="700" fill="#f6ece0">
    <text x="108" y="320" font-size="178" textLength="490" lengthAdjust="spacingAndGlyphs">Seu dia</text>
    <text x="118" y="482" font-size="178" textLength="555" lengthAdjust="spacingAndGlyphs">saboroso</text>
  </g>
  <path d="M136 570 C 250 590, 420 560, 590 516 C 612 510, 624 500, 618 488 C 646 494, 652 528, 612 542 C 450 590, 260 612, 140 584 C 128 580, 126 568, 136 570 Z" fill="#e2732b"/>
</svg>`;
}
for (const el of document.querySelectorAll("[data-slogan]")) el.innerHTML = slogan();

// Abas dos módulos (Meu dia, Caixa, Pedidos, Estoque e perdas).
import("./grupos.js").catch(() => {});

// Botão voltar do celular: o navegador mostra a página guardada (velha). Recarrega para vir com os dados de agora.
addEventListener("pageshow", (e) => { if (e.persisted) location.reload(); });

// Se algo der erro sem aviso, mostra uma faixa no rodapé (em vez de a tela ficar em branco) para a Daiane mandar o print.
function faixaDeErro(msg) {
  if (document.getElementById("faixa-erro")) return;
  const d = document.createElement("div");
  d.id = "faixa-erro";
  d.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:9999;background:#b3261e;color:#fff;border-radius:12px;padding:10px 12px;font-size:14px;box-shadow:0 4px 16px #0004";
  const t = String(msg || "erro").replace(/[<>&]/g, "").slice(0, 200);
  d.innerHTML = `<b>Algo não carregou.</b> Toque aqui para tentar de novo. Se continuar, mande um print para o Claude.<br><span style="font-size:12px;opacity:.85">${t}</span>`;
  d.onclick = () => location.reload();
  (document.body || document.documentElement).append(d);
}
addEventListener("unhandledrejection", (e) => faixaDeErro(e.reason?.message || e.reason));
addEventListener("error", (e) => { if (e.message) faixaDeErro(e.message); });
