import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cartService,
  CarrinhoItemBackend,
  CarrinhoResponse,
  CartMutationRequest,
} from "../services/cartService";
import { CartItem } from "../types";

export const CART_QUERY_KEY = ["cart"] as const;

export interface CartData {
  id: number | null;
  items: CartItem[];
  total: number;
  count: number;
}

export interface CartMutationVariables {
  mangaId: string;
  quantidade?: number;
}

function mapCarrinhoItem(item: CarrinhoItemBackend): CartItem {
  return {
    manga: {
      id: String(item.id),
      title: item.nome,
      price: item.preco,
    },
    quantity: item.quantidade,
  };
}

function mapCarrinho(response: CarrinhoResponse): CartData {
  const items = (response.produtos_adicionados ?? []).map(mapCarrinhoItem);
  return {
    id: response.id,
    items,
    total: items.reduce((sum, i) => sum + i.manga.price * i.quantity, 0),
    count: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

const EMPTY_CART: CartData = { id: null, items: [], total: 0, count: 0 };

function toBackendRequest(vars: CartMutationVariables): CartMutationRequest {
  return {
    produto_id: Number(vars.mangaId),
    quantidade: vars.quantidade ?? 1,
  };
}

export function useCartQuery() {
  return useQuery<CartData>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const response = await cartService.getCart();
      return mapCarrinho(response);
    },
    placeholderData: EMPTY_CART,
  });
}

function useCartMutationBase(
  fn: (data: CartMutationRequest) => Promise<CarrinhoResponse>,
) {
  const queryClient = useQueryClient();
  return useMutation<CarrinhoResponse, Error, CartMutationVariables>({
    mutationFn: (vars) => fn(toBackendRequest(vars)),
    onSuccess: (response) => {
      queryClient.setQueryData(CART_QUERY_KEY, mapCarrinho(response));
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useAddCartItemMutation() {
  return useCartMutationBase(cartService.addItem);
}

export function useRemoveCartItemMutation() {
  return useCartMutationBase(cartService.removeItem);
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();
  return useMutation<CarrinhoResponse, Error, void>({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (response) => {
      queryClient.setQueryData(CART_QUERY_KEY, mapCarrinho(response));
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
