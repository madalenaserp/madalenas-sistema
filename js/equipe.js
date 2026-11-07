// Equipe e funções.
// papel: "dona" (tudo), "gestor" (vê o painel), "lider" (marca presença), "equipe".
// No sistema ligado ao Firebase, o papel que vale é o da coleção "usuarios" (as regras do servidor
// leem de lá). Esta lista serve para a tela de presença e para o modo teste.
export const EQUIPE = [
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

export const pessoa = (nome) => EQUIPE.find((p) => p.nome === nome);
export const EQUIPE_DO_TURNO = EQUIPE.filter((p) => p.setor !== "Gestão");

// O que cada função pode fazer.
export const pode = {
  marcarPresenca: (u) => ["dona", "lider"].includes(u?.papel),
  verPainel: (u) => ["dona", "gestor"].includes(u?.papel),
  gerirEquipe: (u) => u?.papel === "dona",
};
