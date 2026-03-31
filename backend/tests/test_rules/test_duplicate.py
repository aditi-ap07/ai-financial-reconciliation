from app.engine.rules.detect_duplicate import DetectDuplicate


def test_detect_duplicate():
    rule = DetectDuplicate()
    tx = {'transaction_id': 'txn_022', 'amount': 100.0}
    settlements = [
        {'transaction_ref': 'txn_022', 'settled_amount': 100.0},
        {'transaction_ref': 'txn_022', 'settled_amount': 100.0}
    ]
    result = rule.evaluate(tx, settlements, {})
    assert result['gap_type'] == 'DUPLICATE'


def test_no_duplicate():
    rule = DetectDuplicate()
    tx = {'transaction_id': 'txn_001', 'amount': 100.0}
    settlements = [{'transaction_ref': 'txn_001', 'settled_amount': 100.0}]
    assert rule.evaluate(tx, settlements, {}) is None
