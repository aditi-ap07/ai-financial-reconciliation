/** produce CFO-style summary sentence */
export function generateCFOSummary(summary) {
  return `In this cycle, ${summary.total_transactions} transactions were evaluated, with ${summary.total_matched} matched and ${summary.total_exceptions} exceptions; match rate ${summary.match_rate}%`;
}
