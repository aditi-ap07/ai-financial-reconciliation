from ...constants.gap_types import GAP_TYPES

class DetectUnmatched:
    def evaluate(self, transaction, settlements, config):
        if not any(s['transaction_ref'] == transaction['transaction_id'] for s in settlements):
            return {
                'transaction_id': transaction['transaction_id'],
                'platform_amount': transaction['amount'],
                'settled_amount': None,
                'gap_type': GAP_TYPES['UNMATCHED']['id'],
                'gap_amount': transaction['amount'],
                'recommended_action': GAP_TYPES['UNMATCHED']['action']
            }
        return None
