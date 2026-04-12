import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MangaDetail } from "../components/MangaDetail";
// 1. Importando o hook
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function MangaDetailScreen({ route, navigation }: any) {
  const { manga } = route.params;

  // 2. Extraindo as cores dinâmicas
  const { colors } = useTheme();

  // CORREÇÃO: Extrai a função addToCart (com alerta) do contexto
  const { addToCart } = useCart();

  const handleAddToCart = (mangaToAdd: any) => {
    // CORREÇÃO: Repassa o ID do produto para a mutation correta
    addToCart(mangaToAdd.id);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    // 3. Aplicando a cor de fundo dinamicamente
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <MangaDetail
        manga={manga}
        onAddToCart={handleAddToCart}
        onClose={handleClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.light, <-- Removido do estático
  },
});