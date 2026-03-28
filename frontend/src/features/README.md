# features

Reusable business features that combine behavior + UI.

## Use this layer for

- Sign-in/sign-up flows
- Attendance marking flow
- Child creation/editing flow
- Any reusable user action that can be embedded in multiple pages/widgets

## Suggested structure

```text
features/
`-- <feature-name>/
    |-- model/      # state, schema, mappers
    |-- api/        # feature-specific API calls
    |-- ui/         # feature-level UI
    `-- index.ts
```

## Keep out

- Route definitions (go to `app/`)
- Generic primitives like Input/Card (go to `components/ui`)
