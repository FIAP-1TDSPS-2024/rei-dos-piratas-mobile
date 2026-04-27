---
name: feature-from-curl
description: 'Implement a new frontend feature from a backend curl example. Use when the user pastes a curl command (or HTTP request example) and asks to integrate, consume, call, wire up, or implement an endpoint in this React Native + Expo + axios + React Query app. Generates the service call, TypeScript request/response types, and a useQuery/useMutation hook following the existing src/services and src/hooks conventions. Triggers: "curl", "implement endpoint", "consume API", "integrate backend", "novo endpoint", "implementar feature".'
argument-hint: "Paste the curl example and (optionally) the screen/component to wire it into"
---

# Feature From Curl

Generate the service + types + React Query hook (and optionally wire into a screen) for a backend endpoint described by a `curl` example, matching the conventions already used in `src/services/` and `src/hooks/`.

## When to Use

- User pastes a `curl` (or any HTTP request example) and asks to implement/consume/integrate it.
- User says "add an endpoint", "wire up the backend", "create the service for X", "implementar a chamada".

## Inputs Required

Before generating code, confirm you have:

1. The full `curl` (method, URL, headers, body, query params).
2. A representative response body sample (ask the user if not provided — required to type the response correctly).
3. Optional: target screen/component to wire the hook into.

If the response sample is missing, ask once before generating types. Do not invent fields.

## Architecture To Follow

This codebase uses a strict 3-layer pattern. Always preserve it:

```
src/services/<domain>Service.ts   ← axios call + backend-shaped types (snake_case, PT-BR ok)
src/hooks/use<Thing>Query|Mutation.ts  ← React Query wrapper + mapper to domain type
src/types/index.ts                ← domain types consumed by UI (camelCase, PT/EN mixed allowed)
```

- HTTP client: shared `api` from [src/services/api.ts](../../../src/services/api.ts). It auto-injects the `Bearer` token from `AsyncStorage`. Never create a new `axios.create`.
- Data fetching: `@tanstack/react-query`. GET → `useQuery`, mutating verbs → `useMutation`.
- Keep backend field names (often PT-BR / snake_case) inside the service-layer interfaces. Only translate to UI/domain shape inside the hook's mapper function.

See [references/conventions.md](./references/conventions.md) for the full rule list and naming.

## Procedure

1. **Parse the curl.** Extract method, path (strip the host — baseURL is dynamic), headers, query params, body. See [references/curl-parsing.md](./references/curl-parsing.md).
2. **Identify the domain.** Reuse an existing service file when the path prefix matches (e.g., `/auth/*` → [authService.ts](../../../src/services/authService.ts), `/produtos*` → [catalogService.ts](../../../src/services/catalogService.ts)). Otherwise create `src/services/<domain>Service.ts` from [assets/service.template.ts](./assets/service.template.ts).
3. **Define types in the service file.**
   - `<Action>Request` for the body / query params (only if non-trivial).
   - `<Action>Response` (or reuse an existing entity interface) for the response — fields must mirror the backend exactly.
   - Export them.
4. **Add the service method.** Use the shared `api` instance. Method name is a verb in English (`getProducts`, `login`, `createOrder`). Return the typed response data.
5. **Create the hook.**
   - GET → use [assets/hook-query.template.ts](./assets/hook-query.template.ts). Pick a stable `queryKey` (e.g., `["catalog"]`, `["produto", id]`).
   - POST/PUT/PATCH/DELETE → use [assets/hook-mutation.template.ts](./assets/hook-mutation.template.ts). After success, call `queryClient.invalidateQueries` for any list affected.
6. **Map to the UI/domain type** inside the hook (not the service) when the UI already consumes a different shape (see `mapProdutoToManga` in [useCatalogQuery.ts](../../../src/hooks/useCatalogQuery.ts)). If a new domain type is needed, add it to [src/types/index.ts](../../../src/types/index.ts).
7. **Wire into the screen** only if the user asked for it. Use the hook's `data`, `isLoading`, `isError`, `mutate` directly — do not introduce a new context unless the state is genuinely global.
8. **Validate.**
   - No new axios instance was created.
   - Auth header is not manually set (interceptor handles it).
   - No mock data added to [src/utils/mockData.ts](../../../src/utils/mockData.ts).
   - Types compile (`tsc --noEmit` if the user asks).

## Output To User

After implementing, summarize in 3 bullets:

- Files created/modified
- New hook name and its return shape
- Any TODOs (e.g., missing response sample, error handling left to caller)

## Anti-patterns

- Calling `fetch` or `axios.create` instead of the shared `api`.
- Putting the React Query call inside the service layer.
- Renaming backend fields inside the service interfaces (rename in the hook mapper instead).
- Creating a Context just to hold server state — React Query already caches it.
- Inventing response fields when the user didn't provide a sample.
