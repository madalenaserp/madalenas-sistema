// Rodízio de tarefas do balcão. Cada dia as tarefas são distribuídas entre quem trabalha no balcão
// (pula quem está de folga na escala) e no dia seguinte a distribuição gira uma posição.
// Para mudar a lista, mude só aqui. dias: só aparece nesses dias da semana (0=domingo, 1=segunda ... 6=sábado). fotos: "antes_depois" pede foto antes e depois; "uma" pede uma foto; null não pede foto.
import { EQUIPE } from "./equipe.js";
import { folgasNoDia } from "./escala.js";

export const TAREFAS_BALCAO = [
  { id: "balcao_prateleiras", texto: "Higienizar balcão e prateleiras", fotos: "antes_depois" },
  { id: "validade", texto: "Verificar validade de todos os produtos expostos", fotos: null },
  { id: "cafeteira", texto: "Limpar e higienizar a cafeteira", fotos: "antes_depois" },
  { id: "vitrine", texto: "Limpar a vitrine por dentro e por fora", fotos: "antes_depois" },
  { id: "geladeira", texto: "Limpar a geladeira de bebidas", fotos: "antes_depois" },
  { id: "descartaveis", texto: "Repor descartáveis e embalagens", fotos: null },
  { id: "estoque_bebidas", texto: "Organizar o estoque de bebidas e revenda", fotos: null },
  { id: "contar_estoque", texto: "Contar o estoque", fotos: null },
  { id: "mercadorias_expostas", texto: "Verificar mercadorias expostas (qualidade, identificação e preço)", fotos: null },
  { id: "maquininhas", texto: "Verificar se as maquininhas estão carregadas", fotos: "uma" },
  // Limpezas da semana (Daiane, 08/11/2026): um dia fixo para cada.
  { id: "lixeiras", texto: "Lavar todas as lixeiras", fotos: "antes_depois", dias: [1] },
  { id: "varanda", texto: "Lavar a varanda", fotos: "antes_depois", dias: [3] },
  { id: "paredes_fora", texto: "Lavar as paredes de fora", fotos: "antes_depois", dias: [5] },
];
const NOMES_DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
export const diasDaTarefa = (t) => (t.dias ? t.dias.map((d) => NOMES_DIAS[d]).join(" e ") : "");

export const PESSOAS_BALCAO = EQUIPE.filter((p) => p.setor === "Balcão").map((p) => p.nome);

const diasDesde = (dia) => { const [a, m, d] = dia.split("-").map(Number); return Math.round(Date.UTC(a, m - 1, d) / 86400000); };

// Devolve [{ tarefa, pessoa }] para o dia. Sem ninguém trabalhando, pessoa fica vazia.
export async function distribuir(dia) {
  const folgas = await folgasNoDia(dia);
  const trabalham = PESSOAS_BALCAO.filter((n) => !folgas.includes(n));
  const giro = diasDesde(dia);
  const [a, m, d] = dia.split("-").map(Number), semana = new Date(a, m - 1, d).getDay();
  return TAREFAS_BALCAO.filter((t) => !t.dias || t.dias.includes(semana)).map((t, i) => ({ tarefa: t, pessoa: trabalham.length ? trabalham[(i + giro) % trabalham.length] : "" }));
}
