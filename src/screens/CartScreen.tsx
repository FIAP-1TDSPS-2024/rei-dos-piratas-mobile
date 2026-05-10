import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart } from "../components/ShoppingCart";
import { colors } from "../styles/globalStyles";
import {
  useAddCartItemMutation,
  useCartQuery,
  useRemoveCartItemMutation,
} from "../hooks/useCartQuery";

export default function CartScreen({ navigation }: any) {
  const { data, isLoading, isError, refetch } = useCartQuery();
  const addItemMutation = useAddCartItemMutation();
  const removeItemMutation = useRemoveCartItemMutation();

  const cartItems = data?.items ?? [];

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const current = cartItems.find((item) => item.manga.id === id);
    if (!current) return;

    if (quantity <= 0) {
      removeItemMutation.mutate({
        mangaId: id,
        quantidade: current.quantity,
      });
      return;
    }

    const diff = quantity - current.quantity;
    if (diff === 0) return;

    if (diff > 0) {
      addItemMutation.mutate({ mangaId: id, quantidade: diff });
    } else {
      removeItemMutation.mutate({ mangaId: id, quantidade: -diff });
    }
  };

  const handleRemoveItem = (id: string) => {
    const current = cartItems.find((item) => item.manga.id === id);
    if (!current) return;
    removeItemMutation.mutate({
      mangaId: id,
      quantidade: current.quantity,
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione produtos antes de finalizar a compra.",
      );
      return;
    }
    navigation.navigate("CheckoutAddress");
  };

  const handleClose = () => {
    navigation.navigate("Store");
  };

  const pendingMangaId = addItemMutation.isPending
    ? (addItemMutation.variables?.mangaId ?? null)
    : removeItemMutation.isPending
      ? (removeItemMutation.variables?.mangaId ?? null)
      : null;

  const pendingAction: "add" | "remove" | null = addItemMutation.isPending
    ? "add"
    : removeItemMutation.isPending
      ? "remove"
      : null;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Erro ao carregar o carrinho.</Text>
          <Text style={styles.retryText} onPress={() => refetch()}>
            Tentar novamente
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ShoppingCart
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        onClose={handleClose}
        pendingMangaId={pendingMangaId}
        pendingAction={pendingAction}
        isCheckoutPending={false}
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
  },
  errorText: {
    fontSize: 16,
    color: colors.dark,
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: colors.dark,
    textDecorationLine: "underline",
  },
});
