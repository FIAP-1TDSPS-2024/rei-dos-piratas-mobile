import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Header } from "../components/Header";
import { CategoryFilter } from "../components/CategoryFilter";
import { MangaGrid } from "../components/MangaGrid";
import { Manga, Category } from "../types";
import { colors } from "../styles/globalStyles";
import { useCart } from "../context/CartContext";
import { useCatalogQuery } from "../hooks/useCatalogQuery";

export default function StoreScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const { cartItemsCount, addToCart } = useCart();
  const {
    data: mangas = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCatalogQuery();

  const categories = useMemo<Category[]>(() => {
    const uniqueCategories = Array.from(
      new Set(mangas.map((manga) => manga.genre)),
    );
    return ["Todos", ...uniqueCategories];
  }, [mangas]);

  const filteredMangas = useMemo(() => {
    if (selectedCategory === "Todos") {
      return mangas;
    }
    return mangas.filter((manga) => manga.genre === selectedCategory);
  }, [selectedCategory, mangas]);

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
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.dark} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Erro ao carregar o catálogo.</Text>
            <Text style={styles.retryText} onPress={() => refetch()}>
              Tentar novamente
            </Text>
          </View>
        ) : (
          <MangaGrid
            mangas={filteredMangas}
            onAddToCart={addToCart}
            onMangaClick={handleMangaPress}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.dark,
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: colors.dark,
    textDecorationLine: "underline",
  },
});
