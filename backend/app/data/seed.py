from datetime import datetime, timedelta


def deterministic_random(seed):
    while True:
        seed = (seed * 9301 + 49297) % 233280
        yield seed / 233280


def generate_data():
    rand = deterministic_random(42)
    transactions = []
    payment_methods = ['card', 'bank_transfer', 'wallet']
    merchants = ['Acme Toys', 'Nimbus Coffee', 'Grove Books', 'Stellar Apparel', 'Quantum Goods']

    for i in range(1, 51):
        tid = f'txn_{i:03d}'
        amount = float(f'{5 + next(rand) * 495:.2f}')
        if tid == 'txn_017':
            amount = 142.87
        created_at = datetime(2025, 3, 1) + timedelta(days=(i - 1) % 31, hours=(i % 24))
        if tid == 'txn_031':
            created_at = datetime(2025, 3, 28, 12)
        transactions.append({
            'transaction_id': tid,
            'customer_id': f'CUST_{i:03d}',
            'amount': amount,
            'currency': 'GBP',
            'created_at': created_at.isoformat(),
            'status': 'settled' if i % 10 != 0 else 'pending',
            'merchant_name': merchants[i % len(merchants)],
            'payment_method': payment_methods[i % len(payment_methods)],
        })

    settlements = []
    for tx in transactions:
        if tx['transaction_id'] == 'txn_010':
            continue

        settlement_date = datetime.fromisoformat(tx['created_at']) + timedelta(days=2)
        if tx['transaction_id'] == 'txn_031':
            settlement_date = datetime(2025, 4, 2, 10)

        settled_amount = tx['amount']
        if tx['transaction_id'] == 'txn_017':
            settled_amount = 142.86

        sid = f'SETL_{tx["transaction_id"][4:]}'
        settlements.append({
            'settlement_id': sid,
            'transaction_ref': tx['transaction_id'],
            'settled_amount': settled_amount,
            'settlement_date': settlement_date.date().isoformat(),
            'batch_id': f'BATCH_{(int(tx["transaction_id"][4:]) % 10) + 1:03d}',
            'bank_reference': f'BR_{sid}',
        })

        if tx['transaction_id'] == 'txn_022':
            settlements.append({
                'settlement_id': 'SETL_089',
                'transaction_ref': 'txn_022',
                'settled_amount': settled_amount,
                'settlement_date': settlement_date.date().isoformat(),
                'batch_id': 'BATCH_004',
                'bank_reference': 'BR_SETL_089',
            })
            settlements.append({
                'settlement_id': 'SETL_090',
                'transaction_ref': 'txn_022',
                'settled_amount': settled_amount,
                'settlement_date': settlement_date.date().isoformat(),
                'batch_id': 'BATCH_004',
                'bank_reference': 'BR_SETL_090',
            })
            settlements = [s for s in settlements if s['settlement_id'] != sid]

    settlements.append({
        'settlement_id': 'SETL_REFUND',
        'transaction_ref': None,
        'settled_amount': -67.5,
        'settlement_date': '2025-03-28',
        'batch_id': 'BATCH_009',
        'bank_reference': 'BR_REFUND_001',
    })

    return transactions, settlements


transactions, settlements = generate_data()
