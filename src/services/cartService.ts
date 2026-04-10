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

    // O backend retorna um objeto Cart com uma lista `produtos_adicionados`
    // Cada item dessa lista tem aninhado um `produto` e a `quantidade`
    const itemsRaw = data?.produtos_adicionados || data?.produtosAdicionados;

    if (Array.isArray(itemsRaw)) {
      return itemsRaw.map((item: any): CartItem => {
        const prod = item.produto;
        return {
          id: prod.id, // usamos o id do produto como chave para o carrinho na interface
          produtoId: prod.id,
          nome: prod.nome,
          preco: prod.preco,
          quantidade: item.quantidade,
          enderecoImagem: prod.endereco_imagem || prod.enderecoImagem,
        };
      });
    }

    // Se chegar qualquer lixo não mapeado, devolve carrinho vazio e evita o crash
    return [];
  },

  addItem: async (produtoId: number, quantidade: number) => {
    const response = await api.put("/carrinho/adicionar", { produto_id: produtoId, quantidade });
    return response.data;
  },

// No seu cartService.ts
  removeItem: async (produtoId: number, quantidade: number) => {
    // Mantemos o produto_id (snake_case) para bater com a configuração do Spring
    const response = await api.put("/carrinho/remover", {
      produto_id: produtoId,
      quantidade: quantidade
    });
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