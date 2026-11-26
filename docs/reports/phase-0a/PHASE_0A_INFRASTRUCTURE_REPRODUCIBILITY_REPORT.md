# Phase 0A Infrastructure Reproducibility Report

## Pinned Image Digests (`docker-compose.yml`)
| Service | Image & Immutable Digest | Host Port Binding | Notes |
|---|---|---|---|
| `postgres` | `postgres:16-alpine@sha256:0cefaabd882e42bcb2a2f3dc56d3ce4770560ba62fd7f197f1a2e008fd5731ab` | `127.0.0.1:5433:5432` | Loopback-bound; `5433` avoids host `5432` conflict |
| `redis` | `redis:7-alpine@sha256:8da19c7399dca900c6822a1cf30f9d2285585e2c4b457ff4095b0f4500054d3f` | `127.0.0.1:6379:6379` | Loopback-bound |
| `s3` | `chrislusf/seaweedfs:latest@sha256:7ca46aeae2f223b37e5d91593c17ab37738eec6df6ab69b48a0487f7643342b9` | `127.0.0.1:9000:9000` | Admin port `9333` no longer exposed to host |
| `backend` | Built from `backend/Dockerfile` (`python:3.13-slim`, `requirements.lock`) | `0.0.0.0:8000:8000` | Runs as non-root `medicore` user |
| `frontend` | Built from `frontend/Dockerfile` (`node:22-alpine`, `package-lock.json`) | `0.0.0.0:5173:5173` | Runs as non-root `node` user |

## Verification
- `docker compose config --quiet` exited `0`.
- `docker compose up -d --build` rebuilt and started all 5 containers **without deleting existing volumes**.
- `docker compose exec -T backend alembic upgrade head` applied `20261127_0002` cleanly.
