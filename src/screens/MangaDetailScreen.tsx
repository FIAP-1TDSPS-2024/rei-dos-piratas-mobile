import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MangaDetail } from "../components/MangaDetail";
import { colors } from "../styles/globalStyles";
import { useAddCartItemMutation } from "../hooks/useCartQuery";
import { Manga } from "../types";

export default function MangaDetailScreen({ route, navigation }: any) {
  const { manga } = route.params;
  const addItemMutation = useAddCartItemMutation();

  const handleAddToCart = (manga: Manga) => {
    addItemMutation.mutate({ mangaId: manga.id });
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
