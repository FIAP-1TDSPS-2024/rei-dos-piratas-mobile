import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart } from "../components/ShoppingCart";
import { colors } from "../styles/globalStyles";
import {
  useAddCartItemMutation,
  useCartQuery,
  useClearCartMutation,
  useRemoveCartItemMutation,
} from "../hooks/useCartQuery";

export default function CartScreen({ navigation }: any) {
  const { data, isLoading, isError, refetch } = useCartQuery();
  const addItemMutation = useAddCartItemMutation();
  const removeItemMutation = useRemoveCartItemMutation();
  const clearCartMutation = useClearCartMutation();

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
    // TODO: replace with /pedidos endpoint when available
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        Alert.alert(
          "Pedido Confirmado!",
          "Seu pedido foi realizado com sucesso. Obrigado pela compra!",
          [{ text: "OK", onPress: () => navigation.navigate("Store") }],
        );
      },
      onError: () => {
        Alert.alert("Erro", "Não foi possível finalizar a compra.");
      },
    });
  };

  const handleClose = () => {
    navigation.navigate("Store");
  };

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
    console.log("Error fetching cart:", data);
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
