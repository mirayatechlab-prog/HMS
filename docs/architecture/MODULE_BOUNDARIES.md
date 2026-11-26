# Module Boundaries (`backend/app/modules/`)

| Module | Responsibility | Allowed Dependencies |
|---|---|---|
| `identity` | Auth, JWT/refresh rotation, MFA, RBAC permissions | `hospitals`, `audit` |
| `hospitals` | Tenant root (`Hospital`), onboarding wizard state, locale/fiscal config | `audit` |
| `infrastructure` | Buildings, floors, wards, room categories, rooms, beds, tariffs | `hospitals`, `audit` |
| `staff` | Non-doctor staff profiles & role assignments | `identity`, `hospitals`, `audit` |
| `doctors` | Permanent & visiting doctors, schedules, fee rules, contracts | `identity`, `hospitals`, `audit` |
| `patients` | Permanent UHID, demographics, allergies, duplicate merge | `hospitals`, `audit` |
| `opd` | Appointments, walk-ins, doctor queues, OPD encounters | `patients`, `doctors`, `audit` |
| `ipd` | Admissions, bed allocation/transfers, discharge & bed release | `patients`, `infrastructure`, `doctors`, `audit` |
| `clinical` | Vitals, clinical notes (append-only amendments), diagnoses, Rx | `patients`, `opd`, `ipd`, `doctors`, `audit` |
| `nursing` | Nursing observations, rounds, Medication Administration Records (MAR) | `ipd`, `clinical`, `pharmacy`, `audit` |
| `pharmacy` | Medicine master, suppliers, batches, FEFO ledger, dispensing | `clinical`, `patients`, `hospitals`, `audit` |
| `laboratory` | External test catalogue, orders, specimens, collectors, private reports | `clinical`, `patients`, `hospitals`, `audit` |
| `billing` | Charge items, invoices, reversals, tax/discount rules | `hospitals`, `patients`, `opd`, `ipd`, `pharmacy`, `laboratory` |
| `payments` | Advances, receipts, multi-mode payments, daily cash reconciliation | `billing`, `hospitals`, `audit` |
| `settlements` | Visiting doctor & external lab vendor settlements, expenses | `doctors`, `laboratory`, `billing`, `audit` |
| `reports` | Read-only operational, capacity, and financial summaries | Read contracts across modules |
| `audit` | Immutable security/clinical/financial/infra audit log | `hospitals` |
