import PropTypes from 'prop-types';
import ExceptionRow from './ExceptionRow.jsx';
import ExceptionFilters from './ExceptionFilters.jsx';

export default function ExceptionsTable({ exceptions, filter, onFilterChange }) {
  const filtered = filter === 'All' ? exceptions : exceptions.filter((e) => e.gap_type === filter);
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Exceptions Table</h2>
        <ExceptionFilters filter={filter} onChange={onFilterChange} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">transaction_id</th>
              <th className="px-3 py-2">platform_amt</th>
              <th className="px-3 py-2">settled_amt</th>
              <th className="px-3 py-2">gap</th>
              <th className="px-3 py-2">type</th>
              <th className="px-3 py-2">action</th>
            </tr>
          </thead>
          <tbody>{filtered.map((ex) => <ExceptionRow key={`${ex.transaction_id}-${ex.gap_type}`} exception={ex} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

ExceptionsTable.propTypes = {
  exceptions: PropTypes.array.isRequired,
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};
