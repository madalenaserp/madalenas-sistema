// Cardápio do café da manhã (o mesmo do cartaz da loja). Usado nos Pedidos do balcão: a equipe toca no item em vez de escrever.
// Para mudar preço ou item, é só editar aqui.
export const CARDAPIO = [
  { grupo: "Pães e lanches", itens: [
    ["Pão com manteiga", 3.5], ["Pão na chapa", 4.5], ["Pão com ovo", 7], ["Pão com ovo e queijo", 10], ["Pão com mortadela", 7],
    ["Pão com polenguinho", 5], ["Pão com ovo, queijo e presunto", 12], ["Misto quente (pão de forma)", 10], ["Misto quente (pão francês)", 10],
    ["Pão de queijo", 1], ["Pão com queijo e presunto", 9], ["Pão com peito de peru e queijo minas", 12], ["Pão com queijo minas", 8], ["Pão com linguiça", 15],
  ] },
  { grupo: "Adicionais", itens: [["Adicional de queijo prato", 2], ["Adicional de queijo muçarela", 2], ["Adicional de queijo minas", 2], ["Adicional de presunto", 2], ["Adicional de mortadela", 2], ["Adicional de ovo", 2]] },
  { grupo: "Tapiocas", itens: [["Tapioca ovo mexido", 8], ["Tapioca peru com minas", 12], ["Tapioca frango com requeijão", 12], ["Tapioca queijo com presunto", 11]] },
  { grupo: "Coxinhas", itens: [
    ["Coxinha de frango", 9.5], ["Coxinha de frango + Guaraná", 10], ["Coxinha frango com requeijão", 9.5], ["Coxinha frango com requeijão + Guaraná", 10],
    ["Coxinha frango com bacon", 9.5], ["Coxinha frango com bacon + Guaraná", 10], ["Coxinha de carne seca", 11], ["Coxinha de camarão", 11], ["Coxinha de costela", 11],
  ] },
  { grupo: "Sucos naturais", itens: [["Suco de laranja", 7], ["Suco de abacaxi", 7], ["Suco de abacaxi com hortelã", 7.5], ["Suco de maracujá", 7.5], ["Limonada", 7], ["Suco de manga", 8], ["Suco de morango", 8.5], ["Suco de morango com laranja", 9]] },
  { grupo: "Cafés e chocolate", itens: [["Pingado", 5], ["Café expresso", 5], ["Café em grãos", 7], ["Café coado", 4], ["Cappuccino", 8], ["Chocolate quente", 8]] },
].map((g) => ({ grupo: g.grupo, itens: g.itens.map(([nome, preco]) => ({ nome, preco })) }));

export const reais = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
