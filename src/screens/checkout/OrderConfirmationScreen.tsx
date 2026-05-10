import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/globalStyles";
import { useCartQuery } from "../../hooks/useCartQuery";
import { useAddressesQuery } from "../../hooks/useAddressesQuery";
import { useCreateOrderMutation } from "../../hooks/useCreateOrderMutation";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface RouteParams {
  enderecoId: number;
  freteServiceId: number;
  freteOptionName: string;
  freteCompanyName: string;
  fretePrice: number;
  freteDeliveryTime: number | null;
}

export default function OrderConfirmationScreen({ navigation, route }: any) {
  const params = route.params as RouteParams;
  const { data: cart } = useCartQuery();
  const { data: addresses } = useAddressesQuery();
  const createOrder = useCreateOrderMutation();

  const address = addresses?.find((a) => a.id === params.enderecoId);
  const items = cart?.items ?? [];
  const subtotal = cart?.total ?? 0;
  const total = subtotal + params.fretePrice;

  const handleConfirm = () => {
    if (items.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione produtos antes de finalizar.");
      return;
    }
    createOrder.mutate(
      {
        frete_service_id: params.freteServiceId,
        endereco_entrega_id: params.enderecoId,
        produtos_adicionados: items.map((item) => ({
          produto_id: Number(item.manga.id),
          quantidade: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Pedido confirmado!",
            "Seu pedido foi realizado com sucesso.",
            [
              {
                text: "Ver pedidos",
                onPress: () =>
                  navigation.reset({
                    index: 1,
                    routes: [{ name: "Tabs" }, { name: "OrderHistory" }],
                  }),
              },
              {
                text: "Voltar à loja",
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Tabs" }],
                  }),
              },
            ],
          );
        },
        onError: () => {
          Alert.alert("Erro", "Não foi possível finalizar o pedido.");
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Endereço de entrega</Text>
        {address ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {address.logradouro}, {address.numero}
            </Text>
            <Text style={styles.cardSub}>
              {address.bairro} · {address.cidade}/{address.estadoSigla}
            </Text>
            <Text style={styles.cardSub}>CEP {address.cep}</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>Endereço não encontrado.</Text>
        )}

        <Text style={styles.sectionTitle}>Forma de envio</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {params.freteCompanyName} · {params.freteOptionName}
          </Text>
          {params.freteDeliveryTime != null ? (
            <Text style={styles.cardSub}>
              Entrega em até {params.freteDeliveryTime} dia(s)
            </Text>
          ) : null}
          <Text style={styles.cardPrice}>
            {formatCurrency(params.fretePrice)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Itens ({items.length})</Text>
        <View style={styles.card}>
          {items.map((item) => (
            <View key={item.manga.id} style={styles.itemRow}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.manga.title}
              </Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.manga.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Frete</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(params.fretePrice)}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.totalRowGrand]}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>{formatCurrency(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            createOrder.isPending && styles.buttonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.white}
              />
              <Text style={styles.primaryButtonText}>Confirmar pedido</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  content: { padding: 16, paddingBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.gray700,
    marginTop: 8,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray900,
    marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: colors.gray600 },
  cardPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.success,
    marginTop: 6,
  },
  emptyText: { color: colors.gray600, marginBottom: 8 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 8,
  },
  itemTitle: { flex: 1, fontSize: 14, color: colors.gray800 },
  itemQty: {
    fontSize: 13,
    color: colors.gray600,
    width: 32,
    textAlign: "right",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray900,
    width: 90,
    textAlign: "right",
  },
  totalsCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  totalRowGrand: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    marginTop: 6,
    paddingTop: 10,
  },
  totalLabel: { fontSize: 14, color: colors.gray700 },
  totalValue: { fontSize: 14, color: colors.gray900, fontWeight: "600" },
  grandLabel: { fontSize: 16, color: colors.gray900, fontWeight: "700" },
  grandValue: { fontSize: 18, color: colors.success, fontWeight: "700" },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: colors.primary,
    gap: 8,
  },
  primaryButtonText: { color: colors.white, fontWeight: "600", fontSize: 16 },
  buttonDisabled: { opacity: 0.6 },
});
