import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Manga } from "../types";
import { colors } from "../styles/globalStyles";

interface MangaDetailProps {
  manga: Manga;
  onAddToCart: (manga: Manga) => void;
  onClose: () => void;
}

const { height } = Dimensions.get("window");

export function MangaDetail({ manga, onAddToCart, onClose }: MangaDetailProps) {
  const handleAddToCart = () => {
    onAddToCart(manga);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: manga.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.badgeContainer}>
            {manga.isNew && (
              <View style={[styles.badge, styles.badgeNew]}>
                <Text style={styles.badgeText}>Novo</Text>
              </View>
            )}
            {manga.isOnSale && (
              <View style={[styles.badge, styles.badgeOnSale]}>
                <Text style={styles.badgeText}>Oferta</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>{manga.title}</Text>
            <Text style={styles.author}>por {manga.author}</Text>
            <Text style={styles.genre}>{manga.genre}</Text>
          </View>

          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#fbbf24" />
              <Text style={styles.rating}>{manga.rating}</Text>
            </View>
            <Text style={styles.reviewCount}>
              ({manga.reviewCount} avaliações)
            </Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>R$ {manga.price.toFixed(2)}</Text>
            {manga.originalPrice && (
              <Text style={styles.originalPrice}>
                R$ {manga.originalPrice.toFixed(2)}
              </Text>
            )}
            {manga.originalPrice && (
              <View style={styles.discountContainer}>
                <Text style={styles.discount}>
                  -
                  {Math.round(
                    ((manga.originalPrice - manga.price) /
                      manga.originalPrice) *
                      100
                  )}
                  %
                </Text>
              </View>
            )}
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
              {"\n\n"}
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </Text>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.featureItem}>
              <Ionicons name="book" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Formato: Físico</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="language" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Idioma: Português</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cube" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Editora: Panini Comics</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="bag-add" size={20} color="#ffffff" />
          <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    position: "relative",
    height: height * 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.gray800,
    marginBottom: 8,
    lineHeight: 34,
  },
  author: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray800,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.gray500,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.success,
  },
  originalPrice: {
    fontSize: 18,
    color: colors.gray400,
    textDecorationLine: "line-through",
  },
  discountContainer: {
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discount: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  descriptionSection: {
    marginBottom: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.gray800,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.gray600,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 16,
    color: colors.gray700,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    backgroundColor: "#ffffff",
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addToCartText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
