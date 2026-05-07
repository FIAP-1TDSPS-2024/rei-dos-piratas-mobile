import { useQuery } from "@tanstack/react-query";
import { __domainService, __ActionResponse } from "../services/__domainService";
// import { __DomainType } from "../types"; // uncomment if mapping to a UI type

// Optional mapper — only when the UI consumes a different shape than the backend.
// function map__BackendTo__Domain(input: __ActionResponse): __DomainType {
//   return {
//     // ...
//   };
// }

export function use__ThingQuery(/* params */) {
  return useQuery<__ActionResponse /*, Error, __DomainType */>({
    queryKey: ["__domain" /*, params */],
    queryFn: () => __domainService.__action(/* params */),
    // select: map__BackendTo__Domain,
  });
}
