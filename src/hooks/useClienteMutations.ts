import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  clienteService,
  UpdateClienteRequest,
} from "../services/clienteService";
import { Cliente } from "../services/authService";

export function useUpdateClienteMutation() {
  const queryClient = useQueryClient();
  return useMutation<Cliente, Error, UpdateClienteRequest>({
    mutationFn: (data) => clienteService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useDeleteClienteMutation() {
  return useMutation<void, Error, void>({
    mutationFn: () => clienteService.delete(),
  });
}
