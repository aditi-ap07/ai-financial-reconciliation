from ...constants.gap_types import GAP_TYPES

class DetectDuplicate:
    def evaluate(self, transaction, settlements, config):
        matches = [s for s in settlements if s['transaction_ref'] == transaction['transaction_id']]
        if len(matches) > 1:
            total = sum(s['settled_amount'] for s in matches)
            return {
                'transaction_id': transaction['transaction_id'],
                'platform_amount': transaction['amount'],
                'settled_amount': total,
                'gap_type': GAP_TYPES['DUPLICATE']['id'],
                'gap_amount': round(total - transaction['amount'], 2),
                'recommended_action': GAP_TYPES['DUPLICATE']['action']
            }
        return None
