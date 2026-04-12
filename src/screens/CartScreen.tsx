import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart } from "../components/ShoppingCart";
import { useCart } from "../context/CartContext";
// 1. Novos imports do tema e ícones
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen({ navigation }: any) {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeItem
  } = useCart();

  // 2. Chamando o hook do tema
  const { colors, isDark, toggleTheme } = useTheme();

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
    // 3. Aplicando a cor de fundo dinâmica via array no style
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>

      {/* Botão de trocar tema (Flutuante no canto superior esquerdo) */}
      <TouchableOpacity
        style={[
          styles.themeToggle,
          { backgroundColor: colors.surface, borderColor: colors.border }
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isDark ? "sunny" : "moon"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

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
    // backgroundColor: colors.light, <-- Removido, agora é dinâmico no JSX
  },
  themeToggle: {
    position: "absolute",
    top: 50, // Ajuste fino se ficar muito perto do notch
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  }
});