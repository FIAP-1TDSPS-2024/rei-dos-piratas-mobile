import api from "./api";

// --- Backend Types ---

export interface FreteItemRequest {
  produto_id: number;
  quantidade: number;
}

export interface FreteRequest {
  cep_destino: string;
  itens: FreteItemRequest[];
}

export interface FreteCompany {
  id: number;
  name: string;
  picture: string;
}

export interface FreteOption {
  id: number;
  name: string;
  price: number | null;
  custom_price: number | null;
  discount: number | null;
  currency: string | null;
  delivery_time: number | null;
  company: FreteCompany;
}

// --- API Calls ---

export const freightService = {
  calculateFreight: async (data: FreteRequest): Promise<FreteOption[]> => {
    const response = await api.post<FreteOption[]>("/frete", data);
    return response.data;
  },
};
