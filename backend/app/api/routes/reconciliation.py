from fastapi import APIRouter
from ...engine.reconciler import Reconciler
from ...data.seed import transactions, settlements

router = APIRouter(prefix='/api/reconcile')

@router.post('')
def run_reconciliation():
    report = Reconciler().reconcile(transactions, settlements)
    return {'success': True, 'data': report, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}

@router.get('/summary')
def reconciliation_summary():
    report = Reconciler().reconcile(transactions, settlements)
    summary = {
        'total_transactions': report['total_transactions'],
        'total_matched': report['total_matched'],
        'total_gaps': report['total_exceptions'],
        'total_exceptions': report['total_exceptions'],
        'match_rate': report['match_rate'],
        'unmatched_value': report['total_unmatched_value']
    }
    return {'success': True, 'data': summary, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}
