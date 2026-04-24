import { api } from "./api";

export interface CartItem {
  id: number;
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  enderecoImagem?: string;
}

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get("/carrinho");
    const data = response.data;

    // Tratamento de Edge Cases na camada de serviço:
    // Garante que o front sempre receba um array, independente da formatação do backend
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content; // Padrão de paginação do Spring
    if (data && Array.isArray(data.itens)) return data.itens;
    if (data && Array.isArray(data.items)) return data.items;

    // Se chegar qualquer lixo não mapeado, devolve carrinho vazio e evita o crash
    return [];
  },

  addItem: async (produtoId: number, quantidade: number) => {
    const response = await api.put("/carrinho/adicionar", { produtoId, quantidade });
    return response.data;
  },

  removeItem: async (produtoId: number) => {
    // Alinhe com o Jonas para ele aceitar esse payload simples, e não aquele JSON de Cliente
    const response = await api.put("/carrinho/remover", { produtoId });
    return response.data;
  },

  clearCart: async () => {
    const response = await api.put("/carrinho/limpar");
    return response.data;
  },

  checkout: async () => {
    const response = await api.put("/carrinho/finalizar");
    return response.data;
  }
};