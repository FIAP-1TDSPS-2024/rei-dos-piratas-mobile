import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/globalStyles";
import { useCartQuery } from "../../hooks/useCartQuery";
import { useCalculateFreightMutation } from "../../hooks/useFreightMutation";
import { FreteOption } from "../../services/freightService";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function FreightSelectionScreen({ navigation, route }: any) {
  const { enderecoId, cep } = route.params as {
    enderecoId: number;
    cep: string;
  };
  const { data: cart } = useCartQuery();
  const calculateFreight = useCalculateFreightMutation();
  const [options, setOptions] = useState<FreteOption[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const items = cart?.items ?? [];
    if (items.length === 0) return;

    calculateFreight.mutate(
      {
        cep_destino: cep.replace(/\D/g, ""),
        itens: items.map((item) => ({
          produto_id: Number(item.manga.id),
          quantidade: item.quantity,
        })),
      },
      {
        onSuccess: (data) => setOptions(data),
        onError: () => {
          Alert.alert("Erro", "Não foi possível calcular o frete.");
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  const handleContinue = () => {
    const selected = options.find((opt) => opt.id === selectedId);
    if (!selected) {
      Alert.alert("Selecione o frete", "Escolha uma opção de envio.");
      return;
    }
    navigation.navigate("OrderConfirmation", {
      enderecoId,
      freteServiceId: selected.id,
      freteOptionName: selected.name,
      freteCompanyName: selected.company.name,
      fretePrice: selected.price ?? 0,
      freteDeliveryTime: selected.delivery_time,
    });
  };

  const renderItem = ({ item }: { item: FreteOption }) => {
    const selected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.radio}>
          {selected ? <View style={styles.radioInner} /> : null}
        </View>
        {item.company.picture ? (
          <Image
            source={{ uri: item.company.picture }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {item.company.name} · {item.name}
          </Text>
          {item.delivery_time != null ? (
            <Text style={styles.cardSub}>
              Entrega em até {item.delivery_time} dia(s)
            </Text>
          ) : null}
        </View>
        <Text style={[styles.price]}>
          {item.price != null ? formatCurrency(item.price) : "Grátis"}
        </Text>
      </TouchableOpacity>
    );
  };

  const isCalculating = calculateFreight.isPending;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {isCalculating ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.helperText}>Calculando frete...</Text>
        </View>
      ) : (
        <FlatList
          data={options}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.heading}>Selecione a forma de envio</Text>
          }
          ListEmptyComponent={
            calculateFreight.isError ? (
              <View style={styles.empty}>
                <Ionicons
                  name="alert-circle-outline"
                  size={48}
                  color={colors.danger}
                />
                <Text style={styles.emptyText}>
                  Não foi possível calcular o frete.
                </Text>
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  Nenhuma opção de envio disponível.
                </Text>
              </View>
            )
          }
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (selectedId === null || isCalculating) && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedId === null || isCalculating}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  helperText: { color: colors.gray600 },
  list: { padding: 16, paddingBottom: 24 },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray800,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: "#eff6ff" },
  cardDisabled: { opacity: 0.55 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  logo: { width: 40, height: 40 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: colors.gray900 },
  cardSub: { fontSize: 13, color: colors.gray600, marginTop: 2 },
  price: { fontSize: 15, fontWeight: "700", color: colors.success },
  priceDisabled: { color: colors.gray500 },
  empty: { alignItems: "center", padding: 32, gap: 12 },
  emptyText: { color: colors.gray600, textAlign: "center" },
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
    gap: 6,
  },
  primaryButtonText: { color: colors.white, fontWeight: "600", fontSize: 16 },
  buttonDisabled: { opacity: 0.5 },
});
