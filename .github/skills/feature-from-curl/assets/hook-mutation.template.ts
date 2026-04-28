import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  __domainService,
  __ActionRequest,
  __ActionResponse,
} from "../services/__domainService";

export function use__ActionMutation() {
  const queryClient = useQueryClient();
  return useMutation<__ActionResponse, Error, __ActionRequest>({
    mutationFn: (data) => __domainService.__action(data),
    onSuccess: () => {
      // Invalidate any list/detail queries this mutation affects.
      queryClient.invalidateQueries({ queryKey: ["__domain"] });
    },
  });
}
