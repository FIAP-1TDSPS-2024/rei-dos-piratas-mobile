import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Manga } from "../types";
import { colors } from "../styles/globalStyles";

interface MangaCardProps {
  manga: Manga;
  onAddToCart: (manga: Manga) => void;
  onMangaClick: (manga: Manga) => void;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 cards per row with padding

export function MangaCard({
  manga,
  onAddToCart,
  onMangaClick,
}: MangaCardProps) {
  const handleAddToCart = () => {
    onAddToCart(manga);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onMangaClick(manga)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: manga.imageUrl }}
          style={styles.image}
          contentFit="cover"
          placeholder={require("../../assets/icon.png")}
        />

        <View style={styles.badgeContainer}>
          {manga.isNew && (
            <View style={[styles.badge, styles.badgeNew]}>
              <Text style={styles.badgeText}>Novo</Text>
            </View>
          )}
          {manga.originalPrice && (
            <View style={[styles.badge, styles.badgeOnSale]}>
              <Text style={styles.badgeText}>Oferta</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {manga.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {manga.author}
        </Text>

        <View style={styles.priceContainer}>
          <Text
            style={{
              ...styles.price,
              ...(manga.originalPrice ? styles.priceOnSale : {}),
            }}
          >
            R$ {manga.price.toFixed(2)}
          </Text>
          {manga.originalPrice && (
            <Text style={styles.originalPrice}>
              R$ {manga.originalPrice.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeNew: {
    backgroundColor: colors.primary,
  },
  badgeOnSale: {
    backgroundColor: colors.danger,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  addButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray800,
    marginBottom: 4,
    lineHeight: 18,
  },
  author: {
    fontSize: 12,
    color: colors.gray500,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: colors.gray600,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceOnSale: {
    color: colors.success,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.gray400,
    textDecorationLine: "line-through",
  },
});
