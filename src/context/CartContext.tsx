import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Manga, CartItem } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  cartItemsCount: number;
  isLoading: boolean;
  addToCart: (manga: Manga) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => Promise<void>;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const CART_STORAGE_KEY = "@cart_items";

  // Load cart items from AsyncStorage on app start
  useEffect(() => {
    loadCartItems();
  }, []);

  // Save cart items to AsyncStorage whenever cartItems changes
  useEffect(() => {
    if (!isLoading) {
      saveCartItems();
    }
  }, [cartItems, isLoading]);

  const loadCartItems = async () => {
    try {
      const savedCartItems = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
    } catch (error) {
      console.error("Error loading cart items from storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCartItems = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart items to storage:", error);
    }
  };

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const addToCart = (manga: Manga) => {
    const existingItem = cartItems.find((item) => item.manga.id === manga.id);

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.manga.id === manga.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { manga, quantity: 1 }]);
    }

    Alert.alert("Sucesso!", `${manga.title} foi adicionado ao carrinho.`, [
      { text: "OK" },
    ]);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.manga.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.manga.id !== id));
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing cart from storage:", error);
    }
  };

  const checkout = () => {
    Alert.alert(
      "Pedido Confirmado!",
      "Seu pedido foi realizado com sucesso. Obrigado pela compra!",
      [
        {
          text: "OK",
          onPress: async () => {
            await clearCart();
          },
        },
      ]
    );
  };

  const value: CartContextType = {
    cartItems,
    cartItemsCount,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
