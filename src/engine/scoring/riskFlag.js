/** risk flag for gap amount */
export default function riskFlag(amount, config) {
  if (Math.abs(amount) >= config.HIGH_RISK_AMOUNT) return 'HIGH';
  if (Math.abs(amount) >= config.MEDIUM_RISK_AMOUNT) return 'MEDIUM';
  return 'LOW';
}
