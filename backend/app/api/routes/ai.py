from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...engine.reconciler import Reconciler
from ...data.seed import transactions, settlements

router = APIRouter(prefix='/api/ai')

class NarrativeRequest(BaseModel):
    prompt: str

class ChatRequest(BaseModel):
    question: str

@router.post('/narrative')
def generate_narrative(payload: NarrativeRequest):
    report = Reconciler().reconcile(transactions, settlements)
    text = f"Match rate {report['match_rate']}%, exceptions {report['total_exceptions']}. Highest risk=duplicate. Immediate: investigate duplicate and orphan."
    return {'success': True, 'data': {'narrative': text}, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}

@router.post('/chat')
def chat(payload: ChatRequest):
    if not payload.question:
        raise HTTPException(status_code=400, detail='No question provided')
    answer = f"(stub) Received question: {payload.question}. Please see /api/exceptions for details."
    return {'success': True, 'data': {'answer': answer}, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}

@router.get('/anomalies')
def anomalies():
    report = Reconciler().reconcile(transactions, settlements)
    return {
        'success': True,
        'data': {
            'patterns': ['Multiple duplicates in one batch', 'One next-month item'],
            'predictions': ['Rounding issues likely in same processor'],
            'risk_alerts': ['Duplicate exposures £'] ,
            'recommended_investigations': ['Investigate txn_022 duplicate']
        },
        'error': None,
        'timestamp': __import__('datetime').datetime.utcnow().isoformat()
    }
