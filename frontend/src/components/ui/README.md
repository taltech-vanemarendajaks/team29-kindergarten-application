# components/ui

Design system foundation and interaction-layer primitives.

## 1) Foundation components

- `button.tsx` -> `Button`
- `input.tsx` -> `Input`
- `textarea.tsx` -> `Textarea`
- `select.tsx` -> `Select`
- `checkbox.tsx` -> `Checkbox`
- `radio.tsx` -> `Radio`
- `switch.tsx` -> `Switch`
- `card.tsx` -> `Card`
- `badge.tsx` -> `Badge`
- `chip.tsx` -> `Chip`, `Tag`

## 2) Interaction layer components

- `dialog.tsx` -> `Dialog`
- `modal.tsx` -> `Modal`
- `drawer-panel.tsx` -> `DrawerPanel`
- `dropdown.tsx` -> `Dropdown`
- `popover.tsx` -> `Popover`
- `tooltip.tsx` -> `Tooltip`
- `tabs.tsx` -> `Tabs`

## 4) States and feedback (early mandatory)

- `loader.tsx` -> `Loader`
- `spinner.tsx` -> `Spinner`
- `skeleton.tsx` -> `Skeleton`
- `empty-state.tsx` -> `EmptyState`
- `error-state.tsx` -> `ErrorState`
- `alert.tsx` -> `Alert`
- `snackbar.tsx` -> `Snackbar`
- `toast.tsx` -> `Toast`
- `confirm-dialog.tsx` -> `ConfirmDialog`

## Exports

- `index.ts` is the public entry point for all UI components and types.

## Import pattern

Use central export whenever possible:

```ts
import { Button, Input, Dialog, DrawerPanel, Tabs, Toast, ConfirmDialog } from "@/src/components/ui";
```

## Notes

- Components wrap MUI primitives to keep a stable project-level API.
- If defaults need to be changed globally, update wrappers here first.
