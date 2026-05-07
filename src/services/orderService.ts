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

// --- API Calls ---

export const orderService = {
  getOrders: async (): Promise<PedidoBackend[]> => {
      const response = await api.get<PedidosPageResponse>("/pedidos");
      console.log("Orders fetched successfully:", response.data);
      return response.data.page_items;
  },
};
