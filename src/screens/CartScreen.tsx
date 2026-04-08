import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart } from "../components/ShoppingCart";
import { colors } from "../styles/globalStyles";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }: any) {
  // Removi o 'checkout' da desestruturação, ele não pertence mais a esta etapa
  const { cartItems, updateQuantity, removeItem } = useCart();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    // Redireciona para a nossa 6ª tela, garantindo os pontos de navegação e escopo
    navigation.navigate("Checkout");
  };

  const handleClose = () => {
    // Corrigido de 'Home' para 'Store', que é o nome correto da sua Tab de catálogo
    navigation.navigate("Store");
  };

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
});