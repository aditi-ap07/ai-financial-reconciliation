# Onelab Reconciliation

Production-style payments reconciliation system with FastAPI backend and React frontend.

## Quickstart (3 commands)

```bash
git clone <repo>
cd onelab-reconciliation
docker-compose up --build
```

## Services

- backend: http://localhost:8000
- frontend: http://localhost:5173

## Free API keys

- Gemini: https://cloud.google.com/vertex-ai/docs/generative-ai
- Groq: https://groq.com/console

## Add new gap type rule (5 steps)

1. Add definition to `backend/app/constants/gap_types.py`
2. Implement rule in `backend/app/engine/rules` following BaseRule interface
3. Include rule in `Reconciler` rules list
4. Add tests under `backend/tests/test_rules`
5. Update UI `frontend/src/constants/gapTypes.js` and display logic

## Production limitations

- This system assumes 1:1 transaction-to-settlement mapping — partial settlements and batch decomposition are not handled.
- All AI narrative calls are synchronous and will degrade gracefully to rule-based summaries if the API is unavailable.
- The in-memory data store resets on server restart — a production version would require PostgreSQL + Redis.
