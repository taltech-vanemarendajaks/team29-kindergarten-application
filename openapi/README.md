# API Contract — OpenAPI Spec-First Development

This folder is the **single source of truth** for the entire API. All backend interfaces and frontend hooks are generated from these files. Never edit the backend or frontend generated code directly — always update the spec here and regenerate.

---

## Folder Structure

```
openapi/
├── openapi.yaml                  ← master file, references everything else
├── openapi.bundled.yaml          ← generated, do not edit manually
├── package.json                  ← bundler tooling
├── redocly.yaml                  ← linter config (can remove once error scemas are added as well)
├── paths/
│   ├── teachers.yaml             ← endpoints for modules
│   ├── children.yaml
│   └── ...                       ← one file per module
└── components/
    └── schemas/
        ├── teacher.yaml          ← request/response schemas for modules
        ├── common.yaml           ← shared schemas (errors, pagination)
        └── ...                   ← one file per module
```

---

## How the Files Are Organized

### `openapi.yaml` — master file
Contains only metadata and `$ref` pointers to the other files. No actual paths or schemas are defined here directly.

### `paths/<module>.yaml`
Contains all endpoints for one module. References schemas using relative paths:
```yaml
$ref: '../components/schemas/teacher.yaml#/TeacherResponse'
```

### `components/schemas/<module>.yaml`
Contains all request and response schemas for one module. No HTTP operations here — only data shapes.

---

## Adding a New Module

1. Create `paths/<module>.yaml` with the endpoints
2. Create `components/schemas/<module>.yaml` with the schemas
3. Register the paths in `openapi.yaml`:
```yaml
paths:
  /teachers:
    $ref: './paths/teachers.yaml#/~1teachers'
  /teachers/{id}:
    $ref: './paths/teachers.yaml#/~1teachers~1{id}'
```
4. Register the schemas in `openapi.yaml` under `components/schemas`
5. Bundle and regenerate (see below)

Note: The `~1` in path `$ref`s is URL encoding for `/` — it is correct and required.
Everything before # is the file path
Everything after # is the JSON Pointer — specific location where inside that file to look 

---

## Workflow

### 1. Edit the spec
Make your changes in `paths/` or `components/schemas/`. Never edit `openapi.bundled.yaml` directly.

### 2. Lint
Validate the spec before bundling:
```bash
npm run lint
```

### 3. Bundle
Merge all files into one, for the code generators:
```bash
npm run bundle
```
This updates `openapi.bundled.yaml`. Commit this file together with your spec changes.

### 4. Regenerate backend
```bash
cd ../backend
./gradlew openApiGenerate
```

### 5. Regenerate frontend
```bash
cd ../frontend
npm run generate
```

After regenerating, TypeScript and Java compilation errors will show exactly what broke in the implementation — fix those and the implementation is back in sync with the spec.

---

## Backend Code Generation

The Gradle plugin `openapi-generator` reads `openapi.bundled.yaml` and generates:

| Generated | Location                                           | Do not edit |
|-----------|----------------------------------------------------|-------------|
| `TeachersApi.java` | `build/generated/openapi/src/.../generated/api/`   | ✓ |
| `TeacherResponse.java` | `build/generated/openapi/src/.../generated/model/` | ✓ |
| `CreateTeacherRequest.java` | `build/generated/openapi/src/.../generated/model/` | ✓ |
| `UpdateTeacherRequest.java` | `build/generated/openapi/src/.../generated/model/` | ✓ |

### What you write by hand

All code inside `src/` is written by hand:

```
modules/teacher/
    controller/   ← implements generated TeachersApi interface
    service/      ← business logic
    repository/   ← Spring Data queries
    model/        ← JPA entity
    mapper/       ← entity → generated DTO (using MapStruct)
```

### Implementing the generated interface

```java
@RestController
@RequiredArgsConstructor
public class TeacherController implements TeachersApi {

    private final TeacherService service;

    @Override
    public ResponseEntity<List<TeacherResponse>> listTeachers() {
        return ResponseEntity.ok(service.list());
    }
}
```

If your controller method signatures do not match the generated interface, the project will not compile. This is intentional — it enforces the contract.

---

## Frontend Code Generation

Orval reads `openapi.bundled.yaml` and generates:

| Generated | Location                            | Do not edit |
|-----------|-------------------------------------|-------------|
| `teachers.ts` | `src/api/generated/hooks/teachers/` | ✓ |
| `TeacherResponse.ts` | `src/api/generated/models/`         | ✓ |
| `CreateTeacherRequest.ts` | `src/api/generated/models/`         | ✓ |
| `UpdateTeacherRequest.ts` | `src/api/generated/models/`         | ✓ |

### Using the generated hooks

Each module gets one file with ready-made React Query hooks:

```tsx
'use client';

import { useListTeachers } from '@/api/generated/hooks/teachers/teachers';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

export default function TeachersPage() {
    const { data, isLoading, error } = useListTeachers();

    if (error) return <Typography color="error">Failed to load teachers</Typography>;

    return (
        <List>
            {data?.data.map(teacher => (
                <ListItem key={teacher.id}>
                    <ListItemText
                        primary={`${teacher.firstName} ${teacher.lastName}`}
                    />
                </ListItem>
            ))}
        </List>
    );
}
```

### Response shape

The hooks return `{ data: { data: T[], status, headers }, isLoading, error }`. Access the actual data via `data?.data`:

```tsx
const { data } = useListTeachers();
const teachers = data?.data ?? [];       // TeacherResponse[]

const { data } = useGetTeacher(id);
const teacher = data?.data;              // TeacherResponse | undefined
```

---

## General Rules

- **Never edit `openapi.bundled.yaml` by hand** — it is always regenerated from source files
- **Never edit files in `build/generated/` or `src/api/generated/`** — they are always regenerated
- **Spec changes and implementation changes go in the same PR** — keep the contract and code in sync
- **All new endpoints start in the spec** — write the YAML first, then implement
- **`required` fields in schemas become `@NotNull` on the backend and non-optional types on the frontend** — use them to enforce validation at the API boundary

# What is needed for CI/CD Pipeline Setup

## Spec validation
```bash
cd openapi
npm ci
npm run lint
npm run bundle
git diff --exit-code openapi.bundled.yaml
```

This ensures no one merges a spec change without also committing the updated bundled file.

## Backend
```bash
cd backend
./gradlew build
```

`./gradlew build` runs `openApiGenerate`, `compileJava`, and tests automatically in the correct order.

## Frontend
```bash
cd frontend
npm ci
npm run generate
git diff --exit-code src/api/generated
npm run build
```

This ensures no one merges a spec change without also committing the regenerated frontend code.

---

## Full pipeline order

```
1. lint + bundle spec
2. check openapi.bundled.yaml is committed and up to date
3. backend build (generates + compiles + tests)
4. frontend generate
5. check src/api/generated is committed and up to date
6. frontend build
```



---

## What to commit and what CI generates

| File | Committed to repo | Verified in CI |
|------|-------------------|----------------|
| `openapi/openapi.yaml` | ✓ | — |
| `openapi/openapi.bundled.yaml` | ✓ | verified up to date |
| `backend/build/generated/` | — | always regenerated by build |
| `frontend/src/api/generated/` | ✓ | verified up to date |
