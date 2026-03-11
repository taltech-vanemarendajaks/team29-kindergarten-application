# Frontend (Next.js)

Frontend part of the project built with Next.js (App Router).

## Run the project

```bash
npm install
npm run dev
```

After startup, the app is available at [http://localhost:3000](http://localhost:3000).

## Project structure

```text
frontend/
|-- app/                         # Main App Router folder (routes, layout, pages)
|   |-- favicon.ico              # Website icon (favicon)
|   |-- globals.css              # Global application styles
|   |-- layout.tsx               # Root layout for all pages
|   `-- page.tsx                 # Home page (/)
|
|-- public/                      # Public static files
|   |-- file.svg                 # Example static SVG asset
|   |-- globe.svg                # Example static SVG asset
|   |-- next.svg                 # Next.js logo
|   |-- vercel.svg               # Vercel logo
|   `-- window.svg               # Example static SVG asset
|
|-- .gitignore                   # Files and folders excluded from git
|-- eslint.config.mjs            # ESLint configuration
|-- next.config.ts               # Next.js configuration
|-- package.json                 # Project scripts and dependencies
|-- package-lock.json            # Locked npm dependency versions
|-- postcss.config.mjs           # PostCSS configuration (CSS processing)
|-- tsconfig.json                # TypeScript configuration
`-- README.md                    # Frontend documentation
```

## Purpose of key folders

- `app/`: defines application routes and UI structure (pages, layout, styles).
- `public/`: stores static files that are directly accessible by URL.
- `.next/` (generated automatically): Next.js build artifacts, should not be committed.
- `node_modules/` (created after `npm install`): installed dependencies, should not be committed.
