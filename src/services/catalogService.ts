import { api } from "./api";

export type ProdutoCategoriaEnum =
  | "ACAO"
  | "AVENTURA"
  | "COMEDIA"
  | "DRAMA"
  | "FICCAO_CIENTIFICA"
  | "FANTASIA"
  | "TERROR";

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  autor: string;
  categoria: ProdutoCategoriaEnum;
  preco: number;
  preco_original?: number;
  endereco_imagem: string;
  condicao: string;
  estoque: number;
  altura: number;
  largura: number;
  profundidade: number;
  peso: number;
}

export interface CatalogBackendResponse {
  page_items: Produto[];
  page_number: number;
  number_of_pages: number;
  total_elements?: number;
}

export const catalogService = {
  getProducts: async (page = 0, size = 20): Promise<CatalogBackendResponse> => {
    const response = await api.get<CatalogBackendResponse>("/produtos", {
      params: { page, size }
    });
    return response.data;
  },
};