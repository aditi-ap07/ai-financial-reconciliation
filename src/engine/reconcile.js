/**
 * Core reconciliation engine executes detection rules and summarizes results.
 */
import detectRounding from './rules/detectRounding.js';
import detectDuplicate from './rules/detectDuplicate.js';
import detectNextMonth from './rules/detectNextMonth.js';
import detectUnmatched from './rules/detectUnmatched.js';
import { GAP_TYPES } from '../constants/gapTypes.js';
import { ENGINE_CONFIG } from '../constants/engineConfig.js';

function runRules(transaction, allSettlements, config) {
  const duplicate = detectDuplicate(transaction, allSettlements, config);
  if (duplicate) return duplicate;

  const nextMonth = detectNextMonth(transaction, allSettlements, config);
  if (nextMonth) return nextMonth;

  const rounding = detectRounding(transaction, allSettlements, config);
  if (rounding) return rounding;

  const unmatched = detectUnmatched(transaction, allSettlements, config);
  if (unmatched) return unmatched;

  const settlement = allSettlements.find((s) => s.transaction_ref === transaction.transaction_id);
  return {
    transaction_id: transaction.transaction_id,
    platform_amount: transaction.amount,
    settled_amount: settlement ? settlement.settled_amount : null,
    gap_type: 'MATCHED',
    gap_amount: settlement ? Number((settlement.settled_amount - transaction.amount).toFixed(2)) : 0,
    recommended_action: 'No action required',
  };
}

export function reconcile(transactions, settlements, config = ENGINE_CONFIG) {
  const exceptions = transactions.map((tx) => runRules(tx, settlements, config));

  const orphan = settlements
    .filter((s) => !transactions.some((tx) => tx.transaction_id === s.transaction_ref))
    .map((s) => ({
      transaction_id: s.transaction_ref,
      platform_amount: null,
      settled_amount: s.settled_amount,
      gap_type: GAP_TYPES.ORPHAN.id,
      gap_amount: s.settled_amount,
      recommended_action: GAP_TYPES.ORPHAN.action,
    }));

  const allIssues = [...exceptions, ...orphan];

  const matchedCount = exceptions.filter((e) => e.gap_type === 'MATCHED').length;
  const exceptionCount = allIssues.filter((e) => e.gap_type !== 'MATCHED').length;
  const unmatchedValue = allIssues.reduce((sum, item) => sum + Math.abs(item.gap_amount || 0), 0);

  return {
    total_transactions: transactions.length,
    total_matched: matchedCount,
    total_exceptions: exceptionCount,
    total_unmatched_value: Number(unmatchedValue.toFixed(2)),
    match_rate: Number(((matchedCount / transactions.length) * 100).toFixed(2)),
    items: allIssues,
    exception_summary: allIssues.reduce((s, item) => {
      s.byType[item.gap_type] = (s.byType[item.gap_type] || 0) + 1;
      return s;
    }, { byType: {} }),
  };
}

if (process && process.argv[1] && process.argv[1].endsWith('reconcile.js')) {
  (async () => {
    const { platformTransactions, bankSettlements } = await import('../data/seed.js');
    const report = reconcile(platformTransactions, bankSettlements);
    console.log('Reconciliation report:');
    console.table(report); // eslint-disable-line no-console
  })();
}
