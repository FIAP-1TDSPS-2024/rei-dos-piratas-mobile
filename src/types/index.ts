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
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  genre: Category;
  isNew?: boolean;
  isOnSale?: boolean;
}

export interface CartItem {
  manga: Manga;
  quantity: number;
}
