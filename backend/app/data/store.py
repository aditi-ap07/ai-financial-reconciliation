from .seed import transactions, settlements

DATA_STORE = {
    'transactions': {tx['transaction_id']: tx for tx in transactions},
    'settlements': {s['settlement_id']: s for s in settlements},
    'exceptions': {},
    'audit': []
}
