/**
 * detect duplicate settlement entries for a transaction
 */
import { GAP_TYPES } from '../../constants/gapTypes.js';

export default function detectDuplicate(transaction, allSettlements) {
  const matches = allSettlements.filter((s) => s.transaction_ref === transaction.transaction_id);
  if (matches.length <= 1) return null;
  return {
    transaction_id: transaction.transaction_id,
    platform_amount: transaction.amount,
    settled_amount: matches.reduce((sum, item) => sum + item.settled_amount, 0),
    gap_type: GAP_TYPES.DUPLICATE.id,
    gap_amount: Number((matches.reduce((sum, item) => sum + item.settled_amount, 0) - transaction.amount).toFixed(2)),
    recommended_action: GAP_TYPES.DUPLICATE.action,
  };
}
