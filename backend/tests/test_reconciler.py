from app.engine.reconciler import Reconciler
from app.data.seed import transactions, settlements


def test_full_reconciliation_report():
    report = Reconciler().reconcile(transactions, settlements)
    assert report['total_exceptions'] == 4
    assert report['match_rate'] == 92.0
    assert report['total_transactions'] == 50
