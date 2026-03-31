from app.engine.rules.detect_next_month import DetectNextMonth


def test_detect_next_month():
    rule = DetectNextMonth()
    tx = {'transaction_id': 'txn_031', 'amount': 100.0, 'created_at': '2025-03-28T00:00:00'}
    settlements = [{'transaction_ref': 'txn_031', 'settled_amount': 100.0, 'settlement_date': '2025-04-02'}]
    result = rule.evaluate(tx, settlements, {})
    assert result['gap_type'] == 'NEXT_MONTH'


def test_march_31_not_next_month():
    rule = DetectNextMonth()
    tx = {'transaction_id': 'txn_050', 'amount': 100.0, 'created_at': '2025-03-30T00:00:00'}
    settlements = [{'transaction_ref': 'txn_050', 'settled_amount': 100.0, 'settlement_date': '2025-03-31'}]
    assert rule.evaluate(tx, settlements, {}) is None
