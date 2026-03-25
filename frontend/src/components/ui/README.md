# components/ui

Design system foundation primitives (starter general UI set).

## Available components

- `input.tsx` -> `Input`
- `textarea.tsx` -> `Textarea`
- `select.tsx` -> `Select`
- `checkbox.tsx` -> `Checkbox`
- `radio.tsx` -> `Radio`
- `switch.tsx` -> `Switch`
- `card.tsx` -> `Card`
- `badge.tsx` -> `Badge`
- `chip.tsx` -> `Chip`, `Tag`
- `index.ts` -> public exports

## Import pattern

Use central export whenever possible:

```ts
import { Input, Select, Checkbox, Card, Badge, Chip, Tag } from "@/src/components/ui";
```

## Notes

- Components wrap MUI primitives to keep a stable project-level API.
- If defaults need to be changed globally, update wrappers here first.
