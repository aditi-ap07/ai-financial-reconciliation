# Architecture

CSV -> seed -> data store -> reconciler -> rules -> API -> frontend.
- Engine is decoupled and pure Python.
- Rules are isolated for testability.
- Frontend is UI-only.
