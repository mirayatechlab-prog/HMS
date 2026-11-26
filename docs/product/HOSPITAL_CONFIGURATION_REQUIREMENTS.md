# Hospital Configuration Requirements

All operational resources are independently configurable per hospital tenant (`hospital_id`):

| Resource | Hardcoding Allowed? | Initial Demo Profile | Minimum Supported | Maximum Supported |
|---|---|---|---|---|
| Buildings, Floors, Wards | No | 1 Bldg, 2 Floors, 3 Wards | 0 (during onboarding) | Unbounded |
| Room Categories | No | General, Semi-Special, Special | 0 (defaults optional) | Unbounded |
| Rooms & Beds per Room | No | Mixed (1, 3, 4, 6 beds/room) | 0 beds | Unbounded (tested 0–500+) |
| Permanent & Visiting Doctors | No | 2 permanent + visiting | 0 | Unbounded |
| Reception Counters & Staff | No | Configurable | 0 | Unbounded |
| Pharmacies & External Labs | No | 1 pharmacy, multiple labs | 0 | Unbounded |
| Services & Tariffs | No | Effective-dated tariffs | 0 | Unbounded |

**Rule**: `total_beds` is never stored as an independently editable column; all capacity counts are derived from individual `beds` records.
