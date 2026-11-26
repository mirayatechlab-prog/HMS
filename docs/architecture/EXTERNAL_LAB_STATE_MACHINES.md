# External Laboratory State Machines

Because the initial hospital uses external sample collectors and external diagnostic labs (no in-house analyzer integration in MVP), order, specimen, and result lifecycles are modeled as distinct state machines:

## 1. Lab Order State Machine
`REQUESTED` → `COLLECTOR_ASSIGNED` → `SAMPLE_COLLECTED` → `DISPATCHED_TO_LAB` → `REPORT_UPLOADED` → `CLINICALLY_REVIEWED` → `RELEASED` (or `CANCELLED`).

## 2. Specimen State Machine
`PENDING_COLLECTION` → `COLLECTED` → `IN_TRANSIT` → `RECEIVED_BY_LAB` → `PROCESSED` | `REJECTED` (triggers `RECOLLECTION_REQUIRED`).

## 3. Result & Report State Machine
`PENDING` → `UPLOADED` → `VERIFIED` → `RELEASED` → `AMENDED` (revision preserves prior report version).

## 4. Security & Storage
- External collectors only view assigned collection tasks (minimal patient identifiers).
- Uploaded PDF reports are stored in private S3-compatible object storage (`S3ObjectStorageClient`) and served via short-lived authorized presigned URLs.
