from fastapi import APIRouter
from ...data.seed import transactions

router = APIRouter(prefix='/api/transactions')

@router.get('')
def get_transactions():
    return {'success': True, 'data': transactions, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}
