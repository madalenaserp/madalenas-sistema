// Leitura de nota pela foto, no próprio celular (Tesseract, grátis, sem servidor). É um TESTE:
// funciona razoavelmente com cupom/nota impressa e nítida; com nota escrita à mão erra muito.
// Os arquivos ficam em vendor/ocr (só são baixados quando alguém usa a leitura).
let worker = null;

function carregar(progresso) {
  // Guarda a promessa: se a tela já está ligando o leitor (aquecer), a foto espera o mesmo, sem ligar outro.
  worker ??= (async () => {
    if (!window.Tesseract) {
      await new Promise((ok, falha) => {
        const s = document.createElement("script");
        s.src = "vendor/ocr/tesseract.min.js"; s.onload = ok; s.onerror = falha;
        document.head.append(s);
      });
    }
    return window.Tesseract.createWorker("por", 1, {
      workerPath: "vendor/ocr/worker.min.js", corePath: "vendor/ocr/", langPath: "vendor/ocr/lang", gzip: true,
      logger: (m) => progresso?.(m.status, m.progress),
    });
  })();
  worker.catch(() => { worker = null; });
  return worker;
}

// Deixa o leitor pronto antes da primeira foto (baixa e liga uns segundos antes, enquanto a pessoa abre a câmera).
export function aquecer() { return carregar().catch(() => {}); }

// Devolve o texto lido da imagem (dataURL ou arquivo).
export async function lerTexto(imagem, progresso) {
  const w = await carregar(progresso);
  try {
    const { data } = await Promise.race([w.recognize(imagem), new Promise((_, n) => setTimeout(() => n(new Error("a leitura no celular demorou demais")), 60000))]);
    return data.text || "";
  } catch (e) {
    // Se o leitor travou (falta de memória no celular), joga fora e começa um novo na próxima foto.
    worker = null; Promise.resolve().then(() => w.terminate()).catch(() => {});
    throw e;
  }
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
    itens.push({ descricao, qtd, preco, total, insumoId: palpiteInsumo(descricao, insumos) });
  }
  return itens;
}

// Palpite do insumo: o nome do insumo cujas palavras mais aparecem na descrição ("" se nenhum bate).
export function palpiteInsumo(descricao, insumos) {
  const d = sem(descricao);
  let melhor = "", nota = 0;
  for (const ins of insumos) {
    const pal = sem(ins.nome).split(/\s+/).filter((p) => p.length > 2 && !["de", "com"].includes(p));
    const acertos = pal.filter((p) => d.includes(p.slice(0, Math.max(4, p.length - 2)))).length;
    const n = pal.length ? acertos / pal.length : 0;
    if (n > nota) { nota = n; melhor = ins.id; }
  }
  return nota >= 0.5 ? melhor : "";
}

