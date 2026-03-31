/**
 * detect rounding exception between platform and settlement amount.
 */
import { GAP_TYPES } from '../../constants/gapTypes.js';
import { isRoundingDiff } from '../../utils/dates.js';

/**
 * @param {Object} transaction
 * @param {Array} allSettlements
 * @param {Object} config
 * @returns {Object|null}
 */
export default function detectRounding(transaction, allSettlements, config) {
  const settlement = allSettlements.find((s) => s.transaction_ref === transaction.transaction_id);
  if (!settlement) return null;
  const isDiff = isRoundingDiff(transaction.amount, settlement.settled_amount, config.ROUNDING_TOLERANCE);
  if (!isDiff) return null;
  return {
    transaction_id: transaction.transaction_id,
    platform_amount: transaction.amount,
    settled_amount: settlement.settled_amount,
    gap_type: GAP_TYPES.ROUNDING.id,
    gap_amount: Number((settlement.settled_amount - transaction.amount).toFixed(2)),
    recommended_action: GAP_TYPES.ROUNDING.action,
  };
}
