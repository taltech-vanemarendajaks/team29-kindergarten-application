# components

Reusable UI component library for the frontend.

## Current structure

- `ui/` - project UI kit:
  - foundation primitives (`Button`, `Input`, `Card`, `Badge`, ...)
  - interaction components (`Dialog`, `Modal`, `DrawerPanel`, `Dropdown`, `Popover`, `Tooltip`, `Tabs`)

## Layer intent

This folder is for generic UI building blocks, not for domain logic.

- Domain/business behavior -> `src/modules` or `src/features`
- Routing/layout composition -> `src/app`
