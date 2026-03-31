GAP_TYPES = {
    'NEXT_MONTH': {
        'id': 'NEXT_MONTH',
        'label': 'Next Month Settlement',
        'severity': 'LOW',
        'action': 'Defer to next month reconciliation run'
    },
    'ROUNDING': {
        'id': 'ROUNDING',
        'label': 'Rounding Difference',
        'severity': 'MEDIUM',
        'action': 'Verify with payment processor rounding rules'
    },
    'DUPLICATE': {
        'id': 'DUPLICATE',
        'label': 'Duplicate Settlement',
        'severity': 'HIGH',
        'action': 'Request bank reversal for duplicate entry'
    },
    'ORPHAN': {
        'id': 'ORPHAN',
        'label': 'Orphan Refund',
        'severity': 'HIGH',
        'action': 'Escalate to finance team — no original transaction found'
    },
    'UNMATCHED': {
        'id': 'UNMATCHED',
        'label': 'No Settlement Found',
        'severity': 'MEDIUM',
        'action': 'Chase bank for settlement status'
    }
}
