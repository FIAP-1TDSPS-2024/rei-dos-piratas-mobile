import api from "./api";
import { Produto } from "./catalogService";

// --- Backend Types ---

export interface CarrinhoItemBackend {
  produto: Produto;
  quantidade: number;
}

export interface CarrinhoResponse {
  id: number;
  produtos_adicionados: CarrinhoItemBackend[];
}

export interface CartMutationRequest {
  produto_id: number;
  quantidade: number;
}

// --- API Calls ---

export const cartService = {
  getCart: async (): Promise<CarrinhoResponse> => {
    const response = await api.get<CarrinhoResponse>("/carrinho");
    return response.data;
  },

  addItem: async (data: CartMutationRequest): Promise<CarrinhoResponse> => {
    const response = await api.put<CarrinhoResponse>(
      "/carrinho/adicionar",
      data,
    );
    return response.data;
  },

  removeItem: async (data: CartMutationRequest): Promise<CarrinhoResponse> => {
    const response = await api.put<CarrinhoResponse>("/carrinho/remover", data);
    return response.data;
  },

  clearCart: async (): Promise<CarrinhoResponse> => {
    const response = await api.put<CarrinhoResponse>("/carrinho/limpar", "");
    return response.data;
  },
};
