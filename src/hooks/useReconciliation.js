/**
 * Hook to run reconciliation engine and provide report state.
 */
import { useMemo, useState } from 'react';
import { reconcile } from '../engine/reconcile.js';
import transactions from '../data/transactions.js';
import settlements from '../data/settlements.js';
import { dataQualityReport } from '../engine/dataQuality.js';
import confidenceScore from '../engine/scoring/confidenceScore.js';
import { generateCFOSummary } from '../utils/narrative.js';
import { ENGINE_CONFIG } from '../constants/engineConfig.js';

export function useReconciliation() {
  const [isRunning, setIsRunning] = useState(false);

  const summary = useMemo(() => {
    setIsRunning(true);
    const report = reconcile(transactions, settlements, ENGINE_CONFIG);
    setIsRunning(false);
    return report;
  }, []);

  const narrative = useMemo(() => generateCFOSummary(summary), [summary]);
  const dataQuality = useMemo(() => dataQualityReport(transactions, settlements), []);
  const score = useMemo(() => confidenceScore(summary.match_rate), [summary]);

  function runReconciliation() {
    return reconcile(transactions, settlements, ENGINE_CONFIG);
  }

  return {
    transactions,
    settlements,
    summary,
    exceptions: summary.items.filter((item) => item.gap_type !== 'MATCHED'),
    narrative,
    dataQuality,
    confidenceScore: score,
    runReconciliation,
    isRunning,
  };
}
