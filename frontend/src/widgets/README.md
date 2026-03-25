# widgets

Composite page blocks assembled from `features`, `modules`, and `components/ui`.

## Examples

- Dashboard summary section
- Attendance table panel
- Teacher profile side panel
- Parent overview card grid

## Suggested structure

```text
widgets/
`-- <widget-name>/
    |-- ui/
    |-- model/
    `-- index.ts
```

Widgets should stay page-facing and orchestration-oriented.
