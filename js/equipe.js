// Equipe da loja. "marcaPresenca": quem pode marcar presença e apresentação dos outros.
export const EQUIPE = [
  { nome: "Daiane", setor: "Gestão", marcaPresenca: true, painel: true },
  { nome: "Fábio", setor: "Gestão", painel: true },
  { nome: "Dara", setor: "Caixa", marcaPresenca: true },
  { nome: "Fabrícia", setor: "Caixa" },
  { nome: "Jéssica", setor: "Balcão", marcaPresenca: true },
  { nome: "Natália", setor: "Balcão" },
  { nome: "Flávia", setor: "Balcão" },
  { nome: "Lucas", setor: "Balcão" },
  { nome: "Maurina", setor: "Balcão" },
  { nome: "Ana Clésia", setor: "Lanches" },
  { nome: "Maria Helena", setor: "Lanches" },
];

export const pessoa = (nome) => EQUIPE.find((p) => p.nome === nome);
// Quem tem a presença marcada todo dia (a gestão fica de fora).
export const EQUIPE_DO_TURNO = EQUIPE.filter((p) => p.setor !== "Gestão");
