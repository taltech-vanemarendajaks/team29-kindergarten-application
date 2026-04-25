# Context Manual (Team 29)

## Module initialization in AppProvider
The app now initializes contexts for these modules:
- `kindergarten`
- `groups`
- `parents`
- `children`

Provider order in `src/providers/AppProvider.tsx`:
1. `AuthProvider` (must be outer, other contexts can depend on auth later)
2. `KindergartenProvider`
3. `GroupsProvider`
4. `ParentsProvider`
5. `ChildrenProvider`

This is a valid setup for modular growth. Keep `AuthProvider` outermost.

## How to use a context in a page
1. Confirm the page is inside `src/app/layout.tsx` (already wrapped by `AppProvider`).
2. Import the hook you need:
   - `useKindergartenState`
   - `useGroupsState`
   - `useParentsState`
   - `useChildrenState`
3. Read context state and render UI states (loading/empty/error/success when available).
4. Trigger context actions (`refresh`, `clear`, `set...`, `upsert...`) instead of duplicating local fetch/state logic.

## How to create a new module context
1. Create `src/context/<Module>Context.tsx` with `"use client"`.
2. Define:
   - module state type(s)
   - context interface
   - `createContext<... | null>(null)`
3. Implement `<Module>Provider`:
   - add module state with `useState`
   - add actions with `useCallback`
   - memoize exported value with `useMemo`
4. Export `use<Module>State()` hook with runtime guard:
   - throw if hook is used outside provider
5. Register the provider in `AppProvider`.
6. Keep page components thin and reuse context actions.

## Recommended pattern for data modules
For API-backed modules (like `children`):
1. Keep API calls in `services` or `modules/*/api`.
2. Expose `isLoading`, `error`, and `refresh...` from context.
3. Normalize errors into user-friendly messages.
4. Avoid duplicate sources of truth between page state and context state.

## Current baseline
- `ChildrenContext` is a data-ready example.
- `KindergartenContext`, `GroupsContext`, and `ParentsContext` are lightweight scaffolds intended for fast extension by feature developers.
