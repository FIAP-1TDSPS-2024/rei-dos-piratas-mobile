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
import { colors } from "../styles/globalStyles";

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

  const total = cartItems.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );

  const handleCheckout = () => {
    Alert.alert(
      "Finalizar Compra",
      `Total: R$ ${total.toFixed(2)}\n\nDeseja finalizar a compra?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: onCheckout,
        },
      ]
    );
  };

  const renderCartItem: ListRenderItem<CartItem> = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.endereco_imagem || item.enderecoImagem }}
        style={styles.itemImage}
        contentFit="cover"
        placeholder={require("../../assets/adaptive-icon.png")}
      />

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.nome}
        </Text>
        <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            item.quantidade <= 1 && { opacity: 0.3 }
          ]}
          onPress={() => onDecrement(item.id)}
          disabled={item.quantidade <= 1}
          accessibilityLabel={`Diminuir quantidade de ${item.nome}`}
        >
          <Ionicons name="remove" size={16} color={colors.gray600} />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantidade}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onIncrement(item.id)}
          accessibilityLabel={`Aumentar quantidade de ${item.nome}`}
        >
          <Ionicons name="add" size={16} color={colors.gray600} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemoveItem(item.id, item.quantidade)}
        accessibilityLabel={`Remover todos os itens de ${item.nome}`}
      >
        <Ionicons name="trash" size={16} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carrinho</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.gray700} />
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color={colors.gray400} />
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
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

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>R$ {total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
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
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.gray800,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    color: colors.gray800,
    marginBottom: 4,
  },
  itemAuthor: {
    fontSize: 14,
    color: colors.gray500,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.success,
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
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray800,
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
    color: colors.gray500,
    textAlign: "center",
    marginTop: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
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
    color: colors.gray800,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.success,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
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