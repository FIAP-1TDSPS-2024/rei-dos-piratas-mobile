import api from "./api";

// --- Backend Types ---

export interface CarrinhoItemBackend {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
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
    console.log("Adding item to cart:", data);
    const response = await api.put<CarrinhoResponse>(
      "/carrinho/adicionar",
      data,
    );
    console.log("Add item response:", response.data);
    return response.data;
  },

  removeItem: async (data: CartMutationRequest): Promise<CarrinhoResponse> => {
    console.log("Removing item from cart:", data);
    const response = await api.put<CarrinhoResponse>("/carrinho/remover", data);
    console.log("Remove item response:", response.data);
    return response.data;
  },

  clearCart: async (): Promise<CarrinhoResponse> => {
    console.log("Clearing cart...");
    const response = await api.put<CarrinhoResponse>("/carrinho/limpar", "");
    console.log("Clear cart response:", response.data);
    return response.data;
  },
};
