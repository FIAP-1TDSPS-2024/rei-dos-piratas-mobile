import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
// 1. Importando o hook
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  cartItemsCount: number;
  onCartPress: () => void;
}

export function Header({ cartItemsCount, onCartPress }: HeaderProps) {
  // 2. Extraindo as cores dinâmicas
  const { colors } = useTheme();

  return (
    // 3. Fundo da SafeArea acompanhando o Header
    <SafeAreaView style={{ backgroundColor: colors.surface }} edges={["top"]}>
      <View style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border
        }
      ]}>
        <View style={styles.titleContainer}>
          <Image
            style={{ width: 40, height: 40, resizeMode: "contain" }}
            source={require("../../assets/icon.png")}
          />
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            Rei dos Piratas
          </Text>
        </View>

        <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
          {/* Ícone da sacola dinâmico */}
          <Ionicons name="bag" size={24} color={colors.text} />

          {cartItemsCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.danger }]}>
              <Text style={styles.badgeText}>
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1, // Bordinha sutil para dar o efeito de cabeçalho nativo
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 12,
  },
  title: {
    flexShrink: 1,
    fontSize: 24,
    fontWeight: "bold",
  },
  cartButton: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff", // Sempre branco por conta do fundo danger
    fontSize: 12,
    fontWeight: "bold",
  },
});