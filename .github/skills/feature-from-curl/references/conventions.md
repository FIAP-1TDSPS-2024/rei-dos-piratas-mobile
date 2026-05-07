# Codebase conventions for new features

## Files & naming

| Layer         | Path                              | Naming                                                                               |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------- |
| Service       | `src/services/<domain>Service.ts` | `<domain>Service.<verb>` (e.g., `catalogService.getProducts`)                        |
| Service types | same file                         | `<Action>Request`, `<Action>Response`, or backend entity name (`Produto`, `Cliente`) |
| Hook          | `src/hooks/use<Thing><Query       | Mutation>.ts`                                                                        | `useCatalogQuery`, `useLoginMutation` |
| Domain type   | `src/types/index.ts`              | UI-friendly camelCase (`Manga`, `CartItem`)                                          |

## HTTP

- Always import `api` from `./api` (services) or `../services/api` (elsewhere).
- Never set `Authorization` header manually.
- Never call `axios` directly — use the shared instance so the interceptor runs.

## React Query

- `queryKey`: array starting with the domain noun. Include parameters that affect the result: `["produto", id]`, `["catalog", { categoria }]`.
- Mutations: invalidate related queries on success.
  ```ts
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: pedidoService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pedidos"] }),
  });
  ```
- Don't expose `axios`/`AxiosError` to components. Let React Query surface errors via `error: Error`.

## Mappers

- Live in the **hook**, not the service.
- Pure function named `map<Backend>To<Domain>` (e.g., `mapProdutoToManga`).
- One mapper per direction.

## What NOT to do

- Don't add to `src/utils/mockData.ts` — it's legacy and being phased out.
- Don't create a new Context for server state. Use React Query's cache.
- Don't translate backend field names inside service interfaces.
