import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Header } from "../components/Header";
import { CategoryFilter } from "../components/CategoryFilter";
import { MangaGrid } from "../components/MangaGrid";
import { colors } from "../styles/globalStyles";
import { useCart } from "../context/CartContext";
import { useMangas } from "../hooks/useMangas"; // Hook correto do TanStack Query
import { Produto } from "../services/catalogService"; // Tipagem real do backend

export default function StoreScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // CORREÇÃO: Usamos o addToCart (com alerta) em vez do incrementQuantity (silencioso)
  const { cartItemsCount, addToCart } = useCart();

  // Puxa os dados reais, passando página 0 e tamanho 20
  const { data, isLoading, isError, refetch } = useMangas(0, 20);

  // O backend retorna paginação, então precisamos extrair o array de dentro de page_items
  const mangas = data?.page_items || [];

  const categories = useMemo<any[]>(() => {
    const uniqueCategories = Array.from(
      // O backend Java retorna "categoria", não "genre"
      new Set(mangas.map((manga) => manga.categoria)),
    );
    return ["Todos", ...uniqueCategories];
  }, [mangas]);

  const filteredMangas = useMemo(() => {
    if (selectedCategory === "Todos") {
      return mangas;
    }
    return mangas.filter((manga) => manga.categoria === selectedCategory);
  }, [selectedCategory, mangas]);

  const handleMangaPress = (manga: Produto) => {
    navigation.navigate("MangaDetail", { manga });
  };

  const handleCartPress = () => {
    navigation.navigate("Cart");
  };

  const handleAddToCart = (manga: Produto) => {
    // CORREÇÃO: Dispara a função que contém o Alert de sucesso
    addToCart(manga.id);
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
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <MangaGrid
            mangas={filteredMangas as any}
            onAddToCart={handleAddToCart as any}
            onMangaClick={handleMangaPress as any}
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