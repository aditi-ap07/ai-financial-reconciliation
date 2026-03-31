from fastapi import APIRouter
from ...data.store import DATA_STORE

router = APIRouter(prefix='/api/audit')

@router.get('')
def audit_trail():
    return {'success': True, 'data': DATA_STORE['audit'], 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}
