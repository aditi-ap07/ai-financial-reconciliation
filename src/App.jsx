import React, { useMemo, useEffect } from 'react';
import KPICards from './components/dashboard/KPICards.jsx';
import CFONarrative from './components/dashboard/CFONarrative.jsx';
import HealthBar from './components/dashboard/HealthBar.jsx';
import ExceptionsTable from './components/exceptions/ExceptionsTable.jsx';
import ReconciliationLedger from './components/ledger/ReconciliationLedger.jsx';
import GapAnalysisChart from './components/charts/GapAnalysisChart.jsx';
import AuditTrail from './components/audit/AuditTrail.jsx';
import ResolvedTab from './components/audit/ResolvedTab.jsx';
import EngineVersionBadge from './components/shared/EngineVersionBadge.jsx';
import ExportButton from './components/shared/ExportButton.jsx';
import { useReconciliation } from './hooks/useReconciliation.js';
import { useFilters } from './hooks/useFilters.js';
import { useAuditTrail } from './hooks/useAuditTrail.js';
import { exportToCSV } from './utils/csv.js';
import transactions from './data/transactions.js';
import settlements from './data/settlements.js';
import { GAP_TYPES } from './constants/gapTypes.js';

function createDownloadUrl(content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  return URL.createObjectURL(blob);
}

function generateCsvForTransactionData() {
  const columns = ['transaction_id', 'customer_id', 'amount', 'currency', 'created_at', 'status'];
  return exportToCSV(transactions, columns);
}

function generateCsvForSettlementData() {
  const columns = ['settlement_id', 'transaction_ref', 'settled_amount', 'settlement_date', 'batch_id'];
  return exportToCSV(settlements, columns);
}

export default function App() {
  const { summary, exceptions, narrative, dataQuality, confidenceScore, runReconciliation } = useReconciliation();
  const { filter, setFilter, filteredFn } = useFilters('All');
  const { actions, record } = useAuditTrail();

  const filteredExceptions = filteredFn(exceptions);

  const platformCsv = useMemo(generateCsvForTransactionData, []);
  const bankCsv = useMemo(generateCsvForSettlementData, []);

  const platformUrl = useMemo(() => createDownloadUrl(platformCsv), [platformCsv]);
  const bankUrl = useMemo(() => createDownloadUrl(bankCsv), [bankCsv]);

  useEffect(() => {
    console.log('Reconciliation summary object', summary); // eslint-disable-line no-console
  }, [summary]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 bg-slate-50">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Onelab Reconciliation</h1>
        <EngineVersionBadge />
      </header>

      <section>
        <div className="flex gap-2 mb-3">
          <ExportButton url={platformUrl} fileName="platform_transactions.csv" label="Download platform_transactions.csv" />
          <ExportButton url={bankUrl} fileName="bank_settlements.csv" label="Download bank_settlements.csv" />
        </div>
        <KPICards summary={summary} />
      </section>

      <section>
        <CFONarrative text={narrative} />
        <HealthBar percentage={summary.match_rate} />
      </section>

      <ExceptionsTable exceptions={filteredExceptions} filter={filter} onFilterChange={setFilter} />

      <ReconciliationLedger rows={summary.items.map((item) => ({ ...item, status: item.gap_type === 'MATCHED' ? 'Matched' : 'Exception' }))} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GapAnalysisChart summary={summary} />
        <div className="space-y-4">
          <AuditTrail actions={actions} />
          <ResolvedTab resolvedItems={summary.items.filter((i) => i.gap_type !== 'MATCHED').slice(0, 5)} />
        </div>
      </div>

      <section className="bg-white rounded-lg p-4 shadow-sm">
        <details>
          <summary className="font-semibold">Assumptions</summary>
          <ul className="mt-2 list-disc list-inside text-sm">
            <li>All currency is GBP.</li>
            <li>Settlement follows T+2 by default; anomalies are reported.</li>
            <li>Gap types mapped via constants in constants/gapTypes.js.</li>
          </ul>
        </details>
      </section>

      <section className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Data Quality</h2>
        <p className="text-sm">Platform rows: {dataQuality.platformRecords}, Settlements: {dataQuality.settlementRecords}, Orphans: {dataQuality.orphanRecords}, Unmatched: {dataQuality.unmatchedRecords}</p>
        <p className="text-sm">Confidence score: {confidenceScore}</p>
      </section>
    </div>
  );
}
