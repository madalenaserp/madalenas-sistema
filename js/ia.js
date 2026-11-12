// Inteligência do Google (Gemini, pelo Firebase AI Logic) para ler notas e contar itens pela foto.
// Usa uma cópia separada do Firebase (versão nova), sem mexer no login/banco do resto do sistema.
// Precisa: AI Logic ativado no console do Firebase com "Gemini Developer API".
import * as cfg from "./config.js";
const { firebaseConfig } = cfg;
const appCheck = cfg.appCheck || null; // { tipo: "enterprise" | "v3", chave: "..." } em config.js

const V = "https://www.gstatic.com/firebasejs/12.0.0";
const MODELOS = ["gemini-3.8-flash", "gemini-flash-latest"]; // o segundo só se o primeiro não existir mais
const LIMITE = 100000; // tempo máximo de espera (ms); depois disso desiste e avisa
let base = null;
export let etapa = ""; // onde parou (aparece na mensagem de erro, para achar o problema)

export const iaDisponivel = !!firebaseConfig;

const comLimite = (promessa, ms, oque) => Promise.race([promessa, new Promise((_, falha) => setTimeout(() => falha(new Error(`demorou demais (${oque})`)), ms))]);

async function gerar(partes, json = true) {
  etapa = "carregando";
  base ??= (async () => {
    const { initializeApp } = await import(`${V}/firebase-app.js`);
    const ai = await import(`${V}/firebase-ai.js`);
    const app = initializeApp(firebaseConfig, "ia");
    // App Check: só o nosso site pode usar a IA (a chave do site não é segredo).
    let ac = null;
    if (appCheck?.chave) {
      ac = await import(`${V}/firebase-app-check.js`);
      const Prov = appCheck.tipo === "v3" ? ac.ReCaptchaV3Provider : ac.ReCaptchaEnterpriseProvider;
      ac = { mod: ac, inst: ac.initializeAppCheck(app, { provider: new Prov(appCheck.chave), isTokenAutoRefreshEnabled: true }) };
    }
    return { ai, ac, motor: ai.getAI(app, { backend: new ai.GoogleAIBackend() }) };
  })().catch((e) => { base = null; throw e; });
  const { ai, ac, motor } = await comLimite(base, 20000, "carregar");
  if (ac) { etapa = "proteção"; await comLimite(ac.mod.getToken(ac.inst), 20000, "proteção do site"); }
  let ultimoErro;
  const inicio = Date.now();
  for (const nome of MODELOS) {
    etapa = "lendo";
    try {
      const resta = LIMITE - (Date.now() - inicio);
      if (resta < 5000) break;
      const conf = json ? { responseMimeType: "application/json", temperature: 0 } : { temperature: 0.9 };
      conf.thinkingConfig = { thinkingLevel: "low" }; // responde mais rápido
      const m = ai.getGenerativeModel(motor, { model: nome, generationConfig: conf }, { timeout: resta });
      const r = await comLimite(m.generateContent(partes), resta, "resposta");
      etapa = "";
      return json ? JSON.parse(r.response.text()) : r.response.text();
    } catch (e) { ultimoErro = e; console.warn("IA", nome, e?.message); if (!/not found|404|no longer available/i.test(String(e?.message))) break; }
  }
  throw ultimoErro || new Error("demorou demais");
}

const imagem = (dataUrl) => ({ inlineData: { mimeType: dataUrl.slice(5, dataUrl.indexOf(";")), data: dataUrl.split(",")[1] } });
const lista = (insumos) => insumos.map((i) => `${i.id} = ${i.nome} (${i.unidade})`).join("\n");

// Nota/cupom (impresso ou escrito à mão) -> { fornecedor, itens: [{descricao, qtd, preco, total, insumoId}] }
export async function lerNotaIA(dataUrl, insumos) {
  const r = await gerar([imagem(dataUrl), `Esta é a foto de uma nota ou cupom de compra de uma padaria no Brasil (pode estar torta, de lado ou escrita à mão).
Leia TODOS os itens comprados. Para cada item devolva: descricao (como está na nota), qtd (número), preco (preço de UMA unidade em reais, número), total (número).
Se só houver o total, calcule preco = total / qtd. Números usam vírgula decimal na nota; devolva como número JSON.
Para cada item devolva também o tamanho de UMA unidade comprada, lido da descrição: conteudo (número) e base ("kg", "L" ou "unidade").
Exemplos: "FARINHA TRIGO 25KG" -> conteudo 25, base "kg"; "LEITE CX 12X1L" -> 12, "L"; "MARGARINA 500G" -> 0.5, "kg"; "CREME LEITE 200G" -> 0.2, "kg"; "OVOS CX 30" ou "BANDEJA 30 OVOS" -> 30, "unidade"; "OLEO 900ML" -> 0.9, "L".
Se a unidade da nota já é KG, L ou UN (vendido a peso ou por unidade), use conteudo 1 e a base correspondente. Se a descrição NÃO diz o tamanho, use conteudo 0 e base "".
Para cada item, escolha o insumoId da lista abaixo que é o MESMO produto; se nenhum for o mesmo, use "".
Lista de insumos (id = nome (unidade)):
${lista(insumos)}
Devolva só JSON: {"fornecedor": "nome da loja ou vazio", "itens": [{"descricao": "", "qtd": 0, "preco": 0, "total": 0, "conteudo": 0, "base": "", "insumoId": ""}]}`]);
  const ids = new Set(insumos.map((i) => i.id));
  return { fornecedor: String(r.fornecedor || ""), itens: (r.itens || []).map((i) => {
    const base = ["kg", "L", "unidade"].includes(i.base) ? i.base : "", conteudo = base && Number(i.conteudo) > 0 ? Number(i.conteudo) : 0;
    return { descricao: String(i.descricao || ""), qtd: Number(i.qtd) || 0, preco: Number(i.preco) || 0, total: Number(i.total) || 0, conteudo, base: conteudo ? base : "", insumoId: ids.has(i.insumoId) ? i.insumoId : "" };
  }) };
}

