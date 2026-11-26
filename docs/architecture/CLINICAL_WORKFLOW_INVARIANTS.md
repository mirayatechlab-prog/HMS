# Clinical Workflow Invariants

1. **Permanent Identity vs Encounters**: `patients` (permanent hospital-scoped `uhid`) is strictly separated from `opd_encounters` and `ipd_admissions`. Duplicate merge is controlled and audited.
2. **Append-Only Clinical Amendments**: Signed clinical notes, diagnoses, vitals, and lab result interpretations cannot be silently overwritten; corrections create timestamped `clinical_note_amendments` preserving original author and timestamp.
3. **Separated Medication Lifecycle**: Medication Ordering (Doctor) → Dispensing (Pharmacist) → Administration / MAR (Nurse) are separate recorded events.
4. **Care Never Blocked by Billing**: Clinical admission, emergency care, and clinical discharge must never be blocked by financial clearance.
5. **Scoped Visiting Doctor Access**: Visiting doctors only access patients/encounters assigned to them; emergency break-glass requires justification and triggers an immediate audit event.
