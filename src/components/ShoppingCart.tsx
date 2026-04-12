import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItem,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { CartItem } from "../services/cartService";
// 1. Importa o hook do tema que criamos
import { useTheme } from "../context/ThemeContext";

interface ShoppingCartProps {
  cartItems: CartItem[];
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemoveItem: (produtoId: number, quantidadeTotal: number) => void;
  onCheckout: () => void;
  onClose: () => void;
}

export function ShoppingCart({
  cartItems = [],
  onIncrement,
  onDecrement,
  onRemoveItem,
  onCheckout,
  onClose,
}: ShoppingCartProps) {

  // 2. Chama as cores dinâmicas e a função de trocar o tema
  const { colors, isDark, toggleTheme } = useTheme();

  const total = cartItems.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );

  const handleCheckout = () => {
    Alert.alert(
      "Finalizar Compra",
      `Total: R$ ${total.toFixed(2)}\n\nDeseja finalizar a compra?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: onCheckout },
      ]
    );
  };

  const renderCartItem: ListRenderItem<CartItem> = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.surface }]}>
      <Image
        source={{ uri: item.endereco_imagem || item.enderecoImagem }}
        style={styles.itemImage}
        contentFit="cover"
        placeholder={require("../../assets/adaptive-icon.png")}
      />

      <View style={styles.itemDetails}>
        <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
          {item.nome}
        </Text>
        <Text style={[styles.itemPrice, { color: colors.success }]}>
          R$ {item.preco.toFixed(2)}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            { backgroundColor: isDark ? colors.border : "#f3f4f6" }, // Fundo dinâmico para o botão
            item.quantidade <= 1 && { opacity: 0.3 }
          ]}
          onPress={() => onDecrement(item.id)}
          disabled={item.quantidade <= 1}
          accessibilityLabel={`Diminuir quantidade de ${item.nome}`}
        >
          <Ionicons name="remove" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.quantityText, { color: colors.text }]}>
          {item.quantidade}
        </Text>

        <TouchableOpacity
          style={[
            styles.quantityButton,
            { backgroundColor: isDark ? colors.border : "#f3f4f6" }
          ]}
          onPress={() => onIncrement(item.id)}
          accessibilityLabel={`Aumentar quantidade de ${item.nome}`}
        >
          <Ionicons name="add" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemoveItem(item.id, item.quantidade)}
        accessibilityLabel={`Remover todos os itens de ${item.nome}`}
      >
        <Ionicons name="trash" size={18} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>

        {/* Botão de Tema Integrado no Cabeçalho */}
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Ionicons name={isDark ? "sunny" : "moon"} size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Carrinho</Text>

        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={26} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Seu carrinho está vazio
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => String(item.id)}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
              <Text style={[styles.totalAmount, { color: colors.success }]}>
                R$ {total.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  themeButton: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    paddingRight: 4,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});