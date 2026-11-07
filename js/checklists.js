// Checklists da loja, tirados das folhas da Central de Documentos (Salão e Caixa).
// Para mudar um item, mude só o texto aqui. Cada lista é independente.
// foto: true = o item só é marcado com uma foto tirada na hora (prova do que foi feito).
// tipo do item: "check" (padrão) | "numero" (pede um valor, ex.: temperatura) | "dinheiro" (valor em R$).
// quem: "todos" (qualquer pessoa ativa) ou "caixa" (caixa, líderes e gestão).

export const CHECKLISTS = [
  {
    id: "salao_abertura", titulo: "Abertura do salão", setor: "Salão", quem: "todos", porTurno: true,
    secoes: [
      ["Equipe", [
        "Escalados presentes, cada um na função definida pela gestão (ausência ou atraso vai para o Livro)",
        "Uniforme limpo, avental, cabelo preso, unhas curtas sem adornos; mãos lavadas",
        "Pendências do turno anterior lidas no Livro",
      ]],
      ["Equipamentos", [
        "Maquininhas de cartão carregadas e funcionando; carregadores organizados",
        "Sistema de vendas funcionando e bobinas disponíveis",
        "Televisão funcionando e limpa (sem aplicar produto direto na tela)",
        { texto: "Máquina de café e equipamentos de lanche limpos e em condições de uso", foto: true },
        { texto: "Temperatura da vitrine refrigerada (°C)", tipo: "numero", foto: true },
        { texto: "Temperatura da geladeira de bebidas (°C)", tipo: "numero", foto: true },
      ]],
      ["Limpeza e organização", [
        { texto: "Balcão, vitrine (vidro por dentro e por fora), mesas e cadeiras limpos; chão varrido e com pano", foto: true },
        { texto: "Banheiro limpo e abastecido; lixeiras vazias com saco novo", foto: true },
        "Guardanapos, açúcar/adoçante, canudos, copos e embalagens abastecidos; utensílios completos e sem dano",
      ]],
      ["Produtos e vitrine", [
        "Café feito e disponível",
        "Pão de queijo, salgados, coxinhas fritas e frios disponíveis (conferir com a produção)",
        "Frios fatiados conforme a necessidade",
        "Validade e qualidade de todos os expostos conferidas; o que reprovar sai da vitrine e é anotado como perda",
        { texto: "Vitrine padronizada, sem excesso nem vazios, tudo com identificação e preço; bebidas e revenda abastecidas", foto: true },
        "Faltas ou estoque baixo comunicados à produção",
      ]],
      ["Pedidos das empresas e encomendas", [
        "Encomendas do dia conferidas: quais estão prontas e quais pendentes",
        "Pedidos das empresas separados e conferidos (produto, quantidade, identificação)",
        "Foto de cada nota assinada tirada no sistema (Notas das empresas)",
        "Atrasos ou divergências comunicados ao responsável",
      ]],
      ["Conferência final", [
        "Equipe posicionada, vitrine e caixa prontos; luzes, som e placa \"Aberto\" ligados",
      ]],
    ],
  },
  {
    id: "salao_rondas", titulo: "Ronda do salão", setor: "Salão", quem: "todos", repetivel: true,
    ajuda: "Uma ronda a cada 1 hora (ou a cada 30 min no horário de pico). Quem faz: atendente da vez.",
    secoes: [
      ["Ronda", [
        "Mesas limpas e sem louça",
        "Balcão limpo",
        "Vitrine com pelo menos metade de cada item (senão, pedir reposição à produção)",
        "Lixeiras abaixo da metade",
        "Banheiro em ordem",
      ]],
    ],
  },
  {
    id: "salao_fechamento", titulo: "Fechamento do salão", setor: "Salão", quem: "todos",
    ajuda: "Seguir na ordem. A conferência vai junto com o envelope do caixa.",
    secoes: [
      ["Vitrine e produtos", [
        "Contar o que sobrou na vitrine e anotar como perda (ou separar para promoção, se a regra permitir)",
        "Guardar refrigerados na geladeira, tampados e etiquetados com a data",
        "Passar para a produção a lista do que mais faltou hoje",
      ]],
      ["Máquinas e equipamentos", [
        "Conferir todas as maquininhas de cartão usadas no turno",
        { texto: "Maquininhas carregando para o dia seguinte (luz ou ícone de carga aceso)", foto: true },
        { texto: "Quantas maquininhas ficaram carregando", tipo: "numero" },
        "Equipamentos guardados nos locais definidos",
        "Televisão limpa com material apropriado e desligada",
      ]],
      ["Encomendas", [
        "Encomendas de hoje conferidas; as pendentes anotadas no Livro",
        "Encomendas de amanhã conferidas (produto, quantidade, cliente e horário) e comunicadas à produção",
      ]],
      ["Limpeza e organização", [
        "Balcões, vitrines (por dentro e por fora), mesas e cadeiras limpos; cadeiras viradas sobre as mesas",
        { texto: "Máquina de café higienizada conforme o manual (bicos, grupo, bandeja) e demais equipamentos e utensílios", foto: true },
        { texto: "Louça lavada e guardada; pia vazia", foto: true },
        { texto: "Chão varrido e com pano", foto: true },
        { texto: "Banheiro do cliente limpo e reabastecido", foto: true },
        { texto: "Lixo retirado; lixeiras higienizadas com saco novo", foto: true },
        "Materiais de atendimento e embalagens organizados; descartáveis repostos para amanhã",
        "Ambiente limpo, organizado e pronto para a próxima abertura",
      ]],
      ["Segurança", [
        "Luzes e som desligados (os equipamentos ficam ligados)",
        "Janelas e portas trancadas",
      ]],
    ],
  },
  {
    id: "caixa_abertura", titulo: "Abertura do caixa", setor: "Caixa", quem: "caixa", porTurno: true,
    ajuda: "Quem faz: operador junto com o líder do turno.",
    secoes: [
      ["Abertura", [
        { texto: "Fundo de troco contado junto com o líder (R$)", tipo: "dinheiro", esperado: 120 },
        "Maquininhas ligadas, com bateria e papel",
        "QR Code do Pix no balcão",
        "Na gaveta: folha de fechamento, bloco de vales e envelopes de sangria",
      ]],
    ],
  },
  {
    id: "caixa_fechamento", titulo: "Fechamento do caixa", setor: "Caixa", quem: "caixa", porTurno: true,
    ajuda: "Quem faz: operador junto com o líder do turno.",
    secoes: [
      ["Fechamento", [
        { texto: "Relatório de fechamento de cada maquininha tirado", foto: true },
        { texto: "Fundo de troco do dia seguinte separado (R$)", tipo: "dinheiro", esperado: 120 },
        "Dinheiro restante contado",
        "Sangrias e vales do dia somados",
        "Folha de Fechamento de Caixa preenchida",
        { texto: "Diferença do caixa (R$, use - se faltou)", tipo: "dinheiro", diferenca: true },
        "Envelope montado: dinheiro, relatórios, vales e folha",
        { texto: "Envelope lacrado, assinado pelos dois e guardado no cofre", foto: true },
      ]],
    ],
  },
];

// Lista plana de itens de um checklist, com número.
export function itensDe(lista) {
  const itens = [];
  for (const [secao, xs] of lista.secoes)
    for (const x of xs) itens.push({ secao, ...(typeof x === "string" ? { texto: x, tipo: "check" } : { tipo: "check", ...x }), n: itens.length });
  return itens;
}
