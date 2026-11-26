# Role-Permission Matrix (RBAC Design)

Roles are configurable per hospital; permissions are decoupled from role names and enforced at API + record/encounter scope.

| Permission Domain | SysAdmin | HospAdmin | Owner | Reception | Perm. Doctor | Visiting Doctor | Nurse | Pharmacist | Lab Coord | Accountant |
|---|---|---|---|---|---|---|---|---|---|---|
| Infrastructure & Setup | R/W | R/W | R | R | R | — | R | — | — | — |
| Staff & Role Config | R/W | R/W | R | — | — | — | — | — | — | — |
| Patient Identity (UHID) | — | R | R | R/W | R | R (Assigned) | R (Ward) | R (Minimal) | R (Order) | R (Billing) |
| Clinical Notes & Rx | — | — | — | — | R/W (Own) | R/W (Assigned) | R (Read) | R (Rx) | — | — |
| MAR & Nursing Obs | — | — | — | — | R | R (Assigned) | R/W | — | — | — |
| Pharmacy Inventory | — | R | R | — | — | — | — | R/W | — | R |
| External Lab Orders/Reports | — | R | R | — | R/W | R/W (Assigned) | R | — | R/W | — |
| Billing, Receipts & Reversals | — | Approve | R | Collect | — | — | — | — | — | R/W |
| Doctor/Lab Settlements | — | Approve | R | — | — | R (Own) | — | — | — | R/W |
| Audit Logs | R | R | R | — | — | — | — | — | — | — |

*Separation of Duty*: Receptionists cannot edit signed clinical notes; clinical staff cannot alter posted financial records; visiting doctors are restricted to assigned patients/encounters unless emergency break-glass with justification and audit is invoked.
