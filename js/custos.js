// Custo das fichas técnicas pelo preço das notas de compra.
// Tudo é convertido para uma "base": kg, L ou unidade. Ex.: saco de farinha de 25 kg a R$ 120 = R$ 4,80 o kg.
export const BASES = ["kg", "L", "unidade"];
const semAcento = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const num = (t) => Number(String(t).replace(",", "."));
const conv = (q, u) => {
  u = u.toLowerCase();
  if (u === "kg") return { conteudo: q, base: "kg" };
  if (u === "g") return { conteudo: q / 1000, base: "kg" };
  if (u === "l" || u === "lt") return { conteudo: q, base: "L" };
  if (u === "ml") return { conteudo: q / 1000, base: "L" };
  return null;
};

// Tamanho escrito num texto da nota: "FARINHA 25KG", "LEITE 12X1L", "OLEO 900ML", "OVOS 30 UN".
export function tamanhoNoTexto(t) {
  t = semAcento(t);
  let m = t.match(/(\d+)\s*x\s*(\d+(?:[.,]\d+)?)\s*(kg|g|lt|l|ml)\b/);
  if (m) { const c = conv(num(m[2]), m[3]); return c && { ...c, conteudo: c.conteudo * num(m[1]) }; }
  m = t.match(/(\d+(?:[.,]\d+)?)\s*(kg|g|lt|l|ml)\b/);
  if (m) return conv(num(m[1]), m[2]);
  m = t.match(/(\d+)\s*(un|und|unid|unidades|ovos)\b/);
  if (m && num(m[1]) > 1) return { conteudo: num(m[1]), base: "unidade" };
  return null;
}

// Tamanho pela unidade do estoque: "kg", "saco 25 kg", "cartela (30)", "dúzia"...
export function tamanhoDaUnidade(u) {
  const t = semAcento(u);
  if (t === "unidade" || t === "un") return { conteudo: 1, base: "unidade" };
  if (t === "duzia") return { conteudo: 12, base: "unidade" };
  const c = t.match(/cartela\s*\((\d+)\)/); if (c) return { conteudo: num(c[1]), base: "unidade" };
  if (["kg", "g", "l", "ml"].includes(t)) return conv(1, t);
  return tamanhoNoTexto(t);
}

// Quantidade da ficha na base: 500 g -> 0,5 kg.
export function naBase(qtd, un) {
  const u = semAcento(un);
  if (u === "unidade") return { q: qtd, base: "unidade" };
  const c = conv(qtd, u);
  return c ? { q: c.conteudo, base: c.base } : null;
}

// Última compra de cada insumo (a mais recente vale) e o preço na base.
export function ultimasCompras(movs) {
  const u = {};
  for (const m of movs) if (!m.cancelamento && m.acao === "entrada" && m.preco > 0 && (!u[m.insumoId] || (m.criadoEm || "") >= (u[m.insumoId].criadoEm || ""))) u[m.insumoId] = m;
  return u;
}
export function precoBase(insumo, compra, conf) {
  if (!compra) return null;
  const tam = conf.conteudos?.[insumo.id] || (compra.conteudo > 0 && compra.base ? { conteudo: compra.conteudo, base: compra.base } : null)
    || tamanhoNoTexto(compra.obs || "") || tamanhoDaUnidade(compra.unidade || insumo.unidade);
  return { preco: compra.preco, data: compra.data, fornecedor: compra.fornecedor, unidade: compra.unidade || insumo.unidade, descricao: (compra.obs || "").replace(/^Lido da nota: /, ""),
    tamanho: tam || null, porBase: tam ? compra.preco / tam.conteudo : null, digitado: !!conf.conteudos?.[insumo.id] };
}

// Liga o ingrediente da ficha ao item do estoque: o que a Daiane escolheu, senão um palpite pelo nome.
export function ligar(nome, insumos, conf) {
  const n = semAcento(nome);
  const escolhido = conf.ligacoes?.[n];
  if (escolhido !== undefined) return { id: escolhido, palpite: false };
  if (n === "agua") return { id: "__zero", palpite: true };
  const ns = insumos.map((i) => ({ i, n: semAcento(i.nome) }));
  const achou = ns.find((x) => x.n === n) || ns.find((x) => x.n.includes(n) || n.includes(x.n))
    || ns.find((x) => n.split(" ")[0].length >= 4 && x.n.split(" ")[0] === n.split(" ")[0]);
  return { id: achou ? achou.i.id : "", palpite: true };
}
export const chaveIngrediente = semAcento;

// Custo de uma ficha: soma de cada ingrediente (massa e recheio).
export function custoDaFicha(f, insumos, compras, conf) {
  const linhas = [...(f.ingredientes || []), ...(f.temRecheio ? f.recheio || [] : [])].map((i) => {
    const lig = ligar(i.nome, insumos, conf);
    const l = { ...i, ligacao: lig, custo: null, problema: "" };
    if (lig.id === "__zero") { l.custo = 0; return l; }
    const ins = insumos.find((x) => x.id === lig.id);
    if (!ins) { l.problema = "escolher o item do estoque"; return l; }
    const p = precoBase(ins, compras[ins.id], conf);
    const q = naBase(Number(i.qtd) || 0, i.un);
    if (!p) l.problema = "ainda sem nota de compra";
    else if (!p.tamanho) l.problema = `falta dizer quanto tem em 1 ${p.unidade}`;
    else if (!q || q.base !== p.tamanho.base) l.problema = `a ficha usa ${i.un} e a compra é em ${p.tamanho.base}: ajuste o tamanho`;
    else l.custo = q.q * p.porBase;
    l.insumo = ins; l.preco = p;
    return l;
  });
  const total = linhas.reduce((s, l) => s + (l.custo || 0), 0);
  const faltam = linhas.filter((l) => l.custo === null);
  const rende = Number(f.rendimento) || 0;
  return { linhas, total, faltam, porUnidade: rende ? total / rende : null };
}
