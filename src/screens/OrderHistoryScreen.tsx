import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/globalStyles";
import { Order, useOrdersQuery } from "../hooks/useOrdersQuery";
import { isoDateToBr } from "../utils/date";
import { PedidoStatus } from "../services/orderService";

const STATUS_COLOR: Record<PedidoStatus, string> = {
  AGUARDANDO_POSTAGEM: colors.warning ?? "#f59e0b",
  PREPARANDO_ENVIO: colors.warning ?? "#f59e0b",
  ENVIADO: colors.primary,
  ENTREGUE: colors.success ?? "#10b981",
  CANCELADO: colors.danger,
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function OrderCard({ order }: { order: Order }) {
  const statusColor = STATUS_COLOR[order.status] ?? colors.gray600;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>Pedido #{order.id}</Text>
          <Text style={styles.orderDate}>
            Realizado em {isoDateToBr(order.orderDate)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{order.statusLabel}</Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {order.items.map((item) => (
          <View key={item.productId} style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemAuthor}>{item.author}</Text>
              <Text style={styles.itemQuantity}>
                Qtd: {item.quantity} × {formatCurrency(item.price)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        {order.estimatedDelivery && order.status !== "CANCELADO" && (
          <View style={styles.footerRow}>
            <Ionicons name="time" size={16} color={colors.gray600} />
            <Text style={styles.footerText}>
              Previsão de entrega: {isoDateToBr(order.estimatedDelivery)}
            </Text>
          </View>
        )}
        {order.deliveryDate && (
          <View style={styles.footerRow}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.success ?? "#10b981"}
            />
            <Text style={styles.footerText}>
              Entregue em: {isoDateToBr(order.deliveryDate)}
            </Text>
          </View>
        )}
        {order.cancellationDate && (
          <View style={styles.footerRow}>
            <Ionicons name="close-circle" size={16} color={colors.danger} />
            <Text style={styles.footerText}>
              Cancelado em: {isoDateToBr(order.cancellationDate)}
            </Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Frete</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(order.shippingValue)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabelBold}>Total</Text>
          <Text style={styles.totalValueBold}>
            {formatCurrency(order.totalValue)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function OrderHistoryScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useOrdersQuery();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.helperText}>Carregando seus pedidos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle" size={48} color={colors.danger} />
          <Text style={styles.helperText}>
            Não foi possível carregar seus pedidos.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="receipt-outline" size={64} color={colors.gray400} />
          <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
          <Text style={styles.helperText}>
            Você ainda não realizou nenhum pedido.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={data}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  helperText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gray800,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.gray800,
  },
  orderDate: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
  itemsContainer: {
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray100,
  },
  item: {
    flexDirection: "row",
    gap: 12,
  },
  itemImage: {
    width: 56,
    height: 80,
    borderRadius: 6,
    backgroundColor: colors.gray100,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray800,
  },
  itemAuthor: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: 4,
  },
  cardFooter: {
    marginTop: 12,
    gap: 6,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: colors.gray600,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    color: colors.gray600,
  },
  totalValue: {
    fontSize: 13,
    color: colors.gray700,
  },
  totalLabelBold: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.gray800,
  },
  totalValueBold: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
});
