import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MangaDetail } from "../components/MangaDetail";
import { colors } from "../styles/globalStyles";
import { useCart } from "../context/CartContext";

export default function MangaDetailScreen({ route, navigation }: any) {
  const { manga } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = (manga: any) => {
    addToCart(manga);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
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
    backgroundColor: colors.light,
  },
});