// Comprovante de venda do Guappo (nota das empresas) -> { itens:[{descricao,qtd,preco,total}], total, numero, emissao, escrito }
export async function lerComprovanteIA(dataUrl, empresas) {
  const r = await gerar([imagem(dataUrl), `Esta é a foto de um "Comprovante de VENDA" impresso (bobina 80mm) da padaria Madalena's, vendido a prazo para uma empresa.
Leia TODOS os itens da tabela de produtos. Cada item tem uma linha com número, código e DESCRIÇÃO (ex.: "173 BOLO PISCINA ESPECIAL"; tire o código do começo) e embaixo "QTDE UN x VALOR UNITÁRIO ... VALOR TOTAL".
Para cada item devolva: descricao (sem o código), qtd (número; "10,000 UN" = 10), preco (valor unitário), total (valor total do item).
Leia também: total ("VALOR TOTAL R$"), numero ("Numero:"), emissao (data de "Emissão:" no formato AAAA-MM-DD).
Em escrito, copie o que estiver ESCRITO À MÃO no papel (data, nome da empresa), ou "".
Em empresa, escolha da lista o nome que combina com o escrito à mão, ou "": ${empresas.join(", ")}.
Números usam vírgula decimal na nota; devolva como número JSON.
Devolva só JSON: {"itens": [{"descricao": "", "qtd": 0, "preco": 0, "total": 0}], "total": 0, "numero": "", "emissao": "", "escrito": "", "empresa": ""}`]);
  const itens = (r.itens || []).map((i) => ({ descricao: String(i.descricao || "").trim(), qtd: Number(i.qtd) || 0, preco: Number(i.preco) || 0, total: Number(i.total) || 0 })).filter((i) => i.descricao);
  return { itens, total: Number(r.total) || itens.reduce((t, i) => t + i.total, 0), numero: String(r.numero || "").replace(/\D/g, ""),
    emissao: /^\d{4}-\d{2}-\d{2}$/.test(r.emissao) ? r.emissao : "", escrito: String(r.escrito || ""), empresa: empresas.includes(r.empresa) ? r.empresa : "" };
}

// Foto da prateleira -> [{insumoId, qtd, obs}] (só o que dá para ver e contar)
export async function contarFotoIA(dataUrl, insumos) {
  const r = await gerar([imagem(dataUrl), `Esta é a foto de uma prateleira ou depósito de uma padaria. Conte os itens que aparecem e que estão na lista abaixo.
Conte na unidade da lista (ex.: se a unidade é "saco", conte sacos; se é "kg" e o pacote mostra o peso, multiplique). Conte só o que dá para ver com segurança.
Em obs, escreva em português curto como contou (ex.: "4 sacos de 25 kg") ou a dúvida.
Lista de insumos (id = nome (unidade)):
${lista(insumos)}
Devolva só JSON: {"itens": [{"insumoId": "", "qtd": 0, "obs": ""}]}`]);
  const ids = new Set(insumos.map((i) => i.id));
  return (r.itens || []).filter((i) => ids.has(i.insumoId) && Number(i.qtd) >= 0).map((i) => ({ insumoId: i.insumoId, qtd: Number(i.qtd), obs: String(i.obs || "") }));
}

// Resumo do dia da "Aurora" para a Daiane, a partir do que está no painel.
export async function resumoAurora(textoPainel, dataBR) {
  return gerar([`Você é a Aurora, assistente da Daiane, dona da padaria e confeitaria Madalena's Coffee Shop (São Gonçalo/RJ).
Fale com ela como "Patroa", em português do Brasil, com carinho, direto e curto (lê no celular).
Abaixo está o painel do sistema do dia ${dataBR}. Escreva:
1) Uma frase curta e diferente a cada vez para animar a patroa (sem clichê de autoajuda exagerado).
2) "🔴 O que está errado hoje": só problemas reais (faltas, saídas sem autorização, perdas no lixo, sumiço no estoque, notas sem valor, pagamentos atrasados etc.).
3) "🟡 O que está em aberto": pendências que a equipe ainda não fez.
4) "✅ O que você precisa fazer": ações dela (aprovar fichas, dar visto, cobrar empresa, falar com alguém...).
Use listas com "- ". Não invente nada que não esteja no painel; se uma parte estiver vazia, diga numa linha que está tudo certo ali. No máximo 15 linhas no total.
PAINEL:
${textoPainel}`], false);
}