// Preparo da foto da nota para o OCR: acha o papel (parte clara), recorta, deixa em tons de cinza com contraste.
export async function prepararCupom(dataUrl) {
  const im = new Image(); im.src = dataUrl; await im.decode();
  // 1) versão pequena para achar o papel
  const W = 300, e0 = W / Math.max(im.width, im.height);
  const c0 = document.createElement('canvas'); c0.width = Math.round(im.width * e0); c0.height = Math.round(im.height * e0);
  const x0 = c0.getContext('2d'); x0.drawImage(im, 0, 0, c0.width, c0.height);
  const d0 = x0.getImageData(0, 0, c0.width, c0.height).data;
  const lum = (d, i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  const claro = [];
  for (let i = 0; i < d0.length; i += 4) claro.push(lum(d0, i));
  const ord = [...claro].sort((a, b) => a - b); const lim = Math.max(150, ord[Math.floor(ord.length * 0.6)]);
  const cols = new Array(c0.width).fill(0), rows = new Array(c0.height).fill(0);
  for (let y = 0; y < c0.height; y++) for (let x = 0; x < c0.width; x++) if (claro[y * c0.width + x] >= lim) { cols[x]++; rows[y]++; }
  const faixa = (arr, tot) => { const min = tot * 0.25; let a = arr.findIndex((v) => v >= min), b = arr.length - 1 - [...arr].reverse().findIndex((v) => v >= min); return a < 0 ? [0, arr.length - 1] : [a, b]; };
  let [xa, xb] = faixa(cols, c0.height * 0.5), [ya, yb] = faixa(rows, c0.width * 0.3);
  if ((xb - xa) < c0.width * 0.2 || (yb - ya) < c0.height * 0.2) { xa = 0; ya = 0; xb = c0.width - 1; yb = c0.height - 1; }
  const m = 4; xa = Math.max(0, xa - m); ya = Math.max(0, ya - m); xb = Math.min(c0.width - 1, xb + m); yb = Math.min(c0.height - 1, yb + m);
  // 2) recorte em boa resolução (largura do papel ~1300 px)
  const sx = xa / e0, sy = ya / e0, sw = (xb - xa + 1) / e0, sh = (yb - ya + 1) / e0;
  const esc = Math.min(2, 1100 / sw);
  c0.width = c0.height = 0; // libera a memória (no iPhone, canvas esquecido faz a próxima foto sair em branco)
  const c = document.createElement('canvas'); c.width = Math.round(sw * esc); c.height = Math.round(sh * esc);
  const x = c.getContext('2d'); x.drawImage(im, sx, sy, sw, sh, 0, 0, c.width, c.height);
  const img = x.getImageData(0, 0, c.width, c.height), d = img.data;
  const g = new Float32Array(c.width * c.height);
  for (let i = 0, k = 0; i < d.length; i += 4, k++) g[k] = lum(d, i);
  const gs = Array.from(g).sort((a, b) => a - b); const lo = gs[Math.floor(gs.length * 0.02)], hi = gs[Math.floor(gs.length * 0.9)];
  for (let i = 0, k = 0; i < d.length; i += 4, k++) { const v = Math.max(0, Math.min(255, ((g[k] - lo) / Math.max(1, hi - lo)) * 255)); d[i] = d[i + 1] = d[i + 2] = v; }
  x.putImageData(img, 0, 0);
  const url = c.toDataURL('image/png');
  c.width = c.height = 0; im.src = "";
  return url;
}

// Comprovante de VENDA do Guappo (notas das empresas), a partir do texto lido no celular.
// Formato: "001 173 BOLO PISCINA ESPECIAL" e na linha de baixo "1,000 UN 28,00 28,00"; depois "VALOR TOTAL R$ 34,00", "Numero: 244836", "Emissão: 01/11/2026".
export function lerComprovanteGuappo(texto) {
  const linhas = String(texto).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const dinheiro = (l) => [...l.replace(/(\d,\d)[OoC€]/g, "$10").replace(/(\d),[OoC€](\d)/g, "$1,0$2").matchAll(/\d{1,3}(?:\.\d{3})*,\d{2}\b/g)].map((m) => num(m[0]));
  const itens = [];
  linhas.forEach((l, k) => {
    const q = l.match(/(\d{1,4}[.,]\d{3})\s*(UN|KG|CX|PC|LT)\b(.*)$/i);
    if (!q) return;
    const qtd = num(q[1].replace(".", ",")), vals = dinheiro(q[3]);
    if (!(qtd > 0) || !vals.length) return;
    const total = vals.at(-1), preco = vals.length >= 2 ? vals.at(-2) : Math.round((total / qtd) * 100) / 100;
    // descrição: a linha de cima que tem "001 173 NOME" (às vezes o OCR põe uma linha de sujeira no meio)
    const cand = [linhas[k - 1], linhas[k - 2]].filter(Boolean);
    const ant = cand.find((c) => /\b\d{3}\s+\d{1,14}\s+[A-ZÀ-Ü]{2}/.test(c)) || cand[0] || "";
    const md = ant.match(/\b\d{3}\s+(?:\d{1,14}\s+)?([A-ZÀ-Ü].*)$/);
    const descricao = (md ? md[1] : ant).replace(/[^A-Za-zÀ-ÿ0-9 +%/.,-]/g, "").replace(/\s+/g, " ").trim();
    itens.push({ descricao: descricao || "Item", qtd, preco, total });
  });
  const achaValor = (re) => { const k = linhas.findIndex((l) => re.test(sem(l))); if (k < 0) return 0; const v = dinheiro(linhas[k]); if (v.length) return v.at(-1); const v2 = dinheiro(linhas[k + 1] || ""); return v2.length ? v2.at(-1) : 0; };
  const soma = Math.round(itens.reduce((t, i) => t + i.total, 0) * 100) / 100;
  const lido = achaValor(/valor total/) || achaValor(/crediario/);
  const total = lido || soma;
  const n = linhas.map((l) => sem(l).match(/(?:nu|n|u)?mero[:.]?\s*([0-9oc€]{5,8})\b/)).find(Boolean);
  const numero = n ? n[1].replace(/[o]/g, "0").replace(/\D/g, "") : "";
  const e = linhas.map((l) => sem(l).match(/emiss\w*:?\s*(\d{2})\D{0,2}(\d{2})\D{0,2}(\d{4})/)).find(Boolean);
  const e2 = e || linhas.map((l) => l.match(/(\d{2})\/(\d{2})\/(20\d{2})\s+\d{2}[:.]\d{2}/)).find(Boolean); // "11/11/2026 15:01:54"
  const emissao = e2 ? `${e2[3]}-${e2[2]}-${e2[1]}` : "";
  return { itens, total, numero, emissao: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(emissao) ? emissao : "", totalLido: lido > 0, confere: lido > 0 && itens.length > 0 && Math.abs(soma - lido) < 0.02 };
}
