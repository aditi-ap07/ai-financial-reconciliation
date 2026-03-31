/**
 * detect settlement outside transaction month range
 */
import { GAP_TYPES } from '../../constants/gapTypes.js';
import { isNextMonth } from '../../utils/dates.js';

export default function detectNextMonth(transaction, allSettlements) {
  const settlement = allSettlements.find((s) => s.transaction_ref === transaction.transaction_id);
  if (!settlement) return null;
  if (!isNextMonth(transaction.created_at, settlement.settlement_date)) return null;
  return {
    transaction_id: transaction.transaction_id,
    platform_amount: transaction.amount,
    settled_amount: settlement.settled_amount,
    gap_type: GAP_TYPES.NEXT_MONTH.id,
    gap_amount: Number((settlement.settled_amount - transaction.amount).toFixed(2)),
    recommended_action: GAP_TYPES.NEXT_MONTH.action,
  };
}
