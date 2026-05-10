import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/globalStyles";
import { Address, useAddressesQuery } from "../hooks/useAddressesQuery";

function formatCep(cep: string) {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return cep;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function AddressListScreen({ navigation }: any) {
  const { data, isLoading, isError, refetch } = useAddressesQuery();

  const renderItem = ({ item }: { item: Address }) => (
    <View style={styles.card}>
      <Ionicons name="location" size={20} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>
          {item.logradouro}, {item.numero}
        </Text>
        <Text style={styles.cardSub}>
          {item.bairro} · {item.cidade}/{item.estadoSigla}
        </Text>
        <Text style={styles.cardSub}>CEP {formatCep(item.cep)}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name={isError ? "alert-circle-outline" : "location-outline"}
              size={48}
              color={isError ? colors.danger : colors.gray400}
            />
            <Text style={styles.emptyText}>
              {isError
                ? "Erro ao carregar endereços."
                : "Você ainda não possui endereços cadastrados."}
            </Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("NewAddress")}
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.primaryButtonText}>Adicionar endereço</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, paddingBottom: 24, flexGrow: 1 },
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
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray900,
    marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: colors.gray600 },
  empty: {
    alignItems: "center",
    padding: 32,
    gap: 12,
    flex: 1,
    justifyContent: "center",
  },
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
});
