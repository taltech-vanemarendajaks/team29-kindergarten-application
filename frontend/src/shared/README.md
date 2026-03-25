# shared

Cross-project reusable code with no domain ownership.

## Typical content

- `utils/` - pure helpers
- `constants/` - shared constants/enums
- `types/` - common TS types
- `schemas/` - shared validation schemas

## Important

- No module-specific business logic here.
- If it's a visual primitive, prefer `src/components/ui`.
- If it's app infrastructure, prefer `src/lib`.
