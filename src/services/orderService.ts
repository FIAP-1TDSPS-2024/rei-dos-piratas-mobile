import api from "./api";
import { Produto } from "./catalogService";

// --- Backend Types ---

export type PedidoStatus =
  | "AGUARDANDO_POSTAGEM"
  | "PREPARANDO_ENVIO"
  | "ENVIADO"
  | "ENTREGUE"
  | "CANCELADO";

export interface PedidoItemBackend {
  produto: Produto;
  quantidade: number;
}

export interface PedidoBackend {
  id: number;
  data_pedido: string;
  data_entrega: string | null;
  previsao_entrega: string | null;
  data_cancelamento: string | null;
  valor_total: number;
  valor_frete: number;
  status: PedidoStatus;
  produtos_adicionados: PedidoItemBackend[];
}

export interface PedidosPageResponse {
  number_of_pages: number;
  page_number: number;
  page_items: PedidoBackend[];
}

export interface CreateOrderItemRequest {
  produto_id: number;
  quantidade: number;
}

export interface CreateOrderRequest {
  frete_service_id: number;
  endereco_entrega_id: number;
  produtos_adicionados: CreateOrderItemRequest[];
}

// --- API Calls ---

export const orderService = {
  getOrders: async (): Promise<PedidoBackend[]> => {
    const response = await api.get<PedidosPageResponse>("/pedidos");
    return response.data.page_items;
  },

  // TODO: Validate error: Consulte o valor do frete do pedido antes do cálculo de valor total
  createOrder: async (data: CreateOrderRequest): Promise<PedidoBackend> => {
    const response = await api.post<PedidoBackend>("/pedidos", data);
    return response.data;
  },
};
