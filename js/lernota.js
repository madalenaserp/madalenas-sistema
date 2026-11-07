// Leitura de nota pela foto, no próprio celular (Tesseract, grátis, sem servidor). É um TESTE:
// funciona razoavelmente com cupom/nota impressa e nítida; com nota escrita à mão erra muito.
// Os arquivos ficam em vendor/ocr (só são baixados quando alguém usa a leitura).
let worker = null;

async function carregar(progresso) {
  if (worker) return worker;
  if (!window.Tesseract) {
    await new Promise((ok, falha) => {
      const s = document.createElement("script");
      s.src = "vendor/ocr/tesseract.min.js"; s.onload = ok; s.onerror = falha;
      document.head.append(s);
    });
  }
  worker = await window.Tesseract.createWorker("por", 1, {
    workerPath: "vendor/ocr/worker.min.js", corePath: "vendor/ocr/", langPath: "vendor/ocr/lang", gzip: true,
    logger: (m) => progresso?.(m.status, m.progress),
  });
  return worker;
}

// Devolve o texto lido da imagem (dataURL ou arquivo).
export async function lerTexto(imagem, progresso) {
  const w = await carregar(progresso);
  const { data } = await w.recognize(imagem);
  return data.text || "";
}

const sem = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const num = (t) => Number(String(t).replace(/\./g, "").replace(",", "."));

// Tenta achar as linhas de produto: "DESCRIÇÃO ... QTD UN PREÇO TOTAL".
// Pega os dois últimos números com vírgula como preço unitário e total; a quantidade é o número antes da unidade.
export function separarItens(texto, insumos) {
  const itens = [];
  for (const bruta of texto.split("\n")) {
    const l = bruta.replace(/\s+/g, " ").trim();
    const valores = [...l.matchAll(/\d{1,3}(?:\.\d{3})*,\d{2}/g)].map((m) => ({ v: num(m[0]), i: m.index }));
    if (valores.length < 1 || /total|troco|desconto|pagamento|cnpj|cpf/i.test(l)) continue;
    const total = valores.at(-1).v;
    let preco = valores.length >= 2 ? valores.at(-2).v : null;
    const antes = l.slice(0, valores.length >= 2 ? valores.at(-2).i : valores.at(-1).i);
    const mq = antes.match(/(\d+(?:[.,]\d+)?)\s*(UN|UND|KG|SC|CX|PC|PCT|BD|LT|L|G|DZ|FD)\b\.?\s*$/i) || antes.match(/\s(\d+(?:[.,]\d+)?)\s*$/);
    let qtd = mq ? num(mq[1]) : null;
    if (!qtd && preco) qtd = Math.round((total / preco) * 1000) / 1000;
    if (!preco && qtd) preco = Math.round((total / qtd) * 100) / 100;
    if (!qtd || !preco) continue;
    const descricao = (mq ? antes.slice(0, mq.index) : antes).replace(/^\d{1,4}\s+/, "").replace(/\d{8,14}/g, "").trim();
    if (descricao.length < 3) continue;
    // Palpite do insumo: o nome do insumo cujas palavras mais aparecem na descrição.
    const d = sem(descricao);
    let melhor = null, nota = 0;
    for (const ins of insumos) {
      const pal = sem(ins.nome).split(/\s+/).filter((p) => p.length > 2 && !["de", "com"].includes(p));
      const acertos = pal.filter((p) => d.includes(p.slice(0, Math.max(4, p.length - 2)))).length;
      const n = pal.length ? acertos / pal.length : 0;
      if (n > nota) { nota = n; melhor = ins.id; }
    }
    itens.push({ descricao, qtd, preco, total, insumoId: nota >= 0.5 ? melhor : "" });
  }
  return itens;
}
