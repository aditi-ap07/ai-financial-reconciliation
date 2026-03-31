/**
 * Check if settlement date is after last day of transaction month
 */
export function isNextMonth(transactionDate, settlementDate) {
  const tx = new Date(transactionDate);
  const settle = new Date(settlementDate);
  const monthEnd = new Date(Date.UTC(tx.getUTCFullYear(), tx.getUTCMonth() + 1, 0, 23, 59, 59));
  return settle > monthEnd;
}

/**
 * Check rounding delta tolerance
 */
export function isRoundingDiff(platformAmount, settledAmount, tolerance) {
  const diff = Math.abs(platformAmount - settledAmount);
  return diff > 0 && diff < tolerance;
}

/**
 * Helper for dates difference in days
 */
export function daysDiff(dateA, dateB) {
  const dA = new Date(dateA);
  const dB = new Date(dateB);
  const diffMs = Math.abs(dA - dB);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
