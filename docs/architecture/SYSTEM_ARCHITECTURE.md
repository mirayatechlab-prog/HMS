# MediCore HMS — System Architecture

## 1. Architectural Style: Modular Monolith
MediCore HMS is engineered as a **modular monolith** with strict domain boundaries inside a single deployable backend (`FastAPI` + `SQLAlchemy 2` + `PostgreSQL 16` + `Redis 7`) and a single SPA frontend (`React` + `TypeScript` + `Vite`). Microservices, Kubernetes, and event-streaming platforms (Kafka) are intentionally excluded from the MVP to maximize clinical reliability, transactional integrity, and operational simplicity.

## 2. High-Level Component Architecture
```mermaid
flowchart LR
    Client["React + TypeScript SPA"] -->|HTTPS + X-Correlation-ID| API["FastAPI Modular Monolith (/api/v1)"]
    API -->|AsyncPG + RLS Context| PG[("PostgreSQL 16")]
    API -->|Session / Cache / Locks| Redis[("Redis 7")]
    API -->|Presigned URLs (Private)| S3["S3-Compatible Object Storage"]
```

## 3. Cross-Cutting Foundation (Implemented in Phase 0)
- **API Versioning**: All endpoints under `/api/v1`.
- **Correlation IDs**: `CorrelationIdMiddleware` propagates `X-Correlation-ID` across HTTP responses and `structlog` JSON logs.
- **Standardized Error Envelope**: `{ "error": { "code", "message", "correlation_id", "details" } }`.
- **Health Probes**: `/api/v1/health/live` (dependency-free) and `/api/v1/health/ready` (checks PostgreSQL & Redis without leaking credentials).
- **Private Object Storage**: `S3ObjectStorageClient` abstraction with short-lived presigned URLs for lab reports and clinical documents.
