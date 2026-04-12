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
// 1. Importando o hook do tema
import { useTheme } from "../context/ThemeContext";

interface MangaDetailProps {
  manga: Manga;
  onAddToCart: (manga: Manga) => void;
  onClose: () => void;
}

const { height } = Dimensions.get("window");

export function MangaDetail({ manga, onAddToCart, onClose }: MangaDetailProps) {
  // 2. Extraindo as cores dinâmicas
  const { colors, isDark } = useTheme();

  const handleAddToCart = () => {
    onAddToCart(manga);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: manga.endereco_imagem || manga.enderecoImagem }}
            style={styles.image}
            contentFit="cover"
            placeholder={require("../../assets/adaptive-icon.png")}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.badgeContainer}>
            {manga.isNew && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>Novo</Text>
              </View>
            )}
            {manga.preco_original && (
              <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                <Text style={styles.badgeText}>Oferta</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: colors.text }]}>{manga.nome}</Text>

            {manga.autor && <Text style={[styles.author, { color: colors.textSecondary }]}>por {manga.autor}</Text>}
            {manga.categoria && <Text style={[styles.genre, { color: colors.primary }]}>{manga.categoria}</Text>}
          </View>

          <View style={styles.priceSection}>
            <Text
              style={[
                styles.price,
                { color: manga.preco_original ? colors.success : colors.text }
              ]}
            >
              R$ {Number(manga.preco || 0).toFixed(2)}
            </Text>

            {manga.preco_original && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                R$ {Number(manga.preco_original || 0).toFixed(2)}
              </Text>
            )}

            {manga.preco_original && manga.preco && (
              <View style={[styles.discountContainer, { backgroundColor: colors.danger }]}>
                <Text style={styles.discount}>
                  -
                  {Math.round(
                    (((manga.preco_original || 0) - (manga.preco || 0)) /
                      (manga.preco_original || 1)) *
                    100,
                  )}
                  %
                </Text>
              </View>
            )}
          </View>

          {manga.descricao && (
            <View style={styles.descriptionSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Descrição</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>{manga.descricao}</Text>
            </View>
          )}

          <View style={styles.featuresSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Características</Text>
            <View style={styles.featureItem}>
              <Ionicons name="book" size={16} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Formato: Físico</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="language" size={16} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Idioma: Português</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cube" size={16} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Editora: Panini Comics</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer dinâmico */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
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
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  headerSection: {},
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 34,
  },
  author: {
    fontSize: 16,
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
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
  },
  reviewCount: {
    fontSize: 14,
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
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: "line-through",
  },
  discountContainer: {
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
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
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
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  addToCartButton: {
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