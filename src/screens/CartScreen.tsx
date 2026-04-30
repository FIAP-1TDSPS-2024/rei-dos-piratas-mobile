import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart } from "../components/ShoppingCart";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export default function CartScreen({ navigation }: any) {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeItem
  } = useCart();

  // Mantemos o tema apenas para a cor de fundo do container principal
  const { colors } = useTheme();

  const queryClient = useQueryClient();

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
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      edges={["top"]}
    >
      <ShoppingCart
        cartItems={cartItems}
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
  }
});