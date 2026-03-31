from ...constants.gap_types import GAP_TYPES
from ..utils.dates import is_next_month

class DetectNextMonth:
    def evaluate(self, transaction, settlements, config):
        matching = [s for s in settlements if s['transaction_ref'] == transaction['transaction_id']]
        if not matching:
            return None
        settled = matching[0]
        if is_next_month(transaction['created_at'], settled['settlement_date']):
            return {
                'transaction_id': transaction['transaction_id'],
                'platform_amount': transaction['amount'],
                'settled_amount': settled['settled_amount'],
                'gap_type': GAP_TYPES['NEXT_MONTH']['id'],
                'gap_amount': round(settled['settled_amount'] - transaction['amount'], 2),
                'recommended_action': GAP_TYPES['NEXT_MONTH']['action']
            }
        return None
