// Equipe e funções.
// papel: "dona" (tudo), "gestor" (só vê: painel e telas, sem lançar nada), "lider" (marca presença), "equipe".
// No sistema ligado ao Firebase, o papel que vale é o da coleção "usuarios" (as regras do servidor
// leem de lá). Esta lista serve para a tela de presença e para o modo teste.
// Desde 10/11/2026 a Daiane troca as pessoas em RH → Quem é da equipe (fica no servidor, em config/equipe);
// esta lista abaixo só vale enquanto ela não salvar a dela (ou sem internet / antes do login).
import { ler } from "./db.js";

const PADRAO = [
  { nome: "Daiane", usuario: "daiane", setor: "Gestão", papel: "dona" },
  { nome: "Fábio", usuario: "fabio", setor: "Gestão", papel: "gestor" },
  { nome: "Dara", usuario: "dara", setor: "Caixa", papel: "lider" },
  { nome: "Fabrícia", usuario: "fabricia", setor: "Caixa", papel: "equipe" },
  { nome: "Jéssica", usuario: "jessica", setor: "Balcão", papel: "lider" },
  { nome: "Natália", usuario: "natalia", setor: "Balcão", papel: "equipe" },
  { nome: "Flávia", usuario: "flavia", setor: "Balcão", papel: "equipe" },
  { nome: "Lucas", usuario: "lucas", setor: "Balcão", papel: "equipe" },
  { nome: "Maurina", usuario: "maurina", setor: "Balcão", papel: "equipe" },
  { nome: "Ana Clésia", usuario: "anaclesia", setor: "Lanches", papel: "equipe" },
  { nome: "Maria Helena", usuario: "mariahelena", setor: "Lanches", papel: "equipe" },
  { nome: "Daniel", usuario: "daniel", setor: "Produção", papel: "equipe" },
  { nome: "Pablo", usuario: "pablo", setor: "Produção", papel: "equipe" },
  { nome: "Rinaldo", usuario: "rinaldo", setor: "Produção", papel: "equipe" },
  { nome: "Maxwell", usuario: "maxwell", setor: "Produção", papel: "equipe" },
  { nome: "Gabriel", usuario: "gabriel", setor: "Produção", papel: "equipe" },
  { nome: "Eduardo", usuario: "eduardo", setor: "Confeitaria", papel: "equipe" },
];

// Guarda a lista por 10 minutos neste aparelho para a troca de tela não esperar o servidor toda vez.
const CHAVE_EQ = "madalenas.equipe";
async function carregarEquipe() {
  const montar = (lista) => [...PADRAO.filter((p) => p.setor === "Gestão"), ...lista.filter((p) => p.nome && p.setor !== "Gestão")];
  try { const c = JSON.parse(sessionStorage.getItem(CHAVE_EQ) || "null"); if (c && Date.now() - c.em < 10 * 60 * 1000) return c.lista ? montar(c.lista) : PADRAO; } catch {}
  try {
    const d = await ler("config", "equipe");
    try { sessionStorage.setItem(CHAVE_EQ, JSON.stringify({ em: Date.now(), lista: d?.lista?.length ? d.lista : null })); } catch {}
    if (d?.lista?.length) return montar(d.lista);
  } catch { /* antes do login ou sem internet: usa a lista padrão (e não guarda) */ }
  return PADRAO;
}
export const esquecerEquipeGuardada = () => { try { sessionStorage.removeItem(CHAVE_EQ); } catch {} };
export const EQUIPE_PADRAO = PADRAO;
export const EQUIPE = await carregarEquipe();
export const SETORES = ["Caixa", "Balcão", "Lanches", "Produção", "Confeitaria"];

export const pessoa = (nome) => EQUIPE.find((p) => p.nome === nome);
export const EQUIPE_DO_TURNO = EQUIPE.filter((p) => p.setor !== "Gestão");

// O que cada função pode fazer.
export const pode = {
  marcarPresenca: (u) => ["dona", "lider"].includes(u?.papel),
  verPainel: (u) => ["dona", "gestor"].includes(u?.papel),
  gerirEquipe: (u) => u?.papel === "dona",
  // O gestor (Fábio) só vê: não lança nem altera nada.
  somenteLeitura: (u) => u?.papel === "gestor",
  darOrdens: (u) => u?.papel === "dona",
  registrarNoLivro: (u) => ["dona", "lider"].includes(u?.papel),
  verLivroCompleto: (u) => ["dona", "gestor", "lider"].includes(u?.papel),
  darVisto: (u) => u?.papel === "dona",
  // RH: só a Daiane (escala, logins e, depois, cadastro, uniformes, férias e vales).
  rh: (u) => u?.papel === "dona",
  montarEscala: (u) => u?.papel === "dona",
  // Consumo da equipe: quem está no caixa registra; líderes e gestão também.
  // Notas das empresas: caixa lança; líderes conferem; gestão acompanha.
  notasEmpresas: (u) => ["dona", "gestor", "lider"].includes(u?.papel) || u?.setor === "Caixa",
  editarNotas: (u) => ["dona", "lider"].includes(u?.papel) || u?.setor === "Caixa",
  // Produção: a equipe da produção e da confeitaria lança; a Daiane também; o Fábio só vê.
  producao: (u) => ["dona", "gestor"].includes(u?.papel) || ["Produção", "Confeitaria"].includes(u?.setor),
  lancarProducao: (u) => u?.papel === "dona" || (u?.papel !== "gestor" && ["Produção", "Confeitaria"].includes(u?.setor)),
  // Saídas do caixa: caixa, balconistas e líderes registram; Daiane e Fábio acompanham (o Fábio só vê).
  verCaixa: (u) => ["dona", "gestor", "lider"].includes(u?.papel) || ["Caixa", "Balcão"].includes(u?.setor),
  lancarCaixa: (u) => ["dona", "lider"].includes(u?.papel) || (u?.papel !== "gestor" && ["Caixa", "Balcão"].includes(u?.setor)),
  verConsumo: (u) => ["dona", "gestor", "lider"].includes(u?.papel) || u?.setor === "Caixa",
  registrarConsumo: (u) => ["dona", "lider"].includes(u?.papel) || u?.setor === "Caixa",
};
