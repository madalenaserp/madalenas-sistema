// Inteligência do Google (Gemini, pelo Firebase AI Logic) para ler notas e contar itens pela foto.
// Usa uma cópia separada do Firebase (versão nova), sem mexer no login/banco do resto do sistema.
// Precisa: AI Logic ativado no console do Firebase com "Gemini Developer API".
import * as cfg from "./config.js";
const { firebaseConfig } = cfg;
const appCheck = cfg.appCheck || null; // { tipo: "enterprise" | "v3", chave: "..." } em config.js

const V = "https://www.gstatic.com/firebasejs/12.0.0";
const MODELOS = ["gemini-3.8-flash", "gemini-flash-latest"]; // o primeiro que responder
let base = null;

export const iaDisponivel = !!firebaseConfig;

async function gerar(partes) {
  base ??= (async () => {
    const { initializeApp } = await import(`${V}/firebase-app.js`);
    const ai = await import(`${V}/firebase-ai.js`);
    const app = initializeApp(firebaseConfig, "ia");
    // App Check: só o nosso site pode usar a IA (a chave do site não é segredo).
    if (appCheck?.chave) {
      const ac = await import(`${V}/firebase-app-check.js`);
      const Prov = appCheck.tipo === "v3" ? ac.ReCaptchaV3Provider : ac.ReCaptchaEnterpriseProvider;
      ac.initializeAppCheck(app, { provider: new Prov(appCheck.chave), isTokenAutoRefreshEnabled: true });
    }
    return { ai, motor: ai.getAI(app, { backend: new ai.GoogleAIBackend() }) };
  })();
  const { ai, motor } = await base;
  let ultimoErro;
  for (const nome of MODELOS) {
    try {
      const m = ai.getGenerativeModel(motor, { model: nome, generationConfig: { responseMimeType: "application/json", temperature: 0 } }, { timeout: 150000 });
      const r = await m.generateContent(partes);
      return JSON.parse(r.response.text());
    } catch (e) { ultimoErro = e; console.warn("IA", nome, e?.message); }
  }
  throw ultimoErro;
}

const imagem = (dataUrl) => ({ inlineData: { mimeType: dataUrl.slice(5, dataUrl.indexOf(";")), data: dataUrl.split(",")[1] } });
const lista = (insumos) => insumos.map((i) => `${i.id} = ${i.nome} (${i.unidade})`).join("\n");

// Nota/cupom (impresso ou escrito à mão) -> { fornecedor, itens: [{descricao, qtd, preco, total, insumoId}] }
export async function lerNotaIA(dataUrl, insumos) {
  const r = await gerar([imagem(dataUrl), `Esta é a foto de uma nota ou cupom de compra de uma padaria no Brasil (pode estar torta, de lado ou escrita à mão).
Leia TODOS os itens comprados. Para cada item devolva: descricao (como está na nota), qtd (número), preco (preço de UMA unidade em reais, número), total (número).
Se só houver o total, calcule preco = total / qtd. Números usam vírgula decimal na nota; devolva como número JSON.
Para cada item, escolha o insumoId da lista abaixo que é o MESMO produto; se nenhum for o mesmo, use "".
Lista de insumos (id = nome (unidade)):
${lista(insumos)}
Devolva só JSON: {"fornecedor": "nome da loja ou vazio", "itens": [{"descricao": "", "qtd": 0, "preco": 0, "total": 0, "insumoId": ""}]}`]);
  const ids = new Set(insumos.map((i) => i.id));
  return { fornecedor: String(r.fornecedor || ""), itens: (r.itens || []).map((i) => ({ descricao: String(i.descricao || ""), qtd: Number(i.qtd) || 0, preco: Number(i.preco) || 0, total: Number(i.total) || 0, insumoId: ids.has(i.insumoId) ? i.insumoId : "" })) };
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
