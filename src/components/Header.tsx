import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";

interface HeaderProps {
  cartItemsCount: number;
  onCartPress: () => void;
}

export function Header({ cartItemsCount, onCartPress }: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image
            style={{ width: 40, height: 40, resizeMode: "contain" }}
            source={require("../../assets/icon.png")}
          />
          <Text style={styles.title}>Rei dos Piratas</Text>
        </View>

        <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
          <Ionicons name="bag" size={24} color="#ffffff" />
          {cartItemsCount > 0 && (
            <View style={styles.badge}>
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
  safeArea: {
    backgroundColor: colors.dark,
  },
  header: {
    backgroundColor: colors.dark,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cartButton: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
