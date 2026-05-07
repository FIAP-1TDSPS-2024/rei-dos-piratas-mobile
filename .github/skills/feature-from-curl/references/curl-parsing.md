# Parsing a curl example

Extract these pieces from the curl. The host/port is **always discarded** because [api.ts](../../../../src/services/api.ts) builds the `baseURL` dynamically from Expo's `debuggerHost`.

| curl piece                                      | Maps to                                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `-X METHOD` (or implied `GET` / `POST` w/ body) | `api.get` / `api.post` / `api.put` / `api.patch` / `api.delete`                                   |
| URL path after the host                         | First arg to `api.<method>("/path")`                                                              |
| `?query=...`                                    | Second arg (`{ params: { ... } }`) for GET, or merged into body for non-GET if the API expects it |
| `-H "Authorization: Bearer ..."`                | **Ignore.** Token is injected by the request interceptor.                                         |
| `-H "Content-Type: application/json"`           | **Ignore.** Default header.                                                                       |
| Other custom headers                            | Pass via `{ headers: { ... } }` config arg                                                        |
| `-d '{ "..." : "..." }'`                        | Request body → typed as `<Action>Request` interface                                               |
| `-F field=...` (multipart)                      | Use `FormData`; set `headers: { "Content-Type": "multipart/form-data" }`                          |

## Example

```bash
curl -X POST http://localhost:8080/pedidos \
  -H "Authorization: Bearer xxx" \
  -H "Content-Type: application/json" \
  -d '{"produto_id": 1, "quantidade": 2}'
```

Becomes:

```ts
export interface CreatePedidoRequest {
  produto_id: number;
  quantidade: number;
}

export interface PedidoResponse {
  id: number;
  // ...fields from the response sample the user provided
}

export const pedidoService = {
  create: async (data: CreatePedidoRequest): Promise<PedidoResponse> => {
    const response = await api.post<PedidoResponse>("/pedidos", data);
    return response.data;
  },
};
```

## When the response shape is unknown

Stop and ask the user for one example response payload. Do **not** guess. A wrong response type silently breaks the UI.
