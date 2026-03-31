from app.engine.rules.detect_rounding import DetectRounding


def test_detect_rounding():
    rule = DetectRounding()
    tx = {'transaction_id': 'txn_017', 'amount': 142.87, 'created_at': '2025-03-17T00:00:00'}
    settlements = [{'transaction_ref': 'txn_017', 'settled_amount': 142.86, 'settlement_date': '2025-03-19'}]
    result = rule.evaluate(tx, settlements, {'ROUNDING_TOLERANCE': 0.05})
    assert result['gap_type'] == 'ROUNDING'


def test_no_rounding():
    rule = DetectRounding()
    tx = {'transaction_id': 'txn_001', 'amount': 100.0, 'created_at': '2025-03-01T00:00:00'}
    settlements = [{'transaction_ref': 'txn_001', 'settled_amount': 100.0, 'settlement_date': '2025-03-03'}]
    assert rule.evaluate(tx, settlements, {'ROUNDING_TOLERANCE': 0.05}) is None
