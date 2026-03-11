# Frontend (Next.js)

Frontend for Team 29 Kindergarten Application built with **Next.js App Router**.

The structure is prepared for the project scope from the assignment: role-based UI,
domain modules (children, groups, teachers, attendance, parents), and future extensions
(menu, billing, notifications, reporting).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Frontend skeleton

```text
frontend/
|-- src/
|   |-- app/                     # Next.js App Router: routes, layout, global styles
|   |-- modules/                 # Domain modules (children, groups, teachers, ...)
|   |-- features/                # Reusable business features
|   |-- widgets/                 # Composite UI blocks
|   |-- shared/                  # Shared UI/components/utils/types
|   `-- lib/                     # App infrastructure (api clients, providers, config)
|
|-- public/                      # Static assets served from root URL
|
|-- .gitignore
|-- eslint.config.mjs
|-- next.config.ts
|-- package.json
|-- package-lock.json
|-- postcss.config.mjs
|-- tsconfig.json
`-- README.md
```

## Why this structure

- Keeps **Next.js conventions** (`src/app` + `public`) clean and scalable.
- Supports modular growth from current monolith stage to modular architecture.
- Separates routing, domain logic, reusable features, shared code, and technical setup.
- Makes it easier to map frontend layers to backend domain modules and endpoints.

## Folder-level documentation

Each skeleton folder includes its own `README.md` describing the folder purpose and
recommended contents.
