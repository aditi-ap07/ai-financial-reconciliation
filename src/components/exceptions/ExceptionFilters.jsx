import PropTypes from 'prop-types';

export default function ExceptionFilters({ filter, onChange }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-slate-500">Filter:</span>
      <select value={filter} onChange={(e) => onChange(e.target.value)} className="border rounded px-2 py-1">
        <option value="All">All</option>
        <option value="NEXT_MONTH">Next Month</option>
        <option value="ROUNDING">Rounding</option>
        <option value="DUPLICATE">Duplicate</option>
        <option value="ORPHAN">Orphan</option>
        <option value="UNMATCHED">Unmatched</option>
      </select>
    </div>
  );
}

ExceptionFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
