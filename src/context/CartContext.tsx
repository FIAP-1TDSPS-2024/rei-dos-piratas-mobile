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
  updateQuantity: (produtoId: number, quantidade: number) => void;
  removeItem: (produtoId: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth(); // Só busca dados se o cara estiver logado

  // GET: Busca o carrinho da API
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isLoggedIn, // Previne requisições 403 (Unauthorized)
  });

  // PUT: Adicionar ou Atualizar quantidade
  const addMutation = useMutation({
    mutationFn: ({ produtoId, quantidade }: { produtoId: number; quantidade: number }) =>
      cartService.addItem(produtoId, quantidade),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => Alert.alert("Erro", "Não foi possível atualizar o carrinho."),
  });

  // PUT: Remover item
  const removeMutation = useMutation({
    mutationFn: (produtoId: number) => cartService.removeItem(produtoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // PUT: Limpar tudo
  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // PUT: Finalizar pedido
  const checkoutMutation = useMutation({
    mutationFn: () => cartService.checkout(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => Alert.alert("Erro", "Falha ao finalizar o pedido na API."),
  });

  // Helpers exportados para as telas usarem
  const updateQuantity = (produtoId: number, quantidade: number) => {
    addMutation.mutate({ produtoId, quantidade });
  };

  const removeItem = (produtoId: number) => {
    removeMutation.mutate(produtoId);
  };

  const clearCart = () => {
    clearMutation.mutate();
  };

  const checkout = async () => {
    await checkoutMutation.mutateAsync();
  };

  // BLINDAGEM DE INTERFACE
  // Força a variável a ser um array válido antes do cálculo matemático.
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const cartTotal = safeCartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const cartItemsCount = safeCartItems.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: safeCartItems, // Repassa o dado limpo e tratado para a tela
        cartTotal,
        cartItemsCount,
        loading: isLoading || addMutation.isPending || removeMutation.isPending || checkoutMutation.isPending,
        updateQuantity,
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