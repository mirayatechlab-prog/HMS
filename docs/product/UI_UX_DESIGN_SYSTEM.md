# MediCore HMS — UI/UX Design System

## 1. Visual Direction
- **Surfaces**: White (`#FFFFFF`), Soft Gray (`#F8FAFC`, `#F1F5F9`), Border (`#E2E8F0`).
- **Typography**: Deep Navy (`#0A192F`, `#0F2544`) with `Inter` for UI and `JetBrains Mono` for UHIDs, tokens, and codes.
- **Primary Accent**: Clinical Teal (`#0F766E`, `#0D9488`).
- **Semantic Tokens**: Success (Emerald), Warning (Amber), Info (Sky), Danger (Rose), Neutral (Slate).

## 2. Accessibility (WCAG 2.2 AA)
- **Never color alone**: Every `StatusBadge` pairs color with an icon and explicit text label.
- **Keyboard & Focus**: Visible 2px `#0F766E` focus ring (`:focus-visible`), Escape-dismissible dialogs, semantic landmarks (`nav`, `header`, `main`, `aside`).
- **Responsive**: Desktop sidebar + tablet/mobile drawer navigation, overflow-safe data tables.
