# Phase 0A Dependency Security Remediation

## 1. Frontend (`frontend/package.json` & `package-lock.json`)
### Baseline Findings (Before Remediation)
- **Production-only (`npm audit --omit=dev`)**: 4 high (`@remix-run/router`, `react-router`, `react-router-dom` XSS/open-redirect advisories; `zod` memory exhaustion on oversized collections).
- **Full (`npm audit`)**: 22 total (2 critical, 8 high, 10 moderate, 2 low) including `vitest@2.1.8`, `tinypool`, `vite`, `@playwright/test@1.49.1`, `postcss@8.4.49`, `eslint@9.16.0`.

### Remediation Applied
- Upgraded `react-router-dom` `6.28.0 → 6.30.6` (direct, prod).
- Upgraded `zod` `3.23.8 → 4.x`, `react-hook-form` `7.54.0 → latest`, `@hookform/resolvers` `3.9.1 → latest` (direct, prod).
- Upgraded `postcss` `8.4.49 → 8.5.33`, `@playwright/test` `1.49.1 → 1.65.1`, `vitest` `2.1.8 → 5.1.2`, `@vitejs/plugin-react` `4.3.4 → latest`, `eslint` `9.16.0 → 9.39.2` (dev/build).
- Regenerated `package-lock.json` and verified clean install via `npm ci`.

### Post-Remediation Audit Results
- **Production (`npm audit --omit=dev`)**: **0 critical, 0 high**, 2 moderate (`react-router` / `react-router-dom` 6.30.6 — remaining moderate advisory requires breaking v7 upgrade; no open-redirect/XSS critical or high exposure remains).
- **Full (`npm audit`)**: **0 critical, 0 high**, 9 moderate (7 dev-only `@typescript-eslint/*` / `minimatch` + 2 `react-router`).
- **Verification**: `npm run typecheck`, `npm run lint`, `npm run test` (10/10 passed), and `npm run build` all passed after upgrades.

## 2. Backend (`backend/pyproject.toml` & `requirements.lock`)
- Upgraded `fastapi` `0.115.6 → 0.165.0` (updating `starlette` `0.41.3 → 1.10.0`), `pytest` `8.3.4 → 9.2.0`, and `pytest-asyncio` `0.24.0 → 1.5.0`.
- `pip-audit` post-remediation result: **No known vulnerabilities found**.
