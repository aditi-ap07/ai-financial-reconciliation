from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import reconciliation, transactions, settlements, exceptions, audit, ai

app = FastAPI(title='Onelab Reconciliation API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(reconciliation.router)
app.include_router(transactions.router)
app.include_router(settlements.router)
app.include_router(exceptions.router)
app.include_router(audit.router)
app.include_router(ai.router)

@app.get('/api/health')
def health_check():
    return {'success': True, 'data': 'ok', 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}

@app.get('/api/seed')
def reload_seed():
    from .data.seed import generate_data
    transactions, settlements = generate_data()
    return {'success': True, 'data': {'transactions': len(transactions), 'settlements': len(settlements)}, 'error': None, 'timestamp': __import__('datetime').datetime.utcnow().isoformat()}
