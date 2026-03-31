import PropTypes from 'prop-types';
import { formatGBP } from '../../utils/currency.js';

export default function KPICards({ summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-sm text-slate-500">Total Matched</div>
        <div className="text-3xl font-semibold">{summary.total_matched}</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-sm text-slate-500">£ Unmatched</div>
        <div className="text-3xl font-semibold">{formatGBP(summary.total_unmatched_value)}</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-sm text-slate-500"># Exceptions</div>
        <div className="text-3xl font-semibold">{summary.total_exceptions}</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-sm text-slate-500">Match Rate</div>
        <div className="text-3xl font-semibold">{summary.match_rate}%</div>
      </div>
    </div>
  );
}

KPICards.propTypes = {
  summary: PropTypes.object.isRequired,
};
