/**
 * detect orphan settlement with no matching transaction
 */
import { GAP_TYPES } from '../../constants/gapTypes.js';

export default function detectOrphan(transaction, allSettlements) {
  const exists = allSettlements.some((s) => s.transaction_ref === transaction.transaction_id);
  if (exists) return null;
  return {
    transaction_id: transaction.transaction_id,
    platform_amount: transaction.amount,
    settled_amount: null,
    gap_type: GAP_TYPES.ORPHAN.id,
    gap_amount: transaction.amount,
    recommended_action: GAP_TYPES.ORPHAN.action,
  };
}
