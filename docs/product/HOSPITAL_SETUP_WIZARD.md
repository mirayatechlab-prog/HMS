# Hospital Setup Wizard Specification (Phase 1)

## 9-Step Onboarding Flow
1. **Step 1 — Hospital Profile**: Legal/display name, code, timezone (`Asia/Kolkata`), currency (`INR`), locale (`en-IN`), fiscal year start month (April).
2. **Step 2 — Buildings & Floors**: Optional simplified mode for single-building hospitals; arbitrary additions supported.
3. **Step 3 — Wards & Room Categories**: Optional default categories (General, Semi-Special, Special) plus custom categories.
4. **Step 4 — Room & Bed Creation**: Individual and bulk room/bed creation with mixed bed counts per room; **0 beds allowed** to complete initial onboarding.
5. **Step 5 — Permanent & Visiting Doctors**: Registration numbers, specializations, schedules, consultation fees.
6. **Step 6 — Staff & Permissions**: Configurable RBAC roles and least-privilege assignments.
7. **Step 7 — Pharmacy & Laboratory Configuration**: In-house pharmacy locations, external labs, external blood/urine collectors.
8. **Step 8 — Tariffs & Billing Preferences**: Effective-dated room/bed/service tariffs, invoice numbering prefix, tax treatment flags.
9. **Step 9 — Configuration Validation & Activation**: Validates structural integrity, allows saving incomplete state as a draft, and activates hospital for operations.
