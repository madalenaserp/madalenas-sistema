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

// "Seu dia + saboroso", copiado da estampa da camisa: letra cursiva grossa creme,
// "+" e tracinhos retos em laranja, risco laranja com a pontinha virada para cima.
export function slogan() {
  return `<svg class="slogan2" viewBox="0 0 500 300" role="img" aria-label="Seu dia mais saboroso">
    <g transform="rotate(-4 250 150)">
      <g stroke="#e2732b" stroke-width="7" stroke-linecap="round">
        <path d="M52 40 L66 56"/><path d="M28 92 L54 96"/><path d="M38 132 L58 120"/>
        <path d="M458 36 L474 26"/><path d="M462 102 L478 112"/>
      </g>
      <text x="70" y="128" font-family="'Lobster Two', cursive" font-style="italic" font-weight="700" font-size="104" fill="#f6ece0">Seu dia</text>
      <path d="M434 44 V96 M408 70 H460" stroke="#e2732b" stroke-width="12" stroke-linecap="round"/>
      <text x="64" y="222" font-family="'Lobster Two', cursive" font-style="italic" font-weight="700" font-size="104" fill="#f6ece0">saboroso</text>
      <path d="M72 270 C 170 258, 290 246, 390 242 C 406 241, 414 232, 408 220 C 428 228, 428 258, 396 262 C 290 268, 180 280, 76 284 C 64 284, 62 272, 72 270 Z" fill="#e2732b"/>
    </g>
  </svg>`;
}
for (const el of document.querySelectorAll("[data-slogan]")) el.innerHTML = slogan();
