# MediCore HMS

**MediCore HMS** is a modern, multi-tenant-ready, configurable Hospital Management System engineered for small and medium-sized hospitals (starting with ~30 beds and scaling to 500+ beds without architectural changes).

## Phase 0 Status
This repository currently contains the **Phase 0 — Product Architecture & Engineering Foundation**:
- Modular monolith backend (`FastAPI`, `SQLAlchemy 2`, `PostgreSQL 16`, `Alembic`, `Redis`, `Pydantic v2`)
- Modern healthcare SaaS frontend (`React 19`, `TypeScript` strict, `Vite`, `Tailwind CSS`, `TanStack Query`, `Zustand`, `React Hook Form`, `Zod`, `Framer Motion`, `Lucide`)
- 9 interactive development-only Phase 0 UI previews (gated out of production builds)
- Docker Compose local stack (PostgreSQL, Redis, MinIO S3-compatible storage, Backend, Frontend)
- Comprehensive Product, Architecture, Database, Security, and Compliance documentation (`docs/`)
- Phase 0 verification and acceptance reports (`docs/reports/phase-0/`)

## Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose (Apple Silicon `arm64` supported natively)
- Node.js 22+ & npm 11+ (for local frontend dev/tests)
- Python 3.13+ (for local backend dev/tests)

### 1. Environment Setup
```bash
cp .env.example .env
```

### 2. Start Infrastructure & Services via Docker Compose
```bash
docker compose up -d --build
```

### 3. Run Database Migrations
```bash
docker compose exec backend alembic upgrade head
```

### 4. Verify Health Endpoints
- Liveness: `curl http://localhost:8000/api/v1/health/live`
- Readiness: `curl http://localhost:8000/api/v1/health/ready`
- OpenAPI Docs: `http://localhost:8000/docs`
- Frontend Previews: `http://localhost:5173`

### 5. Shutdown
```bash
docker compose down
```
(Use `docker compose down -v` only when intentionally wiping local dev volumes.)

## Documentation Index
- Engineering Contract: [`AGENTS.md`](./AGENTS.md)
- Product Docs: [`docs/product/`](./docs/product/)
- Architecture Docs: [`docs/architecture/`](./docs/architecture/)
- Security & Compliance: [`docs/security/`](./docs/security/)
- Phase Plans: [`docs/phases/`](./docs/phases/)
- Phase 0 Reports: [`docs/reports/phase-0/`](./docs/reports/phase-0/)
