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
import { Ionicons } from "@expo/vector-icons"; // <-- Adicionado para o ícone do botão

import { Header } from "../components/Header";
import { CategoryFilter } from "../components/CategoryFilter";
import { MangaGrid } from "../components/MangaGrid";
import { useCart } from "../context/CartContext";
import { useMangas } from "../hooks/useMangas";
import { Produto } from "../services/catalogService";
// 1. Importando o hook do tema
import { useTheme } from "../context/ThemeContext";

export default function StoreScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // 2. Puxando as cores e a função de trocar o tema
  const { colors, isDark, toggleTheme } = useTheme();

  const { cartItemsCount, addToCart } = useCart();
  const { data, isLoading, isError, refetch } = useMangas(0, 20);

  const mangas = data?.page_items || [];

  const categories = useMemo<any[]>(() => {
    const uniqueCategories = Array.from(
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
    addToCart(manga.id);
  };

  return (
    <SafeAreaProvider>
      {/* 3. StatusBar adaptativa baseada no tema atual */}
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* 4. Fundo dinâmico */}
      <View style={[styles.container, { backgroundColor: colors.background }]}>

        {/* Botão Flutuante de Tema (Bottom Right) */}
        <TouchableOpacity
          style={[
            styles.themeFab,
            { backgroundColor: colors.surface, borderColor: colors.border }
          ]}
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={colors.text} />
        </TouchableOpacity>

        <Header cartItemsCount={cartItemsCount} onCartPress={handleCartPress} />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: colors.text }]}>
              Erro ao carregar o catálogo.
            </Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={[styles.retryText, { color: colors.primary }]}>
                Tentar novamente
              </Text>
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
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  themeFab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    zIndex: 999, // Fica por cima da lista de mangás
    // Sombras para destacar do fundo
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  }
});