from fastapi import APIRouter
from ...data.seed import settlements

router = APIRouter(prefix='/api/settlements')

@router.get('')
def get_settlements():
    return {'success': True, 'data': settlements, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}
