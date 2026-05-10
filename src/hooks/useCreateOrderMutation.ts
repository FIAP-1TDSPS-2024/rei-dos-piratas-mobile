import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateOrderRequest,
  orderService,
  PedidoBackend,
} from "../services/orderService";
import { ORDERS_QUERY_KEY } from "./useOrdersQuery";
import { CART_QUERY_KEY } from "./useCartQuery";

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation<PedidoBackend, Error, CreateOrderRequest>({
    mutationFn: (data) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
