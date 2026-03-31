import PropTypes from 'prop-types';
import { formatGBP } from '../../utils/currency.js';

export default function ExceptionRow({ exception }) {
  return (
    <tr className="bg-white">
      <td className="px-3 py-2 border">{exception.transaction_id}</td>
      <td className="px-3 py-2 border">{exception.platform_amount != null ? formatGBP(exception.platform_amount) : '-'}</td>
      <td className="px-3 py-2 border">{exception.settled_amount != null ? formatGBP(exception.settled_amount) : '-'}</td>
      <td className="px-3 py-2 border">{formatGBP(Math.abs(exception.gap_amount))}</td>
      <td className="px-3 py-2 border">{exception.gap_type}</td>
      <td className="px-3 py-2 border">{exception.recommended_action}</td>
    </tr>
  );
}

ExceptionRow.propTypes = {
  exception: PropTypes.object.isRequired,
};
