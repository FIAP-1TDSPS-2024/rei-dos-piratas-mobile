import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/globalStyles";
import { Address, useAddressesQuery } from "../../hooks/useAddressesQuery";
import { useCartQuery } from "../../hooks/useCartQuery";

function formatCep(cep: string) {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return cep;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function AddressSelectionScreen({ navigation }: any) {
  const { data: addresses, isLoading, isError, refetch } = useAddressesQuery();
  const { data: cart } = useCartQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedId === null && addresses && addresses.length > 0) {
      setSelectedId(addresses[0].id);
    }
  }, [addresses, selectedId]);

  const cartItemsCount = cart?.count ?? 0;

  const handleContinue = () => {
    if (cartItemsCount === 0) {
      Alert.alert("Carrinho vazio", "Adicione produtos antes de continuar.");
      return;
    }
    if (selectedId === null) {
      Alert.alert("Selecione um endereço", "Escolha um endereço para entrega.");
      return;
    }
    const selected = addresses?.find((a) => a.id === selectedId);
    if (!selected) return;
    navigation.navigate("CheckoutFreight", {
      enderecoId: selected.id,
      cep: selected.cep,
    });
  };

  const renderItem = ({ item }: { item: Address }) => {
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
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {item.logradouro}, {item.numero}
          </Text>
          <Text style={styles.cardSub}>
            {item.bairro} · {item.cidade}/{item.estadoSigla}
          </Text>
          <Text style={styles.cardSub}>CEP {formatCep(item.cep)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Erro ao carregar endereços.</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={addresses ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.heading}>Selecione o endereço de entrega</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="location-outline"
              size={48}
              color={colors.gray400}
            />
            <Text style={styles.emptyText}>
              Você ainda não possui endereços cadastrados.
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("NewAddress")}
        >
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Novo endereço</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (selectedId === null || cartItemsCount === 0) &&
              styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedId === null || cartItemsCount === 0}
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#eff6ff",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray900,
    marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: colors.gray600 },
  empty: { alignItems: "center", padding: 32, gap: 12 },
  emptyText: { color: colors.gray600, textAlign: "center" },
  errorText: { color: colors.danger, marginBottom: 8 },
  retryText: { color: colors.primary, textDecorationLine: "underline" },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    gap: 10,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 6,
  },
  secondaryButtonText: { color: colors.primary, fontWeight: "600" },
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
