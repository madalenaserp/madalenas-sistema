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

// "Seu dia + saboroso", como na estampa da camisa: raios e "+" em laranja, trigos verdes dos lados, risco laranja.
export function slogan() {
  return `<div class="slogan2" role="img" aria-label="Seu dia mais saboroso">
    <svg class="raios-esq" viewBox="0 0 30 30" aria-hidden="true"><g stroke="#e2732b" stroke-width="3" stroke-linecap="round">
      <path d="M22 6 L26 1"/><path d="M14 12 L5 8"/><path d="M16 21 L6 22"/></g></svg>
    <div class="l1">Seu dia <span class="mais">+</span></div>
    <svg class="raios-dir" viewBox="0 0 24 30" aria-hidden="true"><g stroke="#e2732b" stroke-width="3" stroke-linecap="round">
      <path d="M4 6 L9 1"/><path d="M8 16 L18 20"/></g></svg>
    <div class="l2">saboroso</div>
    <svg class="risco" viewBox="0 0 220 26" aria-hidden="true"><path d="M6 20 C 60 10, 140 2, 214 6 C 150 8, 70 16, 10 24 Z" fill="#e2732b"/></svg>
    <span class="trigo-esq">${TRIGO}</span><span class="trigo-dir">${TRIGO}</span>
  </div>`;
}
for (const el of document.querySelectorAll("[data-slogan]")) el.innerHTML = slogan();
