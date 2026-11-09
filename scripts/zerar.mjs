// Apaga dados de teste do Firestore (usado pela ação manual "Zerar dados de teste"). Usa a conta de serviço.
// MODO: dia_a_dia | hoje | tudo_menos_logins   DIA: AAAA-MM-DD (para "hoje")
import admin from "firebase-admin";
admin.initializeApp({ projectId: "madalenas-sistema" });
const db = admin.firestore();
const DIA_A_DIA = ["presenca", "presenca_historico", "livro", "consumo", "notas", "notas_fotos", "cobrancas", "perdas", "perdas_fotos",
  "producao", "cozinha", "cozinha_fotos", "caixa", "caixa_fotos", "checklists", "checklists_fotos", "folha", "estoque", "estoque_fotos",
  "tarefas", "tarefas_fotos", "encomendas"];
const CADASTROS = ["fichas", "fichas_fotos", "diarias", "diarias_historico", "salarios", "salarios_historico", "escala", "escala_historico",
  "estoque_cadastro", "estoque_cadastro_historico"];
const modo = process.env.MODO, dia = process.env.DIA;
if (!["dia_a_dia", "hoje", "tudo_menos_logins"].includes(modo)) throw new Error("MODO inválido");
const cols = modo === "tudo_menos_logins" ? [...DIA_A_DIA, ...CADASTROS] : DIA_A_DIA;
let total = 0;
for (const c of cols) {
  let docs;
  if (modo === "hoje") { // registros do dia (campo data) ou criados nesse dia (criadoEm, ex.: encomendas)
    const [a, b2] = await Promise.all([db.collection(c).where("data", "==", dia).get(), db.collection(c).where("criadoEm", ">=", dia).where("criadoEm", "<", dia + "~").get()]);
    docs = [...new Map([...a.docs, ...b2.docs].map((d) => [d.ref.path, d])).values()];
  } else docs = (await db.collection(c).get()).docs;
  const snap = { docs, size: docs.length };
  for (let i = 0; i < snap.docs.length; i += 400) {
    const lote = db.batch(); snap.docs.slice(i, i + 400).forEach((d) => lote.delete(d.ref)); await lote.commit();
  }
  if (snap.size) console.log(`${c}: ${snap.size} apagado(s)`);
  total += snap.size;
}
console.log(`Total: ${total}. Usuários (logins) não foram mexidos.`);
