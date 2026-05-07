/**
 * Aplica máscara de data no formato brasileiro (DD/MM/AAAA) enquanto o
 * usuário digita.
 */
export function maskBrDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Converte uma data no formato brasileiro (DD/MM/AAAA) para o formato
 * ISO esperado pelo backend (YYYY-MM-DD). Retorna `null` se a data for
 * inválida.
 */
export function brDateToIso(value: string): string | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);

  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValid) {
    return null;
  }

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Converte uma data ISO (YYYY-MM-DD) vinda do backend para o formato
 * brasileiro (DD/MM/AAAA) para exibição. Retorna a string original se
 * não estiver no formato esperado.
 */
export function isoDateToBr(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return value;
  }
  const [, yyyy, mm, dd] = match;
  return `${dd}/${mm}/${yyyy}`;
}
