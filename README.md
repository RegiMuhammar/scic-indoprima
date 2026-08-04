# Supply Chain Intelligence Center (SCIC) — PT Indoprima

AI-powered supply chain decision intelligence platform for PT Indoprima automotive manufacturing.

## Quick Start

### Prerequisites
- Node.js 20+, pnpm 9+
- Python 3.11+, uv
- Docker (for local ChromaDB)

### Frontend
\\\ash
cd frontend
pnpm install
pnpm dev
\\\

### Backend
\\\ash
cd backend
uv sync
uv run uvicorn app.main:app --reload
\\\

## Documentation
See [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) for full project context.
