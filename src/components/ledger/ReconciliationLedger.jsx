import PropTypes from 'prop-types';
import LedgerRow from './LedgerRow.jsx';

export default function ReconciliationLedger({ rows }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Reconciliation Ledger</h2>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full text-left text-sm border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">transaction_id</th>
              <th className="px-3 py-2">platform_amt</th>
              <th className="px-3 py-2">settled_amt</th>
              <th className="px-3 py-2">gap</th>
              <th className="px-3 py-2">status</th>
              <th className="px-3 py-2">gap_type</th>
            </tr>
          </thead>
          <tbody>{rows.map((row) => <LedgerRow key={row.transaction_id} row={row} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

ReconciliationLedger.propTypes = {
  rows: PropTypes.array.isRequired,
};
