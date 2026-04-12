import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider, useCart } from "../context/CartContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
// 👇 IMPORTAMOS O SEU NOVO TEMA AQUI 👇
import { ThemeProvider, useTheme } from "../context/ThemeContext";

const queryClient = new QueryClient();

// Screens
import HomeScreen from "../screens/LoginScreen";
import StoreScreen from "../screens/StoreScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MangaDetailScreen from "../screens/MangaDetailScreen";
import CheckoutScreen from "../screens/CheckoutScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CartIconWithBadge({ focused, color, size }: any) {
  const { cartItemsCount } = useCart();
  const { colors } = useTheme(); // Trazendo as cores pro badge também

  return (
    <View>
      <Ionicons
        name={focused ? "bag" : "bag-outline"}
        size={size}
        color={color}
      />
      {cartItemsCount > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.danger }]}>
          <Text style={styles.badgeText}>
            {cartItemsCount > 99 ? "99+" : cartItemsCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function TabNavigator() {
  const { colors } = useTheme(); // Trazendo as cores pra TabBar

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Store") {
            const iconName = focused ? "storefront" : "storefront-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Cart") {
            return (
              <CartIconWithBadge focused={focused} color={color} size={size} />
            );
          } else if (route.name === "Profile") {
            const iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        // 👇 APLICANDO AS CORES NA BARRA INFERIOR 👇
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{ title: "Loja" }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Carrinho" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isLoggedIn, loading } = useAuth();
  const { colors } = useTheme(); // Trazendo as cores pro Stack e Loading

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // 👇 APLICANDO AS CORES NOS CABEÇALHOS GERAIS (MangaDetail, Checkout, etc) 👇
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
            shadowColor: 'transparent', // Tira a sombrinha padrão no iOS
            elevation: 0, // Tira a sombrinha padrão no Android
          },
          headerTintColor: colors.text, // Pinta a seta de voltar e os ícones
          headerTitleStyle: {
            color: colors.text,
          },
          cardStyle: { backgroundColor: colors.background }, // Garante que não vai ter "flash" branco ao mudar de tela
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Tabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MangaDetail"
              component={MangaDetailScreen}
              options={{
                title: "Detalhes do Mangá",
              }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ title: "Finalizar Compra" }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Coloquei o ThemeProvider como o "pai" mais externo pra garantir que todos os contextos abaixo tenham acesso às cores */}
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // Removi o backgroundColor fixo daqui e joguei pro style inline no AppContent
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    // Removi a cor fixa daqui também
  },
  badgeText: {
    color: "#ffffff", // Deixei o texto da badge fixo em branco pq o fundo vermelho (danger) sempre pede texto claro
    fontSize: 10,
    fontWeight: "bold",
  },
});