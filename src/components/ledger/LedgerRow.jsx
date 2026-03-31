import PropTypes from 'prop-types';
import { formatGBP } from '../../utils/currency.js';

export default function LedgerRow({ row }) {
  const rowClass = row.gap_type === 'MATCHED' ? 'bg-emerald-50' : 'bg-rose-50';
  return (
    <tr className={rowClass}>
      <td className="px-3 py-2 border">{row.transaction_id}</td>
      <td className="px-3 py-2 border">{formatGBP(row.platform_amount)}</td>
      <td className="px-3 py-2 border">{row.settled_amount != null ? formatGBP(row.settled_amount) : '-'}</td>
      <td className="px-3 py-2 border">{formatGBP(Math.abs(row.gap_amount))}</td>
      <td className="px-3 py-2 border">{row.status}</td>
      <td className="px-3 py-2 border">{row.gap_type}</td>
    </tr>
  );
}

LedgerRow.propTypes = {
  row: PropTypes.object.isRequired,
};
