# Phase 0 Build Report

## 1. Frontend Production Build (`VITE_ENABLE_PHASE0_PREVIEWS=false`)
- **Command**: `VITE_ENABLE_PHASE0_PREVIEWS=false npm run build` (`tsc -b && vite build`)
- **Exit Code**: `0` (built in 1.20s, 1,654 modules transformed)
- **Output**:
  - `dist/index.html` (0.48 kB)
  - `dist/assets/index-C5WPmRE4.css` (19.05 kB)
  - `dist/assets/index-DVXFLoUS.js` (199.68 kB)
- **Preview Restriction**: Verified via `isPhase0PreviewsEnabled()` in `frontend/src/app/App.tsx`; production builds render `ProductionGateFallback` when `VITE_ENABLE_PHASE0_PREVIEWS` is not `'true'`.

## 2. Docker Compose Build & Runtime (`arm64` Apple Silicon)
- **Command**: `docker compose up -d --build`
- **Services Running**:
  - `medicore-postgres` (`postgres:16-alpine`, healthy, host port `5433->5432`)
  - `medicore-redis` (`redis:7-alpine`, healthy, host port `6379->6379`)
  - `medicore-s3` (`chrislusf/seaweedfs:latest`, running, host ports `9000`, `9333`)
  - `medicore-backend` (`hms-backend`, healthy, host port `8000->8000`)
  - `medicore-frontend` (`hms-frontend`, up, HTTP 200 on `http://localhost:5173`)
