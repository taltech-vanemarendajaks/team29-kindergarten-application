# modules

Domain modules of the kindergarten platform.

## Recommended module list

- `children/`
- `groups/`
- `teachers/`
- `parents/`
- `attendance/`
- `payment/`
- `menu/`

## Suggested internal structure

```text
modules/
`-- <domain>/
    |-- api/        # module API calls
    |-- model/      # entities, state, validation, business rules
    |-- ui/         # module-specific presentational pieces
    |-- hooks/      # module hooks
    `-- index.ts
```

Use modules as source of domain truth. Features/widgets can depend on modules, not vice versa.
