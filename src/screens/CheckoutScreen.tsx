import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../styles/globalStyles";
import { useCart } from "../context/CartContext";

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CARTAO">("PIX");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!address.trim()) {
      Alert.alert("Erro", "Por favor, insere a tua morada de entrega.");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Erro", "O teu carrinho está vazio.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Aqui entrará a mutation do TanStack Query para a API de Encomendas
      // Simulando o tempo de requisição para já não quebrar
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        "Sucesso!",
        "A tua encomenda foi realizada com sucesso! Obrigado por comprar no Rei dos Piratas.",
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              navigation.navigate("Tabs", { screen: "Store" });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", "Falha ao processar o pagamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color={colors.gray400} />
        <Text style={styles.emptyText}>Não tens itens para finalizar.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Resumo da Encomenda */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo da Encomenda</Text>
            {cartItems.map((item: any) => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={styles.summaryItemText} numberOfLines={1}>
                  {item.quantidade}x {item.nome}
                </Text>
                <Text style={styles.summaryPriceText}>
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalText}>Total a Pagar</Text>
              <Text style={styles.totalPrice}>R$ {cartTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Morada de Entrega */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Morada de Entrega</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua, Número, Código Postal..."
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={colors.gray400}
            />
          </View>

          {/* Método de Pagamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Método de Pagamento</Text>
            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "PIX" && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod("PIX")}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={24}
                  color={paymentMethod === "PIX" ? colors.primary : colors.gray500}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentMethod === "PIX" && styles.paymentOptionTextActive,
                  ]}
                >
                  PIX
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "CARTAO" && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod("CARTAO")}
              >
                <Ionicons
                  name="card-outline"
                  size={24}
                  color={paymentMethod === "CARTAO" ? colors.primary : colors.gray500}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentMethod === "CARTAO" && styles.paymentOptionTextActive,
                  ]}
                >
                  Cartão
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

        {/* Botão Fixo de Finalizar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleCheckout}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "A processar..." : "Confirmar Pagamento"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  scrollContent: { padding: 16 },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: colors.gray800, marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryItemText: { flex: 1, fontSize: 14, color: colors.gray600, marginRight: 16 },
  summaryPriceText: { fontSize: 14, fontWeight: "500", color: colors.gray800 },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: 12 },
  totalText: { fontSize: 16, fontWeight: "bold", color: colors.gray800 },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: colors.primary },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray800,
  },
  paymentMethods: { flexDirection: "row", gap: 12 },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    gap: 8,
  },
  paymentOptionActive: { borderColor: colors.primary, backgroundColor: "#eff6ff" },
  paymentOptionText: { fontSize: 16, color: colors.gray600, fontWeight: "500" },
  paymentOptionTextActive: { color: colors.primary },
  footer: { padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: colors.gray200 },
  submitButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: "center" },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.light },
  emptyText: { fontSize: 18, color: colors.gray600, marginTop: 16, marginBottom: 24 },
  backButton: { padding: 12, backgroundColor: colors.primary, borderRadius: 8 },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});