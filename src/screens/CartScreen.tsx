import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart } from "../components/ShoppingCart";
import { colors } from "../styles/globalStyles";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }: any) {
  const { cartItems, updateQuantity, removeItem, checkout } = useCart();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    checkout();
    navigation.navigate("Home");
  };

  const handleClose = () => {
    navigation.navigate("Home");
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
