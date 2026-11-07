// Escala semanal (5x2). Uma semana começa na segunda-feira; o documento é escala/{segunda em AAAA-MM-DD}.
// Em cada pessoa: dias = 7 letras, de segunda a domingo ("T" trabalha, "F" folga), e horário livre (ex.: "7h às 16h").
import { ler } from "./db.js";

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const data = (s) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };

export function segundaDe(dia) {
  const d = data(dia);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return iso(d);
}
export function somarDias(dia, n) { const d = data(dia); d.setDate(d.getDate() + n); return iso(d); }
export const indiceDoDia = (dia) => (data(dia).getDay() + 6) % 7; // segunda = 0

// Quem está de folga na escala neste dia (lista de nomes). Se não há escala salva, ninguém.
export async function folgasNoDia(dia) {
  try {
    const e = await ler("escala", segundaDe(dia));
    if (!e?.pessoas) return [];
    const i = indiceDoDia(dia);
    return Object.entries(e.pessoas).filter(([, p]) => p.dias?.[i] === "F").map(([nome]) => nome);
  } catch { return []; }
}
