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
// Importando o hook do tema
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Pegando as cores dinâmicas
  const { colors, isDark } = useTheme();

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
      <SafeAreaView style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="cart-outline" size={80} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Não tens itens para finalizar.</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Resumo da Encomenda */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumo da Encomenda</Text>
            {cartItems.map((item: any) => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={[styles.summaryItemText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.quantidade}x {item.nome}
                </Text>
                <Text style={[styles.summaryPriceText, { color: colors.text }]}>
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalText, { color: colors.text }]}>Total a Pagar</Text>
              <Text style={[styles.totalPrice, { color: colors.primary }]}>R$ {cartTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Morada de Entrega */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Morada de Entrega</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: isDark ? colors.background : "#fff"
                }
              ]}
              placeholder="Rua, Número, Código Postal..."
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Método de Pagamento */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Método de Pagamento</Text>
            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  { borderColor: colors.border, backgroundColor: isDark ? colors.background : "#fff" },
                  paymentMethod === "PIX" && [styles.paymentOptionActive, { borderColor: colors.primary, backgroundColor: isDark ? 'rgba(52, 211, 153, 0.1)' : '#eff6ff' }],
                ]}
                onPress={() => setPaymentMethod("PIX")}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={24}
                  color={paymentMethod === "PIX" ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    { color: colors.textSecondary },
                    paymentMethod === "PIX" && { color: colors.primary },
                  ]}
                >
                  PIX
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  { borderColor: colors.border, backgroundColor: isDark ? colors.background : "#fff" },
                  paymentMethod === "CARTAO" && [styles.paymentOptionActive, { borderColor: colors.primary, backgroundColor: isDark ? 'rgba(52, 211, 153, 0.1)' : '#eff6ff' }],
                ]}
                onPress={() => setPaymentMethod("CARTAO")}
              >
                <Ionicons
                  name="card-outline"
                  size={24}
                  color={paymentMethod === "CARTAO" ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    { color: colors.textSecondary },
                    paymentMethod === "CARTAO" && { color: colors.primary },
                  ]}
                >
                  Cartão
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

        {/* Botão Fixo de Finalizar */}
        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }, isSubmitting && styles.submitButtonDisabled]}
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

// StyleSheet limpo, apenas com tamanhos, layouts e margens
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    // Sombras mantidas (o contraste no dark mode será dado pela diferença entre background e surface)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryItemText: { flex: 1, fontSize: 14, marginRight: 16 },
  summaryPriceText: { fontSize: 14, fontWeight: "500" },
  divider: { height: 1, marginVertical: 12 },
  totalText: { fontSize: 16, fontWeight: "bold" },
  totalPrice: { fontSize: 18, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  paymentMethods: { flexDirection: "row", gap: 12 },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  paymentOptionActive: { borderWidth: 2 }, // Destaca a borda um pouco mais quando ativo
  paymentOptionText: { fontSize: 16, fontWeight: "500" },
  footer: { padding: 16, borderTopWidth: 1 },
  submitButton: { padding: 16, borderRadius: 8, alignItems: "center" },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, marginTop: 16, marginBottom: 24 },
  backButton: { padding: 12, borderRadius: 8 },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});