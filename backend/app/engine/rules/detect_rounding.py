from ..utils.dates import is_next_month
from ...constants.gap_types import GAP_TYPES

class DetectRounding:
    def evaluate(self, transaction, settlements, config):
        matching = [s for s in settlements if s['transaction_ref'] == transaction['transaction_id']]
        if not matching:
            return None
        settled = matching[0]
        diff = abs(transaction['amount'] - settled['settled_amount'])
        if 0 < diff < config['ROUNDING_TOLERANCE']:
            return {
                'transaction_id': transaction['transaction_id'],
                'platform_amount': transaction['amount'],
                'settled_amount': settled['settled_amount'],
                'gap_type': GAP_TYPES['ROUNDING']['id'],
                'gap_amount': round(settled['settled_amount'] - transaction['amount'], 2),
                'recommended_action': GAP_TYPES['ROUNDING']['action']
            }
        return None
