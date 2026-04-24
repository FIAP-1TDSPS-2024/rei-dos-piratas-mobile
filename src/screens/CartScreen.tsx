import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart } from "../components/ShoppingCart";
import { colors } from "../styles/globalStyles";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }: any) {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeItem
  } = useCart();

  const queryClient = useQueryClient();

  // Força o refetch quando a tela ganha foco para garantir dados frescos
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }, [queryClient])
  );

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const handleClose = () => {
    navigation.navigate("Store");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ShoppingCart
        cartItems={cartItems}
        // Passagem de referência direta: menos código, mais performance
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onRemoveItem={removeItem}
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
});