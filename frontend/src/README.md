# src

Main source directory for frontend code.

## Structure

- `app/` - Next.js routing and layout layer.
- `components/` - reusable UI component library (design system foundation + interaction layer).
- `modules/` - domain-oriented slices (children, teachers, parents, attendance, ...).
- `features/` - reusable user/business actions that can be plugged into modules/pages.
- `widgets/` - larger composed UI blocks (dashboard blocks, panels, tables).
- `shared/` - cross-domain utilities, constants, shared types/schemas.
- `lib/` - infrastructure (providers, API clients, runtime config, adapters).

## Practical rule

If code is:
- route-specific -> place in `app/`
- generic visual building block -> place in `components/`
- domain-specific logic -> place in `modules/`
- reusable business flow -> place in `features/`
