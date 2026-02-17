export interface Manga {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  genre: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

export interface CartItem {
  manga: Manga;
  quantity: number;
}

export type Category =
  | "Todos"
  | "Ação"
  | "Aventura"
  | "Romance"
  | "Comédia"
  | "Drama"
  | "Thriller";
