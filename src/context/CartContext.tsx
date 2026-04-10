import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { cartService, CartItem } from "../services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  cartItemsCount: number;
  loading: boolean;
  incrementQuantity: (produtoId: number) => void;
  decrementQuantity: (produtoId: number) => void;
  removeItem: (produtoId: number, quantidade: number) => void;
  addToCart: (produtoId: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isLoggedIn,
  });

  // Tratamento de dados (Fonte de Verdade)
  const rawCartItems = Array.isArray(cartItems) ? cartItems : [];
  const safeCartItems = rawCartItems.reduce((acc: CartItem[], currentItem) => {
    const existingItem = acc.find(item => item.id === currentItem.id);
    if (existingItem) {
      existingItem.quantidade += currentItem.quantidade;
    } else {
      acc.push({ ...currentItem });
    }
    return acc;
  }, []);

  // MUTATION 1: Adicionar a partir da loja (Com Alerta)
  const addFromStoreMutation = useMutation({
    mutationFn: (produtoId: number) => cartService.addItem(produtoId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      Alert.alert("Sucesso", "Produto adicionado ao carrinho! 🛒");
    },
    onError: (error: any) => {
      console.error("Erro API (Loja):", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível adicionar o produto.");
    },
  });

  // MUTATION 2: Incrementar dentro do carrinho (Silencioso)
  const incrementMutation = useMutation({
    mutationFn: (produtoId: number) => cartService.addItem(produtoId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      console.error("Erro API (Incremento):", error?.response?.data || error.message);
      Alert.alert("Erro", "Falha ao atualizar a quantidade.");
    },
  });

  // MUTATION 3: Decrementar ou Remover
  const removeMutation = useMutation({
    mutationFn: ({ produtoId, quantidade }: { produtoId: number; quantidade: number }) =>
      cartService.removeItem(produtoId, quantidade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      console.error("Erro API (Remoção):", error?.response?.data || error.message);
      Alert.alert("Erro", "Falha ao remover o item.");
    }
  });

  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const checkoutMutation = useMutation({
    mutationFn: cartService.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      Alert.alert("Sucesso", "Compra finalizada!");
    },
  });

  // --- ACTIONS ---

  const addToCart = (produtoId: number) => {
    addFromStoreMutation.mutate(produtoId);
  };

  const incrementQuantity = (produtoId: number) => {
    incrementMutation.mutate(produtoId);
  };

  const decrementQuantity = (produtoId: number) => {
    const item = safeCartItems.find(i => i.id === produtoId);
    if (item && item.quantidade > 1) {
      removeMutation.mutate({ produtoId, quantidade: 1 });
    }
  };

  // Implementação corrigida sem as sobras de código
  const removeItem = (produtoId: number, quantidadeTotal: number) => {
    console.log(`[CartContext] Lixeira acionada: Removendo ${quantidadeTotal} do ID ${produtoId}`);

    // Repassa a quantidade exata para o service
    removeMutation.mutate({ produtoId, quantidade: quantidadeTotal });
  };

  const clearCart = () => clearMutation.mutate();
  const checkout = async () => checkoutMutation.mutateAsync();

  const cartTotal = safeCartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const cartItemsCount = safeCartItems.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: safeCartItems,
        cartTotal,
        cartItemsCount,
        loading: isLoading,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        removeItem,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}