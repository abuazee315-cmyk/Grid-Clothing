export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Formats a number into Indian Rupee (INR) currency representation.
 * e.g., 7999 -> "₹7,999" or 1489200 -> "₹14,89,200"
 */
export function formatINR(amount: number, includeDecimals: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);

  return `₹${formatted}`;
}

/**
 * Formats price cleanly. If there are fractional paise, shows 2 decimals, else integer.
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  const hasDecimals = amount % 1 !== 0;
  return formatINR(amount, hasDecimals);
}

/**
 * Compact format for analytics charts, e.g. 7480000 -> "₹74.8L" or 45000 -> "₹45k"
 */
export function formatINRCompact(val: number): string {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(1)}Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)}L`;
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(0)}k`;
  }
  return `₹${val}`;
}
