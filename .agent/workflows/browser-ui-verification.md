---
description: Browser UI verification workflow for MediCore HMS previews and screens
---
# Browser UI Verification Workflow
1. Start frontend dev server and verify it serves only fictional demonstration data.
2. Open each route in headless/DevTools browser at desktop (1440x900) and tablet (768x1024) viewports.
3. Check for zero console errors, zero uncaught page errors, and zero horizontal overflow.
4. Verify keyboard focus visibility, WCAG 2.2 AA contrast, and non-color-only status indicators.
5. Capture screenshots into artifacts and record exact findings in the verification report.
