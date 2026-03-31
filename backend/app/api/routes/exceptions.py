from fastapi import APIRouter, Query
from ...engine.reconciler import Reconciler
from ...data.seed import transactions, settlements

router = APIRouter(prefix='/api/exceptions')

@router.get('')
def list_exceptions(gap_type: str = Query(None)):
    report = Reconciler().reconcile(transactions, settlements)
    exceptions = report['items']
    if gap_type:
        exceptions = [e for e in exceptions if e['gap_type'] == gap_type]
    return {'success': True, 'data': exceptions, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}

@router.patch('/{exception_id}/action')
def action_exception(exception_id: str, action: str):
    # No persistence in this in-memory PoC
    return {'success': True, 'data': {'exception_id': exception_id, 'action': action}, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}
