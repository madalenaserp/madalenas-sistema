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
