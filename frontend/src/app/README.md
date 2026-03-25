# app

Next.js App Router entrypoint.

## What is here now

- `layout.tsx` - root HTML document layout and global metadata.
- `globals.css` - global styles.
- `main-layout.tsx` - reusable app frame (header/drawer/footer + main container).
- `header.tsx` - top navigation bar.
- `drawer.tsx` - mobile navigation.
- `footer.tsx` - page footer.
- `navigation.ts` - navigation item config.
- `(dashboard)/` - dashboard route group and pages.
- `(public)/` - public/auth route group and pages.

## Responsibility boundaries

- Keep this folder focused on routing and app shell composition.
- Move domain logic to `src/modules`.
- Move reusable UI primitives to `src/components/ui`.
