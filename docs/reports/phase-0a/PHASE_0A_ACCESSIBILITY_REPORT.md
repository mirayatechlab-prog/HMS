# Phase 0A Accessibility Report

## Automated Smoke Checks (Playwright + Vitest)
- **Landmarks & Headings**: Every preview route verified `hasMain: true` (`<main>`), `hasNav: true` (`<nav>`), and `h1Count: 1`.
- **Keyboard & Dialogs**: Modal `Dialog` closes on `Escape` key; `:focus-visible` outlines (`2px solid #0F766E`) defined in `frontend/src/styles/index.css`.
- **Non-Color Status Indicators**: `StatusBadge` pairs semantic color with icon and text label (`Vitest` + DOM rendering verified).

## Scope Limitation
Automated smoke checks do not constitute full WCAG 2.2 AA certification. Manual screen-reader (NVDA/VoiceOver) and full keyboard-only audits are scheduled for Phase 8 UAT.
