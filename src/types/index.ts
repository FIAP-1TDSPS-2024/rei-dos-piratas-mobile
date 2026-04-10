export type Category =
  | "Todos"
  | "Ação"
  | "Aventura"
  | "Comédia"
  | "Drama"
  | "Ficção Científica"
  | "Fantasia"
  | "Terror";

export interface Manga {
  id: number;
  nome?: string;
  autor?: string;
  descricao?: string;
  preco?: number;
  preco_original?: number;
  endereco_imagem?: string;
  categoria?: Category | string;
  isNew?: boolean;
  isOnSale?: boolean;
  
  // Keep legacy properties optional during migration/testing if any other component relies on them
  title?: string;
  author?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  imageUrl?: string;
  genre?: Category;
}

export interface CartItem {
  manga: Manga;
  quantity: number;
}
