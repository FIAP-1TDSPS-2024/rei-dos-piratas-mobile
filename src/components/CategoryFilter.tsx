import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Category } from "../types";
// 1. Importando o hook de Tema
import { useTheme } from "../context/ThemeContext";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  // 2. Extraindo as cores dinâmicas
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                {
                  // Fundo e borda dinâmicos para itens não selecionados
                  backgroundColor: isDark ? colors.surface : "#f3f4f6",
                  borderColor: isDark ? colors.border : "#e5e7eb",
                },
                isSelected && [
                  styles.selectedCategoryButton,
                  { backgroundColor: colors.primary, borderColor: colors.primary },
                ],
              ]}
              onPress={() => onCategoryChange(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: isDark ? colors.textSecondary : "#374151" },
                  isSelected && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    // backgroundColor: "#ffffff", <-- Removido, agora é dinâmico
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedCategoryButton: {
    // As cores primárias são aplicadas no array de styles no JSX
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#ffffff", // Sempre branco para dar contraste com o fundo colorido (primary)
  },
});