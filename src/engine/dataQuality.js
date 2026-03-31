/** sample simple data quality metric set from existing data */
export function dataQualityReport(transactions, settlements) {
  const missingAtPlatform = settlements.filter((s) => !transactions.some((t) => t.transaction_id === s.transaction_ref)).length;
  const unmatched = transactions.filter((t) => !settlements.some((s) => s.transaction_ref === t.transaction_id)).length;
  return {
    platformRecords: transactions.length,
    settlementRecords: settlements.length,
    orphanRecords: missingAtPlatform,
    unmatchedRecords: unmatched,
  };
}
