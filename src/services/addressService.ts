import api from "./api";

// --- Backend Types ---

export interface EnderecoBackend {
  id: number;
  numero: number;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade_id: number;
  cidade: string;
  estado_id: number;
  estado_nome: string;
  estado_sigla: string;
}

export interface EnderecoCreateRequest {
  numero: number;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado_nome: string;
  estado_sigla: string;
}

export interface EnderecosPageResponse {
  number_of_pages: number;
  page_number: number;
  page_items: EnderecoBackend[];
}

// --- API Calls ---

export const addressService = {
  getAddresses: async (): Promise<EnderecoBackend[]> => {
    const response = await api.get<EnderecosPageResponse>("/enderecos");
    return response.data.page_items;
  },

  createAddress: async (
    data: EnderecoCreateRequest,
  ): Promise<EnderecoBackend> => {
    const response = await api.post<EnderecoBackend>("/enderecos", data);
    return response.data;
  },
};
