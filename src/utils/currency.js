/** format number to GBP string */
export function formatGBP(value) {
  return `£${Number(value).toFixed(2)}`;
}

/** parse string with currency signs into number */
export function parseCurrency(value) {
  if (typeof value !== 'string') return Number(value);
  return Number(value.replace(/[^0-9.-]+/g, ''));
}
