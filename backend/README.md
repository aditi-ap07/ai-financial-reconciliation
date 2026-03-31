# Onelab Reconciliation Backend

FastAPI backend for payments reconciliation.

## Quickstart

1. python -m venv .venv
2. .venv\Scripts\activate
3. pip install -r requirements.txt
4. uvicorn app.main:app --reload --port 8000

## Endpoints

- GET /api/health
- GET /api/seed
- POST /api/reconcile
- GET /api/reconcile/summary
- GET /api/transactions
- GET /api/settlements
- GET /api/exceptions
- PATCH /api/exceptions/{id}/action
- GET /api/audit
- GET /api/ai/anomalies
- POST /api/ai/narrative
- POST /api/ai/chat
