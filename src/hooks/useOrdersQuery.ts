import { useQuery } from "@tanstack/react-query";
import {
  orderService,
  PedidoBackend,
  PedidoItemBackend,
  PedidoStatus,
} from "../services/orderService";

export interface OrderItem {
  productId: string;
  title: string;
  author: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderDate: string; // ISO YYYY-MM-DD
  deliveryDate: string | null;
  estimatedDelivery: string | null;
  cancellationDate: string | null;
  totalValue: number;
  shippingValue: number;
  status: PedidoStatus;
  statusLabel: string;
  items: OrderItem[];
}

const STATUS_LABEL: Record<PedidoStatus, string> = {
  AGUARDANDO_POSTAGEM: "Aguardando postagem",
  PREPARANDO_ENVIO: "Preparando envio",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

function mapOrderItem(item: PedidoItemBackend): OrderItem {
  return {
    productId: String(item.produto.id),
    title: item.produto.nome,
    author: item.produto.autor,
    imageUrl: item.produto.endereco_imagem,
    price: item.produto.preco,
    quantity: item.quantidade,
  };
}

function mapOrder(pedido: PedidoBackend): Order {
  return {
    id: String(pedido.id),
    orderDate: pedido.data_pedido,
    deliveryDate: pedido.data_entrega,
    estimatedDelivery: pedido.previsao_entrega,
    cancellationDate: pedido.data_cancelamento,
    totalValue: pedido.valor_total,
    shippingValue: pedido.valor_frete,
    status: pedido.status,
    statusLabel: STATUS_LABEL[pedido.status] ?? pedido.status,
    items: (pedido.produtos_adicionados ?? []).map(mapOrderItem),
  };
}

export const ORDERS_QUERY_KEY = ["orders"] as const;

export function useOrdersQuery() {
  return useQuery<Order[]>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async () => {
      const pedidos = await orderService.getOrders();
      return pedidos.map(mapOrder);
    },
  });
}
