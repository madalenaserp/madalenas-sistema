// Limpeza e organização da cozinha (panificadora e confeitaria). Não tem rodízio fixo:
// quem fizer a tarefa registra com o próprio nome e a foto. Para mudar a lista, mude só aqui.
// fotos: "antes_depois" pede foto antes e depois; "uma" pede uma foto no fim; null só marca feita.
// freq: "diaria" volta todo dia; "semanal" fica pendente até alguém fazer na semana (segunda a domingo).
export const TAREFAS_COZINHA = [
  { id: "bancadas", texto: "Limpar bancadas e mesas de trabalho", fotos: "antes_depois", freq: "diaria" },
  { id: "masseira", texto: "Limpar masseira e batedeira", fotos: "antes_depois", freq: "diaria" },
  { id: "cilindro", texto: "Limpar cilindro e modeladora", fotos: "antes_depois", freq: "diaria" },
  { id: "formas", texto: "Lavar e guardar formas e assadeiras", fotos: "uma", freq: "diaria" },
  { id: "chao", texto: "Varrer e lavar o chão", fotos: "antes_depois", freq: "diaria" },
  { id: "insumos_abertos", texto: "Fechar e identificar insumos abertos (nome e data)", fotos: "uma", freq: "diaria" },
  { id: "lixo", texto: "Tirar o lixo", fotos: null, freq: "diaria" },
  { id: "forno", texto: "Limpar o forno por dentro", fotos: "antes_depois", freq: "semanal" },
  { id: "geladeira", texto: "Limpar e organizar geladeira e câmara fria", fotos: "antes_depois", freq: "semanal" },
  { id: "estoque", texto: "Organizar o estoque de farinha e insumos", fotos: "antes_depois", freq: "semanal" },
  { id: "prateleiras", texto: "Limpar armários e prateleiras", fotos: "antes_depois", freq: "semanal" },
];
export const COZINHAS = ["Panificadora", "Confeitaria"];
