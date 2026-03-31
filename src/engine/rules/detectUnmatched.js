/**
 * detect platform transaction with no settlement
 */
import { GAP_TYPES } from '../../constants/gapTypes.js';

export default function detectUnmatched(transaction, allSettlements) {
  const match = allSettlements.some((s) => s.transaction_ref === transaction.transaction_id);
  if (match) return null;
  return {
    transaction_id: transaction.transaction_id,
    platform_amount: transaction.amount,
    settled_amount: null,
    gap_type: GAP_TYPES.UNMATCHED.id,
    gap_amount: transaction.amount,
    recommended_action: GAP_TYPES.UNMATCHED.action,
  };
}
