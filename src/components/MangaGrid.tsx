import React from "react";
import { FlatList, View, StyleSheet, ListRenderItem } from "react-native";
import { MangaCard } from "./MangaCard";
import { Manga } from "../types";

interface MangaGridProps {
  mangas: Manga[];
  onMangaClick: (manga: Manga) => void;
}

export function MangaGrid({ mangas, onMangaClick }: MangaGridProps) {
  const renderManga: ListRenderItem<Manga> = ({ item }) => (
    <MangaCard manga={item} onMangaClick={onMangaClick} />
  );

  return (
    <FlatList
      data={mangas}
      renderItem={renderManga}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
  },
});
