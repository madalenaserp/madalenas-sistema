// Lista de produtos usada em Produção e em Perdas (para comparar produzido x perdido, use sempre o mesmo nome).
// Para mudar a lista, mude só aqui. A pessoa também pode escrever um produto que não está na lista.
// Produção diária da panificadora (lista mandada pelo Daniel, 07/11/2026).
export const PRODUTOS_PRODUCAO = ["Pão francês", "Pão francês rústico amanteigado", "Semi italiano amanteigado", "Baguete amanteigada", "Sacadura",
  "Pão hambúrguer", "Pão hot dog", "Hambúrguinho", "Coiozinho", "Pão de alho", "Pão pizza", "Massa fina",
  "Broa de coco", "Broa de milho", "Brioche de milho", "Brioche de coco", "Brioche salgado",
  "Colegial goiabada com creme", "Pão doce creme, leite condensado e coco", "Rosca doce", "Trança creme, goiabada e coco",
  "Mini sonho de creme", "Mini sonho de doce de leite", "Mini sonho de Nutella", "Cuca de banana",
  "Italiano queijo e presunto", "Italiano queijo, presunto e cebola", "Esfiha calabresa com catupiry", "Hambúrguer de forno"];
// Outros itens que também podem ser perdidos no balcão.
export const OUTROS_PRODUTOS = ["Pão de queijo", "Coxinha", "Salgado frito", "Salgado assado", "Bolo (fatia)", "Bolo inteiro",
  "Torta (fatia)", "Torta inteira", "Croissant", "Frios", "Leite", "Bebida", "Café coado"];
export const PRODUTOS = [...PRODUTOS_PRODUCAO, ...OUTROS_PRODUTOS];
export const UNIDADES = ["unidade", "kg", "fatia", "bandeja"];
// Junta "Pão Francês " e "pão francês" no mesmo produto.
export const chaveProduto = (produto, unidade) => `${String(produto).trim().toLowerCase()}|${unidade}`;
