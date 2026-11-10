// Insumos do estoque. Começou do zero em 10/11/2026 (a Daiane pediu): cada item nasce na primeira compra
// (a nota lida cria o item) ou no botão "+ Item novo". Qualquer pessoa da equipe cria; a Daiane arruma
// nome, unidade e mínimo em Estoque → Insumos (fica salvo no servidor, com histórico).
import { ler, listarEntre, acrescentar } from "./db.js";

export const INSUMOS_PADRAO = [];
export const UNIDADES = ["kg", "g", "L", "ml", "unidade", "pacote", "caixa", "saco 25 kg", "saco 5 kg", "cartela (30)", "dúzia", "lata", "pote", "botijão"];

// Lista final = itens criados pela equipe + a arrumação da Daiane (cadastro versão 2 em diante).
export async function carregarListaInsumos() {
  const cad = await ler("estoque_cadastro", "insumos").catch(() => null);
  const valeCad = cad && cad.versao >= 2;
  const novos = await listarEntre("estoque_insumos", "criadoEm", "2026-11-10", "9999").catch(() => []);
  const lista = valeCad ? cad.lista.map((i) => ({ ...i })) : [];
  const removidos = new Set(valeCad ? cad.removidos || [] : []);
  for (const n of novos.sort((a, b) => (a.criadoEm || "").localeCompare(b.criadoEm || "")))
    if (!removidos.has(n.insumoId) && !lista.some((i) => i.id === n.insumoId)) lista.push({ id: n.insumoId, nome: n.nome, unidade: n.unidade, minimo: 0 });
  return lista;
}

// Cria um item novo (qualquer pessoa da equipe). Devolve o item.
export async function criarInsumo(nome, unidade, eu) {
  const id = "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const item = { insumoId: id, nome: nome.trim(), unidade: unidade.trim(), registradoPor: eu.nome, registradoPorUid: eu.uid, criadoEm: new Date().toISOString() };
  await acrescentar("estoque_insumos", item);
  return { id, nome: item.nome, unidade: item.unidade, minimo: 0 };
}

// Lista antiga (até 09/11/2026), guardada só como referência. Não é mais usada.
export const INSUMOS_ANTIGOS = [
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
