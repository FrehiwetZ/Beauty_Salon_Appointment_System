export const CURRENCY = 'ETB';
export const CURRENCY_SYMBOL = 'ETB';

/**
 * Format a number or numeric string as Ethiopian Birr (ETB).
 * Example: 800 -> "800 ETB", 45200 -> "45,200 ETB"
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return `0 ${CURRENCY}`;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `0 ${CURRENCY}`;
  return `${num.toLocaleString()} ${CURRENCY}`;
}

export default formatCurrency;
