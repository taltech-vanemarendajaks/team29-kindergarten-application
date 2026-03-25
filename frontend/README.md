# Frontend (Next.js)

Frontend for Team 29 Kindergarten Application built with Next.js App Router and MUI.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Where things live

```text
frontend/
|-- public/                      # Static assets (served as /...)
|-- src/
|   |-- app/                     # Routing, segment layouts, app-level shell parts
|   |-- components/              # Reusable UI components (design system foundation)
|   |-- modules/                 # Domain slices (children, teachers, attendance, ...)
|   |-- features/                # Reusable business features
|   |-- widgets/                 # Page-level composed blocks
|   |-- shared/                  # Shared cross-domain code
|   `-- lib/                     # Infrastructure (api, providers, config, adapters)
|-- package.json
|-- tsconfig.json
`-- README.md
```

## Current app shell

Main app frame is in `src/app/main-layout.tsx` and uses:
- `src/app/header.tsx`
- `src/app/drawer.tsx`
- `src/app/footer.tsx`
- `src/app/navigation.ts`

## Design system foundation

Starter UI components are in `src/components/ui`:
- Button, Input, Textarea, Select
- Checkbox, Radio, Switch
- Card, Badge, Chip (and Tag alias)
- Dialog, Modal, DrawerPanel
- Dropdown, Popover, Tooltip, Tabs
- Loader, Spinner, Skeleton
- EmptyState, ErrorState
- Toast, Snackbar, Alert
- ConfirmDialog
- Table, Pagination
- SearchInput, Filters
- NoResults

Import from one entry point:

```ts
import { SearchInput, Filters, Table, Pagination, NoResults } from "@/src/components/ui";
```

## Folder docs

Every major folder in `frontend` has its own `README.md` with local rules and examples.
