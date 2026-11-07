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

// Pesada da massa mandada pelo Daniel (07/11/2026). Número maior que 0,5: kg de massa por pesada (divisora).
// Número pequeno: peso de cada pão em kg. Serve só de sugestão na ficha técnica; quem preenche confirma.
export const PESADAS = {
  "Pão hambúrguer": 2.5, "Pão hot dog": 2.5, "Broa de coco": 2.5, "Broa de milho": 2.5, "Massa fina": 1.5,
  "Brioche de milho": 1.5, "Brioche de coco": 1.5, "Brioche salgado": 1.5, "Colegial goiabada com creme": 1.5,
  "Pão doce creme, leite condensado e coco": 1.5, "Mini sonho de creme": 0.8, "Mini sonho de doce de leite": 0.8,
  "Rosca doce": 2.5, "Trança creme, goiabada e coco": 2.5, "Pão de alho": 1.5, "Baguete amanteigada": 0.14,
  "Pão francês rústico amanteigado": 0.07, "Semi italiano amanteigado": 0.25, "Sacadura": 0.07, "Coiozinho": 1.2,
  "Hambúrguinho": 0.8, "Pão francês": 1.7, "Pão pizza": 1.5,
};
