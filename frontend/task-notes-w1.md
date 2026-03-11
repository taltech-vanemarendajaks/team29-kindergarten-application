# Frontend Setup Branch Summary (`frontend-setup`)

## What Was Completed

- Initialized Next.js Project
- Reworked the frontend into a scalable `src`-based Next.js App Router structure.
- Implemented a shared global layout with Material UI (`AppShell`) and top navigation.
- Added initial pages (`Home`, `Dashboard`, `Group`, `Contact`) to validate routing and reusable layout behavior.
- Updated and expanded frontend documentation (`frontend/README.md` + folder-level READMEs) to clarify architecture and responsibilities.

## Dependencies Added

- `@mui/material`, `@emotion/react`, `@emotion/styled` for UI framework and styling.
- `@tanstack/react-query` prepared for future server-state/data-fetching workflows.
- `zod` prepared for runtime-safe validation of forms and API payloads.

## Configuration and Technical Setup

- Moved App Router files to `frontend/src/app` and aligned project structure with long-term modular growth.
- Introduced a global MUI theme (brand colors, background) and `CssBaseline` for consistent UI defaults.
- Kept Next.js/TypeScript tooling intact while updating lockfile and dependency graph.

## Additional Task Completed: Public (Unauthenticated) Layout

- Added route groups to isolate layouts by access area:
  - `frontend/src/app/(dashboard)/layout.tsx` uses `AppShell`.
  - `frontend/src/app/(public)/layout.tsx` is a minimal public wrapper.
- Moved existing shared pages (`/`, `/dashboard`, `/group`, `/contact`) into `frontend/src/app/(dashboard)/...` to keep dashboard behavior unchanged.
- Added placeholder public pages:
  - `frontend/src/app/(public)/login/page.tsx`
  - `frontend/src/app/(public)/register/page.tsx`
- Updated root layout (`frontend/src/app/layout.tsx`) to render only global HTML/body and delegate page framing to route-group layouts.
- Resolved public-page console issue by removing MUI dependency from `/login` and `/register` placeholders (using minimal HTML headings), ensuring these pages render independently from dashboard theme/providers.
