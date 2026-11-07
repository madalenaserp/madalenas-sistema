// Lista inicial de insumos do estoque. A Daiane muda a lista na tela Estoque → Insumos (fica salva no servidor);
// esta lista só é usada enquanto ela não salvar a dela.
export const INSUMOS_PADRAO = [
  ["farinha", "Farinha de trigo", "kg", 100], ["acucar", "Açúcar", "kg", 20], ["sal", "Sal", "kg", 5],
  ["fermento", "Fermento biológico seco", "pacote", 5], ["melhorador", "Melhorador", "kg", 2],
  ["margarina", "Margarina", "kg", 10], ["manteiga", "Manteiga", "kg", 5], ["gordura", "Gordura vegetal", "kg", 5], ["oleo", "Óleo", "L", 10],
  ["ovos", "Ovos", "cartela (30)", 5], ["leite", "Leite", "L", 12], ["leite_po", "Leite em pó", "kg", 2],
  ["leite_cond", "Leite condensado", "unidade", 12], ["creme_leite", "Creme de leite", "unidade", 12],
  ["coco", "Coco ralado", "kg", 2], ["fuba", "Fubá", "kg", 5], ["goiabada", "Goiabada", "kg", 3], ["doce_leite", "Doce de leite", "kg", 3],
  ["chocolate_po", "Chocolate em pó", "kg", 2], ["nutella", "Nutella", "kg", 1],
  ["mucarela", "Queijo muçarela", "kg", 5], ["presunto", "Presunto", "kg", 5], ["calabresa", "Calabresa", "kg", 3], ["catupiry", "Catupiry", "kg", 2],
  ["gas", "Gás", "botijão", 1], ["saco_pao", "Saco de pão", "pacote", 5], ["embalagem", "Embalagens e bandejas", "pacote", 5],
  ["copo", "Copos descartáveis", "pacote", 5],
].map(([id, nome, unidade, minimo]) => ({ id, nome, unidade, minimo }));
export const LOCAIS = ["Panificadora", "Confeitaria"];
