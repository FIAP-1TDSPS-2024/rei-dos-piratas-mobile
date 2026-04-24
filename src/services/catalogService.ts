import api from "./api";

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

interface CatalogBackendResponse {
  page_items: Produto[];
  page_number: number;
  number_of_pages: number;
}

export interface CatalogResponse {
  content: Produto[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

/*
TODO List
autor
preco_original
categoria

*/

export const catalogService = {
  getProducts: async (): Promise<Produto[]> => {
    const response = await api.get<CatalogBackendResponse>("/produtos");
    return response.data.page_items;
  },
};
