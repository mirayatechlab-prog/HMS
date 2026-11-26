# Phase 0 Clinical Safety Design Review

- **Designed only (Phase 2–4 Implementation)**:
  - Permanent hospital-scoped `uhid` separated from `opd_encounters` and `ipd_admissions`.
  - Append-only `clinical_note_amendments` (no silent overwrites).
  - Separate Medication Order → Dispense → Administration (MAR) events.
  - Clinical discharge separated from financial clearance and physical bed release (`CLEANING` → `AVAILABLE`).
  - Expired/quarantined batch dispensing blocked; visiting doctor access encounter-scoped with audited emergency break-glass.
- **No unsupported clinical features**: AI diagnosis, automated clinical recommendations, OT, and ICU telemetry remain excluded.
