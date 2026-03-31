from .rules.detect_rounding import DetectRounding
from .rules.detect_duplicate import DetectDuplicate
from .rules.detect_next_month import DetectNextMonth
from .rules.detect_unmatched import DetectUnmatched
from ..constants.gap_types import GAP_TYPES
from ..constants.engine_config import ENGINE_CONFIG

class Reconciler:
    def __init__(self, config=ENGINE_CONFIG):
        self.config = config
        self.rules = [DetectDuplicate(), DetectNextMonth(), DetectRounding(), DetectUnmatched()]

    def reconcile(self, transactions, settlements):
        exceptions = []
        matched = 0

        for tx in transactions:
            exception = None
            for rule in self.rules:
                exception = rule.evaluate(tx, settlements, self.config)
                if exception:
                    exceptions.append(exception)
                    break
            if not exception:
                matched += 1

        orphan = [s for s in settlements if s['transaction_ref'] is None or not any(t['transaction_id'] == s['transaction_ref'] for t in transactions)]
        for s in orphan:
            exceptions.append({
                'transaction_id': s.get('transaction_ref') or 'REF_REFUND_001',
                'platform_amount': None,
                'settled_amount': s['settled_amount'],
                'gap_type': GAP_TYPES['ORPHAN']['id'],
                'gap_amount': s['settled_amount'],
                'recommended_action': GAP_TYPES['ORPHAN']['action']
            })

        total = len(transactions)
        summary = {
            'total_transactions': total,
            'total_matched': matched,
            'total_exceptions': len(exceptions),
            'total_unmatched_value': round(sum(abs(e['gap_amount']) for e in exceptions), 2),
            'match_rate': round((matched / total) * 100, 2) if total else 0,
            'items': exceptions
        }
        return summary


def main():
    from ..data.seed import transactions, settlements
    report = Reconciler().reconcile(transactions, settlements)
    print('Reconciliation report')
    print(report)


if __name__ == '__main__':
    main()
