import React, { useState, useMemo } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Header } from "../components/Header";
import { CategoryFilter } from "../components/CategoryFilter";
import { MangaGrid } from "../components/MangaGrid";
import { MOCK_MANGAS } from "../utils/mockData";
import { Manga, Category } from "../types";
import { colors } from "../styles/globalStyles";
import { useCart } from "../context/CartContext";

const CATEGORIES: Category[] = [
  "Todos",
  "Ação",
  "Aventura",
  "Romance",
  "Comédia",
  "Drama",
  "Thriller",
];

export default function HomeScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const { cartItemsCount, addToCart } = useCart();

  const filteredMangas = useMemo(() => {
    if (selectedCategory === "Todos") {
      return MOCK_MANGAS;
    }
    return MOCK_MANGAS.filter((manga) => manga.genre === selectedCategory);
  }, [selectedCategory]);

  const handleMangaPress = (manga: Manga) => {
    navigation.navigate("MangaDetail", { manga });
  };

  const handleCartPress = () => {
    navigation.navigate("Cart");
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <View style={styles.container}>
        <Header cartItemsCount={cartItemsCount} onCartPress={handleCartPress} />

        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <MangaGrid
          mangas={filteredMangas}
          onAddToCart={addToCart}
          onMangaClick={handleMangaPress}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
});
